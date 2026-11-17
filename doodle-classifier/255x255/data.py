"""Loading the processed .npy files, splitting them, and building tf.data pipelines.

Memory: class arrays are opened with mmap_mode="r", and a generator yields one
image at a time, so RAM holds only the current batch plus a small prefetch
buffer, no matter how many classes there are.
"""
from __future__ import annotations

import zlib
from pathlib import Path

import numpy as np
import tensorflow as tf

import config


def load_manifest(processed_dir: Path, class_names: list) -> dict:
    path = processed_dir / "manifest.json"
    if not path.exists():
        raise FileNotFoundError(f"{path} not found - run `python build_dataset.py` first")
    manifest = config.load_json(path)
    if manifest["class_names"] != class_names:
        raise ValueError(
            "class_names.txt does not match the processed data - re-run `python build_dataset.py`"
        )
    return manifest


def open_arrays(processed_dir: Path, split: str, class_names: list) -> list:
    """One memory-mapped uint8 array per class (or an empty array if missing)."""
    arrays = []
    for name in class_names:
        path = processed_dir / split / f"{name}.npy"
        arrays.append(np.load(path, mmap_mode="r") if path.exists() else np.empty((0, 0, 0), np.uint8))
    return arrays


def stratified_split(manifest: dict, class_names: list, val_fraction: float,
                     test_fraction: float, seed: int) -> dict:
    """Per-class train/val/test split of the `train` images.

    Each class is shuffled with a seed derived from (seed, class name), so the
    split of existing classes stays the same when new classes are added later.
    Returns {"train"|"val"|"test": [(class_idx, row_idx), ...]}.
    """
    splits = {"train": [], "val": [], "test": []}
    for c, name in enumerate(class_names):
        n = len(manifest["splits"]["train"][name])
        rng = np.random.default_rng([seed, zlib.crc32(name.encode("utf-8"))])
        order = rng.permutation(n)
        n_test = int(round(n * test_fraction))
        n_val = int(round(n * val_fraction))
        splits["test"] += [(c, int(r)) for r in order[:n_test]]
        splits["val"] += [(c, int(r)) for r in order[n_test: n_test + n_val]]
        splits["train"] += [(c, int(r)) for r in order[n_test + n_val:]]
    return splits


def all_pairs(arrays: list) -> list:
    return [(c, r) for c, arr in enumerate(arrays) for r in range(len(arr))]


def describe_pairs(pairs: list, manifest: dict, class_names: list, split: str = "train") -> list:
    """Human-readable (class, filename) for each pair - useful for reports."""
    files = manifest["splits"][split]
    return [(class_names[c], files[class_names[c]][r]) for c, r in pairs]


def _thicken_strokes(images: tf.Tensor, prob: float) -> tf.Tensor:
    """Randomly thicken black strokes (a 3x3 min-filter) for a subset of the batch.

    Dataset strokes are thin; strokes drawn on the canvas are often thicker.
    """
    thick = -tf.nn.max_pool2d(-images, ksize=3, strides=1, padding="SAME")
    choose = tf.random.uniform([tf.shape(images)[0], 1, 1, 1]) < prob
    return tf.where(choose, thick, images)


def make_dataset(arrays: list, pairs: list, num_classes: int, batch_size: int,
                 training: bool, seed: int = config.SEED,
                 thicken_prob: float = config.THICKEN_PROB) -> tf.data.Dataset:
    """Batches of (float32 black-on-white image 0-255 [B,S,S,1], one-hot label [B,C])."""
    pairs = np.asarray(pairs, dtype=np.int64).reshape(-1, 2)
    size = next(a.shape[1] for a in arrays if a.size)
    epoch = {"n": 0}

    def generator():
        if training:  # new, but reproducible, order every epoch
            order = np.random.default_rng([seed, epoch["n"]]).permutation(len(pairs))
            epoch["n"] += 1
        else:
            order = np.arange(len(pairs))
        for i in order:
            c, r = pairs[i]
            yield np.asarray(arrays[c][r])[..., None], c

    ds = tf.data.Dataset.from_generator(
        generator,
        output_signature=(
            tf.TensorSpec(shape=(size, size, 1), dtype=tf.uint8),
            tf.TensorSpec(shape=(), dtype=tf.int64),
        ),
    )

    def to_model_input(images, labels):
        images = tf.cast(images, tf.float32)
        if training and thicken_prob > 0:
            images = _thicken_strokes(images, thicken_prob)
        return images, tf.one_hot(labels, num_classes)

    return ds.batch(batch_size).map(to_model_input, num_parallel_calls=tf.data.AUTOTUNE).prefetch(2)

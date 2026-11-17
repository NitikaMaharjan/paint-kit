"""Convert the raw PNG doodles into per-class NumPy bitmap files.

    python build_dataset.py

Reads   doodles/<Class>/*.png         and   unseen_doodles/<Class>/*.png
Writes  processed/train/<Class>.npy   and   processed/unseen/<Class>.npy
        processed/manifest.json       (source filename of every row + settings)
        processed/preview.png         (visual sanity check of the preprocessing)

Each .npy is uint8 with shape (N, IMAGE_SIZE, IMAGE_SIZE), black doodle on white.
This mirrors the 28x28 project's one-.npy-per-class layout, but at the new
resolution and colour format. The files are memory-mapped during training,
so the whole dataset never has to sit in RAM.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

import config
from preprocessing import list_images, preprocess_path

SPLITS = {"train": config.RAW_TRAIN_DIR, "unseen": config.RAW_UNSEEN_DIR}


def build_split(name: str, raw_dir: Path, class_names: list, out_dir: Path, size: int) -> dict:
    files_per_class = {}
    if not raw_dir.exists():
        print(f"[{name}] {raw_dir} does not exist - skipping")
        return files_per_class

    extra = sorted({p.name for p in raw_dir.iterdir() if p.is_dir()} - set(class_names))
    if extra:
        print(f"[{name}] WARNING: folders not listed in class_names.txt are ignored: {extra}")

    (out_dir / name).mkdir(parents=True, exist_ok=True)
    for class_name in class_names:
        class_dir = raw_dir / class_name
        if not class_dir.is_dir():
            if name == "train":
                raise FileNotFoundError(f"Missing training folder for class '{class_name}': {class_dir}")
            print(f"[{name}] WARNING: no folder for '{class_name}'")
            files_per_class[class_name] = []
            continue

        files = list_images(class_dir)
        # Allocate one class at a time -> peak memory is a single class (~1.6 MB at 128px).
        arr = np.empty((len(files), size, size), dtype=np.uint8)
        for i, f in enumerate(files):
            arr[i] = preprocess_path(f, size=size)
        np.save(out_dir / name / f"{class_name}.npy", arr)
        files_per_class[class_name] = [f.name for f in files]
        print(f"[{name}] {class_name}: {len(files)} images")
    return files_per_class


def save_preview(out_dir: Path, class_names: list, size: int, per_class: int = 8) -> None:
    rows = []
    for class_name in class_names:
        path = out_dir / "train" / f"{class_name}.npy"
        arr = np.load(path, mmap_mode="r")[:per_class]
        row = np.full((size, per_class * (size + 2)), 200, dtype=np.uint8)
        for i, img in enumerate(arr):
            row[:, i * (size + 2): i * (size + 2) + size] = img
        rows.append(row)
        rows.append(np.full((2, row.shape[1]), 200, dtype=np.uint8))
    Image.fromarray(np.vstack(rows)).save(out_dir / "preview.png")


def main(argv=None) -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", default=None, help="base output dir (default: this folder)")
    parser.add_argument("--size", type=int, default=config.IMAGE_SIZE)
    args = parser.parse_args(argv)

    class_names = config.load_class_names()
    out_dir = config.output_paths(args.out)["processed"]
    print(f"{len(class_names)} classes, size {args.size}px -> {out_dir}")

    manifest = {
        "image_size": args.size,
        "format": "uint8, black doodle on white background (255 = background)",
        "margin": config.MARGIN,
        "ink_threshold": config.INK_THRESHOLD,
        "class_names": class_names,
        "splits": {},
    }
    for name, raw_dir in SPLITS.items():
        manifest["splits"][name] = build_split(name, raw_dir, class_names, out_dir, args.size)

    config.save_json(manifest, out_dir / "manifest.json")
    save_preview(out_dir, class_names, args.size)
    total = sum(len(v) for v in manifest["splits"]["train"].values())
    print(f"Done: {total} training images. Preview: {out_dir / 'preview.png'}")


if __name__ == "__main__":
    sys.exit(main())

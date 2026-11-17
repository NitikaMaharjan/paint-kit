"""Predict the class of one or more doodle images.

    python predict.py my_drawing.png
    python predict.py unseen_doodles/Apple --top 3
    python predict.py drawing.png --model models/doodle_classifier_255.keras

Input images can be any size, PNG with transparency included (e.g. exported from
the canvas). They go through the same preprocessing as the training data.
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

import config
from preprocessing import list_images, preprocess_image


class DoodleClassifier:
    """Small wrapper to reuse from other code (e.g. a future backend endpoint)."""

    def __init__(self, model_path: Path | str | None = None):
        from tensorflow import keras

        model_path = Path(model_path) if model_path else config.output_paths()["models"] / config.MODEL_FILENAME
        self.model = keras.models.load_model(model_path)
        self.class_names = config.load_json(model_path.parent / "class_names.json")
        self.image_size = int(self.model.input_shape[1])

    def predict_images(self, images: list, top: int = 3) -> list:
        """images: list of PIL images. Returns [[(class, probability), ...], ...]."""
        batch = np.stack([preprocess_image(img, size=self.image_size) for img in images])
        probs = self.model.predict(batch[..., None].astype("float32"), verbose=0)
        top = min(top, len(self.class_names))
        return [[(self.class_names[i], float(p[i])) for i in np.argsort(p)[::-1][:top]] for p in probs]


def _collect(paths: list) -> list:
    files = []
    for p in map(Path, paths):
        if p.is_dir():
            files += list_images(p)
        elif p.is_file():
            files.append(p)
        else:
            raise FileNotFoundError(p)
    return files


def main(argv=None) -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("paths", nargs="+", help="image files and/or folders")
    parser.add_argument("--model", default=None, help="path to .keras model (class_names.json must sit next to it)")
    parser.add_argument("--top", type=int, default=3)
    parser.add_argument("--cpu", action="store_true")
    args = parser.parse_args(argv)

    from train import configure_devices
    configure_devices(args.cpu)
    from PIL import Image

    clf = DoodleClassifier(args.model)
    files = _collect(args.paths)
    for start in range(0, len(files), 64):  # small chunks keep memory flat
        chunk = files[start: start + 64]
        images = []
        for f in chunk:
            with Image.open(f) as im:
                im.load()
                images.append(im.copy())
        for f, preds in zip(chunk, clf.predict_images(images, args.top)):
            print(f"{f}: " + ", ".join(f"{c} {p:.1%}" for c, p in preds))


if __name__ == "__main__":
    main()

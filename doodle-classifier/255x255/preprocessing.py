"""Image -> normalised array conversion, shared by dataset building AND prediction.

Using the exact same function at training and prediction time is what keeps
predictions on new drawings (e.g. from the web canvas) consistent with training.

Output format: uint8 array (IMAGE_SIZE, IMAGE_SIZE), BLACK doodle on WHITE
background (255 = background, 0 = darkest ink). The model itself inverts and
scales this internally, so callers always work with black-on-white images.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

import config


def _flatten_onto_white(img: Image.Image) -> Image.Image:
    """Transparent pixels (e.g. an exported canvas) become white, not black."""
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        rgba = img.convert("RGBA")
        background = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        background.alpha_composite(rgba)
        return background.convert("L")
    return img.convert("L")


def preprocess_image(
    img: Image.Image,
    size: int = config.IMAGE_SIZE,
    margin: float = config.MARGIN,
    ink_threshold: int = config.INK_THRESHOLD,
) -> np.ndarray:
    """Convert any doodle image into a centred, size x size, black-on-white uint8 array.

    Steps:
      1. flatten transparency onto white, convert to grayscale
      2. crop to the bounding box of the ink  -> position/scale invariance
      3. pad to a square with a small white margin (keeps aspect ratio)
      4. downscale with area averaging (BOX)  -> thin strokes are not dropped
      5. stretch contrast so the darkest ink becomes pure black
         (dataset strokes are mid-grey, canvas strokes are black; this makes them match)
    """
    gray = np.asarray(_flatten_onto_white(img), dtype=np.float32)
    ink = 255.0 - gray  # work in "ink" space: background 0, ink > 0

    mask = ink > ink_threshold
    if not mask.any():
        return np.full((size, size), 255, dtype=np.uint8)  # blank drawing

    ys, xs = np.nonzero(mask)
    crop = ink[ys.min(): ys.max() + 1, xs.min(): xs.max() + 1]
    h, w = crop.shape
    side = int(round(max(h, w) * (1.0 + 2.0 * margin)))
    square = np.zeros((side, side), dtype=np.float32)
    y0, x0 = (side - h) // 2, (side - w) // 2
    square[y0: y0 + h, x0: x0 + w] = crop

    small = Image.fromarray(np.clip(square, 0, 255).astype(np.uint8), mode="L")
    small = np.asarray(small.resize((size, size), Image.BOX), dtype=np.float32)

    peak = small.max()
    if peak > 0:
        small = small * (255.0 / peak)

    return (255.0 - np.clip(small, 0, 255)).astype(np.uint8)


def preprocess_path(path: Path | str, size: int = config.IMAGE_SIZE) -> np.ndarray:
    with Image.open(path) as img:
        return preprocess_image(img, size=size)


def list_images(folder: Path) -> list:
    """Sorted image files in a folder (sorted => deterministic ordering)."""
    return sorted(
        p for p in folder.iterdir()
        if p.is_file() and p.suffix.lower() in config.IMAGE_EXTENSIONS
    )

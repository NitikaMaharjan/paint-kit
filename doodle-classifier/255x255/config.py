"""Central configuration for the 255x255 (black-on-white) doodle classifier.

Every script reads its defaults from here, so changing e.g. IMAGE_SIZE or the
split fractions only needs to happen in one place.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# ---- Raw data (one sub-folder per class, black doodle on white background) ----
RAW_TRAIN_DIR = ROOT / "doodles"
RAW_UNSEEN_DIR = ROOT / "unseen_doodles"
CLASS_NAMES_FILE = ROOT / "class_names.txt"  # defines class order / label ids
IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".bmp", ".webp")

# ---- Preprocessing ----
IMAGE_SIZE = 128        # network input resolution (source images are ~254px)
MARGIN = 0.10           # white border added around the cropped doodle (fraction of its size)
INK_THRESHOLD = 20      # 0-255; pixels darker than (255 - this) count as ink when cropping

# ---- Split / training ----
SEED = 42
VAL_FRACTION = 0.15
TEST_FRACTION = 0.15
BATCH_SIZE = 32
MAX_EPOCHS = 80
LEARNING_RATE = 1e-3
EARLY_STOP_PATIENCE = 15
LABEL_SMOOTHING = 0.1
THICKEN_PROB = 0.5      # probability of randomly thickening strokes during training

MODEL_FILENAME = "doodle_classifier_255.keras"


def output_paths(out_dir: Path | str | None = None) -> dict:
    """Where generated files go. Defaults to sub-folders of this directory."""
    base = Path(out_dir) if out_dir else ROOT
    return {
        "processed": base / "processed",
        "models": base / "models",
        "reports": base / "reports",
    }


def load_class_names(path: Path = CLASS_NAMES_FILE) -> list:
    with open(path, "r", encoding="utf-8") as f:
        names = [line.strip() for line in f if line.strip()]
    if len(names) != len(set(names)):
        raise ValueError(f"Duplicate class names in {path}")
    return names


def save_json(obj, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2)


def load_json(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

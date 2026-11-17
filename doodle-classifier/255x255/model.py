"""CNN architecture for 128x128 black-on-white doodles.

Design (kept deliberately small - ~100 images per class):
  * input: black-on-white, 0-255 (same format as the dataset and the canvas)
  * Rescaling(-1/255, +1) inverts AND normalises: background -> 0, ink -> 1.
    A zero background matches the zero padding of convolutions and the fill of
    the augmentation layers below, and the network "looks at" the ink.
  * augmentation layers (only active in training): flip, small rotation,
    shift and zoom - plausible variations of how people draw.
  * 5 conv blocks (Conv -> BatchNorm -> ReLU -> MaxPool): 128 -> 4 px
  * GlobalAveragePooling instead of Flatten: far fewer parameters, less overfitting
  * Dropout + light L2 weight decay
Only built-in Keras layers are used, so the saved .keras file loads without
any custom code.
"""
from __future__ import annotations

import platform
import sys

from tensorflow import keras

layers = keras.layers

FILTERS = (32, 48, 64, 96, 128)


def _conv_block(x, filters: int, l2: float, name: str):
    x = layers.Conv2D(filters, 3, padding="same", use_bias=False,
                      kernel_regularizer=keras.regularizers.l2(l2), name=f"{name}_conv")(x)
    # momentum 0.9 (Keras default 0.99): with ~11 steps/epoch the default moving
    # statistics stay near their initial values, and the model collapses to one
    # class at inference time even while training accuracy looks fine.
    x = layers.BatchNormalization(momentum=0.9, name=f"{name}_bn")(x)
    x = layers.Activation("relu", name=f"{name}_relu")(x)
    return layers.MaxPooling2D(2, name=f"{name}_pool")(x)


def build_model(num_classes: int, image_size: int, augment: bool = True, flip: bool = True,
                dropout: float = 0.4, l2: float = 1e-4) -> keras.Model:
    inputs = keras.Input(shape=(image_size, image_size, 1), name="image")
    x = layers.Rescaling(scale=-1.0 / 255.0, offset=1.0, name="invert_and_scale")(inputs)

    if augment:
        if flip:
            x = layers.RandomFlip("horizontal", name="aug_flip")(x)
        x = layers.RandomRotation(0.03, fill_mode="constant", fill_value=0.0, name="aug_rotate")(x)  # ~ +-11 deg
        x = layers.RandomTranslation(0.08, 0.08, fill_mode="constant", fill_value=0.0, name="aug_shift")(x)
        x = layers.RandomZoom(0.12, fill_mode="constant", fill_value=0.0, name="aug_zoom")(x)

    for i, filters in enumerate(FILTERS):
        x = _conv_block(x, filters, l2, name=f"block{i + 1}")

    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.Dropout(dropout, name="dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)
    return keras.Model(inputs, outputs, name="doodle_cnn_255")


def make_optimizer(learning_rate: float):
    """Adam. On Apple Silicon with TF <= 2.15 the legacy Adam is much faster
    (TF itself prints a warning about this for the new optimizer)."""
    legacy = getattr(keras.optimizers, "legacy", None)
    on_apple_silicon = sys.platform == "darwin" and platform.machine() == "arm64"
    if on_apple_silicon and legacy is not None and hasattr(legacy, "Adam"):
        try:
            return legacy.Adam(learning_rate=learning_rate)
        except Exception:  # Keras 3 exposes a stub that raises
            pass
    return keras.optimizers.Adam(learning_rate=learning_rate)

"""Train the 255x255 (black-on-white) doodle CNN.

    python build_dataset.py   # once, and again whenever images/classes change
    python train.py           # trains, saves the model, evaluates on test + unseen

Outputs
  models/doodle_classifier_255.keras   trained model (input: black-on-white 128x128, 0-255)
  models/class_names.json              label order used by the model
  models/model_info.json               preprocessing settings + versions
  reports/                             history.csv, training_curves.png, splits.json,
                                       test_* and unseen_* metrics / confusion matrices
"""
from __future__ import annotations

import argparse
import os
import platform

import config


def configure_devices(cpu_only: bool = False) -> None:
    """Use Apple Metal (tensorflow-metal) / CUDA if available, unless --cpu is given."""
    os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
    import tensorflow as tf

    if cpu_only:
        tf.config.set_visible_devices([], "GPU")
    gpus = tf.config.list_logical_devices("GPU")
    print(f"TensorFlow {tf.__version__} | Python {platform.python_version()} | "
          f"device: {'GPU/Metal ' + str([g.name for g in gpus]) if gpus else 'CPU'}")


def plot_history(history: dict, path) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(11, 4))
    for key, ax in (("loss", a1), ("accuracy", a2)):
        ax.plot(history[key], label="train")
        ax.plot(history[f"val_{key}"], label="validation")
        ax.set_title(key)
        ax.set_xlabel("epoch")
        ax.legend()
    fig.tight_layout()
    fig.savefig(path, dpi=110)
    plt.close(fig)


def main(argv=None) -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", default=None, help="base output dir (default: this folder)")
    parser.add_argument("--epochs", type=int, default=config.MAX_EPOCHS)
    parser.add_argument("--batch-size", type=int, default=config.BATCH_SIZE)
    parser.add_argument("--lr", type=float, default=config.LEARNING_RATE)
    parser.add_argument("--no-flip", action="store_true", help="disable horizontal-flip augmentation")
    parser.add_argument("--cpu", action="store_true", help="hide the GPU / Metal device")
    args = parser.parse_args(argv)

    configure_devices(args.cpu)
    from tensorflow import keras
    import tensorflow as tf

    import data
    from evaluate import run_evaluation
    from model import build_model, make_optimizer

    keras.utils.set_random_seed(config.SEED)
    paths = config.output_paths(args.out)
    for p in (paths["models"], paths["reports"]):
        p.mkdir(parents=True, exist_ok=True)

    # ---- data ----
    class_names = config.load_class_names()
    num_classes = len(class_names)
    manifest = data.load_manifest(paths["processed"], class_names)
    image_size = manifest["image_size"]
    arrays = data.open_arrays(paths["processed"], "train", class_names)
    splits = data.stratified_split(manifest, class_names, config.VAL_FRACTION,
                                   config.TEST_FRACTION, config.SEED)
    print(f"{num_classes} classes | train {len(splits['train'])} | "
          f"val {len(splits['val'])} | test {len(splits['test'])} | {image_size}px")
    config.save_json({k: [f"{c}/{f}" for c, f in data.describe_pairs(v, manifest, class_names)]
                      for k, v in splits.items()}, paths["reports"] / "splits.json")

    train_ds = data.make_dataset(arrays, splits["train"], num_classes, args.batch_size, training=True)
    val_ds = data.make_dataset(arrays, splits["val"], num_classes, args.batch_size, training=False)

    # ---- model ----
    model = build_model(num_classes, image_size, flip=not args.no_flip)
    model.compile(
        optimizer=make_optimizer(args.lr),
        loss=keras.losses.CategoricalCrossentropy(label_smoothing=config.LABEL_SMOOTHING),
        metrics=["accuracy"],
    )
    model.summary(line_length=90)

    callbacks = [
        keras.callbacks.EarlyStopping(monitor="val_loss", patience=config.EARLY_STOP_PATIENCE,
                                      restore_best_weights=True, verbose=1),
        keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=6,
                                          min_lr=1e-5, verbose=1),
        keras.callbacks.CSVLogger(str(paths["reports"] / "history.csv")),
    ]
    history = model.fit(train_ds, validation_data=val_ds, epochs=args.epochs,
                        callbacks=callbacks, verbose=2)

    # ---- save ----
    model_path = paths["models"] / config.MODEL_FILENAME
    model.save(model_path)
    config.save_json(class_names, paths["models"] / "class_names.json")
    config.save_json({
        "model_file": config.MODEL_FILENAME,
        "input": f"{image_size}x{image_size}x1 float32, black doodle on white background, 0-255",
        "preprocessing": "preprocessing.preprocess_image (crop to ink, pad square, resize, contrast stretch)",
        "image_size": image_size,
        "margin": manifest["margin"],
        "ink_threshold": manifest["ink_threshold"],
        "num_classes": num_classes,
        "epochs_run": len(history.history["loss"]),
        "tensorflow_version": tf.__version__,
    }, paths["models"] / "model_info.json")
    plot_history(history.history, paths["reports"] / "training_curves.png")
    print(f"Saved model to {model_path}")

    # ---- evaluate on data the model never trained on ----
    run_evaluation(model, class_names, paths, ["test", "unseen"], args.batch_size)


if __name__ == "__main__":
    main()

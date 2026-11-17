"""Evaluate a trained model: accuracy, precision, recall, F1, confusion matrix.

    python evaluate.py                 # held-out test split + unseen_doodles
    python evaluate.py --split unseen

Writes reports/<split>_report.txt, <split>_metrics.json, <split>_confusion_matrix.png
Metrics are computed with NumPy, so no scikit-learn dependency is needed.
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np

import config


def compute_metrics(y_true: np.ndarray, probs: np.ndarray, class_names: list) -> dict:
    n = len(class_names)
    y_pred = probs.argmax(axis=1)
    cm = np.zeros((n, n), dtype=np.int64)
    np.add.at(cm, (y_true, y_pred), 1)

    tp = np.diag(cm).astype(float)
    support = cm.sum(axis=1).astype(float)
    predicted = cm.sum(axis=0).astype(float)
    with np.errstate(divide="ignore", invalid="ignore"):
        precision = np.where(predicted > 0, tp / predicted, 0.0)
        recall = np.where(support > 0, tp / support, 0.0)
        f1 = np.where(precision + recall > 0, 2 * precision * recall / (precision + recall), 0.0)

    k = min(3, n)
    topk = np.argsort(probs, axis=1)[:, ::-1][:, :k]
    present = support > 0
    weights = support / support.sum()
    return {
        "num_samples": int(len(y_true)),
        "accuracy": float((y_pred == y_true).mean()),
        f"top{k}_accuracy": float((topk == y_true[:, None]).any(axis=1).mean()),
        "macro_precision": float(precision[present].mean()),
        "macro_recall": float(recall[present].mean()),
        "macro_f1": float(f1[present].mean()),
        "weighted_f1": float((f1 * weights).sum()),
        "per_class": {
            name: {"precision": float(precision[i]), "recall": float(recall[i]),
                   "f1": float(f1[i]), "support": int(support[i])}
            for i, name in enumerate(class_names)
        },
        "confusion_matrix": cm.tolist(),
    }


def format_report(title: str, m: dict, class_names: list) -> str:
    width = max(12, max(len(c) for c in class_names) + 2)
    lines = [title, "=" * len(title),
             f"{'class':<{width}}{'precision':>10}{'recall':>10}{'f1':>10}{'support':>9}"]
    for name in class_names:
        p = m["per_class"][name]
        lines.append(f"{name:<{width}}{p['precision']:>10.3f}{p['recall']:>10.3f}{p['f1']:>10.3f}{p['support']:>9d}")
    topk_key = next(k for k in m if k.startswith("top"))
    lines += [
        "",
        f"{'macro avg':<{width}}{m['macro_precision']:>10.3f}{m['macro_recall']:>10.3f}{m['macro_f1']:>10.3f}{m['num_samples']:>9d}",
        f"accuracy: {m['accuracy']:.3f}   {topk_key.replace('_', ' ')}: {m[topk_key]:.3f}   weighted f1: {m['weighted_f1']:.3f}",
        "",
        "confusion matrix (rows = true, cols = predicted):",
    ]
    cm = np.array(m["confusion_matrix"])
    lines.append(" " * width + "".join(f"{c[:6]:>8}" for c in class_names))
    for name, row in zip(class_names, cm):
        lines.append(f"{name:<{width}}" + "".join(f"{v:>8d}" for v in row))
    return "\n".join(lines)


def plot_confusion_matrix(cm, class_names: list, title: str, path: Path) -> None:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    cm = np.asarray(cm)
    n = len(class_names)
    size = max(5, 0.35 * n + 3)
    fig, ax = plt.subplots(figsize=(size, size))
    ax.imshow(cm, cmap="Blues")
    ax.set_xticks(range(n))
    ax.set_xticklabels(class_names, rotation=90 if n > 10 else 45, ha="right")
    ax.set_yticks(range(n))
    ax.set_yticklabels(class_names)
    ax.set_xlabel("Predicted")
    ax.set_ylabel("True")
    ax.set_title(title)
    if n <= 20:
        for i in range(n):
            for j in range(n):
                ax.text(j, i, int(cm[i, j]), ha="center", va="center",
                        color="white" if cm[i, j] > cm.max() / 2 else "black")
    fig.tight_layout()
    fig.savefig(path, dpi=120)
    plt.close(fig)


def evaluate_split(model, dataset, y_true, class_names: list, split_name: str, reports_dir: Path,
                   file_labels: list | None = None) -> dict:
    probs = model.predict(dataset, verbose=0)
    y_true = np.asarray(y_true)
    m = compute_metrics(y_true, probs, class_names)

    reports_dir.mkdir(parents=True, exist_ok=True)
    report = format_report(f"{split_name} set ({m['num_samples']} images)", m, class_names)

    if file_labels is not None:
        wrong = [(file_labels[i], class_names[int(probs[i].argmax())], float(probs[i].max()))
                 for i in range(len(y_true)) if probs[i].argmax() != y_true[i]]
        m["misclassified"] = [{"true": t, "file": f, "predicted": p, "confidence": c}
                              for (t, f), p, c in wrong]
        if wrong:
            report += "\n\nmisclassified:\n" + "\n".join(
                f"  {t}/{f} -> {p} ({c:.0%})" for (t, f), p, c in wrong)

    (reports_dir / f"{split_name}_report.txt").write_text(report + "\n", encoding="utf-8")
    config.save_json(m, reports_dir / f"{split_name}_metrics.json")
    plot_confusion_matrix(m["confusion_matrix"], class_names, f"{split_name} confusion matrix",
                          reports_dir / f"{split_name}_confusion_matrix.png")
    print("\n" + report + "\n")
    return m


def run_evaluation(model, class_names: list, paths: dict, splits: list,
                   batch_size: int = config.BATCH_SIZE) -> dict:
    """Evaluate on 'test' (held-out part of doodles/) and/or 'unseen' (unseen_doodles/)."""
    import data

    manifest = data.load_manifest(paths["processed"], class_names)
    results = {}
    for split in splits:
        if split == "test":
            arrays = data.open_arrays(paths["processed"], "train", class_names)
            pairs = data.stratified_split(manifest, class_names, config.VAL_FRACTION,
                                          config.TEST_FRACTION, config.SEED)["test"]
            labels = data.describe_pairs(pairs, manifest, class_names, "train")
        elif split == "unseen":
            arrays = data.open_arrays(paths["processed"], "unseen", class_names)
            pairs = data.all_pairs(arrays)
            if not pairs:
                print("No unseen images found - skipping")
                continue
            labels = data.describe_pairs(pairs, manifest, class_names, "unseen")
        else:
            raise ValueError(split)
        ds = data.make_dataset(arrays, pairs, len(class_names), batch_size, training=False)
        results[split] = evaluate_split(model, ds, [c for c, _ in pairs], class_names, split,
                                        paths["reports"], labels)
    return results


def main(argv=None) -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", default=None, help="base output dir used for training (default: this folder)")
    parser.add_argument("--split", choices=["test", "unseen", "all"], default="all")
    parser.add_argument("--cpu", action="store_true", help="hide the GPU / Metal device")
    args = parser.parse_args(argv)

    from train import configure_devices
    configure_devices(args.cpu)
    from tensorflow import keras

    paths = config.output_paths(args.out)
    class_names = config.load_json(paths["models"] / "class_names.json")
    model = keras.models.load_model(paths["models"] / config.MODEL_FILENAME)
    splits = ["test", "unseen"] if args.split == "all" else [args.split]
    run_evaluation(model, class_names, paths, splits)


if __name__ == "__main__":
    main()

"""
CivicPulse ML Model Training Pipeline
Trained on historical civic complaint data from CivicLens-AI.

Architecture:
  Historical CivicLens data
            ↓
       ML training
            ↓
      trained model
            ↓
  incoming CivicPulse report
            ↓
      ML prediction
            ↓
      severity score
            ↓
        PostgreSQL
            ↓
   React Admin Center
            ↓
     Leaflet Heatmap
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# Base Paths
SCRIPT_DIR = Path(__file__).resolve().parent
DATA_PATH = SCRIPT_DIR / "data" / "complaints.csv"
MODEL_DIR = SCRIPT_DIR / "model"
MODEL_PATH = MODEL_DIR / "civicpulse_severity_model.joblib"

TARGET_CLASSES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
NUMERIC_FEATURES = ["latitude", "longitude", "rainfall", "traffic", "population"]
CATEGORICAL_FEATURES = ["category", "ward", "department"]


def load_dataset(csv_path: Path) -> pd.DataFrame:
    """Load and perform preliminary validation on the historical CSV."""
    if not csv_path.exists():
        raise FileNotFoundError(f"Historical dataset not found at {csv_path}")

    print(f"[1/6] Loading historical training data from: {csv_path}")
    df = pd.read_csv(csv_path)
    print(f"      Initial shape: {df.shape[0]} rows, {df.shape[1]} columns")

    # Verify required columns exist
    required_cols = ["category", "ward", "priority"] + NUMERIC_FEATURES
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in CSV: {missing}")

    # Drop unrecoverable missing values
    df = df.dropna(subset=["priority", "category", "ward"]).copy()

    # Normalize priority target to uppercase
    df["priority"] = df["priority"].astype(str).str.strip().str.upper()

    # Map if any variations exist
    priority_norm = {
        "LOW": "LOW",
        "MEDIUM": "MEDIUM",
        "HIGH": "HIGH",
        "CRITICAL": "CRITICAL"
    }
    df["priority"] = df["priority"].map(priority_norm)
    df = df.dropna(subset=["priority"]).copy()

    # Department fallback
    if "department" not in df.columns or df["department"].isnull().all():
        df["department"] = "General Administration"
    else:
        df["department"] = df["department"].fillna("General Administration")

    print(f"      Cleaned dataset shape: {df.shape[0]} records")
    return df


def compute_ward_defaults(df: pd.DataFrame) -> dict:
    """Compute per-ward medians and overall medians for inference fallbacks."""
    overall_medians = {
        "latitude": float(df["latitude"].median()),
        "longitude": float(df["longitude"].median()),
        "rainfall": float(df["rainfall"].median()),
        "traffic": float(df["traffic"].median()),
        "population": float(df["population"].median()),
    }

    ward_grouped = df.groupby("ward")[NUMERIC_FEATURES].median().to_dict(orient="index")

    # Category -> dominant department mapping
    cat_dept = df.groupby("category")["department"].agg(
        lambda x: x.mode()[0] if not x.mode().empty else "General Administration"
    ).to_dict()

    return {
        "overall": overall_medians,
        "by_ward": ward_grouped,
        "category_department": cat_dept,
        "known_categories": sorted(df["category"].dropna().unique().tolist()),
        "known_wards": sorted(df["ward"].dropna().unique().tolist()),
        "known_departments": sorted(df["department"].dropna().unique().tolist()),
    }


def build_pipeline() -> Pipeline:
    """Build scikit-learn preprocessing and Random Forest pipeline."""
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, NUMERIC_FEATURES),
            ("cat", cat_pipeline, CATEGORICAL_FEATURES)
        ],
        remainder="drop"
    )

    classifier = RandomForestClassifier(
        n_estimators=120,
        max_depth=14,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    model_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])

    return model_pipeline


def train_and_evaluate():
    """Execute training pipeline and save artifacts."""
    print("=" * 60)
    print("  CIVICPULSE ML TRAINING: SEVERITY PREDICTION PIPELINE")
    print("=" * 60)

    # 1. Load Data
    df = load_dataset(DATA_PATH)

    # 2. Extract Features & Target
    feature_cols = CATEGORICAL_FEATURES + NUMERIC_FEATURES
    X = df[feature_cols].copy()
    y = df["priority"].copy()

    class_counts = y.value_counts().to_dict()
    print("\n[2/6] Target Class Distribution:")
    for cls in TARGET_CLASSES:
        cnt = class_counts.get(cls, 0)
        pct = (cnt / len(y)) * 100
        print(f"      - {cls:<10}: {cnt:>5} records ({pct:5.2f}%)")

    # 3. Context & Ward Defaults
    context_defaults = compute_ward_defaults(df)

    # 4. Train / Test Split
    print("\n[3/6] Performing Stratified Train/Test Split (80/20, random_state=42)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"      Train set size: {len(X_train)} samples")
    print(f"      Test set size : {len(X_test)} samples")

    # 5. Train Model
    print("\n[4/6] Training RandomForestClassifier (120 trees, balanced weights)...")
    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)
    print("      Model training complete.")

    # 6. Evaluation
    print("\n[5/6] Evaluating on Unseen Test Set...")
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)

    acc = accuracy_score(y_test, y_pred)
    prec_macro = precision_score(y_test, y_pred, average="macro", zero_division=0)
    rec_macro = recall_score(y_test, y_pred, average="macro", zero_division=0)
    f1_macro = f1_score(y_test, y_pred, average="macro", zero_division=0)
    prec_weighted = precision_score(y_test, y_pred, average="weighted", zero_division=0)
    rec_weighted = recall_score(y_test, y_pred, average="weighted", zero_division=0)
    f1_weighted = f1_score(y_test, y_pred, average="weighted", zero_division=0)

    cm = confusion_matrix(y_test, y_pred, labels=pipeline.classes_)

    print("-" * 60)
    print("  EVALUATION METRICS SUMMARY")
    print("-" * 60)
    print(f"  Accuracy           : {acc:.4f} ({acc*100:.2f}%)")
    print(f"  Macro Precision    : {prec_macro:.4f}")
    print(f"  Macro Recall       : {rec_macro:.4f}")
    print(f"  Macro F1-Score     : {f1_macro:.4f}")
    print(f"  Weighted F1-Score  : {f1_weighted:.4f}")
    print("\n  Classification Report:")
    print(classification_report(y_test, y_pred, digits=4, zero_division=0))
    print("  Confusion Matrix (Labels: " + ", ".join(pipeline.classes_) + "):")
    print(cm)
    print("-" * 60)

    # 7. Serialize Artifacts
    print("\n[6/6] Saving trained model and metadata bundle...")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    metrics = {
        "accuracy": float(acc),
        "macro_precision": float(prec_macro),
        "macro_recall": float(rec_macro),
        "macro_f1": float(f1_macro),
        "weighted_f1": float(f1_weighted),
        "classes": pipeline.classes_.tolist(),
        "confusion_matrix": cm.tolist(),
        "total_training_samples": len(X_train),
        "total_test_samples": len(X_test),
        "class_distribution": class_counts
    }

    bundle = {
        "pipeline": pipeline,
        "classes": pipeline.classes_.tolist(),
        "features": {
            "numeric": NUMERIC_FEATURES,
            "categorical": CATEGORICAL_FEATURES
        },
        "context_defaults": context_defaults,
        "metrics": metrics,
        "model_version": "civicpulse-v1",
        "target_classes": TARGET_CLASSES
    }

    joblib.dump(bundle, MODEL_PATH)
    print(f"      Saved model bundle to: {MODEL_PATH}")

    # Also save a metrics.json for inspection
    metrics_path = MODEL_DIR / "metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"      Saved metrics summary to: {metrics_path}")

    print("\n[SUCCESS] MODEL TRAINING SUCCESSFUL AND REPRODUCIBLE.")
    return metrics


if __name__ == "__main__":
    train_and_evaluate()

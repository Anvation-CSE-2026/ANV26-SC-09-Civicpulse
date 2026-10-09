"""
CivicPulse ML Prediction Module
Loads trained model pipeline and generates severity predictions
derived mathematically from class probabilities.
"""

from pathlib import Path
from typing import Dict, Any, Optional
import joblib
import numpy as np
import pandas as pd

SCRIPT_DIR = Path(__file__).resolve().parent
MODEL_PATH = SCRIPT_DIR / "model" / "civicpulse_severity_model.joblib"

# Anchors for deriving 0-100 severity score from class probability distribution:
# Expected severity score = sum(P(class) * WEIGHT[class])
CLASS_WEIGHTS = {
    "LOW": 20.0,
    "MEDIUM": 50.0,
    "HIGH": 75.0,
    "CRITICAL": 95.0
}

# Category synonyms / normalization mapping to historical dataset categories
CATEGORY_SYNONYMS = {
    # Road / Infrastructure
    "pothole": "Road Damage",
    "road crack": "Road Damage",
    "road excavation": "Road Damage",
    "broken footpath": "Road Damage",
    "road damage": "Road Damage",
    "infrastructure": "Road Damage",
    "potholes": "Road Damage",

    # Waterlogging & Drainage
    "waterlogging": "Water Logging",
    "water logging": "Water Logging",
    "flooding": "Water Logging",
    "drainage": "Sewage Overflow",
    "drainage issue": "Sewage Overflow",
    "sewage": "Sewage Overflow",
    "sewage overflow": "Sewage Overflow",
    "open manhole": "Sewage Overflow",

    # Utilities
    "broken streetlight": "Streetlight Outage",
    "streetlight outage": "Streetlight Outage",
    "streetlight": "Streetlight Outage",
    "power issue": "Power Outage",
    "power outage": "Power Outage",
    "blackout": "Power Outage",
    "water leakage": "Water Supply",
    "water supply": "Water Supply",
    "pipe burst": "Water Supply",

    # Public Safety & Traffic
    "traffic signal broken": "Traffic Signal Fault",
    "traffic signal fault": "Traffic Signal Fault",
    "traffic light": "Traffic Signal Fault",
    "traffic": "Traffic Signal Fault",
    "public safety": "Public Nuisance",
    "accident": "Traffic Signal Fault",

    # Sanitation & Environment
    "garbage": "Garbage Collection",
    "garbage collection": "Garbage Collection",
    "trash": "Garbage Collection",
    "stray animals": "Stray Animals",
    "stray dogs": "Stray Animals",
    "tree fall": "Tree Fall",
    "fallen tree": "Tree Fall",
    "air pollution": "Air Pollution",
    "noise pollution": "Noise Pollution",
    "illegal construction": "Illegal Construction",
    "encroachment": "Encroachment",
    "public nuisance": "Public Nuisance",
}

# Global cached bundle
_BUNDLE = None


def get_model_bundle() -> Dict[str, Any]:
    """Load model bundle lazily and cache in memory."""
    global _BUNDLE
    if _BUNDLE is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. "
                "Please run python model/train.py first."
            )
        _BUNDLE = joblib.load(MODEL_PATH)
    return _BUNDLE


def normalize_category(cat: Optional[str]) -> str:
    """Map user/UI category to matching historical dataset category."""
    if not cat:
        return "Road Damage"
    raw = cat.strip().lower()
    return CATEGORY_SYNONYMS.get(raw, cat.strip())


def normalize_ward(ward: Optional[str], defaults: Dict[str, Any]) -> str:
    """Map ward or area name to known ward or return clean string."""
    if not ward:
        return "Ward-1"
    raw = ward.strip()
    # Check if exact match in known wards
    known_wards = defaults.get("known_wards", [])
    if raw in known_wards:
        return raw

    # Check case-insensitive
    for kw in known_wards:
        if kw.lower() == raw.lower():
            return kw

    # If format like 'Ward 22' -> 'Ward-22'
    if raw.lower().startswith("ward"):
        parts = raw.replace("-", " ").split()
        if len(parts) >= 2 and parts[1].isdigit():
            cand = f"Ward-{parts[1]}"
            if cand in known_wards:
                return cand

    return raw


def predict_incident_severity(
    category: Optional[str] = None,
    ward: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    rainfall: Optional[float] = None,
    traffic: Optional[float] = None,
    population: Optional[int] = None,
    department: Optional[str] = None,
    description: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Predict severity level, score (0-100), and confidence for a civic complaint.
    
    Returns:
      {
        "severityLevel": "HIGH",
        "severityScore": 78,
        "confidence": 0.87,
        "modelVersion": "civicpulse-v1",
        "context": { ... }
      }
    """
    bundle = get_model_bundle()
    pipeline = bundle["pipeline"]
    defaults = bundle["context_defaults"]
    overall_med = defaults["overall"]
    by_ward = defaults.get("by_ward", {})
    cat_dept_map = defaults.get("category_department", {})

    # 1. Normalize Category
    norm_cat = normalize_category(category)

    # 2. Normalize Ward
    norm_ward = normalize_ward(ward, defaults)

    # 3. Resolve Ward Defaults if not passed
    ward_stats = by_ward.get(norm_ward, overall_med)

    final_lat = float(latitude) if latitude is not None else float(ward_stats.get("latitude", overall_med["latitude"]))
    final_lng = float(longitude) if longitude is not None else float(ward_stats.get("longitude", overall_med["longitude"]))
    final_rain = float(rainfall) if rainfall is not None else float(ward_stats.get("rainfall", overall_med["rainfall"]))
    final_traffic = float(traffic) if traffic is not None else float(ward_stats.get("traffic", overall_med["traffic"]))
    final_pop = int(population) if population is not None else int(ward_stats.get("population", overall_med["population"]))

    # 4. Resolve Department
    if department and department.strip():
        final_dept = department.strip()
    else:
        final_dept = cat_dept_map.get(norm_cat, "Roads & Infrastructure")

    # 5. Build Single-Row DataFrame matching training features
    input_df = pd.DataFrame([{
        "category": norm_cat,
        "ward": norm_ward,
        "department": final_dept,
        "latitude": final_lat,
        "longitude": final_lng,
        "rainfall": final_rain,
        "traffic": final_traffic,
        "population": final_pop
    }])

    # 6. Predict Probabilities using scikit-learn pipeline
    probs = pipeline.predict_proba(input_df)[0]
    classes = pipeline.classes_

    prob_dict = {str(cls): float(round(p, 4)) for cls, p in zip(classes, probs)}

    # 7. Derive Mathematical 0-100 Severity Score
    # severityScore = sum( P(class) * CLASS_WEIGHTS[class] )
    expected_score = sum(
        prob_dict.get(cls, 0.0) * CLASS_WEIGHTS.get(cls, 50.0)
        for cls in classes
    )

    # Contextual adjustment for extreme hazard factors
    # e.g. severe rainfall (>80mm) or heavy congestion (>100) or high population
    hazard_boost = 0.0
    if final_rain > 75.0:
        hazard_boost += min(8.0, (final_rain - 75.0) * 0.15)
    if final_traffic > 80.0:
        hazard_boost += min(8.0, (final_traffic - 80.0) * 0.12)
    if final_pop > 90000:
        hazard_boost += 3.0

    raw_score = expected_score + hazard_boost
    severity_score = int(np.clip(round(raw_score), 15, 99))

    # 8. Determine Severity Level from Score & argmax
    top_class = str(classes[np.argmax(probs)])
    confidence = float(round(np.max(probs), 4))

    # Calibrate severity level to CivicPulse standards
    if severity_score > 80 or top_class == "CRITICAL":
        severity_level = "CRITICAL"
    elif severity_score > 60 or top_class == "HIGH":
        severity_level = "HIGH"
    elif severity_score > 35 or top_class == "MEDIUM":
        severity_level = "MEDIUM"
    else:
        severity_level = "LOW"

    return {
        "severityLevel": severity_level,
        "severityScore": severity_score,
        "confidence": confidence,
        "modelVersion": bundle.get("model_version", "civicpulse-v1"),
        "context": {
            "category": norm_cat,
            "department": final_dept,
            "ward": norm_ward,
            "latitude": round(final_lat, 6),
            "longitude": round(final_lng, 6),
            "rainfall": round(final_rain, 1),
            "traffic": round(final_traffic, 1),
            "population": int(final_pop),
            "probabilities": prob_dict,
            "expectedBaseScore": round(expected_score, 1),
            "environmentalHazardBoost": round(hazard_boost, 1)
        }
    }


def derive_severity_score(probabilities: Dict[str, float], rainfall: float = 0.0, traffic: float = 0.0, population: int = 40000) -> int:
    """Derive continuous 15-99 severity score from class probability distribution and environmental hazards."""
    expected = sum(
        probabilities.get(cls, 0.0) * CLASS_WEIGHTS.get(cls, 50.0)
        for cls in CLASS_WEIGHTS
    )
    hazard_boost = 0.0
    if rainfall > 75.0:
        hazard_boost += min(8.0, (rainfall - 75.0) * 0.15)
    if traffic > 80.0:
        hazard_boost += min(8.0, (traffic - 80.0) * 0.12)
    if population > 90000:
        hazard_boost += 3.0
    return int(np.clip(round(expected + hazard_boost), 15, 99))


def predict_severity(data: Optional[Dict[str, Any]] = None, **kwargs) -> Dict[str, Any]:
    """Convenience wrapper accepting dictionary or keyword arguments."""
    payload = dict(data or {})
    payload.update(kwargs)
    return predict_incident_severity(
        category=payload.get("category"),
        ward=payload.get("ward"),
        latitude=payload.get("latitude"),
        longitude=payload.get("longitude"),
        rainfall=payload.get("rainfall"),
        traffic=payload.get("traffic"),
        population=payload.get("population"),
        department=payload.get("department"),
        description=payload.get("description"),
    )


if __name__ == "__main__":
    # Test sample call
    print("Testing CivicPulse ML Predictor...")
    res = predict_incident_severity(
        category="Pothole",
        ward="BTM",
        latitude=12.9166,
        longitude=77.6101,
        rainfall=12.4,
        traffic=78.0,
        population=45000,
        department="Roads & Infrastructure"
    )
    import json
    print(json.dumps(res, indent=2))

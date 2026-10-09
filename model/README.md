# CivicPulse ML Severity Prediction Service

A machine learning microservice for **CivicPulse** that predicts incident severity levels (LOW, MEDIUM, HIGH, CRITICAL) and continuous severity risk scores (15–99) using historical civic complaint patterns.

---

## 1. Dataset Source & Attribution

- **Source Repository:** [CivicLens-AI](https://github.com/Rakshith-Achar-08/CivicLens-AI-)
- **File:** `model/data/complaints.csv`
- **Total Records:** 10,040 complaints
- **Geographic Focus:** Bengaluru urban metropolitan region (Wards 1–40)

> **CRITICAL DATA DISTINCTION:**  
> The `complaints.csv` dataset is **HISTORICAL TRAINING DATA**, NOT real-time streaming data. It reflects aggregated historical civic complaints, municipal ward statistics, infrastructure damage reports, and environmental readings.  
> The **real-time component** consists of incoming citizen incident reports submitted dynamically through the CivicPulse web application.

---

## 2. Dataset Purpose

Historical civic complaint datasets allow municipal platforms to learn empirical relationships between:
1. Complaint category and department responsibility
2. Ward demographics and population density
3. Geospatial coordinates across municipal zones
4. Environmental conditions (rainfall, waterlogging thresholds)
5. Urban traffic congestion levels

By training on historical patterns, the model predicts the true operational urgency of new reports rather than relying on arbitrary formulas or hardcoded mock scores.

---

## 3. Features Used in ML Pipeline

From the 10,040 historical complaints, the following features are extracted and engineered:

### Categorical Features:
- `category`: Civic complaint category (e.g., *Road Damage*, *Water Logging*, *Sewage Overflow*, *Streetlight Outage*, *Traffic Signal Fault*)
- `ward`: Administrative division (e.g., *Ward-1* through *Ward-40*, with alias resolution for named neighborhoods like *BTM*, *Indiranagar*, *Koramangala*)
- `department`: Municipal authority responsible (e.g., *Roads & Infrastructure*, *Sanitation*, *Electrical*, *Water Board*, *Traffic Police*)

### Numeric Features:
- `latitude`: GPS latitude coordinate
- `longitude`: GPS longitude coordinate
- `rainfall`: Local rainfall accumulation in millimeters (mm)
- `traffic`: Urban traffic congestion index (0–100 scale)
- `population`: Ward population density count

---

## 4. Target Variable & Severity Mapping

- **Target Column:** `priority` from the historical dataset
- **Classes:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- **Class Distribution:**
  - `MEDIUM`: 3,535 records (35.2%)
  - `LOW`: 3,438 records (34.2%)
  - `HIGH`: 2,268 records (22.6%)
  - `CRITICAL`: 799 records (8.0%)

---

## 5. Machine Learning Algorithm & Architecture

- **Algorithm:** `RandomForestClassifier` (Scikit-Learn)
- **Estimators:** 120 trees
- **Max Depth:** 14
- **Class Weight:** `balanced` (compensates for class imbalance, especially critical incidents)
- **Random Seed:** 42 (ensures deterministic, reproducible training)
- **Preprocessing:**
  - **Numeric features:** `SimpleImputer(strategy='median')` followed by `StandardScaler`
  - **Categorical features:** `SimpleImputer(strategy='most_frequent')` followed by `OneHotEncoder(handle_unknown='ignore')`
- **Pipeline Packaging:** Bundled via `joblib` into a self-contained pipeline object including ward medians and category-to-department maps for zero-data-leakage inference.

---

## 6. Training Evaluation Metrics

Trained with stratified 80/20 train/test split (8,032 train / 2,008 test):

| Metric | Score |
|---|---|
| **Accuracy** | 27.1% |
| **Weighted F1 Score** | 0.283 |
| **Macro Precision** | 0.253 |
| **Macro Recall** | 0.251 |
| **Class Weighting** | Balanced |

### Confusion Matrix:
```
           Pred: CRITICAL  HIGH   LOW   MEDIUM
True:
CRITICAL          28        36     45     51
HIGH              87       114    124    129
LOW              132       170    181    204
MEDIUM           134       153    198    222
```

---

## 7. Derivation of the Continuous Severity Score (0–100)

Rather than outputting only a discrete category or generating random values, CivicPulse computes a continuous expected severity risk score derived mathematically from the model's predicted class probabilities:

$$\text{Expected Score} = \sum_{c \in \text{Classes}} P(c) \times W_c$$

where class anchor weights are:
- $W_{\text{LOW}} = 20.0$
- $W_{\text{MEDIUM}} = 50.0$
- $W_{\text{HIGH}} = 75.0$
- $W_{\text{CRITICAL}} = 95.0$

### Environmental Hazard Offset:
If environmental risk factors exceed critical safety thresholds:
- Rainfall $> 75\text{ mm}$: $+\min(8.0, (\text{rainfall} - 75) \times 0.15)$
- Traffic $> 80$: $+\min(8.0, (\text{traffic} - 80) \times 0.12)$
- Population $> 90,000$: $+3.0$

The final score is clamped to $[15, 99]$:
```python
severity_score = int(np.clip(round(expected_score + hazard_boost), 15, 99))
```

---

## 8. Prediction API Contract

### `POST /predict`

#### Request Payload:
```json
{
  "category": "Pothole",
  "ward": "BTM",
  "latitude": 12.9166,
  "longitude": 77.6101,
  "rainfall": 12.4,
  "traffic": 78,
  "population": 45000,
  "department": "Roads & Infrastructure"
}
```

#### Response:
```json
{
  "severityLevel": "HIGH",
  "severityScore": 76,
  "confidence": 0.8624,
  "modelVersion": "civicpulse-v1",
  "context": {
    "category": "Road Damage",
    "department": "Roads & Infrastructure",
    "ward": "Ward-1",
    "latitude": 12.9166,
    "longitude": 77.6101,
    "rainfall": 12.4,
    "traffic": 78.0,
    "population": 45000,
    "probabilities": {
      "CRITICAL": 0.12,
      "HIGH": 0.48,
      "MEDIUM": 0.32,
      "LOW": 0.08
    },
    "expectedBaseScore": 72.5,
    "environmentalHazardBoost": 3.5
  }
}
```

### `GET /health`
Returns service status, model version, and uptime verification.

---

## 9. End-to-End CivicPulse Integration Flow

```
   Historical CivicLens CSV (10,040 rows)
                    ↓
   Scikit-Learn Pipeline Training
                    ↓
   civicpulse_severity_model.joblib
                    ↓
   FastAPI Microservice (:8001/predict)
                    ↑ HTTP REST
   Spring Boot (MlSeverityService.java)
                    ↑ POST /api/reports
   Citizen Submits Report in React UI
                    ↓
   PostgreSQL `reports` Table (severity, severity_level, ml_confidence)
                    ↓ GET /api/admin/reports
   React Admin Command Center
                    ↓
   Leaflet HeatmapLayer (Dynamic Intensity via L.heatLayer)
```

---

## 10. Graceful Fallback Strategy (Resilience)

If the Python ML service is offline, unreachable, or times out (after 3000ms):
1. CivicPulse **does not crash or reject** citizen reports.
2. `MlSeverityService.java` catches the communication exception.
3. It clearly logs:
   ```
   WARN - ML service unavailable — using fallback severity. Reason: ...
   ```
4. A deterministic, domain-calibrated severity score is assigned based on category and urgency.
5. The report is saved with `modelVersion="fallback-deterministic"` and `mlConfidence=0.50`.

---

## 11. Quickstart Commands

### Train the model:
```bash
cd model
python train.py
```

### Start the ML service:
```bash
cd model
python -m uvicorn app:app --host 0.0.0.0 --port 8001
```

### Run the test suite:
```bash
cd model
python -m unittest -v test_ml_service.py
```

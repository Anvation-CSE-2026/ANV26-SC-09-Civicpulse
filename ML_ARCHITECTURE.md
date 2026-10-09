# CivicPulse Machine Learning Pipeline Architecture

## 1. Executive Summary

CivicPulse replaces heuristic or hardcoded incident severity scoring with an empirical, reproducible **Machine Learning Prediction Pipeline** trained on 10,040 historical complaints from the **CivicLens-AI** civic repository.

---

## 2. Core Architecture: Historical Training vs. Real-Time Operations

```
+-----------------------------------------------------------+
|               HISTORICAL TRAINING DATA                   |
|  - CivicLens-AI complaints.csv (10,040 records)          |
|  - Historical complaints across Bengaluru Wards 1-40     |
|  - Categories, priorities, weather & traffic logs        |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|                 OFFLINE MODEL TRAINING                    |
|  - Scikit-Learn RandomForestClassifier (120 trees)       |
|  - Balanced class weighting & stratified splitting        |
|  - Preprocessing: OneHotEncoding + StandardScaler        |
|  - Persisted to model/civicpulse_severity_model.joblib    |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|                REAL-TIME INFERENCE SERVICE                |
|  - FastAPI microservice running locally on :8001/predict  |
|  - Continuous mathematical score derivation:              |
|      severityScore = sum( P(class) * W_class ) + Hazard   |
+-----------------------------------------------------------+
                             ^
                             | HTTP POST /predict
+-----------------------------------------------------------+
|                 LIVE CITIZEN INCIDENT                     |
|  - Citizen submits new report through CivicPulse React UI |
|  - Spring Boot backend receives POST /api/reports         |
|  - Extracts category, coordinates, ward, civic context    |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|              POSTGRESQL ENTERPRISE STORAGE                |
|  - Saved to `reports` table:                              |
|      severity (integer 15-99)                             |
|      severity_level ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')|
|      ml_confidence (0.0 - 1.0)                            |
|      ml_model_version ('civicpulse-v1')                   |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|                REACT ADMIN COMMAND CENTER                 |
|  - Real-time incident list & explainable breakdown        |
|  - Truthful ML metrics: model confidence, context impact  |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|                 LEAFLET HEATMAP DISPLAY                   |
|  - HeatmapLayer converts incident.severity to intensity   |
|  - Multiple nearby reports organically amplify heat       |
+-----------------------------------------------------------+
```

---

## 3. Critical Data Disclaimer

> **IMPORTANT:**  
> The CSV file (`model/data/complaints.csv`) is **HISTORICAL TRAINING DATA**, NOT real-time streaming data. It serves solely as the empirical training foundation for the offline classifier.  
> The **real-time component** consists of live, incoming citizen reports submitted through the CivicPulse application and processed instantaneously by the Spring Boot backend and FastAPI prediction service.

---

## 4. Key Components

| Component | Technology | Role |
|---|---|---|
| **ML Training** | Python, pandas, scikit-learn, joblib | Trains `RandomForestClassifier` with `ColumnTransformer` pipeline |
| **Prediction Service** | FastAPI, Uvicorn | Exposes `POST /predict` and `GET /health` on port 8001 |
| **Backend Orchestrator** | Spring Boot, RestTemplate | `MlSeverityService.java` delegates incoming citizen reports to ML |
| **Persistent Storage** | PostgreSQL | Stores reports with ML severity, level, confidence, and metadata |
| **Admin Command Center** | React, Tailwind, Lucide | Renders live incidents and Explainable Severity Breakdown |
| **Geospatial Map** | Leaflet, Leaflet.heat | Renders incident pins and continuous heatmap gradient |

---

## 5. Resilience & Fallback Handling

If the Python ML microservice is stopped or unreachable:
- Spring Boot intercepts the timeout (configured at 3000ms).
- A warning is logged:
  ```
  WARN: ML service unavailable — using fallback severity.
  ```
- A deterministic, conservative fallback score is assigned without interrupting the citizen's report submission or crashing the platform.

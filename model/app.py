"""
CivicPulse ML Prediction API Service
FastAPI application exposing real-time ML severity predictions for civic incidents.

Port: 8001
"""

from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from predict import predict_incident_severity, get_model_bundle

app = FastAPI(
    title="CivicPulse ML Incident Severity Service",
    description="Real-time civic incident severity prediction trained on CivicLens-AI historical complaints.",
    version="1.0.0"
)

# Enable CORS for local services
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IncidentPredictionRequest(BaseModel):
    category: Optional[str] = Field(None, example="Pothole", description="Incident category or issue type")
    ward: Optional[str] = Field(None, example="BTM", description="Ward or geographic area name")
    latitude: Optional[float] = Field(None, example=12.9166, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, example=77.6101, description="Longitude coordinate")
    rainfall: Optional[float] = Field(None, example=12.4, description="Local rainfall measurement in mm")
    traffic: Optional[float] = Field(None, example=78.0, description="Local traffic congestion index (0-150)")
    population: Optional[int] = Field(None, example=45000, description="Estimated population of the ward/area")
    department: Optional[str] = Field(None, example="Roads & Infrastructure", description="Target municipal department")
    description: Optional[str] = Field(None, example="Large pothole near BTM Main Road causing traffic danger", description="Citizen text description")


class IncidentPredictionResponse(BaseModel):
    severityLevel: str = Field(..., example="HIGH", description="Predicted severity level (LOW, MEDIUM, HIGH, CRITICAL)")
    severityScore: int = Field(..., example=78, description="Derived continuous severity score (15-99)")
    confidence: float = Field(..., example=0.87, description="Model prediction confidence (0.0 - 1.0)")
    modelVersion: str = Field(..., example="civicpulse-v1", description="Identifier of the deployed model version")
    context: Dict[str, Any] = Field(..., description="Explainable feature context and probability distribution")


@app.get("/health")
def health_check():
    try:
        bundle = get_model_bundle()
        return {
            "status": "UP",
            "service": "CivicPulse ML Service",
            "modelVersion": bundle.get("model_version", "civicpulse-v1"),
            "classes": bundle.get("classes", [])
        }
    except Exception as e:
        return {
            "status": "DEGRADED",
            "error": str(e)
        }


@app.get("/metrics")
def get_metrics():
    try:
        bundle = get_model_bundle()
        return bundle.get("metrics", {})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict", response_model=IncidentPredictionResponse)
def predict(request: IncidentPredictionRequest):
    try:
        result = predict_incident_severity(
            category=request.category,
            ward=request.ward,
            latitude=request.latitude,
            longitude=request.longitude,
            rainfall=request.rainfall,
            traffic=request.traffic,
            population=request.population,
            department=request.department,
            description=request.description
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=False)

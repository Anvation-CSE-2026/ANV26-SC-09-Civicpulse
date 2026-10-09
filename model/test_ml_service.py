"""
Comprehensive test suite for CivicPulse ML Severity Prediction Pipeline
Tests:
1. Model artifact loading and structure
2. Feature processing & imputation for missing features
3. Unknown category/ward handling
4. Probability-to-severityScore derivation (0-100 range)
5. FastAPI endpoints (/health, /predict)
6. Fallback robustness
"""

import os
import unittest
import requests
import joblib
import pandas as pd
import numpy as np

from predict import predict_severity, derive_severity_score

API_BASE_URL = os.environ.get("ML_API_URL", "http://localhost:8001")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "civicpulse_severity_model.joblib")


class TestCivicPulseMLModel(unittest.TestCase):

    def test_01_model_artifact_exists_and_loads(self):
        """Test that the trained joblib artifact exists and has all required components."""
        self.assertTrue(os.path.exists(MODEL_PATH), f"Model artifact not found at {MODEL_PATH}")
        bundle = joblib.load(MODEL_PATH)
        self.assertIn("pipeline", bundle)
        self.assertIn("classes", bundle)
        self.assertIn("context_defaults", bundle)
        self.assertIn("metrics", bundle)
        self.assertIn("by_ward", bundle["context_defaults"])
        self.assertIn("overall", bundle["context_defaults"])
        self.assertIn("category_department", bundle["context_defaults"])

    def test_02_predict_valid_request(self):
        """Test prediction with standard complete input."""
        sample_input = {
            "category": "Pothole",
            "ward": "BTM",
            "latitude": 12.9166,
            "longitude": 77.6101,
            "rainfall": 12.4,
            "traffic": 78,
            "population": 45000,
            "department": "Roads"
        }
        result = predict_severity(sample_input)
        
        self.assertIn("severityLevel", result)
        self.assertIn(result["severityLevel"], ["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        self.assertIn("severityScore", result)
        self.assertIsInstance(result["severityScore"], int)
        self.assertTrue(0 <= result["severityScore"] <= 100, f"Score {result['severityScore']} out of range 0-100")
        self.assertIn("confidence", result)
        self.assertTrue(0.0 <= result["confidence"] <= 1.0)
        self.assertEqual(result["modelVersion"], "civicpulse-v1")

    def test_03_missing_numeric_features_imputed(self):
        """Test prediction when rainfall, traffic, or population are omitted."""
        partial_input = {
            "category": "Waterlogging",
            "ward": "Indiranagar",
            "latitude": 12.9784,
            "longitude": 77.6408
            # rainfall, traffic, population omitted
        }
        result = predict_severity(partial_input)
        self.assertIn("severityLevel", result)
        self.assertIn("severityScore", result)
        self.assertTrue(0 <= result["severityScore"] <= 100)
        # Verify context features were enriched
        self.assertIn("rainfall", result["context"])
        self.assertIn("traffic", result["context"])
        self.assertIn("population", result["context"])

    def test_04_unknown_category_and_ward(self):
        """Test robustness against unseen categories or wards."""
        unseen_input = {
            "category": "Alien Invasion / Unknown Glitch",
            "ward": "Mars Sector 7",
            "latitude": 12.97,
            "longitude": 77.59
        }
        result = predict_severity(unseen_input)
        self.assertIn("severityLevel", result)
        self.assertIn("severityScore", result)
        self.assertTrue(0 <= result["severityScore"] <= 100)

    def test_05_score_derivation_deterministic_and_continuous(self):
        """Test severity score calculation math."""
        # Test extreme critical probability
        probs_critical = {
            "LOW": 0.0,
            "MEDIUM": 0.05,
            "HIGH": 0.15,
            "CRITICAL": 0.80
        }
        score_crit = derive_severity_score(probs_critical, rainfall=100.0, traffic=95)
        self.assertGreaterEqual(score_crit, 80)
        self.assertLessEqual(score_crit, 99)

        # Test mild low probability
        probs_low = {
            "LOW": 0.85,
            "MEDIUM": 0.10,
            "HIGH": 0.05,
            "CRITICAL": 0.0
        }
        score_low = derive_severity_score(probs_low, rainfall=0.0, traffic=10)
        self.assertLessEqual(score_low, 35)
        self.assertGreaterEqual(score_low, 15)

    def test_06_fastapi_health_endpoint(self):
        """Test FastAPI /health endpoint."""
        try:
            resp = requests.get(f"{API_BASE_URL}/health", timeout=3)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data.get("status"), "UP")
            self.assertEqual(data.get("modelVersion"), "civicpulse-v1")
        except requests.exceptions.ConnectionError:
            self.skipTest(f"FastAPI service not reachable on {API_BASE_URL}")

    def test_07_fastapi_predict_endpoint(self):
        """Test FastAPI POST /predict endpoint."""
        try:
            payload = {
                "category": "Pothole",
                "ward": "BTM",
                "latitude": 12.9166,
                "longitude": 77.6101,
                "rainfall": 12.4,
                "traffic": 78,
                "population": 45000,
                "department": "Roads"
            }
            resp = requests.post(f"{API_BASE_URL}/predict", json=payload, timeout=3)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertIn("severityLevel", data)
            self.assertIn("severityScore", data)
            self.assertIn("confidence", data)
            self.assertIn("modelVersion", data)
            self.assertIn("context", data)
        except requests.exceptions.ConnectionError:
            self.skipTest(f"FastAPI service not reachable on {API_BASE_URL}")


if __name__ == "__main__":
    unittest.main()

/**
 * API Service for CivicPulse
 * 
 * Configured with environment variable VITE_API_BASE_URL.
 * Integrates directly with local state / mock handlers, and can easily connect
 * to a Spring Boot backend in production.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiService = {
  /**
   * Fetch all incidents with optional filtering
   */
  async getIncidents(filters = {}) {
    // If backend is active:
    // const res = await fetch(`${API_BASE_URL}/incidents`);
    // return res.json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, url: API_BASE_URL });
      }, 100);
    });
  },

  /**
   * Fetch single incident details
   */
  async getIncidentById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 100);
    });
  },

  /**
   * Submit new report
   */
  async createReport(reportData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        });
      }, 300);
    });
  },

  /**
   * Simulated ML Image Analysis Endpoint
   */
  async analyzeImageEvidence(imageFileOrUrl) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return realistic simulated ML classification
        const detections = [
          { label: 'ROAD EXCAVATION', confidence: 94, visualSeverity: 'HIGH', weight: 28 },
          { label: 'WATERLOGGING', confidence: 96, visualSeverity: 'CRITICAL', weight: 30 },
          { label: 'POTHOLE SEVERE', confidence: 91, visualSeverity: 'HIGH', weight: 26 },
          { label: 'SEWAGE SPILL', confidence: 97, visualSeverity: 'CRITICAL', weight: 30 },
          { label: 'STRUCTURAL DAMAGE', confidence: 88, visualSeverity: 'MEDIUM', weight: 22 }
        ];

        const match = detections[Math.floor(Math.random() * detections.length)];

        resolve({
          success: true,
          detected: match.label,
          confidence: match.confidence,
          visualSeverity: match.visualSeverity,
          evidenceWeight: match.weight,
          analysisTimestamp: new Date().toLocaleTimeString()
        });
      }, 600);
    });
  }
};

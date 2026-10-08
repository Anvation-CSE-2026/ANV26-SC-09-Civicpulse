/**
 * API Service for CivicPulse
 * 
 * Configured with environment variable VITE_API_BASE_URL.
 * Connects directly to the Spring Boot REST backend with JWT authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export function getStoredToken() {
  return localStorage.getItem('civicpulse_token') || null;
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('civicpulse_token', token);
  } else {
    localStorage.removeItem('civicpulse_token');
  }
}

export function clearStoredAuth() {
  localStorage.removeItem('civicpulse_token');
  localStorage.removeItem('civicpulse_user');
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch (networkError) {
    throw new Error('Backend unavailable. Please ensure the server is running on ' + API_BASE_URL);
  }

  if (response.status === 401) {
    if (endpoint.includes('/auth/')) {
      let errorMsg = 'Invalid email or password.';
      try {
        const errorJson = await response.json();
        errorMsg = errorJson.message || errorJson.error || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }
    throw new Error('Unauthorized or session expired');
  }

  if (response.status === 403) {
    throw new Error('You do not have permission to access this resource.');
  }

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.message || errorJson.error || errorMsg;
    } catch (_) {
      try {
        const text = await response.text();
        if (text) errorMsg = text;
      } catch (__) {}
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const apiService = {
  // Authentication
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data?.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  async register(registrationData) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData)
    });
    if (data?.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  // Reports
  async createReport(reportData) {
    return request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },

  async getMyReports() {
    return request('/reports/my', {
      method: 'GET'
    });
  },

  async getReportById(id) {
    return request(`/reports/${id}`, {
      method: 'GET'
    });
  },

  // Admin
  async getAllReports() {
    return request('/admin/reports', {
      method: 'GET'
    });
  },

  async getIncidents(filters = {}) {
    try {
      return await request('/admin/incidents', { method: 'GET' });
    } catch (_) {
      return [];
    }
  },

  async getIncidentById(id) {
    return request(`/reports/${id}`, { method: 'GET' });
  },

  // Simulated ML Image Analysis Endpoint
  async analyzeImageEvidence(imageFileOrUrl) {
    return new Promise((resolve) => {
      setTimeout(() => {
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

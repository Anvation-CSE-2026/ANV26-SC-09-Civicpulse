/**
 * API Service for CivicPulse
 * 
 * Configured with environment variable VITE_API_BASE_URL.
 * Connects directly to the Spring Boot REST backend with JWT authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Multi-tab session isolation: read from tab's sessionStorage first, fallback to localStorage
export function getStoredToken() {
  return sessionStorage.getItem('civicpulse_token') || localStorage.getItem('civicpulse_token') || null;
}

export function setStoredToken(token) {
  if (token) {
    sessionStorage.setItem('civicpulse_token', token);
    localStorage.setItem('civicpulse_token', token);
  } else {
    sessionStorage.removeItem('civicpulse_token');
    localStorage.removeItem('civicpulse_token');
  }
}

export function clearStoredAuth() {
  sessionStorage.removeItem('civicpulse_token');
  sessionStorage.removeItem('civicpulse_user');
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
    console.error(`[API Network Error] ${options.method || 'GET'} ${url}:`, networkError);
    throw new Error('Backend unavailable. Please ensure the server is running on ' + API_BASE_URL);
  }

  if (response.status === 401) {
    if (endpoint.includes('/auth/')) {
      let errorMsg = 'Invalid email or password.';
      try {
        const errorJson = await response.json();
        errorMsg = errorJson.message || errorJson.error || errorMsg;
      } catch (_) {}
      console.error(`[API 401] ${endpoint}:`, errorMsg);
      throw new Error(errorMsg);
    }
    console.error(`[API 401] ${endpoint}: Session expired`);
    throw new Error('Your session has expired. Please log in again.');
  }

  if (response.status === 403) {
    let forbiddenMsg = 'You are not authorized to perform this action.';
    try {
      const errorJson = await response.json();
      forbiddenMsg = errorJson.message || errorJson.error || forbiddenMsg;
    } catch (_) {}
    console.error(`[API 403] ${endpoint}: Access Denied:`, forbiddenMsg);
    throw new Error(forbiddenMsg);
  }

  if (response.status === 500) {
    console.error(`[API 500] ${endpoint}: Internal Server Error`);
    throw new Error('Server error. Please try again.');
  }

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.message || errorJson.error || errorMsg;
      console.error(`[API ${response.status}] ${endpoint}:`, errorJson);
    } catch (_) {
      try {
        const text = await response.text();
        if (text) errorMsg = text;
        console.error(`[API ${response.status}] ${endpoint}:`, text);
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
  async getCitizens() {
    return request('/admin/citizens', {
      method: 'GET'
    });
  },

  async getAllReports() {
    return request('/admin/reports', {
      method: 'GET'
    });
  },

  async getReportDetails(id) {
    return request(`/admin/reports/${id}`, {
      method: 'GET'
    });
  },

  async updateReportStatus(id, updateData) {
    return request(`/admin/reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  },

  async assignReport(id, targetAdminId = null) {
    return request(`/admin/reports/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(targetAdminId != null ? { adminId: targetAdminId } : {})
    });
  },

  // Super Admin exceptional operations
  async deleteReport(id, reason = 'Super Admin removal') {
    return request(`/admin/reports/${id}?reason=${encodeURIComponent(reason)}`, {
      method: 'DELETE'
    });
  },

  async provisionAdmin(provisionData) {
    return request('/admin/users/provision', {
      method: 'POST',
      body: JSON.stringify(provisionData)
    });
  },

  async getUsers(role = null) {
    const query = role ? `?role=${role}` : '';
    return request(`/admin/users${query}`, {
      method: 'GET'
    });
  },

  async updateUserStatus(id, enabled) {
    return request(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled })
    });
  },

  async getAuditLogs() {
    return request('/admin/audit-logs', {
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

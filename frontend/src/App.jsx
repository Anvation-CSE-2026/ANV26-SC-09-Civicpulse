import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IncidentProvider } from './context/IncidentContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

import CitizenLayout from './components/Citizen/CitizenLayout';

import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminIncidentsPage from './pages/Admin/AdminIncidentsPage';
import AdminMapPage from './pages/Admin/AdminMapPage';
import AdminResourcesPage from './pages/Admin/AdminResourcesPage';
import AdminTeamsPage from './pages/Admin/AdminTeamsPage';
import AdminReportsPage from './pages/Admin/AdminReportsPage';
import AdminAnalyticsPage from './pages/Admin/AdminAnalyticsPage';
import AdminAiEnginePage from './pages/Admin/AdminAiEnginePage';
import AdminSettingsPage from './pages/Admin/AdminSettingsPage';
import AdminCitizensPage from './pages/Admin/AdminCitizensPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <IncidentProvider>
          <Routes>
            {/* Public Landing Page at Root '/' */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Citizen Protected Routes */}
            <Route
              path="/citizen/*"
              element={
                <ProtectedRoute role="CITIZEN">
                  <CitizenLayout />
                </ProtectedRoute>
              }
            />

            {/* Admin / Municipal Worker Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="MUNICIPAL_WORKER">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="incidents" element={<AdminIncidentsPage />} />
              <Route path="map" element={<AdminMapPage />} />
              <Route path="resources" element={<AdminResourcesPage />} />
              <Route path="teams" element={<AdminTeamsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="ai-engine" element={<AdminAiEnginePage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="citizens" element={<AdminCitizensPage />} />
              <Route path="alerts" element={<AdminDashboardPage />} />
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </IncidentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

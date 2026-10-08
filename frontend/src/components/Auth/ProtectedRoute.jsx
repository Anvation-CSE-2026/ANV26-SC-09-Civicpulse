import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, role: requiredRole }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    if (role === 'CITIZEN') {
      return <Navigate to="/citizen" replace />;
    }
    if (role === 'MUNICIPAL_WORKER') {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
}

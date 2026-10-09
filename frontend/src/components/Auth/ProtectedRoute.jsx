import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, role: requiredRole }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'MUNICIPAL_WORKER' || role === 'MUNICIPAL';
  const isCitizen = role === 'CITIZEN';

  if (requiredRole) {
    const requiresAdmin = requiredRole === 'ADMIN' || requiredRole === 'SUPER_ADMIN' || requiredRole === 'MUNICIPAL_WORKER' || requiredRole === 'MUNICIPAL';
    const requiresCitizen = requiredRole === 'CITIZEN';

    if (requiresAdmin && !isAdmin) {
      return <Navigate to="/citizen" replace />;
    }
    if (requiresCitizen && !isCitizen) {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
}

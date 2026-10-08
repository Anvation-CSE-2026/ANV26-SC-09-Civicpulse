import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, clearStoredAuth } from '../services/api';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = {
  CITIZEN: {
    id: "USR-002",
    name: "Citizen User",
    email: "jane.citizen@example.com",
    password: "CitizenPass123!",
    role: "CITIZEN",
    ward: "Koramangala 5th Block (Ward 151)",
    initials: "JC",
    level: "LEVEL 4 CIVIC GUARDIAN"
  },
  MUNICIPAL_WORKER: {
    id: "USR-001",
    name: "System Administrator",
    email: "admin@civicpulse.local",
    password: "AdminPass123!",
    role: "ADMIN",
    ward: "BBMP South Command Center",
    initials: "AD",
    level: "MUNICIPAL CONTROL OFFICER"
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('civicpulse_user');
      const savedToken = localStorage.getItem('civicpulse_token');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (savedToken && !parsed.token) {
          parsed.token = savedToken;
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const isAuthenticated = !!currentUser;
  const role = currentUser?.role || null;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('civicpulse_user', JSON.stringify(currentUser));
      if (currentUser.token) {
        localStorage.setItem('civicpulse_token', currentUser.token);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setCurrentUser(null);
      clearStoredAuth();
    };
    window.addEventListener('civicpulse:session-expired', handleSessionExpired);
    return () => window.removeEventListener('civicpulse:session-expired', handleSessionExpired);
  }, []);

  const login = async (email, password) => {
    try {
      const authResponse = await apiService.login(email.trim(), password);
      const isWorker = authResponse.role === 'ADMIN' || authResponse.role === 'MUNICIPAL' || authResponse.role === 'MUNICIPAL_WORKER';
      const user = {
        id: authResponse.userId,
        name: authResponse.name,
        email: authResponse.email,
        role: authResponse.role, // "CITIZEN", "ADMIN", etc.
        token: authResponse.token,
        tokenType: authResponse.tokenType || "Bearer",
        initials: (authResponse.name || 'CP').substring(0, 2).toUpperCase(),
        level: isWorker ? 'MUNICIPAL CONTROL OFFICER' : 'LEVEL 4 CIVIC GUARDIAN',
        ward: isWorker ? 'BBMP Command Center' : 'Bengaluru Urban Ward'
      };

      setCurrentUser(user);
      localStorage.setItem('civicpulse_token', authResponse.token);
      localStorage.setItem('civicpulse_user', JSON.stringify(user));
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid credentials' };
    }
  };

  const signup = async (formData) => {
    try {
      const requestedRole = formData.role === 'MUNICIPAL_WORKER' || formData.role === 'MUNICIPAL' ? 'ADMIN' : (formData.role || 'CITIZEN');
      const registerData = {
        name: (formData.fullName || formData.name || '').trim(),
        email: (formData.email || '').trim(),
        password: formData.password,
        role: requestedRole
      };
      const authResponse = await apiService.register(registerData);

      // Backend returns full AuthResponse with JWT
      if (authResponse?.token) {
        const userRole = authResponse.role || requestedRole;
        const isWorker = userRole === 'ADMIN' || userRole === 'MUNICIPAL' || userRole === 'MUNICIPAL_WORKER';
        const user = {
          id: authResponse.userId,
          name: authResponse.name || registerData.name,
          email: authResponse.email || registerData.email,
          role: userRole,
          token: authResponse.token,
          tokenType: authResponse.tokenType || "Bearer",
          initials: (authResponse.name || registerData.name || 'CP').substring(0, 2).toUpperCase(),
          level: isWorker ? 'MUNICIPAL CONTROL OFFICER' : 'LEVEL 4 CIVIC GUARDIAN',
          ward: isWorker ? 'BBMP Command Center' : 'Bengaluru Urban Ward'
        };

        setCurrentUser(user);
        localStorage.setItem('civicpulse_token', authResponse.token);
        localStorage.setItem('civicpulse_user', JSON.stringify(user));
        return { success: true, user, autoLogin: true };
      }

      return { success: true, data: authResponse, autoLogin: false };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearStoredAuth();
  };

  const quickDemoLogin = async (accountRole) => {
    if (accountRole === 'MUNICIPAL_WORKER' || accountRole === 'ADMIN' || accountRole === 'MUNICIPAL') {
      const res = await login('admin@civicpulse.local', 'AdminPass123!');
      if (res.success) return res.user;
      throw new Error(res.error || 'Admin login failed');
    } else {
      const res = await login('jane.citizen@example.com', 'CitizenPass123!');
      if (res.success) return res.user;
      throw new Error(res.error || 'Citizen login failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        role,
        login,
        signup,
        logout,
        quickDemoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

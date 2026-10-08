import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = {
  CITIZEN: {
    id: "USR-002",
    name: "Citizen User",
    email: "citizen@civicpulse.com",
    password: "citizen123",
    role: "CITIZEN",
    ward: "Koramangala 5th Block (Ward 151)",
    initials: "CU",
    level: "LEVEL 4 CIVIC GUARDIAN"
  },
  MUNICIPAL_WORKER: {
    id: "USR-001",
    name: "Admin User",
    email: "admin@civicpulse.gov",
    password: "admin123",
    role: "MUNICIPAL_WORKER",
    ward: "BBMP South Command Center",
    initials: "AD",
    level: "MUNICIPAL CONTROL OFFICER"
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('civicpulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const isAuthenticated = !!currentUser;
  const role = currentUser?.role || null;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('civicpulse_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('civicpulse_user');
    }
  }, [currentUser]);

  const login = (email, password, forcedRole) => {
    // Check if email matches demo accounts
    if (email === DEMO_ACCOUNTS.CITIZEN.email || forcedRole === 'CITIZEN') {
      const user = { ...DEMO_ACCOUNTS.CITIZEN, email: email || DEMO_ACCOUNTS.CITIZEN.email };
      setCurrentUser(user);
      return { success: true, user };
    }

    if (email === DEMO_ACCOUNTS.MUNICIPAL_WORKER.email || forcedRole === 'MUNICIPAL_WORKER') {
      const user = { ...DEMO_ACCOUNTS.MUNICIPAL_WORKER, email: email || DEMO_ACCOUNTS.MUNICIPAL_WORKER.email };
      setCurrentUser(user);
      return { success: true, user };
    }

    // Generic user login fallback
    const mockUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: forcedRole || (email.includes('admin') || email.includes('gov') ? 'MUNICIPAL_WORKER' : 'CITIZEN'),
      ward: 'Bengaluru Urban Ward',
      initials: email.substring(0, 2).toUpperCase(),
      level: forcedRole === 'MUNICIPAL_WORKER' ? 'MUNICIPAL CONTROL OFFICER' : 'REGISTERED CITIZEN'
    };

    setCurrentUser(mockUser);
    return { success: true, user: mockUser };
  };

  const signup = (formData) => {
    const newUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.fullName || 'Registered User',
      email: formData.email,
      phone: formData.phone || '+91 98765 43210',
      role: formData.role || 'CITIZEN',
      ward: formData.role === 'MUNICIPAL_WORKER' ? 'BBMP Control Office' : 'Bengaluru Urban',
      initials: (formData.fullName || 'RU').substring(0, 2).toUpperCase(),
      level: formData.role === 'MUNICIPAL_WORKER' ? 'MUNICIPAL OFFICER' : 'LEVEL 1 CITIZEN'
    };

    // Store created user in mock list or set current user
    localStorage.setItem('civicpulse_last_signup', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('civicpulse_user');
  };

  const quickDemoLogin = (accountRole) => {
    const user = DEMO_ACCOUNTS[accountRole] || DEMO_ACCOUNTS.CITIZEN;
    setCurrentUser(user);
    return user;
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

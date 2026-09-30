import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { MOCK_USER, MOCK_ADMIN } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Try loading saved user session from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('wastesphere_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default demo mode starts with MOCK_USER logged in as citizen for instant testing
    return MOCK_USER;
  });

  const [token, setToken] = useState(() => localStorage.getItem('wastesphere_token') || 'mock_jwt_token_123');

  useEffect(() => {
    if (user) {
      localStorage.setItem('wastesphere_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wastesphere_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('wastesphere_token', token);
    } else {
      localStorage.removeItem('wastesphere_token');
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token);
      return res;
    }
    throw new Error('Authentication failed');
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token);
      return res;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wastesphere_user');
    localStorage.removeItem('wastesphere_token');
  };

  const switchDemoRole = (role) => {
    if (role === 'admin') {
      setUser(MOCK_ADMIN);
    } else {
      setUser(MOCK_USER);
    }
  };

  const isCitizen = user?.role === 'citizen';
  const isAdmin = user?.role === 'admin';
  const isApprovedAdmin = isAdmin && user?.verificationStatus === 'approved';
  const isPendingAdmin = isAdmin && user?.verificationStatus === 'pending';

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        register,
        logout,
        switchDemoRole,
        isCitizen,
        isAdmin,
        isApprovedAdmin,
        isPendingAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

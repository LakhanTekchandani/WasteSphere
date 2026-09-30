import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('wastesphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate and restore user session on startup
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('wastesphere_token');
      if (storedToken) {
        try {
          const authenticatedUser = await api.getMe(storedToken);
          setUser(authenticatedUser);
          setToken(storedToken);
          localStorage.setItem('wastesphere_user', JSON.stringify(authenticatedUser));
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    // credentials: { email, password }
    const res = await api.login(credentials);
    if (res && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('wastesphere_token', res.token);
      localStorage.setItem('wastesphere_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res?.message || 'Authentication failed');
  };

  const registerCitizen = async (citizenData) => {
    const res = await api.register(citizenData);
    if (res && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('wastesphere_token', res.token);
      localStorage.setItem('wastesphere_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const registerAdmin = async (formData) => {
    const res = await api.registerAdmin(formData);
    if (res && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('wastesphere_token', res.token);
      localStorage.setItem('wastesphere_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res?.message || 'Admin registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wastesphere_user');
    localStorage.removeItem('wastesphere_token');
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
        loading,
        login,
        registerCitizen,
        registerAdmin,
        logout,
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('kumbh_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('kumbh_admin_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setAdminUser(res.data.user);
        localStorage.setItem('kumbh_admin_token', res.data.token);
        localStorage.setItem('kumbh_admin_user', JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      // Fallback for offline preview login
      if (email.toLowerCase() === 'admin@kumbhmela.gov.in' && (password === 'Admin@123456' || password === 'admin123')) {
        const mockUser = { id: 'admin-1', name: 'Kumbh Administrator', email: 'admin@kumbhmela.gov.in', role: 'SuperAdmin' };
        const mockToken = 'mock-jwt-token-kumbh-2026';
        setToken(mockToken);
        setAdminUser(mockUser);
        localStorage.setItem('kumbh_admin_token', mockToken);
        localStorage.setItem('kumbh_admin_user', JSON.stringify(mockUser));
        return { success: true };
      }
      return { 
        success: false, 
        message: err.response?.data?.message || 'Server connection failed. Try demo credentials: admin@kumbhmela.gov.in / Admin@123456' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('kumbh_admin_token');
    localStorage.removeItem('kumbh_admin_user');
  };

  return (
    <AuthContext.Provider value={{ adminUser, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

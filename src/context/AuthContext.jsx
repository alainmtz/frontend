import React, { createContext, useState, useEffect } from 'react';
import { refreshToken as fetchRefreshToken } from '../utils/token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token) {
      setUser({ token, refreshToken });
    }
    setLoading(false);
  }, []);

  const login = (token, refreshToken) => {
    localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    setUser({ token, refreshToken });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Refrescar token automáticamente si expira
  const autoRefreshToken = async () => {
    if (!user?.refreshToken) return;
    try {
      const newToken = await fetchRefreshToken(user.refreshToken);
      localStorage.setItem('token', newToken);
      setUser(prev => ({ ...prev, token: newToken }));
    } catch (err) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, autoRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

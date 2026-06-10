import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('ck_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ck_user');
    if (saved && token) {
      try { setUser(JSON.parse(saved)); } catch (_) {}
      
      // Fetch latest user data to get warnings
      api.get('/users/me')
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('ck_user', JSON.stringify(res.data.user));
        })
        .catch(() => {});
    }
    setLoading(false);
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('ck_token', jwtToken);
    localStorage.setItem('ck_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ck_token');
    localStorage.removeItem('ck_user');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('ck_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

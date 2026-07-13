import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('transitops_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('transitops_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('transitops_user', JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem('transitops_token');
        localStorage.removeItem('transitops_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem('transitops_token', res.data.token);
    localStorage.setItem('transitops_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}`);
    return res.data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authService.register(payload);
    localStorage.setItem('transitops_token', res.data.token);
    localStorage.setItem('transitops_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success('Account created successfully');
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_user');
    setUser(null);
    toast('Signed out', { icon: '👋' });
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem('transitops_user', JSON.stringify(updated));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

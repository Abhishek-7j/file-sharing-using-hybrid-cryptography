import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('identity_dna_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.warn("Failed to fetch user, clearing token");
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    const res = await api.login(usernameOrEmail, password);
    localStorage.setItem('identity_dna_token', res.access_token);
    setToken(res.access_token);
    setUser({ user_id: res.user_id, username: res.username });
    return res;
  };

  const register = async (name, email, username, password) => {
    const res = await api.register(name, email, username, password);
    localStorage.setItem('identity_dna_token', res.access_token);
    setToken(res.access_token);
    setUser({ user_id: res.user_id, username: res.username });
    return res;
  };

  const logout = () => {
    localStorage.removeItem('identity_dna_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

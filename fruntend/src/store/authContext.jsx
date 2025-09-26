import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/apiService.js';

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          api.setToken(token);
          const userData = await api.profile();
          console.log('Fetched User Data:', userData); // Debugging
          setUser(userData._doc || userData); // Adjust based on response structure
        } catch (error) {
          console.error('Error fetching user profile:', error); // Debugging
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      console.log('Login Response:', res); // Debugging
      if (!res?.token) throw new Error('Invalid login response: Token not found.');

      // set and persist token
      api.setToken(res.token);
      localStorage.setItem('token', res.token);
      setToken(res.token);

      // fetch profile to get role and user details (works for both user and admin logins)
      const userData = await api.profile();
      setUser(userData._doc || userData);
      return { success: true, data: { token: res.token, user: userData } };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const isAdmin = () => {
    console.log('Checking isAdmin:', user); // Debugging
    return user?.role === 'admin' || user?._doc?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    token,
    user,
    loading,
    setUser,
    setToken,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);



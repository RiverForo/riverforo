// AuthContext.js - Context for authentication in RiverForo.com

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError(err.response?.data?.error || 'Authentication failed');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  // Social login
  const socialLogin = async (provider, userData) => {
    try {
      const res = await axios.post(`/api/auth/social/${provider}`, userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Social login failed');
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put(`/api/users/${user._id}`, formData);
      
      if (res.data.success) {
        setUser(res.data.data);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Profile update failed');
      return false;
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.put('/api/auth/updatepassword', {
        currentPassword,
        newPassword
      });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Password update failed');
      return false;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/api/auth/forgotpassword', { email });
      
      if (res.data.success) {
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset request failed');
      return false;
    }
  };

  // Reset password
  const resetPassword = async (resetToken, password) => {
    try {
      const res = await axios.put(`/api/auth/resetpassword/${resetToken}`, {
        password
      });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed');
      return false;
    }
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        socialLogin,
        logout,
        updateProfile,
        updatePassword,
        forgotPassword,
        resetPassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

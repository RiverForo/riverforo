import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is logged in on initial render
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // For now, just set a basic user object
          // In a real implementation, you would verify the token with your backend
          setUser({
            username: localStorage.getItem('username') || 'User',
            role: localStorage.getItem('role') || 'user'
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate');
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // In a real implementation, you would make an API call to your backend
      // For now, just simulate a successful login
      const mockUser = {
        username: credentials.username,
        role: 'user'
      };
      
      // Store user info in localStorage
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('role', 'user');
      
      setUser(mockUser);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError('Login failed');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };
  
  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // In a real implementation, you would make an API call to your backend
      // For now, just simulate a successful registration
      const mockUser = {
        username: userData.username,
        role: 'user'
      };
      
      // Store user info in localStorage
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('username', userData.username);
      localStorage.setItem('role', 'user');
      
      setUser(mockUser);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError('Registration failed');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

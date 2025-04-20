// ThemeContext.js - Context for theme management in RiverForo.com

import React, { createContext, useState, useEffect } from 'react';

// Create the theme context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default to light theme
  const [theme, setTheme] = useState('light');
  
  // Load saved theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme === 'dark' ? 'dark-theme' : 'light-theme';
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setTheme('dark');
        document.body.className = 'dark-theme';
      }
    }
  }, []);
  
  // Update theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

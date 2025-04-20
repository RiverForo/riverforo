import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the language context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Default language is Spanish (es)
  const [language, setLanguage] = useState('es');
  
  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // Function to change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  // Translations for UI elements
  const translations = {
    es: {
      home: 'Inicio',
      categories: 'Categorías',
      threads: 'Temas',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      profile: 'Perfil',
      logout: 'Cerrar Sesión',
      welcome: 'Bienvenido a RiverForo',
      recentThreads: 'Temas Recientes',
      search: 'Buscar',
      createThread: 'Crear Tema',
      reply: 'Responder',
      footer: 'RiverForo - La comunidad de hinchas de River Plate'
    },
    en: {
      home: 'Home',
      categories: 'Categories',
      threads: 'Threads',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      logout: 'Logout',
      welcome: 'Welcome to RiverForo',
      recentThreads: 'Recent Threads',
      search: 'Search',
      createThread: 'Create Thread',
      reply: 'Reply',
      footer: 'RiverForo - River Plate fans community'
    }
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// LanguageContext.js - Context for multilingual support in RiverForo.com

import React, { createContext, useState, useEffect } from 'react';

// Spanish translations
const es = {
  // Navigation
  home: 'Inicio',
  forums: 'Foros',
  login: 'Iniciar Sesión',
  register: 'Registrarse',
  logout: 'Cerrar Sesión',
  profile: 'Perfil',
  admin: 'Administración',
  
  // Forum sections
  latestThreads: 'Últimos Temas',
  categories: 'Categorías',
  threads: 'Temas',
  posts: 'Mensajes',
  createThread: 'Crear Tema',
  reply: 'Responder',
  
  // User related
  username: 'Nombre de Usuario',
  email: 'Correo Electrónico',
  password: 'Contraseña',
  confirmPassword: 'Confirmar Contraseña',
  forgotPassword: 'Olvidé mi Contraseña',
  resetPassword: 'Restablecer Contraseña',
  joinDate: 'Fecha de Registro',
  lastActive: 'Última Actividad',
  bio: 'Biografía',
  location: 'Ubicación',
  
  // Thread and post actions
  edit: 'Editar',
  delete: 'Eliminar',
  like: 'Me Gusta',
  unlike: 'Quitar Me Gusta',
  report: 'Reportar',
  sticky: 'Fijar',
  unsticky: 'Desfijar',
  lock: 'Bloquear',
  unlock: 'Desbloquear',
  
  // Notifications
  notifications: 'Notificaciones',
  markAllAsRead: 'Marcar Todo como Leído',
  noNotifications: 'No tienes notificaciones',
  
  // Admin
  dashboard: 'Panel de Control',
  users: 'Usuarios',
  reports: 'Reportes',
  settings: 'Configuración',
  
  // Misc
  search: 'Buscar',
  loading: 'Cargando...',
  error: 'Error',
  success: 'Éxito',
  save: 'Guardar',
  cancel: 'Cancelar',
  submit: 'Enviar',
  language: 'Idioma',
  theme: 'Tema',
  
  // River Plate specific
  riverPlate: 'River Plate',
  matches: 'Partidos',
  players: 'Jugadores',
  news: 'Noticias',
  history: 'Historia',
  stadium: 'Estadio',
  
  // Footer
  about: 'Acerca de',
  contact: 'Contacto',
  terms: 'Términos de Uso',
  privacy: 'Política de Privacidad',
  copyright: '© 2025 RiverForo.com - Todos los derechos reservados'
};

// English translations
const en = {
  // Navigation
  home: 'Home',
  forums: 'Forums',
  login: 'Login',
  register: 'Register',
  logout: 'Logout',
  profile: 'Profile',
  admin: 'Admin',
  
  // Forum sections
  latestThreads: 'Latest Threads',
  categories: 'Categories',
  threads: 'Threads',
  posts: 'Posts',
  createThread: 'Create Thread',
  reply: 'Reply',
  
  // User related
  username: 'Username',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  forgotPassword: 'Forgot Password',
  resetPassword: 'Reset Password',
  joinDate: 'Join Date',
  lastActive: 'Last Active',
  bio: 'Bio',
  location: 'Location',
  
  // Thread and post actions
  edit: 'Edit',
  delete: 'Delete',
  like: 'Like',
  unlike: 'Unlike',
  report: 'Report',
  sticky: 'Sticky',
  unsticky: 'Unsticky',
  lock: 'Lock',
  unlock: 'Unlock',
  
  // Notifications
  notifications: 'Notifications',
  markAllAsRead: 'Mark All as Read',
  noNotifications: 'You have no notifications',
  
  // Admin
  dashboard: 'Dashboard',
  users: 'Users',
  reports: 'Reports',
  settings: 'Settings',
  
  // Misc
  search: 'Search',
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
  save: 'Save',
  cancel: 'Cancel',
  submit: 'Submit',
  language: 'Language',
  theme: 'Theme',
  
  // River Plate specific
  riverPlate: 'River Plate',
  matches: 'Matches',
  players: 'Players',
  news: 'News',
  history: 'History',
  stadium: 'Stadium',
  
  // Footer
  about: 'About',
  contact: 'Contact',
  terms: 'Terms of Use',
  privacy: 'Privacy Policy',
  copyright: '© 2025 RiverForo.com - All rights reserved'
};

// Create the language context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Spanish as primary language
  const [language, setLanguage] = useState('es');
  const [translations, setTranslations] = useState(es);
  
  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setTranslations(savedLanguage === 'es' ? es : en);
    }
  }, []);
  
  // Update translations when language changes
  const changeLanguage = (lang) => {
    setLanguage(lang);
    setTranslations(lang === 'es' ? es : en);
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = lang;
  };
  
  return (
    <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

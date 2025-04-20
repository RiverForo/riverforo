import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import './Header.css';

const Header = () => {
  const { language, changeLanguage, translations } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();
  
  const t = translations[language];
  
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>RiverForo</h1>
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">{t.home}</Link>
            </li>
            <li>
              <Link to="/categories">{t.categories}</Link>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <div className="language-selector">
            <button 
              className={language === 'es' ? 'active' : ''} 
              onClick={() => changeLanguage('es')}
            >
              ES
            </button>
            <button 
              className={language === 'en' ? 'active' : ''} 
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
          </div>
          
          {user ? (
            <div className="user-menu">
              <Link to="/notifications" className="notifications-icon">
                📬 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </Link>
              <Link to="/profile" className="profile-link">
                {user.username}
              </Link>
              <button onClick={logout} className="logout-button">
                {t.logout}
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                {t.login}
              </Link>
              <Link to="/register" className="register-button">
                {t.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

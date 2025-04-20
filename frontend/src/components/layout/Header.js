// Header.js - Main navigation header for RiverForo.com

import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import LanguageSelector from '../common/LanguageSelector';
import ThemeToggle from '../common/ThemeToggle';
import SearchBar from '../common/SearchBar';
import './Header.scss';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { translations } = useContext(LanguageContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { unreadCount } = useContext(NotificationContext);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const history = useHistory();
  
  const handleLogout = () => {
    logout();
    history.push('/');
    setUserMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setUserMenuOpen(false);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationsOpen(false);
  };
  
  return (
    <header className={`site-header ${theme}-theme`}>
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <img src="/images/river-plate-logo.png" alt="River Plate Logo" />
            <span className="site-name">RiverForo</span>
          </Link>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
        
        <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                {translations.home}
              </Link>
            </li>
            <li>
              <Link to="/category/general" onClick={() => setMobileMenuOpen(false)}>
                {translations.forums}
              </Link>
            </li>
            <li>
              <Link to="/matches" onClick={() => setMobileMenuOpen(false)}>
                {translations.matches}
              </Link>
            </li>
            <li>
              <Link to="/news" onClick={() => setMobileMenuOpen(false)}>
                {translations.news}
              </Link>
            </li>
          </ul>
          
          <div className="header-actions">
            <SearchBar />
            
            <LanguageSelector />
            
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            
            {isAuthenticated ? (
              <>
                <div className="notification-container">
                  <button 
                    className="notification-button" 
                    onClick={toggleNotifications}
                    aria-label={translations.notifications}
                  >
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </button>
                  
                  {notificationsOpen && <NotificationDropdown />}
                </div>
                
                <div className="user-menu-container">
                  <button 
                    className="user-menu-button" 
                    onClick={toggleUserMenu}
                    aria-label="User menu"
                  >
                    <img 
                      src={user.avatar || '/images/default-avatar.png'} 
                      alt={user.username} 
                      className="user-avatar"
                    />
                    <span className="username">{user.username}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <Link 
                        to={`/user/${user.username}`} 
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {translations.profile}
                      </Link>
                      
                      <Link 
                        to="/edit-profile" 
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {translations.settings}
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {translations.admin}
                        </Link>
                      )}
                      
                      <button onClick={handleLogout}>
                        {translations.logout}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="login-button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {translations.login}
                </Link>
                
                <Link 
                  to="/register" 
                  className="register-button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {translations.register}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

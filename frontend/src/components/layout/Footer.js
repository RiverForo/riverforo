// Footer.js - Footer component for RiverForo.com

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import './Footer.scss';

const Footer = () => {
  const { translations, language, changeLanguage } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  
  return (
    <footer className={`site-footer ${theme}-theme`}>
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <img src="/images/river-plate-logo.png" alt="River Plate Logo" />
            <span className="site-name">RiverForo</span>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>{translations.forums}</h3>
              <ul>
                <li><Link to="/category/general">{translations.general}</Link></li>
                <li><Link to="/category/matches">{translations.matches}</Link></li>
                <li><Link to="/category/players">{translations.players}</Link></li>
                <li><Link to="/category/history">{translations.history}</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>{translations.riverPlate}</h3>
              <ul>
                <li><Link to="/news">{translations.news}</Link></li>
                <li><Link to="/matches">{translations.matches}</Link></li>
                <li><Link to="/stadium">{translations.stadium}</Link></li>
                <li><Link to="/history">{translations.history}</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>{translations.about}</h3>
              <ul>
                <li><Link to="/about">{translations.about}</Link></li>
                <li><Link to="/contact">{translations.contact}</Link></li>
                <li><Link to="/terms">{translations.terms}</Link></li>
                <li><Link to="/privacy">{translations.privacy}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="language-selector">
            <span>{translations.language}:</span>
            <button 
              className={language === 'es' ? 'active' : ''} 
              onClick={() => changeLanguage('es')}
            >
              Español
            </button>
            <button 
              className={language === 'en' ? 'active' : ''} 
              onClick={() => changeLanguage('en')}
            >
              English
            </button>
          </div>
          
          <div className="social-links">
            <a href="https://facebook.com/riverplate" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com/riverplate" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com/riverplate" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com/riverplate" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
          
          <div className="copyright">
            <p>{translations.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo">
          <h2>RiverForo</h2>
          <p>{t.footer}</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h3>Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>River Plate</h3>
            <ul>
              <li><a href="https://www.cariverplate.com.ar/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
              <li><a href="https://twitter.com/RiverPlate" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://www.instagram.com/riverplate/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.facebook.com/riverplateoficial/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} RiverForo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Login.js - Login page component for RiverForo.com

import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdSenseComponent from '../ads/AdSenseComponent';
import SocialLogin from '../auth/SocialLogin';
import './Login.scss';

const Login = () => {
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
  const { translations, language } = useContext(LanguageContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const history = useHistory();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
    
    // Clear any previous auth errors
    clearError();
  }, [isAuthenticated, history, clearError]);
  
  // Set form error if auth error occurs
  useEffect(() => {
    if (error) {
      setFormError(error);
      setLoading(false);
    }
  }, [error]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password) {
      setFormError(language === 'es' 
        ? 'Por favor ingrese su correo electrónico y contraseña' 
        : 'Please enter your email and password');
      return;
    }
    
    setLoading(true);
    setFormError('');
    
    // Attempt login
    const success = await login(email, password);
    
    if (!success) {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="/images/river-plate-logo.png" alt="River Plate Logo" className="logo" />
          <h1>{translations.login}</h1>
        </div>
        
        {formError && (
          <div className="error-message">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">{translations.email}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'es' ? 'Ingrese su correo electrónico' : 'Enter your email'}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{translations.password}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'es' ? 'Ingrese su contraseña' : 'Enter your password'}
              disabled={loading}
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={loading}
              />
              <label htmlFor="remember-me">
                {language === 'es' ? 'Recordarme' : 'Remember me'}
              </label>
            </div>
            
            <Link to="/forgot-password" className="forgot-password">
              {translations.forgotPassword}
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading 
              ? (language === 'es' ? 'Iniciando sesión...' : 'Logging in...') 
              : translations.login}
          </button>
        </form>
        
        <div className="social-login-section">
          <div className="divider">
            <span>{language === 'es' ? 'o continuar con' : 'or continue with'}</span>
          </div>
          
          <SocialLogin />
        </div>
        
        <div className="register-link">
          <p>
            {language === 'es' 
              ? '¿No tienes una cuenta?' 
              : "Don't have an account?"}{' '}
            <Link to="/register">
              {language === 'es' ? 'Regístrate' : 'Register'}
            </Link>
          </p>
        </div>
      </div>
      
      <div className="login-sidebar">
        <AdSenseComponent adSlot="1234567890" format="rectangle" />
      </div>
    </div>
  );
};

export default Login;

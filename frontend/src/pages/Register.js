// Register.js - Registration page component for RiverForo.com

import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdSenseComponent from '../ads/AdSenseComponent';
import SocialLogin from '../auth/SocialLogin';
import './Register.scss';

const Register = () => {
  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const { translations, language } = useContext(LanguageContext);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState(language);
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    if (!username || !email || !password || !confirmPassword) {
      setFormError(language === 'es' 
        ? 'Por favor complete todos los campos' 
        : 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError(language === 'es' 
        ? 'Las contraseñas no coinciden' 
        : 'Passwords do not match');
      return;
    }
    
    if (!acceptTerms) {
      setFormError(language === 'es' 
        ? 'Debe aceptar los términos y condiciones' 
        : 'You must accept the terms and conditions');
      return;
    }
    
    setLoading(true);
    setFormError('');
    
    // Attempt registration
    const success = await register({
      username,
      email,
      password,
      preferredLanguage
    });
    
    if (!success) {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <img src="/images/river-plate-logo.png" alt="River Plate Logo" className="logo" />
          <h1>{translations.register}</h1>
        </div>
        
        {formError && (
          <div className="error-message">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">{translations.username}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={language === 'es' ? 'Elija un nombre de usuario' : 'Choose a username'}
              disabled={loading}
            />
          </div>
          
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
              placeholder={language === 'es' ? 'Cree una contraseña' : 'Create a password'}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm-password">{translations.confirmPassword}</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={language === 'es' ? 'Confirme su contraseña' : 'Confirm your password'}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="preferred-language">{translations.language}</label>
            <select
              id="preferred-language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              disabled={loading}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div className="form-options">
            <div className="accept-terms">
              <input
                type="checkbox"
                id="accept-terms"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                disabled={loading}
              />
              <label htmlFor="accept-terms">
                {language === 'es' 
                  ? 'Acepto los términos y condiciones' 
                  : 'I accept the terms and conditions'}
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading 
              ? (language === 'es' ? 'Registrando...' : 'Registering...') 
              : translations.register}
          </button>
        </form>
        
        <div className="social-login-section">
          <div className="divider">
            <span>{language === 'es' ? 'o registrarse con' : 'or register with'}</span>
          </div>
          
          <SocialLogin />
        </div>
        
        <div className="login-link">
          <p>
            {language === 'es' 
              ? '¿Ya tienes una cuenta?' 
              : 'Already have an account?'}{' '}
            <Link to="/login">
              {translations.login}
            </Link>
          </p>
        </div>
      </div>
      
      <div className="register-sidebar">
        <AdSenseComponent adSlot="1234567890" format="rectangle" />
      </div>
    </div>
  );
};

export default Register;

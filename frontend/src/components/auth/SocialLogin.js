// SocialLogin.js - Social login component for RiverForo.com

import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import './SocialLogin.scss';

const SocialLogin = () => {
  const { socialLogin } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    // In a real implementation, this would use the Google OAuth API
    // For now, we'll simulate the process
    const googleUser = {
      id: 'google-123456',
      email: 'user@gmail.com',
      name: 'Google User',
      picture: 'https://example.com/avatar.jpg'
    };
    
    await socialLogin('google', googleUser);
  };
  
  // Handle Facebook login
  const handleFacebookLogin = async () => {
    // In a real implementation, this would use the Facebook SDK
    // For now, we'll simulate the process
    const facebookUser = {
      id: 'facebook-123456',
      email: 'user@example.com',
      name: 'Facebook User',
      picture: 'https://example.com/avatar.jpg'
    };
    
    await socialLogin('facebook', facebookUser);
  };
  
  return (
    <div className="social-login">
      <button 
        className="google-login-button"
        onClick={handleGoogleLogin}
        aria-label={language === 'es' ? 'Iniciar sesión con Google' : 'Login with Google'}
      >
        <i className="fab fa-google"></i>
        <span>Google</span>
      </button>
      
      <button 
        className="facebook-login-button"
        onClick={handleFacebookLogin}
        aria-label={language === 'es' ? 'Iniciar sesión con Facebook' : 'Login with Facebook'}
      >
        <i className="fab fa-facebook-f"></i>
        <span>Facebook</span>
      </button>
    </div>
  );
};

export default SocialLogin;

// Home.js - Home page component for RiverForo.com

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../../contexts/LanguageContext';
import { AuthContext } from '../../contexts/AuthContext';
import CategoryList from '../categories/CategoryList';
import ThreadPreview from '../threads/ThreadPreview';
import AdSenseComponent from '../ads/AdSenseComponent';
import UpcomingMatches from '../widgets/UpcomingMatches';
import OnlineUsers from '../widgets/OnlineUsers';
import './Home.scss';

const Home = () => {
  const { translations, language } = useContext(LanguageContext);
  const { isAuthenticated } = useContext(AuthContext);
  
  const [categories, setCategories] = useState([]);
  const [latestThreads, setLatestThreads] = useState([]);
  const [popularThreads, setPopularThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesRes = await axios.get('/api/categories');
        setCategories(categoriesRes.data.data);
        
        // Fetch latest threads
        const latestThreadsRes = await axios.get('/api/threads?limit=5&sort=-createdAt');
        setLatestThreads(latestThreadsRes.data.data);
        
        // Fetch popular threads
        const popularThreadsRes = await axios.get('/api/threads?limit=5&sort=-views');
        setPopularThreads(popularThreadsRes.data.data);
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{translations.loading}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>{translations.error}</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="home-page">
      <div className="welcome-banner">
        <div className="banner-content">
          <h1>RiverForo.com</h1>
          <p className="banner-subtitle">
            {language === 'es' 
              ? 'La comunidad oficial de hinchas de River Plate' 
              : 'The official River Plate fans community'}
          </p>
          
          {!isAuthenticated && (
            <div className="banner-actions">
              <Link to="/register" className="register-button">
                {translations.register}
              </Link>
              <Link to="/login" className="login-button">
                {translations.login}
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="home-content">
        <div className="main-content">
          <section className="categories-section">
            <h2>{translations.categories}</h2>
            <CategoryList categories={categories} />
          </section>
          
          <AdSenseComponent adSlot="1234567890" format="horizontal" />
          
          <section className="latest-threads-section">
            <h2>{translations.latestThreads}</h2>
            <div className="thread-list">
              {latestThreads.map(thread => (
                <ThreadPreview key={thread._id} thread={thread} />
              ))}
            </div>
            <Link to="/threads" className="view-all-link">
              {language === 'es' ? 'Ver todos los temas' : 'View all threads'}
            </Link>
          </section>
        </div>
        
        <div className="sidebar">
          <AdSenseComponent adSlot="0987654321" format="rectangle" style={{ marginBottom: '20px' }} />
          
          <section className="popular-threads-section">
            <h3>{language === 'es' ? 'Temas Populares' : 'Popular Threads'}</h3>
            <div className="popular-thread-list">
              {popularThreads.map(thread => (
                <div key={thread._id} className="popular-thread-item">
                  <Link to={`/thread/${thread.slug}`}>
                    {thread.title}
                  </Link>
                  <div className="thread-stats">
                    <span>{thread.views} {language === 'es' ? 'vistas' : 'views'}</span>
                    <span>{thread.replies} {language === 'es' ? 'respuestas' : 'replies'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <UpcomingMatches />
          
          <OnlineUsers />
        </div>
      </div>
    </div>
  );
};

export default Home;

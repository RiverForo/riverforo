// CategoryView.js - Category view page component for RiverForo.com

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import ThreadListItem from '../threads/ThreadListItem';
import AdSenseComponent from '../ads/AdSenseComponent';
import './CategoryView.scss';

const CategoryView = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const { translations, language } = useContext(LanguageContext);
  
  const [category, setCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('-createdAt'); // Default sort by newest
  
  const history = useHistory();
  
  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        
        // Get category by slug
        const categoryRes = await axios.get(`/api/categories/slug/${slug}`);
        setCategory(categoryRes.data.data);
        
        // Get threads for category
        const threadsRes = await axios.get(
          `/api/categories/${categoryRes.data.data._id}/threads?page=${page}&limit=20&sort=${sortBy}`
        );
        setThreads(threadsRes.data.data);
        
        // Set total pages
        if (threadsRes.data.pagination) {
          setTotalPages(Math.ceil(threadsRes.data.count / 20));
        }
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [slug, page, sortBy]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // Reset to first page when changing sort
  };
  
  // Handle new thread creation
  const handleNewThread = () => {
    if (isAuthenticated) {
      history.push(`/new-thread/${category._id}`);
    } else {
      history.push('/login');
    }
  };
  
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
  
  if (!category) {
    return (
      <div className="not-found-container">
        <h2>{language === 'es' ? 'Categoría no encontrada' : 'Category not found'}</h2>
        <p>
          {language === 'es' 
            ? 'La categoría que estás buscando no existe o ha sido eliminada.' 
            : 'The category you are looking for does not exist or has been removed.'}
        </p>
        <Link to="/" className="back-home-link">
          {translations.home}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="category-view-page">
      <div className="category-header">
        <div className="breadcrumbs">
          <Link to="/">{translations.home}</Link>
          <span className="separator">&gt;</span>
          <span className="current">{category.name[language]}</span>
        </div>
        
        <h1 className="category-title">{category.name[language]}</h1>
        
        <p className="category-description">
          {category.description[language]}
        </p>
      </div>
      
      <AdSenseComponent adSlot="1234567890" format="horizontal" />
      
      <div className="category-actions">
        <button 
          className="new-thread-button"
          onClick={handleNewThread}
        >
          <i className="fas fa-plus"></i> 
          {language === 'es' ? 'Nuevo Tema' : 'New Thread'}
        </button>
        
        <div className="sort-options">
          <label htmlFor="sort-by">{translations.sortBy}:</label>
          <select 
            id="sort-by" 
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="-createdAt">
              {language === 'es' ? 'Más recientes' : 'Newest'}
            </option>
            <option value="createdAt">
              {language === 'es' ? 'Más antiguos' : 'Oldest'}
            </option>
            <option value="-replies">
              {language === 'es' ? 'Más respuestas' : 'Most replies'}
            </option>
            <option value="-views">
              {language === 'es' ? 'Más vistas' : 'Most views'}
            </option>
          </select>
        </div>
      </div>
      
      <div className="threads-container">
        {threads.length > 0 ? (
          threads.map(thread => (
            <ThreadListItem key={thread._id} thread={thread} />
          ))
        ) : (
          <div className="no-threads">
            <p>
              {language === 'es' 
                ? 'No hay temas en esta categoría. ¡Sé el primero en crear uno!' 
                : 'There are no threads in this category. Be the first to create one!'}
            </p>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(1)} 
            disabled={page === 1}
            aria-label={language === 'es' ? 'Primera página' : 'First page'}
          >
            <i className="fas fa-angle-double-left"></i>
          </button>
          
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page === 1}
            aria-label={language === 'es' ? 'Página anterior' : 'Previous page'}
          >
            <i className="fas fa-angle-left"></i>
          </button>
          
          <span className="page-info">
            {language === 'es' 
              ? `Página ${page} de ${totalPages}` 
              : `Page ${page} of ${totalPages}`}
          </span>
          
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page === totalPages}
            aria-label={language === 'es' ? 'Página siguiente' : 'Next page'}
          >
            <i className="fas fa-angle-right"></i>
          </button>
          
          <button 
            onClick={() => handlePageChange(totalPages)} 
            disabled={page === totalPages}
            aria-label={language === 'es' ? 'Última página' : 'Last page'}
          >
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryView;

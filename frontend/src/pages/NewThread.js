// NewThread.js - New thread creation page component for RiverForo.com

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import PostEditor from '../components/posts/PostEditor';
import './NewThread.scss';

const NewThread = () => {
  const { categoryId } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { translations, language } = useContext(LanguageContext);
  const history = useHistory();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, [isAuthenticated, history]);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Get all categories
        const categoriesRes = await axios.get('/api/categories');
        setCategories(categoriesRes.data.data);
        
        // If categoryId is provided, get specific category
        if (categoryId) {
          const categoryRes = await axios.get(`/api/categories/${categoryId}`);
          setCategory(categoryRes.data.data);
        }
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [categoryId]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError(language === 'es' 
        ? 'Por favor ingrese un título para el tema' 
        : 'Please enter a title for the thread');
      return;
    }
    
    if (!selectedCategory) {
      setError(language === 'es' 
        ? 'Por favor seleccione una categoría' 
        : 'Please select a category');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create new thread
      const threadRes = await axios.post('/api/threads', {
        title,
        category: selectedCategory
      });
      
      // Redirect to new thread
      history.push(`/thread/${threadRes.data.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create thread');
      setIsSubmitting(false);
    }
  };
  
  // Handle content submission (first post)
  const handleContentSubmit = async (content) => {
    if (!title.trim()) {
      setError(language === 'es' 
        ? 'Por favor ingrese un título para el tema' 
        : 'Please enter a title for the thread');
      return false;
    }
    
    if (!selectedCategory) {
      setError(language === 'es' 
        ? 'Por favor seleccione una categoría' 
        : 'Please select a category');
      return false;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create new thread
      const threadRes = await axios.post('/api/threads', {
        title,
        category: selectedCategory,
        content
      });
      
      // Redirect to new thread
      history.push(`/thread/${threadRes.data.data.slug}`);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create thread');
      setIsSubmitting(false);
      return false;
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
  
  return (
    <div className="new-thread-page">
      <div className="page-header">
        <h1>
          {language === 'es' ? 'Crear Nuevo Tema' : 'Create New Thread'}
        </h1>
        
        {category && (
          <p className="category-info">
            {language === 'es' ? 'Categoría:' : 'Category:'} {category.name[language]}
          </p>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form className="new-thread-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="thread-title">{translations.title}</label>
          <input
            type="text"
            id="thread-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === 'es' ? 'Título del tema' : 'Thread title'}
            disabled={isSubmitting}
            required
          />
        </div>
        
        {!category && (
          <div className="form-group">
            <label htmlFor="thread-category">{translations.category}</label>
            <select
              id="thread-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <option value="">
                {language === 'es' ? '-- Seleccionar categoría --' : '-- Select category --'}
              </option>
              
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name[language]}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="thread-content">{translations.content}</label>
          <PostEditor
            onSubmit={handleContentSubmit}
            onCancel={() => history.goBack()}
          />
        </div>
      </form>
    </div>
  );
};

export default NewThread;

// ThreadView.js - Thread view page component for RiverForo.com

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import PostItem from '../posts/PostItem';
import PostEditor from '../posts/PostEditor';
import AdSenseComponent from '../ads/AdSenseComponent';
import SimilarThreads from '../threads/SimilarThreads';
import './ThreadView.scss';

const ThreadView = () => {
  const { slug } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { translations, language } = useContext(LanguageContext);
  
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyOpen, setReplyOpen] = useState(false);
  
  const history = useHistory();
  
  // Fetch thread data
  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        
        // Get thread by slug
        const threadRes = await axios.get(`/api/threads/slug/${slug}`);
        setThread(threadRes.data.data);
        
        // Get category
        const categoryRes = await axios.get(`/api/categories/${threadRes.data.data.category._id}`);
        setCategory(categoryRes.data.data);
        
        // Get posts for thread (first page)
        const postsRes = await axios.get(`/api/threads/${threadRes.data.data._id}/posts?page=${page}&limit=10`);
        setPosts(postsRes.data.data);
        
        // Set total pages
        if (postsRes.data.pagination) {
          setTotalPages(Math.ceil(postsRes.data.count / 10));
        }
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load thread');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThread();
  }, [slug, page]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle reply submission
  const handleReplySubmit = async (content) => {
    try {
      const res = await axios.post('/api/posts', {
        thread: thread._id,
        content
      });
      
      // Add new post to list
      setPosts([...posts, res.data.data]);
      
      // Close reply editor
      setReplyOpen(false);
      
      // Scroll to new post
      setTimeout(() => {
        const newPost = document.getElementById(`post-${res.data.data._id}`);
        if (newPost) {
          newPost.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit reply');
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
  
  if (error) {
    return (
      <div className="error-container">
        <h2>{translations.error}</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  if (!thread) {
    return (
      <div className="not-found-container">
        <h2>{language === 'es' ? 'Tema no encontrado' : 'Thread not found'}</h2>
        <p>
          {language === 'es' 
            ? 'El tema que estás buscando no existe o ha sido eliminado.' 
            : 'The thread you are looking for does not exist or has been removed.'}
        </p>
        <Link to="/" className="back-home-link">
          {translations.home}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="thread-view-page">
      <div className="thread-header">
        <div className="breadcrumbs">
          <Link to="/">{translations.home}</Link>
          <span className="separator">&gt;</span>
          <Link to={`/category/${category.slug}`}>{category.name[language]}</Link>
          <span className="separator">&gt;</span>
          <span className="current">{thread.title}</span>
        </div>
        
        <h1 className="thread-title">{thread.title}</h1>
        
        <div className="thread-meta">
          <div className="thread-author">
            <img 
              src={thread.user.avatar || '/images/default-avatar.png'} 
              alt={thread.user.username} 
              className="author-avatar"
            />
            <Link to={`/user/${thread.user.username}`} className="author-name">
              {thread.user.username}
            </Link>
          </div>
          
          <div className="thread-stats">
            <span className="views">
              <i className="fas fa-eye"></i> {thread.views}
            </span>
            <span className="replies">
              <i className="fas fa-comment"></i> {thread.replies}
            </span>
            <span className="date">
              <i className="fas fa-calendar-alt"></i>
              {new Date(thread.createdAt).toLocaleDateString(
                language === 'es' ? 'es-ES' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
              )}
            </span>
          </div>
        </div>
      </div>
      
      <AdSenseComponent adSlot="1234567890" format="horizontal" />
      
      <div className="thread-content">
        <div className="posts-container">
          {posts.map((post, index) => (
            <PostItem 
              key={post._id} 
              post={post} 
              isFirstPost={page === 1 && index === 0}
              isThreadAuthor={post.user._id === thread.user._id}
              onPostUpdated={(updatedPost) => {
                const updatedPosts = [...posts];
                const postIndex = updatedPosts.findIndex(p => p._id === updatedPost._id);
                if (postIndex !== -1) {
                  updatedPosts[postIndex] = updatedPost;
                  setPosts(updatedPosts);
                }
              }}
              onPostDeleted={(deletedPostId) => {
                setPosts(posts.filter(p => p._id !== deletedPostId));
              }}
            />
          ))}
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
        
        {isAuthenticated ? (
          <div className="reply-section">
            {replyOpen ? (
              <PostEditor 
                onSubmit={handleReplySubmit}
                onCancel={() => setReplyOpen(false)}
              />
            ) : (
              <button 
                className="reply-button"
                onClick={() => setReplyOpen(true)}
              >
                <i className="fas fa-reply"></i> {translations.reply}
              </button>
            )}
          </div>
        ) : (
          <div className="login-to-reply">
            <p>
              {language === 'es' 
                ? 'Debes iniciar sesión para responder a este tema.' 
                : 'You must be logged in to reply to this thread.'}
            </p>
            <Link to="/login" className="login-link">
              {translations.login}
            </Link>
          </div>
        )}
      </div>
      
      <div className="thread-sidebar">
        <AdSenseComponent adSlot="0987654321" format="rectangle" style={{ marginBottom: '20px' }} />
        
        <SimilarThreads 
          categoryId={category._id}
          currentThreadId={thread._id}
        />
      </div>
    </div>
  );
};

export default ThreadView;

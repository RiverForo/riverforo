// PostItem.js - Post item component for RiverForo.com

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import PostEditor from './PostEditor';
import './PostItem.scss';

const PostItem = ({ post, isFirstPost, isThreadAuthor, onPostUpdated, onPostDeleted }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  
  const [editing, setEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState(null);
  
  // Format date based on language
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'es' ? 'es-ES' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };
  
  // Check if current user can edit this post
  const canEdit = isAuthenticated && (
    user._id === post.user._id || 
    user.role === 'admin' || 
    user.role === 'moderator'
  );
  
  // Handle post edit
  const handleEdit = async (content) => {
    try {
      const res = await axios.put(`/api/posts/${post._id}`, { content });
      onPostUpdated(res.data.data);
      setEditing(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
      return false;
    }
  };
  
  // Handle post delete
  const handleDelete = async () => {
    if (window.confirm(
      language === 'es' 
        ? '¿Estás seguro de que quieres eliminar este mensaje?' 
        : 'Are you sure you want to delete this post?'
    )) {
      try {
        await axios.delete(`/api/posts/${post._id}`);
        onPostDeleted(post._id);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete post');
      }
    }
  };
  
  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated) return;
    
    try {
      const res = await axios.post(`/api/posts/${post._id}/like`);
      onPostUpdated(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to like post');
    }
  };
  
  // Check if current user has liked this post
  const hasLiked = isAuthenticated && post.likes.includes(user._id);
  
  return (
    <div 
      id={`post-${post._id}`} 
      className={`post-item ${isFirstPost ? 'first-post' : ''}`}
    >
      <div className="post-sidebar">
        <div className="user-info">
          <Link to={`/user/${post.user.username}`} className="user-avatar">
            <img 
              src={post.user.avatar || '/images/default-avatar.png'} 
              alt={post.user.username} 
            />
          </Link>
          
          <Link to={`/user/${post.user.username}`} className="username">
            {post.user.username}
          </Link>
          
          {isThreadAuthor && (
            <div className="user-badge author-badge">
              {language === 'es' ? 'Autor' : 'Author'}
            </div>
          )}
          
          {post.user.role === 'admin' && (
            <div className="user-badge admin-badge">
              {language === 'es' ? 'Administrador' : 'Admin'}
            </div>
          )}
          
          {post.user.role === 'moderator' && (
            <div className="user-badge mod-badge">
              {language === 'es' ? 'Moderador' : 'Mod'}
            </div>
          )}
          
          <div className="user-stats">
            <div className="join-date">
              {language === 'es' ? 'Miembro desde:' : 'Member since:'} 
              {formatDate(post.user.createdAt)}
            </div>
            
            <div className="post-count">
              {language === 'es' ? 'Mensajes:' : 'Posts:'} {post.user.postCount}
            </div>
          </div>
        </div>
      </div>
      
      <div className="post-content">
        <div className="post-header">
          <div className="post-date">
            {formatDate(post.createdAt)}
            
            {post.isEdited && (
              <span className="edited-badge">
                {language === 'es' ? '(editado)' : '(edited)'}
              </span>
            )}
          </div>
          
          {canEdit && (
            <div className="post-options">
              <button 
                className="options-toggle"
                onClick={() => setShowOptions(!showOptions)}
                aria-label={language === 'es' ? 'Opciones' : 'Options'}
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              
              {showOptions && (
                <div className="options-dropdown">
                  <button 
                    onClick={() => {
                      setEditing(true);
                      setShowOptions(false);
                    }}
                  >
                    <i className="fas fa-edit"></i>
                    {language === 'es' ? 'Editar' : 'Edit'}
                  </button>
                  
                  <button onClick={handleDelete}>
                    <i className="fas fa-trash-alt"></i>
                    {language === 'es' ? 'Eliminar' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {editing ? (
          <PostEditor 
            initialContent={post.content}
            onSubmit={handleEdit}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div 
            className="post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
        
        <div className="post-footer">
          <div className="post-actions">
            <button 
              className={`like-button ${hasLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={!isAuthenticated}
              aria-label={language === 'es' ? 'Me gusta' : 'Like'}
            >
              <i className={`${hasLiked ? 'fas' : 'far'} fa-heart`}></i>
              <span className="like-count">{post.likes.length}</span>
            </button>
            
            <button 
              className="quote-button"
              onClick={() => {
                // Implement quote functionality
              }}
              disabled={!isAuthenticated}
              aria-label={language === 'es' ? 'Citar' : 'Quote'}
            >
              <i className="fas fa-quote-right"></i>
              <span>
                {language === 'es' ? 'Citar' : 'Quote'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;

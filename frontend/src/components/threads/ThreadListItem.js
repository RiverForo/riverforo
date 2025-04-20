// ThreadListItem.js - Thread list item component for RiverForo.com

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';
import './ThreadListItem.scss';

const ThreadListItem = ({ thread }) => {
  const { language } = useContext(LanguageContext);
  
  // Format date based on language
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'es' ? 'es-ES' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };
  
  return (
    <div className="thread-list-item">
      <div className="thread-avatar">
        <img 
          src={thread.user.avatar || '/images/default-avatar.png'} 
          alt={thread.user.username} 
        />
      </div>
      
      <div className="thread-content">
        <div className="thread-title">
          <Link to={`/thread/${thread.slug}`}>
            {thread.title}
          </Link>
          
          {thread.isPinned && (
            <span className="pinned-badge" title={language === 'es' ? 'Fijado' : 'Pinned'}>
              <i className="fas fa-thumbtack"></i>
            </span>
          )}
          
          {thread.isLocked && (
            <span className="locked-badge" title={language === 'es' ? 'Cerrado' : 'Locked'}>
              <i className="fas fa-lock"></i>
            </span>
          )}
        </div>
        
        <div className="thread-meta">
          <span className="thread-author">
            <Link to={`/user/${thread.user.username}`}>
              {thread.user.username}
            </Link>
          </span>
          
          <span className="thread-category">
            <Link to={`/category/${thread.category.slug}`}>
              {thread.category.name[language]}
            </Link>
          </span>
          
          <span className="thread-date">
            {formatDate(thread.createdAt)}
          </span>
        </div>
      </div>
      
      <div className="thread-stats">
        <div className="views">
          <i className="fas fa-eye"></i>
          <span>{thread.views}</span>
        </div>
        
        <div className="replies">
          <i className="fas fa-comment"></i>
          <span>{thread.replies}</span>
        </div>
      </div>
      
      <div className="last-reply">
        {thread.lastReply ? (
          <>
            <div className="last-reply-avatar">
              <img 
                src={thread.lastReply.user.avatar || '/images/default-avatar.png'} 
                alt={thread.lastReply.user.username} 
              />
            </div>
            
            <div className="last-reply-info">
              <Link to={`/user/${thread.lastReply.user.username}`} className="last-reply-author">
                {thread.lastReply.user.username}
              </Link>
              
              <span className="last-reply-date">
                {formatDate(thread.lastReply.createdAt)}
              </span>
            </div>
          </>
        ) : (
          <div className="no-replies">
            {language === 'es' ? 'Sin respuestas' : 'No replies'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadListItem;

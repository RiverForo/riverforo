// PostEditor.js - Post editor component for RiverForo.com

import React, { useState, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import './PostEditor.scss';

const PostEditor = ({ initialContent = '', onSubmit, onCancel }) => {
  const { translations, language } = useContext(LanguageContext);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  
  // Focus editor on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate content
    if (!content.trim()) {
      setError(language === 'es' 
        ? 'El mensaje no puede estar vacío' 
        : 'Post content cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Submit content
    const success = await onSubmit(content);
    
    if (!success) {
      setIsSubmitting(false);
    }
  };
  
  // Handle formatting buttons
  const handleFormat = (format) => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    if (!editor.contains(selection.anchorNode)) {
      return;
    }
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'quote':
        formattedText = `<blockquote>${selectedText}</blockquote>`;
        break;
      case 'code':
        formattedText = `<code>${selectedText}</code>`;
        break;
      case 'link':
        const url = prompt(
          language === 'es' 
            ? 'Ingrese la URL:' 
            : 'Enter the URL:'
        );
        if (url) {
          formattedText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText || url}</a>`;
        }
        break;
      default:
        return;
    }
    
    if (formattedText) {
      document.execCommand('insertHTML', false, formattedText);
    }
  };
  
  return (
    <div className="post-editor">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="editor-toolbar">
        <button 
          type="button" 
          onClick={() => handleFormat('bold')}
          title={language === 'es' ? 'Negrita' : 'Bold'}
        >
          <i className="fas fa-bold"></i>
        </button>
        
        <button 
          type="button" 
          onClick={() => handleFormat('italic')}
          title={language === 'es' ? 'Cursiva' : 'Italic'}
        >
          <i className="fas fa-italic"></i>
        </button>
        
        <button 
          type="button" 
          onClick={() => handleFormat('underline')}
          title={language === 'es' ? 'Subrayado' : 'Underline'}
        >
          <i className="fas fa-underline"></i>
        </button>
        
        <span className="toolbar-divider"></span>
        
        <button 
          type="button" 
          onClick={() => handleFormat('quote')}
          title={language === 'es' ? 'Cita' : 'Quote'}
        >
          <i className="fas fa-quote-right"></i>
        </button>
        
        <button 
          type="button" 
          onClick={() => handleFormat('code')}
          title={language === 'es' ? 'Código' : 'Code'}
        >
          <i className="fas fa-code"></i>
        </button>
        
        <button 
          type="button" 
          onClick={() => handleFormat('link')}
          title={language === 'es' ? 'Enlace' : 'Link'}
        >
          <i className="fas fa-link"></i>
        </button>
      </div>
      
      <div 
        ref={editorRef}
        className="editor-content" 
        contentEditable={!isSubmitting}
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
      ></div>
      
      <div className="editor-actions">
        <button 
          type="button" 
          className="cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {translations.cancel}
        </button>
        
        <button 
          type="button" 
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (language === 'es' ? 'Enviando...' : 'Submitting...') 
            : translations.submit}
        </button>
      </div>
    </div>
  );
};

export default PostEditor;

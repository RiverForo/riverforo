import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Home.css';

const Home = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  
  // Mock data for categories and recent threads
  const categories = [
    {
      id: 1,
      name: language === 'es' ? 'Noticias y Anuncios' : 'News and Announcements',
      description: language === 'es' ? 'Noticias oficiales y anuncios sobre River Plate y el foro' : 'Official news and announcements about River Plate and the forum',
      threadCount: 5,
      postCount: 23
    },
    {
      id: 2,
      name: language === 'es' ? 'Discusión General' : 'General Discussion',
      description: language === 'es' ? 'Discusiones generales sobre River Plate' : 'General discussions about River Plate',
      threadCount: 12,
      postCount: 87
    },
    {
      id: 3,
      name: language === 'es' ? 'Partidos y Eventos' : 'Matches and Events',
      description: language === 'es' ? 'Discusiones sobre partidos pasados y futuros, y eventos relacionados con River Plate' : 'Discussions about past and upcoming matches, and events related to River Plate',
      threadCount: 8,
      postCount: 64
    }
  ];
  
  const recentThreads = [
    {
      id: 1,
      title: language === 'es' ? '¡Bienvenidos a RiverForo.com!' : 'Welcome to RiverForo.com!',
      author: 'admin',
      category: language === 'es' ? 'Noticias y Anuncios' : 'News and Announcements',
      replies: 3,
      views: 120,
      lastPost: '2025-04-19T14:30:00Z'
    },
    {
      id: 2,
      title: language === 'es' ? 'Análisis del último partido' : 'Analysis of the last match',
      author: 'riverplate_fan',
      category: language === 'es' ? 'Partidos y Eventos' : 'Matches and Events',
      replies: 15,
      views: 230,
      lastPost: '2025-04-18T09:45:00Z'
    },
    {
      id: 3,
      title: language === 'es' ? 'Rumores de fichajes para la próxima temporada' : 'Transfer rumors for next season',
      author: 'futbol_expert',
      category: language === 'es' ? 'Discusión General' : 'General Discussion',
      replies: 27,
      views: 412,
      lastPost: '2025-04-17T22:15:00Z'
    }
  ];
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-AR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="home-page">
      <div className="welcome-banner">
        <h1>{t.welcome}</h1>
        <p>
          {language === 'es' 
            ? 'La comunidad online para todos los hinchas de River Plate. Discute sobre partidos, jugadores, noticias y más.'
            : 'The online community for all River Plate fans. Discuss matches, players, news, and more.'}
        </p>
      </div>
      
      <div className="home-content">
        <div className="categories-section">
          <h2>{t.categories}</h2>
          <div className="categories-list">
            {categories.map(category => (
              <div key={category.id} className="category-card">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="category-stats">
                  <span>
                    {language === 'es' ? 'Temas: ' : 'Threads: '}
                    {category.threadCount}
                  </span>
                  <span>
                    {language === 'es' ? 'Mensajes: ' : 'Posts: '}
                    {category.postCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="recent-threads-section">
          <h2>{t.recentThreads}</h2>
          <div className="threads-list">
            {recentThreads.map(thread => (
              <div key={thread.id} className="thread-card">
                <h3>{thread.title}</h3>
                <div className="thread-meta">
                  <span>
                    {language === 'es' ? 'Por: ' : 'By: '}
                    {thread.author}
                  </span>
                  <span>
                    {language === 'es' ? 'Categoría: ' : 'Category: '}
                    {thread.category}
                  </span>
                </div>
                <div className="thread-stats">
                  <span>
                    {language === 'es' ? 'Respuestas: ' : 'Replies: '}
                    {thread.replies}
                  </span>
                  <span>
                    {language === 'es' ? 'Vistas: ' : 'Views: '}
                    {thread.views}
                  </span>
                  <span>
                    {language === 'es' ? 'Último mensaje: ' : 'Last post: '}
                    {formatDate(thread.lastPost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

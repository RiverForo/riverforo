import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ThreadView from './pages/ThreadView'; // <-- newly added
import './App.css';

function App() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`} lang={language}>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/thread/:id" element={<ThreadView />} /> {/* <-- new route */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

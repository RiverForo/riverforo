// React component for App.js - Main application component for RiverForo.com

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForumCategory from './pages/ForumCategory';
import ThreadView from './pages/ThreadView';
import CreateThread from './pages/CreateThread';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import './styles/main.scss';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <img src="/images/river-plate-logo.png" alt="River Plate Logo" />
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <div className="app-container">
                <Header />
                <main className="main-content">
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/category/:slug" component={ForumCategory} />
                    <Route path="/thread/:slug" component={ThreadView} />
                    <PrivateRoute path="/create-thread/:categorySlug" component={CreateThread} />
                    <Route path="/user/:username" component={UserProfile} />
                    <PrivateRoute path="/edit-profile" component={EditProfile} />
                    <AdminRoute path="/admin" component={AdminDashboard} />
                    <Route component={NotFound} />
                  </Switch>
                </main>
                <Footer />
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

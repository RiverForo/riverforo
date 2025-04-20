// NotificationContext.js - Context for real-time notifications in RiverForo.com

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { AuthContext } from './AuthContext';

// Create the notification context
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, user } = useContext(AuthContext);
  
  // Initialize Pusher
  useEffect(() => {
    if (isAuthenticated && user) {
      // Pusher configuration
      const pusher = new Pusher('2baff66ce4eb56c9ecc1', {
        cluster: 'us2',
        encrypted: true
      });
      
      // Subscribe to user's private channel
      const channel = pusher.subscribe(`private-user-${user._id}`);
      
      // Listen for new notifications
      channel.bind('new-notification', (data) => {
        setNotifications(prevNotifications => [data.notification, ...prevNotifications]);
        setUnreadCount(prevCount => prevCount + 1);
      });
      
      // Cleanup on unmount
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
    }
  }, [isAuthenticated, user]);
  
  // Load notifications when user is authenticated
  useEffect(() => {
    const fetchNotifications = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          
          // Get notifications
          const notificationsRes = await axios.get('/api/notifications');
          setNotifications(notificationsRes.data.data);
          
          // Get unread count
          const countRes = await axios.get('/api/notifications/unread/count');
          setUnreadCount(countRes.data.data.count);
          
          setError(null);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to load notifications');
        } finally {
          setLoading(false);
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    };
    
    fetchNotifications();
  }, [isAuthenticated]);
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark notification as read');
      return false;
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark all notifications as read');
      return false;
    }
  };
  
  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      
      // Update local state
      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
      
      // Update unread count if needed
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete notification');
      return false;
    }
  };
  
  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      await axios.delete('/api/notifications');
      
      // Update local state
      setNotifications([]);
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete all notifications');
      return false;
    }
  };
  
  // Clear errors
  const clearError = () => {
    setError(null);
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        clearError
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

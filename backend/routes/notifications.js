// Routes for notifications
const express = require('express');
const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} = require('../controllers/notifications');

const router = express.Router();

// Middleware
const { protect } = require('../middleware/auth');

// All notification routes are protected
router.use(protect);

router.get('/', getUserNotifications);
router.get('/unread/count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);

module.exports = router;

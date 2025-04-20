// Routes for threads
const express = require('express');
const {
  getThreads,
  getThread,
  getThreadBySlug,
  createThread,
  updateThread,
  deleteThread,
  getThreadPosts,
  toggleSticky,
  toggleLock,
  searchThreads
} = require('../controllers/threads');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getThreads);
router.get('/search', searchThreads);
router.get('/:id', getThread);
router.get('/slug/:slug', getThreadBySlug);
router.get('/:id/posts', getThreadPosts);

// Protected routes
router.post('/', protect, createThread);
router.put('/:id', protect, updateThread);
router.delete('/:id', protect, deleteThread);

// Admin/Moderator routes
router.put(
  '/:id/sticky',
  protect,
  authorize('admin', 'moderator'),
  toggleSticky
);
router.put(
  '/:id/lock',
  protect,
  authorize('admin', 'moderator'),
  toggleLock
);

module.exports = router;

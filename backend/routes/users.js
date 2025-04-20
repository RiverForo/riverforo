// User routes for RiverForo.com

const express = require('express');
const {
  getUsers,
  getUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  getUserThreads,
  getUserPosts
} = require('../controllers/users');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);

// Public routes
router.get('/:id', getUser);
router.get('/username/:username', getUserByUsername);
router.get('/:id/threads', getUserThreads);
router.get('/:id/posts', getUserPosts);

// Protected routes
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;

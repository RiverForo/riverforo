// Routes for posts
const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  searchPosts
} = require('../controllers/posts');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLike);

module.exports = router;

// Routes for categories
const express = require('express');
const {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryThreads,
  reorderCategories
} = require('../controllers/categories');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id/threads', getCategoryThreads);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);
router.put('/reorder', protect, authorize('admin'), reorderCategories);

module.exports = router;

// Routes for ads
const express = require('express');
const {
  getAdPlacements,
  getAdPlacementsByLocation,
  getAdPlacement,
  createAdPlacement,
  updateAdPlacement,
  deleteAdPlacement,
  trackImpression,
  trackClick,
  getAdStats
} = require('../controllers/ads');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAdPlacements);
router.get('/location/:location', getAdPlacementsByLocation);
router.put('/:id/impression', trackImpression);
router.put('/:id/click', trackClick);

// Admin routes
router.get('/stats', protect, authorize('admin'), getAdStats);
router.get('/:id', protect, authorize('admin'), getAdPlacement);
router.post('/', protect, authorize('admin'), createAdPlacement);
router.put('/:id', protect, authorize('admin'), updateAdPlacement);
router.delete('/:id', protect, authorize('admin'), deleteAdPlacement);

module.exports = router;

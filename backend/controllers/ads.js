// AdSense controller for RiverForo.com

const AdPlacement = require('../models/AdPlacement');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all ad placements
// @route   GET /api/ads
// @access  Public
exports.getAdPlacements = asyncHandler(async (req, res, next) => {
  // Get only active ads
  const adPlacements = await AdPlacement.find({ 
    isActive: true,
    $or: [
      { endDate: null },
      { endDate: { $gt: new Date() } }
    ]
  }).sort({ displayOrder: 1 });

  res.status(200).json({
    success: true,
    count: adPlacements.length,
    data: adPlacements
  });
});

// @desc    Get ad placements by location
// @route   GET /api/ads/location/:location
// @access  Public
exports.getAdPlacementsByLocation = asyncHandler(async (req, res, next) => {
  // Get only active ads for specific location
  const adPlacements = await AdPlacement.find({ 
    location: req.params.location,
    isActive: true,
    $or: [
      { endDate: null },
      { endDate: { $gt: new Date() } }
    ]
  }).sort({ displayOrder: 1 });

  res.status(200).json({
    success: true,
    count: adPlacements.length,
    data: adPlacements
  });
});

// @desc    Get single ad placement
// @route   GET /api/ads/:id
// @access  Private/Admin
exports.getAdPlacement = asyncHandler(async (req, res, next) => {
  const adPlacement = await AdPlacement.findById(req.params.id);

  if (!adPlacement) {
    return next(
      new ErrorResponse(`Ad placement not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: adPlacement
  });
});

// @desc    Create new ad placement
// @route   POST /api/ads
// @access  Private/Admin
exports.createAdPlacement = asyncHandler(async (req, res, next) => {
  const adPlacement = await AdPlacement.create(req.body);

  res.status(201).json({
    success: true,
    data: adPlacement
  });
});

// @desc    Update ad placement
// @route   PUT /api/ads/:id
// @access  Private/Admin
exports.updateAdPlacement = asyncHandler(async (req, res, next) => {
  let adPlacement = await AdPlacement.findById(req.params.id);

  if (!adPlacement) {
    return next(
      new ErrorResponse(`Ad placement not found with id of ${req.params.id}`, 404)
    );
  }

  adPlacement = await AdPlacement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: adPlacement
  });
});

// @desc    Delete ad placement
// @route   DELETE /api/ads/:id
// @access  Private/Admin
exports.deleteAdPlacement = asyncHandler(async (req, res, next) => {
  const adPlacement = await AdPlacement.findById(req.params.id);

  if (!adPlacement) {
    return next(
      new ErrorResponse(`Ad placement not found with id of ${req.params.id}`, 404)
    );
  }

  await adPlacement.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Track ad impression
// @route   PUT /api/ads/:id/impression
// @access  Public
exports.trackImpression = asyncHandler(async (req, res, next) => {
  const adPlacement = await AdPlacement.findById(req.params.id);

  if (!adPlacement) {
    return next(
      new ErrorResponse(`Ad placement not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment impression count
  adPlacement.impressions += 1;
  await adPlacement.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Track ad click
// @route   PUT /api/ads/:id/click
// @access  Public
exports.trackClick = asyncHandler(async (req, res, next) => {
  const adPlacement = await AdPlacement.findById(req.params.id);

  if (!adPlacement) {
    return next(
      new ErrorResponse(`Ad placement not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment click count
  adPlacement.clicks += 1;
  await adPlacement.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get ad performance stats
// @route   GET /api/ads/stats
// @access  Private/Admin
exports.getAdStats = asyncHandler(async (req, res, next) => {
  // Get total impressions and clicks
  const stats = await AdPlacement.aggregate([
    {
      $group: {
        _id: null,
        totalImpressions: { $sum: '$impressions' },
        totalClicks: { $sum: '$clicks' }
      }
    }
  ]);

  // Get stats by location
  const locationStats = await AdPlacement.aggregate([
    {
      $group: {
        _id: '$location',
        impressions: { $sum: '$impressions' },
        clicks: { $sum: '$clicks' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { impressions: -1 }
    }
  ]);

  // Calculate CTR
  const totalStats = stats.length > 0 ? stats[0] : { totalImpressions: 0, totalClicks: 0 };
  const ctr = totalStats.totalImpressions > 0 
    ? (totalStats.totalClicks / totalStats.totalImpressions) * 100 
    : 0;

  res.status(200).json({
    success: true,
    data: {
      total: {
        impressions: totalStats.totalImpressions,
        clicks: totalStats.totalClicks,
        ctr: ctr.toFixed(2)
      },
      byLocation: locationStats
    }
  });
});

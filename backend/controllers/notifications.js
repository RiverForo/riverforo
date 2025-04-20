// Notifications controller for RiverForo.com

const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getUserNotifications = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Notification.countDocuments({ recipient: req.user.id });

  // Get notifications
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: notifications.length,
    pagination,
    data: notifications
  });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    data: { count }
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure notification belongs to user
  if (notification.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to access this notification`, 403)
    );
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure notification belongs to user
  if (notification.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to delete this notification`, 403)
    );
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
exports.deleteAllNotifications = asyncHandler(async (req, res, next) => {
  await Notification.deleteMany({ recipient: req.user.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

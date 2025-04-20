// Users controller for RiverForo.com

const User = require('../models/User');
const Thread = require('../models/Thread');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await User.countDocuments();

  // Get users
  const users = await User.find()
    .sort({ joinDate: -1 })
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
    count: users.length,
    pagination,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get user by username
// @route   GET /api/users/username/:username
// @access  Public
exports.getUserByUsername = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with username of ${req.params.username}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is updating their own profile or is admin
  if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to update this user`, 403)
    );
  }

  // Fields to update
  const fieldsToUpdate = {
    username: req.body.username,
    email: req.body.email,
    bio: req.body.bio,
    location: req.body.location,
    preferredLanguage: req.body.preferredLanguage,
    notifications: req.body.notifications,
    avatar: req.body.avatar
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  // If admin is updating role
  if (req.user.role === 'admin' && req.body.role) {
    fieldsToUpdate.role = req.body.role;
  }

  user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is deleting their own account or is admin
  if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to delete this user`, 403)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user threads
// @route   GET /api/users/:id/threads
// @access  Public
exports.getUserThreads = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Thread.countDocuments({ 'user._id': user._id });

  // Get threads
  const threads = await Thread.find({ 'user._id': user._id })
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
    count: threads.length,
    pagination,
    data: threads
  });
});

// @desc    Get user posts
// @route   GET /api/users/:id/posts
// @access  Public
exports.getUserPosts = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments({ 'user._id': user._id });

  // Get posts
  const posts = await Post.find({ 'user._id': user._id })
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
    count: posts.length,
    pagination,
    data: posts
  });
});

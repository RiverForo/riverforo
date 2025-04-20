// Thread controller for RiverForo.com

const Thread = require('../models/Thread');
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const pusher = require('../utils/pusher');

// @desc    Get all threads
// @route   GET /api/threads
// @access  Public
exports.getThreads = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Thread.countDocuments();

  // Get threads
  const threads = await Thread.find()
    .sort({ isSticky: -1, updatedAt: -1 })
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

// @desc    Get single thread
// @route   GET /api/threads/:id
// @access  Public
exports.getThread = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread) {
    return next(
      new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if thread's category is private and user has access
  const category = await Category.findById(thread.category._id);

  if (category && category.isPrivate) {
    if (!req.user) {
      return next(
        new ErrorResponse(`Not authorized to access this thread`, 401)
      );
    }

    if (!category.allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`Not authorized to access this thread`, 403)
      );
    }
  }

  // Increment view count
  thread.viewCount += 1;
  await thread.save();

  res.status(200).json({
    success: true,
    data: thread
  });
});

// @desc    Get thread by slug
// @route   GET /api/threads/slug/:slug
// @access  Public
exports.getThreadBySlug = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findOne({ slug: req.params.slug });

  if (!thread) {
    return next(
      new ErrorResponse(`Thread not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Check if thread's category is private and user has access
  const category = await Category.findById(thread.category._id);

  if (category && category.isPrivate) {
    if (!req.user) {
      return next(
        new ErrorResponse(`Not authorized to access this thread`, 401)
      );
    }

    if (!category.allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`Not authorized to access this thread`, 403)
      );
    }
  }

  // Increment view count
  thread.viewCount += 1;
  await thread.save();

  res.status(200).json({
    success: true,
    data: thread
  });
});

// @desc    Create new thread
// @route   POST /api/threads
// @access  Private
exports.createThread = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = {
    _id: req.user.id,
    username: req.user.username,
    avatar: req.user.avatar
  };

  // Check if category exists
  const category = await Category.findById(req.body.categoryId);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.body.categoryId}`, 404)
    );
  }

  // Check if user can post in this category
  if (category.isPrivate && !category.allowedRoles.includes(req.user.role)) {
    return next(
      new ErrorResponse(`Not authorized to post in this category`, 403)
    );
  }

  // Add category to req.body
  req.body.category = {
    _id: category._id,
    name: category.name,
    slug: category.slug
  };

  // Create thread
  const thread = await Thread.create(req.body);

  // Create first post
  const post = await Post.create({
    content: req.body.content,
    user: req.body.user,
    thread: {
      _id: thread._id,
      title: thread.title,
      slug: thread.slug
    }
  });

  // Update thread with first post
  thread.lastPost = {
    _id: post._id,
    user: req.body.user,
    createdAt: post.createdAt
  };
  thread.postCount = 1;
  await thread.save();

  // Update category with thread count and last thread
  await Category.findByIdAndUpdate(
    category._id,
    {
      $inc: { threadCount: 1, postCount: 1 },
      lastThread: {
        threadId: thread._id,
        title: thread.title,
        user: req.body.user,
        createdAt: thread.createdAt
      }
    },
    { new: true }
  );

  // Trigger real-time update
  pusher.trigger('forum', 'new-thread', {
    thread: {
      _id: thread._id,
      title: thread.title,
      slug: thread.slug,
      category: thread.category,
      user: thread.user,
      createdAt: thread.createdAt
    }
  });

  res.status(201).json({
    success: true,
    data: thread
  });
});

// @desc    Update thread
// @route   PUT /api/threads/:id
// @access  Private
exports.updateThread = asyncHandler(async (req, res, next) => {
  let thread = await Thread.findById(req.params.id);

  if (!thread) {
    return next(
      new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is thread owner or admin/moderator
  if (
    thread.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'moderator'
  ) {
    return next(
      new ErrorResponse(`Not authorized to update this thread`, 403)
    );
  }

  // Check if thread is locked
  if (thread.isLocked && req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return next(
      new ErrorResponse(`Thread is locked and cannot be updated`, 403)
    );
  }

  // Update thread
  thread = await Thread.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: thread
  });
});

// @desc    Delete thread
// @route   DELETE /api/threads/:id
// @access  Private
exports.deleteThread = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread) {
    return next(
      new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is thread owner or admin/moderator
  if (
    thread.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'moderator'
  ) {
    return next(
      new ErrorResponse(`Not authorized to delete this thread`, 403)
    );
  }

  // Get category
  const category = await Category.findById(thread.category._id);

  // Delete all posts in thread
  await Post.deleteMany({ 'thread._id': thread._id });

  // Delete thread
  await thread.remove();

  // Update category thread and post count
  if (category) {
    const postCount = await Post.countDocuments({ 'thread._id': thread._id });
    
    await Category.findByIdAndUpdate(
      category._id,
      {
        $inc: { threadCount: -1, postCount: -postCount }
      },
      { new: true }
    );
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get posts in thread
// @route   GET /api/threads/:id/posts
// @access  Public
exports.getThreadPosts = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread) {
    return next(
      new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if thread's category is private and user has access
  const category = await Category.findById(thread.category._id);

  if (category && category.isPrivate) {
    if (!req.user) {
      return next(
        new ErrorResponse(`Not authorized to access this thread`, 401)
      );
    }

    if (!category.allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`Not authorized to access this thread`, 403)
      );
    }
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments({ 'thread._id': thread._id });

  // Get posts
  const posts = await Post.find({ 'thread._id': thread._id })
    .sort({ createdAt: 1 })
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

// @desc    Toggle sticky status
// @route   PUT /api/threads/:id/sticky
// @access  Private/Admin/Moderator
exports.toggleSticky = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread) {
    return next(
      new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
    );
  }

  // Toggle sticky status
  thread.isSticky = !thread.isSticky;
  await thread.save();

  res.status(200).json({
    success: true,
    data: thread
  });
});

// @desc    Toggle lock status
// @route   PUT /api/threads/:id/lock
// @access  Private/Admin/Moderator
exports.toggleLock = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);

  if (!thread) {
    return next(
      new ErrorResponse(`Thread not found with id of ${req.params.id}`, 404)
    );
  }

  // Toggle lock status
  thread.isLocked = !thread.isLocked;
  await thread.save();

  res.status(200).json({
    success: true,
    data: thread
  });
});

// @desc    Search threads
// @route   GET /api/threads/search
// @access  Public
exports.searchThreads = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Create search query
  const searchQuery = {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ]
  };

  // Get total count
  const total = await Thread.countDocuments(searchQuery);

  // Get threads
  const threads = await Thread.find(searchQuery)
    .sort({ updatedAt: -1 })
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

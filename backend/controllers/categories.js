// Category controller for RiverForo.com

const Category = require('../models/Category');
const Thread = require('../models/Thread');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
exports.getCategoryBySlug = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with slug of ${req.params.slug}`, 404)
    );
  }

  // Check if category is private and user has access
  if (category.isPrivate) {
    if (!req.user) {
      return next(
        new ErrorResponse(`Not authorized to access this category`, 401)
      );
    }

    if (!category.allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`Not authorized to access this category`, 403)
      );
    }
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if category has threads
  const threadCount = await Thread.countDocuments({ 'category._id': category._id });

  if (threadCount > 0) {
    return next(
      new ErrorResponse(`Cannot delete category with existing threads`, 400)
    );
  }

  await category.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get threads in category
// @route   GET /api/categories/:id/threads
// @access  Public
exports.getCategoryThreads = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if category is private and user has access
  if (category.isPrivate) {
    if (!req.user) {
      return next(
        new ErrorResponse(`Not authorized to access this category`, 401)
      );
    }

    if (!category.allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`Not authorized to access this category`, 403)
      );
    }
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Thread.countDocuments({ 'category._id': category._id });

  // Get threads
  const threads = await Thread.find({ 'category._id': category._id })
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

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
exports.reorderCategories = asyncHandler(async (req, res, next) => {
  const { categoryOrders } = req.body;

  if (!categoryOrders || !Array.isArray(categoryOrders)) {
    return next(new ErrorResponse('Please provide category orders array', 400));
  }

  // Update each category order
  const updatePromises = categoryOrders.map(item => {
    return Category.findByIdAndUpdate(
      item.id,
      { order: item.order },
      { new: true }
    );
  });

  await Promise.all(updatePromises);

  const categories = await Category.find().sort({ order: 1 });

  res.status(200).json({
    success: true,
    data: categories
  });
});

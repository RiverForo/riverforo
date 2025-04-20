// Posts controller for RiverForo.com

const Post = require('../models/Post');
const Thread = require('../models/Thread');
const Category = require('../models/Category');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const pusher = require('../utils/pusher');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments();

  // Get posts
  const posts = await Post.find()
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

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if post's thread's category is private and user has access
  const thread = await Thread.findById(post.thread._id);
  
  if (thread) {
    const category = await Category.findById(thread.category._id);

    if (category && category.isPrivate) {
      if (!req.user) {
        return next(
          new ErrorResponse(`Not authorized to access this post`, 401)
        );
      }

      if (!category.allowedRoles.includes(req.user.role)) {
        return next(
          new ErrorResponse(`Not authorized to access this post`, 403)
        );
      }
    }
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = {
    _id: req.user.id,
    username: req.user.username,
    avatar: req.user.avatar
  };

  // Check if thread exists
  const thread = await Thread.findById(req.body.threadId);

  if (!thread) {
    return next(
      new ErrorResponse(`Thread not found with id of ${req.body.threadId}`, 404)
    );
  }

  // Check if thread is locked
  if (thread.isLocked && req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return next(
      new ErrorResponse(`Thread is locked and cannot be replied to`, 403)
    );
  }

  // Check if thread's category is private and user has access
  const category = await Category.findById(thread.category._id);

  if (category && category.isPrivate) {
    if (!category.allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`Not authorized to post in this thread`, 403)
      );
    }
  }

  // Add thread to req.body
  req.body.thread = {
    _id: thread._id,
    title: thread.title,
    slug: thread.slug
  };

  // Create post
  const post = await Post.create(req.body);

  // Update thread with last post and increment post count
  thread.lastPost = {
    _id: post._id,
    user: req.body.user,
    createdAt: post.createdAt
  };
  thread.postCount += 1;
  await thread.save();

  // Update category post count
  if (category) {
    await Category.findByIdAndUpdate(
      category._id,
      {
        $inc: { postCount: 1 }
      },
      { new: true }
    );
  }

  // Process mentions
  if (post.mentions && post.mentions.length > 0) {
    // Find users by username
    for (const mention of post.mentions) {
      const mentionedUser = await User.findOne({ username: mention.username });
      
      if (mentionedUser) {
        // Update mention with user ID
        mention.user = mentionedUser._id;
        
        // Create notification
        await Notification.create({
          type: 'mention',
          title: 'You were mentioned in a post',
          message: `${req.user.username} mentioned you in "${thread.title}"`,
          recipient: mentionedUser._id,
          sender: {
            _id: req.user.id,
            username: req.user.username,
            avatar: req.user.avatar
          },
          reference: {
            model: 'Post',
            id: post._id
          },
          url: `/forums/thread/${thread.slug}#post-${post._id}`
        });
        
        // Trigger real-time notification
        pusher.trigger(`user-${mentionedUser._id}`, 'new-notification', {
          message: `${req.user.username} mentioned you in a post`
        });
      }
    }
    
    // Save updated mentions
    await post.save();
  }

  // Notify thread owner if it's not their own post
  if (thread.user._id.toString() !== req.user.id) {
    await Notification.create({
      type: 'reply',
      title: 'New reply to your thread',
      message: `${req.user.username} replied to your thread "${thread.title}"`,
      recipient: thread.user._id,
      sender: {
        _id: req.user.id,
        username: req.user.username,
        avatar: req.user.avatar
      },
      reference: {
        model: 'Post',
        id: post._id
      },
      url: `/forums/thread/${thread.slug}#post-${post._id}`
    });
    
    // Trigger real-time notification
    pusher.trigger(`user-${thread.user._id}`, 'new-notification', {
      message: `${req.user.username} replied to your thread`
    });
  }

  // Trigger real-time update for thread
  pusher.trigger(`thread-${thread._id}`, 'new-post', {
    post: {
      _id: post._id,
      content: post.content,
      user: post.user,
      createdAt: post.createdAt
    }
  });

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post owner or admin/moderator
  if (
    post.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'moderator'
  ) {
    return next(
      new ErrorResponse(`Not authorized to update this post`, 403)
    );
  }

  // Check if thread is locked
  const thread = await Thread.findById(post.thread._id);
  
  if (thread && thread.isLocked && req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return next(
      new ErrorResponse(`Thread is locked and post cannot be updated`, 403)
    );
  }

  // Update post
  post = await Post.findByIdAndUpdate(req.params.id, { content: req.body.content }, {
    new: true,
    runValidators: true
  });

  // Trigger real-time update
  pusher.trigger(`thread-${post.thread._id}`, 'update-post', {
    post: {
      _id: post._id,
      content: post.content,
      isEdited: post.isEdited,
      updatedAt: post.updatedAt
    }
  });

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post owner or admin/moderator
  if (
    post.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'moderator'
  ) {
    return next(
      new ErrorResponse(`Not authorized to delete this post`, 403)
    );
  }

  // Check if it's the first post in the thread
  const thread = await Thread.findById(post.thread._id);
  const firstPost = await Post.findOne({ 'thread._id': post.thread._id }).sort({ createdAt: 1 });
  
  if (firstPost && firstPost._id.toString() === post._id.toString()) {
    return next(
      new ErrorResponse(`Cannot delete the first post of a thread. Delete the thread instead.`, 400)
    );
  }

  // Delete post
  await post.remove();

  // Update thread post count and last post
  if (thread) {
    // Decrement post count
    thread.postCount -= 1;
    
    // Update last post
    const lastPost = await Post.findOne({ 'thread._id': thread._id }).sort({ createdAt: -1 });
    
    if (lastPost) {
      thread.lastPost = {
        _id: lastPost._id,
        user: lastPost.user,
        createdAt: lastPost.createdAt
      };
    } else {
      thread.lastPost = null;
    }
    
    await thread.save();
    
    // Update category post count
    const category = await Category.findById(thread.category._id);
    
    if (category) {
      await Category.findByIdAndUpdate(
        category._id,
        {
          $inc: { postCount: -1 }
        },
        { new: true }
      );
    }
  }

  // Trigger real-time update
  pusher.trigger(`thread-${post.thread._id}`, 'delete-post', {
    postId: post._id
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like/unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.toggleLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user already liked the post
  const likeIndex = post.likes.findIndex(
    like => like.user.toString() === req.user.id
  );

  if (likeIndex === -1) {
    // Add like
    post.likes.push({
      user: req.user.id,
      username: req.user.username
    });
    
    // Create notification if it's not the user's own post
    if (post.user._id.toString() !== req.user.id) {
      await Notification.create({
        type: 'like',
        title: 'Someone liked your post',
        message: `${req.user.username} liked your post in "${post.thread.title}"`,
        recipient: post.user._id,
        sender: {
          _id: req.user.id,
          username: req.user.username,
          avatar: req.user.avatar
        },
        reference: {
          model: 'Post',
          id: post._id
        },
        url: `/forums/thread/${post.thread.slug}#post-${post._id}`
      });
      
      // Trigger real-time notification
      pusher.trigger(`user-${post.user._id}`, 'new-notification', {
        message: `${req.user.username} liked your post`
      });
    }
  } else {
    // Remove like
    post.likes.splice(likeIndex, 1);
  }

  await post.save();

  // Update thread like count
  const thread = await Thread.findById(post.thread._id);
  
  if (thread) {
    thread.likeCount = await Post.aggregate([
      { $match: { 'thread._id': thread._id } },
      { $project: { likeCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likeCount' } } }
    ]).then(result => (result.length > 0 ? result[0].total : 0));
    
    await thread.save();
  }

  // Trigger real-time update
  pusher.trigger(`thread-${post.thread._id}`, 'update-likes', {
    postId: post._id,
    likes: post.likes
  });

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
exports.searchPosts = asyncHandler(async (req, res, next) => {
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
    content: { $regex: query, $options: 'i' }
  };

  // Get total count
  const total = await Post.countDocuments(searchQuery);

  // Get posts
  const posts = await Post.find(searchQuery)
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

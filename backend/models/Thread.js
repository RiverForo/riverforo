// Thread model for RiverForo.com

const mongoose = require('mongoose');
const slugify = require('slugify');

const ThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: [10000, 'Content cannot be more than 10000 characters']
  },
  user: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    }
  },
  category: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true
    },
    name: {
      es: String,
      en: String
    },
    slug: {
      type: String,
      required: true
    }
  },
  tags: {
    type: [String],
    maxlength: [10, 'Cannot have more than 10 tags']
  },
  lastPost: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post'
    },
    user: {
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      username: String,
      avatar: String
    },
    createdAt: {
      type: Date
    }
  },
  viewCount: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isAnnouncement: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from title
ThreadSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Thread', ThreadSchema);

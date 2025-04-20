// Category model for RiverForo.com

const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
  name: {
    es: {
      type: String,
      required: [true, 'Please add a Spanish category name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    en: {
      type: String,
      required: [true, 'Please add an English category name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    }
  },
  description: {
    es: {
      type: String,
      required: [true, 'Please add a Spanish description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    en: {
      type: String,
      required: [true, 'Please add an English description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    }
  },
  slug: {
    type: String,
    unique: true
  },
  icon: {
    type: String,
    default: 'comments'
  },
  color: {
    type: String,
    default: '#FF0000' // River Plate red
  },
  order: {
    type: Number,
    default: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  allowedRoles: {
    type: [String],
    enum: ['user', 'moderator', 'admin'],
    default: ['user', 'moderator', 'admin']
  },
  parentCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  threadCount: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  lastThread: {
    threadId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Thread'
    },
    title: String,
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from Spanish name
CategorySchema.pre('save', function(next) {
  if (this.isModified('name.es')) {
    this.slug = slugify(this.name.es, { lower: true });
  }
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Category', CategorySchema);

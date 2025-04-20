// Notification model for RiverForo.com

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mention', 'like', 'reply', 'thread', 'follow', 'admin', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    username: String,
    avatar: String
  },
  reference: {
    model: {
      type: String,
      enum: ['Thread', 'Post', 'User', 'Category', null],
      default: null
    },
    id: {
      type: mongoose.Schema.ObjectId,
      default: null
    }
  },
  url: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);

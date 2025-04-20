// AdPlacement model for RiverForo.com

const mongoose = require('mongoose');

const AdPlacementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  location: {
    type: String,
    enum: ['header', 'sidebar-top', 'sidebar-bottom', 'between-threads', 'footer', 'custom'],
    required: [true, 'Please specify the ad location']
  },
  adCode: {
    type: String,
    required: [true, 'Please add the ad code']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  targetPages: {
    type: [String],
    default: ['all']
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
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

// Update the updatedAt field
AdPlacementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AdPlacement', AdPlacementSchema);

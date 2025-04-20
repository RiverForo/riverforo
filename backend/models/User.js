// User model for RiverForo.com

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot be more than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${this.username}&background=FF0000&color=FFFFFF`;
    }
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferredLanguage: {
    type: String,
    enum: ['es', 'en'],
    default: 'es'
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    mentions: {
      type: Boolean,
      default: true
    },
    threads: {
      type: Boolean,
      default: true
    }
  },
  socialAuth: {
    google: {
      id: String,
      email: String,
      name: String
    },
    facebook: {
      id: String,
      email: String,
      name: String
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  isVerified: {
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

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update the updatedAt field
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function() {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  return verificationToken;
};

// Update last active timestamp
UserSchema.methods.updateLastActive = async function() {
  this.lastActive = Date.now();
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);

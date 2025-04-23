// Authentication controller for RiverForo.com

const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, preferredLanguage } = req.body;

  const user = await User.create({
    username,
    email,
    password,
    preferredLanguage: preferredLanguage || 'es'
  });

  const verificationToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;

  const message = `You are receiving this email because you need to verify your email address. Please make a GET request to: \n\n ${verificationUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err);
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    email: req.body.email,
    bio: req.body.bio,
    location: req.body.location,
    preferredLanguage: req.body.preferredLanguage,
    notifications: req.body.notifications
  };

  Object.keys(fieldsToUpdate).forEach(key =>
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:verificationtoken
// @access  Public
const verifyEmail = asyncHandler(async (req, res, next) => {
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.verificationtoken)
    .digest('hex');

  const user = await User.findOne({ emailVerificationToken });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Social login/register
// @route   POST /api/auth/social/:provider
// @access  Public
const socialAuth = asyncHandler(async (req, res, next) => {
  const { provider } = req.params;
  const { id, email, name } = req.body;

  if (!['google', 'facebook'].includes(provider)) {
    return next(new ErrorResponse(`Provider ${provider} is not supported`, 400));
  }

  let user = await User.findOne({ [`socialAuth.${provider}.id`]: id });

  if (!user && email) {
    user = await User.findOne({ email });

    if (user) {
      user.socialAuth = {
        ...user.socialAuth,
        [provider]: { id, email, name }
      };
      await user.save();
    }
  }

  if (!user) {
    let username = name.toLowerCase().replace(/\s+/g, '');
    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      username = `${username}${Math.floor(Math.random() * 10000)}`;
    }

    user = await User.create({
      username,
      email,
      password: crypto.randomBytes(10).toString('hex'),
      socialAuth: {
        [provider]: { id, email, name }
      },
      emailVerified: true,
      isVerified: true
    });
  }

  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// Helper function
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token
  });
};

// Export all functions
module.exports = {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  socialAuth
};

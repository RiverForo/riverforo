// Routes for authentication
const express = require('express');
const {
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
} = require('../controllers/auth');

const router = express.Router();

// Protect middleware
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
console.log('Logout type:', typeof logout); // should log 'function'
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verify-email/:verificationtoken', verifyEmail);
router.post('/social/:provider', socialAuth);

module.exports = router;

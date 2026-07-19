const express = require('express');
const router = express.Router();
const {
  registerUser,
  adminCreateUser,
  verifyEmail,
  resendVerification,
  loginUser,
  getMe,
  logoutUser,
  updateProfile,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { registerValidator, loginValidator } = require('../validators/authValidator');

router.post('/register', registerValidator, validate, registerUser);
router.post('/admin/create-user', protect, authorize('Admin'), registerValidator, validate, adminCreateUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', loginValidator, validate, loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

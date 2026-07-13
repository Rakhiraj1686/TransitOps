const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  const user = await User.create({ name, email, password, role, phone });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toSafeObject(),
      token: generateToken(user._id, user.role),
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // 🔍 Debug Logs
  console.log("=================================");
  console.log("Login Request Body:", req.body);
  console.log("Email:", email);
  console.log("Password:", password);
  const user = await User.findOne({ email }).select('+password');

  console.log("User Found:", user ? "YES" : "NO");

  if (user) {
    console.log("DB Email:", user.email);
    console.log("DB Password (Hashed):", user.password);

    const isMatch = await user.matchPassword(password);

    console.log("Password Match:", isMatch);
    console.log("User Active:", user.isActive);
  }

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated. Contact an administrator.');
  }

  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toSafeObject(),
      token: generateToken(user._id, user.role),
    },
  });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toSafeObject() });
});

// @desc    Logout (client discards token; endpoint provided for completeness)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Update current user's profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  if (req.body.avatar) user.avatar = req.body.avatar;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json({ success: true, message: 'Profile updated', data: updated.toSafeObject() });
});

module.exports = { registerUser, loginUser, getMe, logoutUser, updateProfile };

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(User.find(), req.query).search(['name', 'email']).filter().sort().paginate();
  const [users, total] = await Promise.all([features.query, User.countDocuments()]);
  res.json({
    success: true,
    count: users.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: users,
  });
});

// @desc    Update a user's role or active status
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const { name, role, isActive, phone } = req.body;
  if (name) user.name = name;
  if (role) user.role = role;
  if (phone) user.phone = phone;
  if (typeof isActive === 'boolean') user.isActive = isActive;
  const updated = await user.save();
  res.json({ success: true, message: 'User updated successfully', data: updated.toSafeObject() });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
});

module.exports = { getUsers, updateUser, deleteUser };

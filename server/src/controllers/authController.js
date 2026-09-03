const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { ROLES } = require('../constants/roles');

// Frontend URL used to build the link inside verification emails.
// Set CLIENT_URL in your .env, e.g. CLIENT_URL=http://localhost:5173
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// @desc    Public self-registration
// @route   POST /api/auth/register
// @access  Public
//
// SECURITY NOTE: this endpoint is reachable by anyone on the internet, so it must
// never trust the client for privileged fields. Regardless of what the request body
// contains, every self-registered account is created as the lowest-privilege role.
// Elevated roles (Admin, Fleet Manager, etc.) can only be created through the
// separate admin-only `adminCreateUser` endpoint below.
//
// The first account is an Admin for bootstrap purposes. Later self-registered
// accounts remain restricted to the Driver role, but can sign in immediately.
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  const isFirstUser = (await User.estimatedDocumentCount()) === 0;

  // Bootstrap the very first account (Admin) as already verified and active so
  // there's always a way into the app on a fresh install. Every later
  // self-registration must go through the email verification flow below.
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: isFirstUser ? ROLES.ADMIN : ROLES.DRIVER,
    isActive: true,
    isEmailVerified: isFirstUser,
  });

  if (isFirstUser) {
    res.status(201).json({
      success: true,
      message: 'Admin account created. You can sign in now.',
      data: {
        user: user.toSafeObject(),
        token: generateToken(user._id, user.role),
      },
    });
    return;
  }

  const rawToken = user.generateEmailVerificationToken();
  await user.save();

  const verifyUrl = `${CLIENT_URL}/verify-email/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your email for TransitOps',
    html: `<p>Hi ${user.name},</p><p>Thanks for registering on TransitOps. Please verify your email address to activate your account:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours. If you didn't request this, you can ignore this email.</p>`,
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email and verify your account before logging in.',
    data: {
      user: user.toSafeObject(),
    },
  });
});

// @desc    Verify a user's email address via the token emailed to them
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    res.status(400);
    throw new Error('This verification link is invalid or has expired. Please request a new one.');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  // Only now let Admins know a (verified, real) person is waiting for approval —
  // this keeps admin inboxes free of notifications for addresses that were never
  // actually confirmed by their owner.
  User.find({ role: ROLES.ADMIN, isActive: true })
    .select('email')
    .then((admins) => {
      if (!admins.length) return;
      sendEmail({
        to: admins.map((a) => a.email).join(','),
        subject: 'New TransitOps registration awaiting approval',
        html: `<p>${user.name} (${user.email}) has verified their email and is waiting for approval.</p><p>Go to Settings &gt; User &amp; Role Management to review.</p>`,
      });
    });

  res.json({
    success: true,
    message: 'Email verified. An administrator must still approve your account before you can sign in.',
  });
});

// @desc    Resend the email verification link
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isEmailVerified: false });

  // Always return the same generic response whether or not the account exists /
  // is already verified — this avoids leaking which emails are registered.
  if (user) {
    const rawToken = user.generateEmailVerificationToken();
    await user.save();
    const verifyUrl = `${CLIENT_URL}/verify-email/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your email for TransitOps',
      html: `<p>Hi ${user.name},</p><p>Here's your new verification link:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
    });
  }

  res.json({
    success: true,
    message: 'If an unverified account exists for that email, a new verification link has been sent.',
  });
});

// @desc    Admin-only: create a user directly with any role, active immediately
// @route   POST /api/auth/admin/create-user
// @access  Private/Admin (see authorize('Admin') in authRoutes.js)
const adminCreateUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  const safeRole = Object.values(ROLES).includes(role) ? role : ROLES.DRIVER;

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: safeRole,
    isActive: true,
    isEmailVerified: true,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { user: user.toSafeObject() },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  console.log("User:", user);

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  console.log("Password Match: true");
  console.log("isEmailVerified:", user.isEmailVerified);
  console.log("isActive:", user.isActive);

  if (!user.isEmailVerified) {
    res.status(403);
    throw new Error("Please verify your email address before signing in.");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account is inactive.");
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: user.toSafeObject(),
      token,
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

module.exports = { registerUser, adminCreateUser, verifyEmail, resendVerification, loginUser, getMe, logoutUser, updateProfile };
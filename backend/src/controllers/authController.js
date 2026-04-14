import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus
      },
      token
    }
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  console.log('🔐 Login attempt for email:', email);

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  console.log('✅ User found:', user._id);

  // Check password
  try {
    const isMatch = await user.comparePassword(password);
    console.log('🔑 Password match result:', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('❌ Error comparing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during authentication. Please try again.'
    });
  }

  console.log('✅ Login successful for:', email);
  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus
      },
      token
    }
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.json({
    success: true,
    data: { user }
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (email) {
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    updates.email = email;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email (simulated)
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Set reset token and expiry
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  await user.save();

  // In a real app, you would send an email here.
  // For now, we'll return the token in the response (ONLY for development/simulation)
  // or just say an email was sent.
  console.log(`🔑 Reset token for ${email}: ${resetToken}`);

  res.json({
    success: true,
    message: 'Reset link sent to email',
    // In production, NEVER include the resetToken here.
    // We include it now to make testing easier since we don't have an email service.
    debugToken: resetToken
  });
});

/**
 * @route   POST /api/auth/reset-password/:resetToken
 * @desc    Reset password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});



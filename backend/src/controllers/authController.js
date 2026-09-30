const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { uploadImageBuffer } = require('../services/cloudinaryService');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, verificationStatus: user.verificationStatus },
    process.env.JWT_SECRET || 'wastesphere_hackathon_super_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Citizen Registration
 * POST /api/auth/register
 */
const registerCitizen = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return errorResponse(res, 400, 'All fields (name, email, password, phone) are required.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, 'User with this email already exists.');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'citizen',
      verificationStatus: 'none',
    });

    const token = generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 201, 'Citizen registered successfully.', {
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Registration
 * POST /api/auth/admin/register
 * Accepts government ID image via multipart upload or URL
 */
const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, governmentIdUrl } = req.body;

    if (!name || !email || !password || !phone) {
      return errorResponse(res, 400, 'All fields (name, email, password, phone) are required.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, 'User with this email already exists.');
    }

    let idImage = { url: governmentIdUrl || '', public_id: '' };

    // If image file uploaded directly via multipart
    if (req.file) {
      const uploadRes = await uploadImageBuffer(req.file.buffer, 'wastesphere/admin_ids');
      idImage = { url: uploadRes.url, public_id: uploadRes.public_id };
    }

    if (!idImage.url) {
      return errorResponse(
        res,
        400,
        'Government/Officer ID image is required for admin registration.'
      );
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'admin',
      verificationStatus: 'pending', // Pending verification by platform admin
      governmentIdImage: idImage,
    });

    const token = generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(
      res,
      201,
      'Admin account registered. Verification is pending approval.',
      {
        token,
        user: userObj,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * User Login (Citizen or Admin)
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const token = generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 200, 'Login successful.', {
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'User profile retrieved.', {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCitizen,
  registerAdmin,
  login,
  getMe,
};

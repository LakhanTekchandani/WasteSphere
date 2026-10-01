const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Verify JWT token and attach user to req.user
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'wastesphere_hackathon_super_secret_key_2026');

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid token. User not found.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired. Please log in again.');
    }
    return errorResponse(res, 401, 'Invalid token authorization.');
  }
};

/**
 * Optional JWT verification: attaches user if valid token provided, but does not block guests
 */
const optionalAuthenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'wastesphere_hackathon_super_secret_key_2026');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore invalid token for optional auth
  }
  next();
};

/**
 * Require specific role (e.g. 'admin' or 'citizen')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return errorResponse(res, 403, `Forbidden. ${role.toUpperCase()} role required.`);
    }
    next();
  };
};

/**
 * Require approved admin verification status
 * Admin accounts remain pending until approved by verification flow
 */
const requireApprovedAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 403, 'Forbidden. Admin account required.');
  }

  if (req.user.verificationStatus !== 'approved') {
    return errorResponse(
      res,
      403,
      `Forbidden. Your admin account status is currently '${req.user.verificationStatus}'. Approved verification status is required to access the Admin Dashboard.`
    );
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuthenticateToken,
  requireRole,
  requireApprovedAdmin,
};

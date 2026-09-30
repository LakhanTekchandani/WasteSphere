const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('[EXPRESS ERROR HANDLER]:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 400, 'Validation Error', errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 400, `Duplicate entry. ${field} already exists.`);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 400, 'File size too large. Maximum size is 10MB.');
  }

  return errorResponse(
    res,
    err.statusCode || 500,
    err.message || 'Internal Server Error'
  );
};

module.exports = errorHandler;

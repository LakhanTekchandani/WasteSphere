const WasteReport = require('../models/WasteReport');
const { calculateRecognition } = require('../services/recognitionService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get citizen's complaint-based recognition state & progress
 * GET /api/recognition/my-recognition
 */
const getMyRecognition = async (req, res, next) => {
  try {
    // Count qualifying complaints (any submitted report except status === 'Rejected')
    const qualifyingCount = await WasteReport.countDocuments({
      user: req.user._id,
      status: { $ne: 'Rejected' },
    });

    const recognitionData = calculateRecognition(qualifyingCount);

    return successResponse(res, 200, 'Recognition state retrieved.', {
      recognition: recognitionData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyRecognition,
};

const PointTransaction = require('../models/PointTransaction');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get citizen point history & total accumulated points
 * GET /api/points/my-points
 */
const getMyPoints = async (req, res, next) => {
  try {
    const transactions = await PointTransaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const totalPoints = transactions.reduce((acc, curr) => acc + curr.points, 0);

    return successResponse(res, 200, 'Point summary retrieved.', {
      totalPoints,
      history: transactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPoints,
};

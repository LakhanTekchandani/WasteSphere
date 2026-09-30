const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * List pending admin verification requests
 * GET /api/admin/verifications
 */
const getPendingVerifications = async (req, res, next) => {
  try {
    const pendingAdmins = await User.find({
      role: 'admin',
      verificationStatus: 'pending',
    }).select('-password');

    return successResponse(res, 200, 'Pending admin verifications retrieved.', {
      pendingVerifications: pendingAdmins,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve or Reject Admin Verification
 * PATCH /api/admin/verifications/:id/status
 */
const updateVerificationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return errorResponse(res, 400, "Status must be 'approved' or 'rejected'.");
    }

    const adminCandidate = await User.findOne({ _id: id, role: 'admin' });
    if (!adminCandidate) {
      return errorResponse(res, 404, 'Admin registration record not found.');
    }

    adminCandidate.verificationStatus = status;
    adminCandidate.verifiedBy = req.user._id;
    adminCandidate.verifiedAt = new Date();

    await adminCandidate.save();

    const updatedObj = adminCandidate.toObject();
    delete updatedObj.password;

    return successResponse(
      res,
      200,
      `Admin verification status updated to '${status}'.`,
      { admin: updatedObj }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingVerifications,
  updateVerificationStatus,
};

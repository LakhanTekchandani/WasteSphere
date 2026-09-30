const Certificate = require('../models/Certificate');
const QuizAttempt = require('../models/QuizAttempt');
const WasteReport = require('../models/WasteReport');
const PointTransaction = require('../models/PointTransaction');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendSMS } = require('../services/smsService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Configurable threshold constants for certificate eligibility
const ELIGIBILITY_RULES = {
  MIN_QUIZZES_PASSED: 1,
  MIN_QUALIFYING_COMPLAINTS: 1,
  MIN_TOTAL_POINTS: 10,
};

/**
 * Check citizen's certificate eligibility
 * GET /api/certificates/eligibility
 */
const checkEligibility = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if certificate has already been issued
    const existingCertificate = await Certificate.findOne({ user: userId });

    // Count passed quizzes
    const passedQuizzesCount = await QuizAttempt.countDocuments({
      user: userId,
      passed: true,
    });

    // Count qualifying complaints
    const qualifyingComplaintsCount = await WasteReport.countDocuments({
      user: userId,
      status: { $ne: 'Rejected' },
    });

    // Calculate total points
    const pointDocs = await PointTransaction.find({ user: userId });
    const totalPoints = pointDocs.reduce((sum, p) => sum + p.points, 0);

    const missingCriteria = [];
    if (passedQuizzesCount < ELIGIBILITY_RULES.MIN_QUIZZES_PASSED) {
      missingCriteria.push(`Pass at least ${ELIGIBILITY_RULES.MIN_QUIZZES_PASSED} awareness quiz`);
    }
    if (qualifyingComplaintsCount < ELIGIBILITY_RULES.MIN_QUALIFYING_COMPLAINTS) {
      missingCriteria.push(`Submit at least ${ELIGIBILITY_RULES.MIN_QUALIFYING_COMPLAINTS} valid waste report`);
    }
    if (totalPoints < ELIGIBILITY_RULES.MIN_TOTAL_POINTS) {
      missingCriteria.push(`Earn at least ${ELIGIBILITY_RULES.MIN_TOTAL_POINTS} activity points`);
    }

    const isEligible = missingCriteria.length === 0;

    return successResponse(res, 200, 'Certificate eligibility evaluated.', {
      isEligible,
      alreadyIssued: !!existingCertificate,
      existingCertificate,
      criteria: {
        quizzesPassed: passedQuizzesCount,
        minQuizzesRequired: ELIGIBILITY_RULES.MIN_QUIZZES_PASSED,
        qualifyingComplaints: qualifyingComplaintsCount,
        minComplaintsRequired: ELIGIBILITY_RULES.MIN_QUALIFYING_COMPLAINTS,
        totalPoints,
        minPointsRequired: ELIGIBILITY_RULES.MIN_TOTAL_POINTS,
      },
      missingCriteria,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get citizen's issued certificates
 * GET /api/certificates/my-certificates
 */
const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('issuedBy', 'name role')
      .sort({ issueDate: -1 });

    return successResponse(res, 200, 'Issued certificates retrieved.', { certificates });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: List eligible users awaiting certificate issuance
 * GET /api/certificates/admin/pending-eligibility
 */
const getPendingEligibleUsersAdmin = async (req, res, next) => {
  try {
    const citizens = await User.find({ role: 'citizen' }).select('-password');
    const eligibleList = [];

    for (const citizen of citizens) {
      const alreadyHasCert = await Certificate.findOne({ user: citizen._id });
      if (alreadyHasCert) continue;

      const passedQuizzes = await QuizAttempt.countDocuments({
        user: citizen._id,
        passed: true,
      });

      const qualifyingComplaints = await WasteReport.countDocuments({
        user: citizen._id,
        status: { $ne: 'Rejected' },
      });

      const points = await PointTransaction.find({ user: citizen._id });
      const totalPoints = points.reduce((sum, p) => sum + p.points, 0);

      const isEligible =
        passedQuizzes >= ELIGIBILITY_RULES.MIN_QUIZZES_PASSED &&
        qualifyingComplaints >= ELIGIBILITY_RULES.MIN_QUALIFYING_COMPLAINTS &&
        totalPoints >= ELIGIBILITY_RULES.MIN_TOTAL_POINTS;

      if (isEligible) {
        eligibleList.push({
          user: citizen,
          stats: {
            quizzesPassed: passedQuizzes,
            qualifyingComplaints,
            totalPoints,
          },
        });
      }
    }

    return successResponse(res, 200, 'Eligible users pending certificate issuance retrieved.', {
      eligibleUsers: eligibleList,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Approve & Issue Certificate to User
 * POST /api/certificates/admin/issue/:userId
 */
const issueCertificateAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { title } = req.body;

    const citizen = await User.findById(userId);
    if (!citizen || citizen.role !== 'citizen') {
      return errorResponse(res, 404, 'Citizen user not found.');
    }

    const existingCert = await Certificate.findOne({ user: userId });
    if (existingCert) {
      return errorResponse(res, 400, 'Certificate has already been issued to this citizen.');
    }

    // Double-check eligibility snapshot
    const passedQuizzes = await QuizAttempt.countDocuments({ user: userId, passed: true });
    const qualifyingComplaints = await WasteReport.countDocuments({
      user: userId,
      status: { $ne: 'Rejected' },
    });
    const points = await PointTransaction.find({ user: userId });
    const totalPoints = points.reduce((sum, p) => sum + p.points, 0);

    // Generate unique Certificate ID
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const certId = `CERT-${new Date().getFullYear()}-${randomHex}`;

    const certificate = await Certificate.create({
      user: userId,
      certificateTitle: title || 'Environmental Awareness & Active Citizen Certificate',
      certificateId: certId,
      issuedBy: req.user._id,
      criteriaSnapshot: {
        quizzesPassed: passedQuizzes,
        qualifyingComplaints,
        totalPoints,
      },
    });

    const notificationMsg = `Congratulations ${citizen.name}! An official Environmental Awareness Certificate (#${certId}) has been issued to your profile.`;
    const notification = await Notification.create({
      user: userId,
      title: 'Certificate Issued!',
      message: notificationMsg,
      type: 'CERTIFICATE_ISSUED',
      relatedEntityId: certificate._id,
    });

    if (citizen.phone) {
      const smsRes = await sendSMS(citizen.phone, notificationMsg);
      if (smsRes.success) {
        notification.smsSent = true;
        notification.smsLog = `Sent via ${smsRes.provider}`;
        await notification.save();
      }
    }

    return successResponse(res, 201, 'Certificate issued successfully.', { certificate });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkEligibility,
  getMyCertificates,
  getPendingEligibleUsersAdmin,
  issueCertificateAdmin,
};

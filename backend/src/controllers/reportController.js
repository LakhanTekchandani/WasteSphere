const WasteReport = require('../models/WasteReport');
const Notification = require('../models/Notification');
const { sendSMS } = require('../services/smsService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { uploadImageBuffer } = require('../services/cloudinaryService');

/**
 * Submit Waste Report (Final User Confirmed Values)
 * POST /api/reports
 */
const createReport = async (req, res, next) => {
  try {
    let {
      wastePhotoUrl,
      publicId,
      wasteType,
      issueType,
      description,
      latitude,
      longitude,
      address,
      landmark,
      severity,
    } = req.body;

    // Handle file upload if sent directly in request
    if (req.file) {
      const uploadRes = await uploadImageBuffer(req.file.buffer, 'wastesphere/reports');
      wastePhotoUrl = uploadRes.url;
      publicId = uploadRes.public_id;
    }

    if (!wastePhotoUrl) {
      return errorResponse(res, 400, 'Waste photo is required.');
    }

    if (!wasteType || !issueType || !severity) {
      return errorResponse(res, 400, 'Waste type, issue type, and severity are required.');
    }

    if (latitude === undefined || longitude === undefined || !address) {
      return errorResponse(
        res,
        400,
        'Location details (latitude, longitude, address) are required.'
      );
    }

    const report = await WasteReport.create({
      user: req.user._id,
      wastePhoto: {
        url: wastePhotoUrl,
        public_id: publicId || '',
      },
      wasteType,
      issueType,
      description: description || '',
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        address,
      },
      landmark: landmark || '',
      severity,
      status: 'Pending',
    });

    // Create in-app notification
    const notificationMsg = `Your waste report #${report._id.toString().substring(18)} for ${issueType} has been submitted successfully.`;
    const notification = await Notification.create({
      user: req.user._id,
      title: 'Report Submitted',
      message: notificationMsg,
      type: 'COMPLAINT_UPDATE',
      relatedEntityId: report._id,
    });

    // Trigger SMS notification
    if (req.user.phone) {
      const smsRes = await sendSMS(req.user.phone, notificationMsg);
      if (smsRes.success) {
        notification.smsSent = true;
        notification.smsLog = `Sent via ${smsRes.provider}`;
        await notification.save();
      }
    }

    return successResponse(res, 201, 'Waste report created successfully.', {
      report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get citizen's own complaints
 * GET /api/reports/my-reports
 */
const getMyReports = async (req, res, next) => {
  try {
    const reports = await WasteReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'My reports retrieved successfully.', { reports });
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaint detail by ID
 * GET /api/reports/:id
 */
const getReportById = async (req, res, next) => {
  try {
    const report = await WasteReport.findById(req.params.id).populate('user', 'name email phone');
    if (!report) {
      return errorResponse(res, 404, 'Waste report not found.');
    }

    // Access control: Only owner or approved admin can view details
    if (req.user.role !== 'admin' && report.user._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Forbidden. You cannot view another user report.');
    }

    return successResponse(res, 200, 'Report details retrieved.', { report });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: List all complaints with filters
 * GET /api/reports/admin/all
 */
const getAllReportsAdmin = async (req, res, next) => {
  try {
    const { status, wasteType, issueType, severity } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (wasteType) filter.wasteType = wasteType;
    if (issueType) filter.issueType = issueType;
    if (severity) filter.severity = severity;

    const reports = await WasteReport.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'All waste reports retrieved for admin.', { reports });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Update complaint status & resolution details
 * PATCH /api/reports/:id/status
 */
const updateReportStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolutionDetails } = req.body;

    const validStatuses = ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return errorResponse(
        res,
        400,
        `Invalid status. Allowed statuses: ${validStatuses.join(', ')}`
      );
    }

    const report = await WasteReport.findById(id).populate('user', 'name phone email');
    if (!report) {
      return errorResponse(res, 404, 'Waste report not found.');
    }

    const previousStatus = report.status;
    report.status = status;
    if (resolutionDetails !== undefined) {
      report.resolutionDetails = resolutionDetails;
    }

    await report.save();

    // Trigger SMS and Notification on important status changes
    if (previousStatus !== status && report.user) {
      const notificationMsg = `Waste Report #${report._id.toString().substring(18)} status updated to '${status}'. ${
        resolutionDetails ? 'Note: ' + resolutionDetails : ''
      }`;

      const notification = await Notification.create({
        user: report.user._id,
        title: `Report Status: ${status}`,
        message: notificationMsg,
        type: 'COMPLAINT_UPDATE',
        relatedEntityId: report._id,
      });

      if (report.user.phone) {
        const smsRes = await sendSMS(report.user.phone, notificationMsg);
        if (smsRes.success) {
          notification.smsSent = true;
          notification.smsLog = `Sent via ${smsRes.provider}`;
          await notification.save();
        }
      }
    }

    return successResponse(res, 200, `Report status updated to '${status}'.`, { report });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Assign resolution handler
 * PATCH /api/reports/:id/assign
 */
const assignReportAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return errorResponse(res, 400, 'Assigned officer/team name is required.');
    }

    const report = await WasteReport.findById(id);
    if (!report) {
      return errorResponse(res, 404, 'Waste report not found.');
    }

    report.assignedTo = assignedTo;
    if (report.status === 'Pending' || report.status === 'Under Review') {
      report.status = 'Assigned';
    }

    await report.save();

    return successResponse(res, 200, `Report assigned to '${assignedTo}'.`, { report });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getMyReports,
  getReportById,
  getAllReportsAdmin,
  updateReportStatusAdmin,
  assignReportAdmin,
};

const PickupRequest = require('../models/PickupRequest');
const Notification = require('../models/Notification');
const { sendSMS } = require('../services/smsService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Submit Waste Pickup Request
 * POST /api/pickups
 */
const createPickup = async (req, res, next) => {
  try {
    const {
      wasteType,
      latitude,
      longitude,
      address,
      preferredDate,
      preferredTime,
      additionalDetails,
    } = req.body;

    if (!wasteType || !address || !preferredDate || !preferredTime) {
      return errorResponse(
        res,
        400,
        'Waste type, pickup address, preferred date, and preferred time are required.'
      );
    }

    if (latitude === undefined || longitude === undefined) {
      return errorResponse(res, 400, 'Pickup latitude and longitude coordinates are required.');
    }

    const pickup = await PickupRequest.create({
      user: req.user._id,
      wasteType,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      address,
      preferredDate: new Date(preferredDate),
      preferredTime,
      additionalDetails: additionalDetails || '',
      status: 'Pending',
    });

    const notificationMsg = `Waste pickup request #${pickup._id.toString().substring(18)} for ${wasteType} received. Status: Pending.`;
    const notification = await Notification.create({
      user: req.user._id,
      title: 'Pickup Request Received',
      message: notificationMsg,
      type: 'PICKUP_UPDATE',
      relatedEntityId: pickup._id,
    });

    if (req.user.phone) {
      const smsRes = await sendSMS(req.user.phone, notificationMsg);
      if (smsRes.success) {
        notification.smsSent = true;
        notification.smsLog = `Sent via ${smsRes.provider}`;
        await notification.save();
      }
    }

    return successResponse(res, 201, 'Waste pickup request submitted successfully.', { pickup });
  } catch (error) {
    next(error);
  }
};

/**
 * Get citizen's own pickup requests
 * GET /api/pickups/my-pickups
 */
const getMyPickups = async (req, res, next) => {
  try {
    const pickups = await PickupRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'My pickup requests retrieved.', { pickups });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pickup request detail
 * GET /api/pickups/:id
 */
const getPickupById = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id).populate('user', 'name email phone');
    if (!pickup) {
      return errorResponse(res, 404, 'Pickup request not found.');
    }

    if (req.user.role !== 'admin' && pickup.user._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Forbidden. You cannot view another user pickup request.');
    }

    return successResponse(res, 200, 'Pickup request details retrieved.', { pickup });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: List all pickup requests
 * GET /api/pickups/admin/all
 */
const getAllPickupsAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const pickups = await PickupRequest.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'All pickup requests retrieved for admin.', { pickups });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Update pickup request status
 * PATCH /api/pickups/:id/status
 */
const updatePickupStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Accepted', 'Scheduled', 'Collected'];
    if (!validStatuses.includes(status)) {
      return errorResponse(
        res,
        400,
        `Invalid status. Allowed statuses: ${validStatuses.join(', ')}`
      );
    }

    const pickup = await PickupRequest.findById(id).populate('user', 'name phone email');
    if (!pickup) {
      return errorResponse(res, 404, 'Pickup request not found.');
    }

    const previousStatus = pickup.status;
    pickup.status = status;
    await pickup.save();

    if (previousStatus !== status && pickup.user) {
      const notificationMsg = `Waste Pickup Request #${pickup._id.toString().substring(18)} status updated to '${status}'.`;

      const notification = await Notification.create({
        user: pickup.user._id,
        title: `Pickup Status: ${status}`,
        message: notificationMsg,
        type: 'PICKUP_UPDATE',
        relatedEntityId: pickup._id,
      });

      if (pickup.user.phone) {
        const smsRes = await sendSMS(pickup.user.phone, notificationMsg);
        if (smsRes.success) {
          notification.smsSent = true;
          notification.smsLog = `Sent via ${smsRes.provider}`;
          await notification.save();
        }
      }
    }

    return successResponse(res, 200, `Pickup status updated to '${status}'.`, { pickup });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPickup,
  getMyPickups,
  getPickupById,
  getAllPickupsAdmin,
  updatePickupStatusAdmin,
};

const WasteReport = require('../models/WasteReport');
const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const { calculateRecognition } = require('../services/recognitionService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Approved Admin Dashboard Overview Metrics
 * GET /api/analytics/dashboard-metrics
 */
const getDashboardMetrics = async (req, res, next) => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      underReviewComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      totalPickups,
      pendingPickups,
      scheduledPickups,
      collectedPickups,
      totalCertificates,
      totalUsers,
    ] = await Promise.all([
      WasteReport.countDocuments(),
      WasteReport.countDocuments({ status: 'Pending' }),
      WasteReport.countDocuments({ status: 'Under Review' }),
      WasteReport.countDocuments({ status: 'In Progress' }),
      WasteReport.countDocuments({ status: 'Resolved' }),
      WasteReport.countDocuments({ status: 'Rejected' }),
      PickupRequest.countDocuments(),
      PickupRequest.countDocuments({ status: 'Pending' }),
      PickupRequest.countDocuments({ status: 'Scheduled' }),
      PickupRequest.countDocuments({ status: 'Collected' }),
      Certificate.countDocuments(),
      User.countDocuments({ role: 'citizen' }),
    ]);

    // Calculate recognition breakdown across all citizens
    const citizens = await User.find({ role: 'citizen' }).select('_id');
    const recognitionCounts = { None: 0, Bronze: 0, Silver: 0, Gold: 0 };

    for (const citizen of citizens) {
      const qualifying = await WasteReport.countDocuments({
        user: citizen._id,
        status: { $ne: 'Rejected' },
      });
      const rec = calculateRecognition(qualifying);
      recognitionCounts[rec.medal] = (recognitionCounts[rec.medal] || 0) + 1;
    }

    return successResponse(res, 200, 'Dashboard metrics retrieved.', {
      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        underReview: underReviewComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        rejected: rejectedComplaints,
      },
      pickups: {
        total: totalPickups,
        pending: pendingPickups,
        scheduled: scheduledPickups,
        collected: collectedPickups,
      },
      recognition: recognitionCounts,
      certificatesIssued: totalCertificates,
      totalCitizens: totalUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Waste Hotspots Data
 * GET /api/analytics/waste-hotspots
 * Aggregates complaints by address/location clusters
 */
const getWasteHotspots = async (req, res, next) => {
  try {
    const hotspots = await WasteReport.aggregate([
      {
        $group: {
          _id: '$location.address',
          reportCount: { $sum: 1 },
          latitude: { $first: '$location.latitude' },
          longitude: { $first: '$location.longitude' },
          wasteTypes: { $push: '$wasteType' },
          severities: { $push: '$severity' },
          statuses: { $push: '$status' },
        },
      },
      { $sort: { reportCount: -1 } },
      { $limit: 20 },
    ]);

    // Format output with dominant waste type and severity counts
    const formattedHotspots = hotspots.map((spot) => {
      // Find most frequent waste type
      const typeMap = {};
      spot.wasteTypes.forEach((t) => (typeMap[t] = (typeMap[t] || 0) + 1));
      const dominantWasteType = Object.keys(typeMap).reduce((a, b) =>
        typeMap[a] > typeMap[b] ? a : b
      );

      const highSeverityCount = spot.severities.filter((s) => s === 'High').length;

      return {
        address: spot._id,
        latitude: spot.latitude,
        longitude: spot.longitude,
        reportCount: spot.reportCount,
        dominantWasteType,
        highSeverityCount,
        intensity:
          spot.reportCount >= 5 ? 'Critical' : spot.reportCount >= 3 ? 'High' : 'Moderate',
      };
    });

    return successResponse(res, 200, 'Waste hotspots data retrieved.', {
      hotspots: formattedHotspots,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics,
  getWasteHotspots,
};

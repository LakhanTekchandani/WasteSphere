const express = require('express');
const router = express.Router();
const {
  getDashboardMetrics,
  getWasteHotspots,
} = require('../controllers/analyticsController');
const { authenticateToken, requireApprovedAdmin } = require('../middleware/authMiddleware');

router.use(authenticateToken, requireApprovedAdmin);

router.get('/dashboard-metrics', getDashboardMetrics);
router.get('/waste-hotspots', getWasteHotspots);

module.exports = router;

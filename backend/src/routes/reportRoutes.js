const express = require('express');
const router = express.Router();
const {
  createReport,
  getMyReports,
  getReportById,
  getAllReportsAdmin,
  updateReportStatusAdmin,
  assignReportAdmin,
} = require('../controllers/reportController');
const { authenticateToken, requireApprovedAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authenticateToken);

// Citizen & Admin access
router.post('/', upload.single('wastePhoto'), createReport);
router.get('/my-reports', getMyReports);
router.get('/:id', getReportById);

// Admin-only endpoints
router.get('/admin/all', requireApprovedAdmin, getAllReportsAdmin);
router.patch('/:id/status', requireApprovedAdmin, updateReportStatusAdmin);
router.patch('/:id/assign', requireApprovedAdmin, assignReportAdmin);

module.exports = router;

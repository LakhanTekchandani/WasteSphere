const express = require('express');
const router = express.Router();
const {
  getPendingVerifications,
  updateVerificationStatus,
} = require('../controllers/adminVerificationController');
const { authenticateToken, requireApprovedAdmin } = require('../middleware/authMiddleware');

// All verification management endpoints require an approved admin
router.use(authenticateToken, requireApprovedAdmin);

router.get('/', getPendingVerifications);
router.patch('/:id/status', updateVerificationStatus);

module.exports = router;

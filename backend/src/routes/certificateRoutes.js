const express = require('express');
const router = express.Router();
const {
  checkEligibility,
  getMyCertificates,
  getPendingEligibleUsersAdmin,
  issueCertificateAdmin,
} = require('../controllers/certificateController');
const { authenticateToken, requireApprovedAdmin } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Citizen endpoints
router.get('/eligibility', checkEligibility);
router.get('/my-certificates', getMyCertificates);

// Approved Admin endpoints
router.get('/admin/pending-eligibility', requireApprovedAdmin, getPendingEligibleUsersAdmin);
router.post('/admin/issue/:userId', requireApprovedAdmin, issueCertificateAdmin);

module.exports = router;

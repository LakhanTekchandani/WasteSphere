const express = require('express');
const router = express.Router();
const {
  createPickup,
  getMyPickups,
  getPickupById,
  getAllPickupsAdmin,
  updatePickupStatusAdmin,
} = require('../controllers/pickupController');
const { authenticateToken, requireApprovedAdmin } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Citizen endpoints
router.post('/', createPickup);
router.get('/my-pickups', getMyPickups);
router.get('/:id', getPickupById);

// Admin-only endpoints
router.get('/admin/all', requireApprovedAdmin, getAllPickupsAdmin);
router.patch('/:id/status', requireApprovedAdmin, updatePickupStatusAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAwarenessContent,
  getAwarenessById,
  createAwarenessAdmin,
  updateAwarenessAdmin,
  deleteAwarenessAdmin,
} = require('../controllers/awarenessController');
const { authenticateToken, requireApprovedAdmin } = require('../middleware/authMiddleware');

// Public or Citizen viewing
router.get('/', getAwarenessContent);
router.get('/:id', getAwarenessById);

// Approved Admin CRUD
router.post('/', authenticateToken, requireApprovedAdmin, createAwarenessAdmin);
router.put('/:id', authenticateToken, requireApprovedAdmin, updateAwarenessAdmin);
router.delete('/:id', authenticateToken, requireApprovedAdmin, deleteAwarenessAdmin);

module.exports = router;

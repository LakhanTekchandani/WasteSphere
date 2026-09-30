const express = require('express');
const router = express.Router();
const { getMyPoints } = require('../controllers/pointsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/my-points', authenticateToken, getMyPoints);

module.exports = router;

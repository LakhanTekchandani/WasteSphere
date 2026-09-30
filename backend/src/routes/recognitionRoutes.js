const express = require('express');
const router = express.Router();
const { getMyRecognition } = require('../controllers/recognitionController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/my-recognition', authenticateToken, getMyRecognition);

module.exports = router;

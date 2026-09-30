const express = require('express');
const router = express.Router();
const { analyzeWasteImage } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/waste-recognition', authenticateToken, upload.single('wastePhoto'), analyzeWasteImage);

module.exports = router;

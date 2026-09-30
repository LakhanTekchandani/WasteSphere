const express = require('express');
const router = express.Router();
const { registerCitizen, registerAdmin, login, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerCitizen);
router.post('/admin/register', upload.single('governmentIdImage'), registerAdmin);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

module.exports = router;

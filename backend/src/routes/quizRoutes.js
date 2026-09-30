const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getMyAttempts,
  createQuizAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
} = require('../controllers/quizController');
const { authenticateToken, requireApprovedAdmin } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Citizen endpoints
router.get('/', getQuizzes);
router.get('/my-attempts', getMyAttempts);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuizAttempt);

// Approved Admin endpoints
router.post('/', requireApprovedAdmin, createQuizAdmin);
router.put('/:id', requireApprovedAdmin, updateQuizAdmin);
router.delete('/:id', requireApprovedAdmin, deleteQuizAdmin);

module.exports = router;

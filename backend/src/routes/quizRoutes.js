const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  startAiQuiz,
  answerQuizQuestion,
  submitQuizAttempt,
  getMyAttempts,
  createQuizAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
} = require('../controllers/quizController');
const {
  authenticateToken,
  optionalAuthenticateToken,
  requireApprovedAdmin,
} = require('../middleware/authMiddleware');

// Citizen endpoints (supports optional authentication for guest users & logged-in citizens)
router.get('/', optionalAuthenticateToken, getQuizzes);
router.post('/start', optionalAuthenticateToken, startAiQuiz);
router.post('/:id/start', optionalAuthenticateToken, startAiQuiz);
router.post('/answer', optionalAuthenticateToken, answerQuizQuestion);
router.post('/:id/answer', optionalAuthenticateToken, answerQuizQuestion);
router.post('/submit', optionalAuthenticateToken, submitQuizAttempt);
router.post('/:id/submit', optionalAuthenticateToken, submitQuizAttempt);

// Authenticated citizen endpoint
router.get('/my-attempts', authenticateToken, getMyAttempts);
router.get('/:id', optionalAuthenticateToken, getQuizById);

// Approved Admin endpoints
router.post('/', authenticateToken, requireApprovedAdmin, createQuizAdmin);
router.put('/:id', authenticateToken, requireApprovedAdmin, updateQuizAdmin);
router.delete('/:id', authenticateToken, requireApprovedAdmin, deleteQuizAdmin);

module.exports = router;

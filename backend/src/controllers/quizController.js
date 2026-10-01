const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const PointTransaction = require('../models/PointTransaction');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const groqQuizService = require('../services/groqQuizService');

// In-memory active quiz attempt store
const activeQuizAttempts = new Map();

// Periodic cleanup of stale attempts older than 2 hours
setInterval(() => {
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  for (const [key, attempt] of activeQuizAttempts.entries()) {
    if (attempt.startedAt < twoHoursAgo) {
      activeQuizAttempts.delete(key);
    }
  }
}, 30 * 60 * 1000);

const DEFAULT_QUIZZES = [
  {
    id: 'qz_101',
    title: 'Waste Segregation Masterclass',
    description: 'Master the fundamentals of Wet vs Dry waste segregation and learn proper disposal practices.',
    category: 'Wet / Organic Waste',
    points: 100,
    questions: []
  },
  {
    id: 'qz_102',
    title: 'Plastic Recycling & Circular Economy',
    description: 'Test your understanding of single-use plastics, microplastics, and high-density polyethylene (HDPE).',
    category: 'Dry / Recyclable Waste',
    points: 120,
    questions: []
  },
  {
    id: 'qz_103',
    title: 'E-Waste & Electronics Safety',
    description: 'Learn safe recycling procedures for discarded electronics, batteries, and circuit components.',
    category: 'E-Waste & Electronics',
    points: 150,
    questions: []
  },
  {
    id: 'qz_104',
    title: 'Hazardous Waste Procedures',
    description: 'Understand safe handling for chemical cleaners, medical packaging, paint cans, and fluorescent tubes.',
    category: 'Hazardous Waste',
    points: 150,
    questions: []
  }
];

/**
 * List active quizzes
 * GET /api/quizzes
 */
const getQuizzes = async (req, res, next) => {
  try {
    let dbQuizzes = await Quiz.find({ isActive: true }).sort({ createdAt: -1 });

    if (!dbQuizzes || dbQuizzes.length === 0) {
      return successResponse(res, 200, 'Active quizzes retrieved.', { quizzes: DEFAULT_QUIZZES });
    }

    const quizzesWithCounts = await Promise.all(
      dbQuizzes.map(async (quiz) => {
        const questionCount = await QuizQuestion.countDocuments({ quiz: quiz._id });
        return {
          id: quiz._id.toString(),
          ...quiz.toObject(),
          questionCount: questionCount || 3,
          questions: [] // Questions are generated on demand via AI when quiz starts
        };
      })
    );

    return successResponse(res, 200, 'Active quizzes retrieved.', { quizzes: quizzesWithCounts });
  } catch (error) {
    return successResponse(res, 200, 'Active quizzes retrieved.', { quizzes: DEFAULT_QUIZZES });
  }
};

/**
 * Get quiz details by ID
 * GET /api/quizzes/:id
 */
const getQuizById = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    let targetQuiz = DEFAULT_QUIZZES.find(q => q.id === quizId);

    if (!targetQuiz) {
      const dbQuiz = await Quiz.findById(quizId);
      if (dbQuiz) {
        targetQuiz = {
          id: dbQuiz._id.toString(),
          title: dbQuiz.title,
          description: dbQuiz.description,
          category: dbQuiz.category,
          points: 100,
          questions: []
        };
      }
    }

    if (!targetQuiz) {
      targetQuiz = DEFAULT_QUIZZES[0];
    }

    return successResponse(res, 200, 'Quiz details retrieved.', { quiz: targetQuiz, questions: [] });
  } catch (error) {
    next(error);
  }
};

/**
 * Start AI Quiz Attempt
 * POST /api/quizzes/:id/start or POST /api/quizzes/start
 */
const startAiQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id || req.body.quizId || 'qz_101';
    let targetQuiz = DEFAULT_QUIZZES.find(q => q.id === quizId);

    if (!targetQuiz) {
      try {
        const dbQuiz = await Quiz.findById(quizId);
        if (dbQuiz) {
          targetQuiz = {
            id: dbQuiz._id.toString(),
            title: dbQuiz.title,
            description: dbQuiz.description,
            category: dbQuiz.category,
            points: 100
          };
        }
      } catch (e) {
        // Fallback to default
      }
    }

    if (!targetQuiz) {
      targetQuiz = DEFAULT_QUIZZES[0];
    }

    // Call Groq to generate structured questions for this category
    const generatedQuestions = await groqQuizService.generateQuizQuestions(targetQuiz.category, 3);

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Store authoritative attempt on backend
    activeQuizAttempts.set(attemptId, {
      attemptId,
      quizId: targetQuiz.id,
      category: targetQuiz.category,
      title: targetQuiz.title,
      points: targetQuiz.points || 100,
      questions: generatedQuestions, // Stores correctAnswer & explanation securely
      answers: {},
      startedAt: Date.now()
    });

    // Sanitize questions for client response (HIDE correctAnswer & explanation to prevent cheating)
    const sanitizedQuestions = generatedQuestions.map(q => ({
      id: q.id,
      type: q.type || 'MCQ',
      question: q.question,
      imageUrl: q.imageUrl || '',
      options: q.options,
      hint: q.hint || ''
    }));

    return successResponse(res, 200, 'AI Quiz attempt started.', {
      attemptId,
      quizId: targetQuiz.id,
      title: targetQuiz.title,
      category: targetQuiz.category,
      points: targetQuiz.points || 100,
      questions: sanitizedQuestions
    });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to start AI quiz attempt. Please try again.');
  }
};

/**
 * Validate single question answer
 * POST /api/quizzes/:id/answer or POST /api/quizzes/answer
 */
const answerQuizQuestion = async (req, res, next) => {
  try {
    const { attemptId, questionId, selectedAnswer } = req.body;

    if (!attemptId || !questionId || !selectedAnswer) {
      return errorResponse(res, 400, 'attemptId, questionId, and selectedAnswer are required.');
    }

    const attempt = activeQuizAttempts.get(attemptId);
    if (!attempt) {
      return errorResponse(res, 404, 'Quiz attempt session expired or invalid. Please restart the quiz.');
    }

    const targetQuestion = attempt.questions.find(q => q.id === questionId);
    if (!targetQuestion) {
      return errorResponse(res, 404, 'Question not found in current attempt.');
    }

    // Authoritative correctness evaluation
    const formattedUserAns = selectedAnswer.toString().trim().toUpperCase();
    const formattedCorrectAns = targetQuestion.correctAnswer.toString().trim().toUpperCase();
    const isCorrect = (formattedUserAns === formattedCorrectAns);

    // Save answer in attempt state
    attempt.answers[questionId] = {
      selectedAnswer: formattedUserAns,
      isCorrect
    };

    const targetOption = targetQuestion.options.find(o => o.id === formattedUserAns);
    const selectedText = targetOption ? targetOption.text : `Option ${formattedUserAns}`;
    const correctOption = targetQuestion.options.find(o => o.id === formattedCorrectAns);
    const correctText = correctOption ? correctOption.text : `Option ${formattedCorrectAns}`;

    const feedback = await groqQuizService.evaluateAnswerExplanation({
      questionText: targetQuestion.question,
      options: targetQuestion.options,
      correctAnswer: formattedCorrectAns,
      selectedAnswer: formattedUserAns,
      selectedOptionText: selectedText,
      correctAnswerText: correctText,
      isCorrect
    });

    return successResponse(res, 200, 'Answer evaluated.', {
      questionId,
      selectedAnswer: formattedUserAns,
      isCorrect,
      correctAnswer: formattedCorrectAns,
      feedback: feedback || targetQuestion.explanation,
      explanation: targetQuestion.explanation
    });
  } catch (error) {
    return errorResponse(res, 500, 'Failed to evaluate question answer.');
  }
};

/**
 * Submit Quiz Attempt & Calculate Final Score
 * POST /api/quizzes/:id/submit or POST /api/quizzes/submit
 */
const submitQuizAttempt = async (req, res, next) => {
  try {
    const quizId = req.params.id || req.body.quizId;
    const { attemptId, answers } = req.body;

    const attempt = attemptId ? activeQuizAttempts.get(attemptId) : null;

    if (attempt) {
      const userAnswers = answers || attempt.answers || {};
      let correctCount = 0;
      const totalQuestions = attempt.questions.length || 1;
      const breakdown = [];

      attempt.questions.forEach((question, idx) => {
        let userSelected = userAnswers[question.id] || userAnswers[idx];
        if (typeof userSelected === 'object' && userSelected.selectedAnswer) {
          userSelected = userSelected.selectedAnswer;
        }

        let formattedUserAns = '';
        if (typeof userSelected === 'string') {
          formattedUserAns = userSelected.trim().toUpperCase();
        } else if (typeof userSelected === 'number') {
          formattedUserAns = String.fromCharCode(65 + userSelected);
        }

        const formattedCorrectAns = question.correctAnswer.trim().toUpperCase();
        const isCorrect = (formattedUserAns === formattedCorrectAns);

        if (isCorrect) {
          correctCount++;
        }

        breakdown.push({
          questionId: question.id,
          question: question.question,
          selectedAnswer: formattedUserAns || 'N/A',
          correctAnswer: formattedCorrectAns,
          isCorrect,
          explanation: question.explanation || `Option ${formattedCorrectAns} is the correct answer.`
        });
      });

      const accuracyPercentage = Math.round((correctCount / totalQuestions) * 100);
      const passed = accuracyPercentage >= 70;
      const pointsEarned = Math.round((correctCount / totalQuestions) * (attempt.points || 100));

      let totalPoints = pointsEarned;

      // If user is authenticated, save points and transaction
      if (req.user) {
        try {
          const userDoc = await User.findById(req.user._id);
          if (userDoc) {
            userDoc.points = (userDoc.points || 0) + pointsEarned;
            await userDoc.save();
            totalPoints = userDoc.points;

            await PointTransaction.create({
              user: req.user._id,
              points: pointsEarned,
              source: 'QUIZ_COMPLETION',
              description: `Passed quiz attempt (${correctCount}/${totalQuestions}): ${attempt.title}`,
              referenceId: req.user._id
            });
          }
        } catch (dbErr) {
          console.error('[QUIZ SUBMIT] Database point record error:', dbErr.message);
        }
      }

      // Cleanup attempt from memory after evaluation
      activeQuizAttempts.delete(attemptId);

      return successResponse(res, 200, 'Quiz attempt evaluated successfully.', {
        attemptId,
        score: pointsEarned,
        pointsEarned,
        totalPoints,
        correctCount,
        totalQuestions,
        accuracyPercentage,
        passed,
        breakdown
      });
    }

    return errorResponse(res, 400, 'Invalid or expired quiz attemptId. Please restart the quiz.');
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's past quiz attempts
 * GET /api/quizzes/my-attempts
 */
const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate('quiz', 'title category passingScore')
      .sort({ completedAt: -1 });

    return successResponse(res, 200, 'Quiz attempts history retrieved.', { attempts });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Create Quiz with Questions
 * POST /api/quizzes
 */
const createQuizAdmin = async (req, res, next) => {
  try {
    const { title, description, category, passingScore, questions } = req.body;

    if (!title || !category) {
      return errorResponse(res, 400, 'Quiz title and category are required.');
    }

    const quiz = await Quiz.create({
      title,
      description: description || '',
      category,
      passingScore: passingScore || 70,
      createdBy: req.user._id,
    });

    let createdQuestions = [];
    if (Array.isArray(questions) && questions.length > 0) {
      const qDocs = questions.map((q) => ({
        quiz: quiz._id,
        questionText: q.questionText,
        questionType: q.questionType || 'MCQ',
        imageUrl: q.imageUrl || '',
        options: q.options,
        points: q.points || 10,
        explanation: q.explanation || '',
      }));
      createdQuestions = await QuizQuestion.insertMany(qDocs);
    }

    return successResponse(res, 201, 'Quiz created successfully.', {
      quiz,
      questions: createdQuestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Update Quiz
 * PUT /api/quizzes/:id
 */
const updateQuizAdmin = async (req, res, next) => {
  try {
    const { title, description, category, passingScore, isActive } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found.');
    }

    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (category) quiz.category = category;
    if (passingScore !== undefined) quiz.passingScore = passingScore;
    if (isActive !== undefined) quiz.isActive = isActive;

    await quiz.save();

    return successResponse(res, 200, 'Quiz updated successfully.', { quiz });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Delete Quiz
 * DELETE /api/quizzes/:id
 */
const deleteQuizAdmin = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found.');
    }
    await QuizQuestion.deleteMany({ quiz: quiz._id });
    return successResponse(res, 200, 'Quiz and associated questions deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  startAiQuiz,
  answerQuizQuestion,
  submitQuizAttempt,
  getMyAttempts,
  createQuizAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
};

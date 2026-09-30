const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const PointTransaction = require('../models/PointTransaction');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * List active quizzes
 * GET /api/quizzes
 */
const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }).sort({ createdAt: -1 });
    
    // Also include question count for each quiz
    const quizzesWithCounts = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await QuizQuestion.countDocuments({ quiz: quiz._id });
        return {
          ...quiz.toObject(),
          questionCount,
        };
      })
    );

    return successResponse(res, 200, 'Active quizzes retrieved.', { quizzes: quizzesWithCounts });
  } catch (error) {
    next(error);
  }
};

/**
 * Get quiz details with questions
 * GET /api/quizzes/:id
 */
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found.');
    }

    const questions = await QuizQuestion.find({ quiz: quiz._id });

    // If request is from normal citizen, hide `isCorrect` fields on options!
    const isUserAdmin = req.user && req.user.role === 'admin';
    const sanitizedQuestions = questions.map((q) => {
      const qObj = q.toObject();
      if (!isUserAdmin) {
        qObj.options = qObj.options.map((opt) => ({
          optionText: opt.optionText,
          _id: opt._id,
        }));
        delete qObj.explanation; // Don't leak explanation before submission
      }
      return qObj;
    });

    return successResponse(res, 200, 'Quiz details retrieved.', {
      quiz,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit Quiz Answers (Server-side evaluation)
 * POST /api/quizzes/:id/submit
 * Body: { answers: [{ questionId, selectedOptionIndex }] }
 */
const submitQuizAttempt = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // Array of { questionId, selectedOptionIndex }

    if (!Array.isArray(answers) || answers.length === 0) {
      return errorResponse(res, 400, 'Answers array is required.');
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found.');
    }

    const questions = await QuizQuestion.find({ quiz: quizId });
    if (questions.length === 0) {
      return errorResponse(res, 400, 'This quiz has no questions.');
    }

    let achievedScore = 0;
    let totalPossibleScore = 0;
    const evaluatedAnswers = [];
    const feedbackDetails = [];

    questions.forEach((question) => {
      totalPossibleScore += question.points;
      const userAns = answers.find(
        (a) => a.questionId.toString() === question._id.toString()
      );

      let isCorrect = false;
      let selectedOptionIndex = -1;

      if (userAns && typeof userAns.selectedOptionIndex === 'number') {
        selectedOptionIndex = userAns.selectedOptionIndex;
        const targetOption = question.options[selectedOptionIndex];
        if (targetOption && targetOption.isCorrect) {
          isCorrect = true;
          achievedScore += question.points;
        }
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selectedOptionIndex,
        isCorrect,
      });

      // Find correct option index for feedback
      const correctOptionIndex = question.options.findIndex((opt) => opt.isCorrect);

      feedbackDetails.push({
        questionId: question._id,
        questionText: question.questionText,
        selectedOptionIndex,
        correctOptionIndex,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
        maxPoints: question.points,
        explanation: question.explanation,
      });
    });

    const scorePercentage = Math.round((achievedScore / totalPossibleScore) * 100);
    const passed = scorePercentage >= (quiz.passingScore || 70);

    // Check if user has ALREADY passed this quiz previously (prevent duplicate points abuse)
    const existingPassedAttempt = await QuizAttempt.findOne({
      user: req.user._id,
      quiz: quiz._id,
      passed: true,
    });

    let pointsAwarded = 0;
    let pointsMessage = '';

    if (passed) {
      if (!existingPassedAttempt) {
        // Award points equal to achieved score (e.g. 30 points)
        pointsAwarded = achievedScore;
        await PointTransaction.create({
          user: req.user._id,
          points: pointsAwarded,
          source: 'QUIZ_COMPLETION',
          description: `Passed quiz: ${quiz.title}`,
          referenceId: quiz._id,
        });
        pointsMessage = `Congratulations! You earned ${pointsAwarded} points for passing this quiz.`;
      } else {
        pointsMessage = `You passed! (Note: Points were already awarded on your first passing attempt).`;
      }
    } else {
      pointsMessage = `Score too low to pass (${scorePercentage}%). Passing score requirement is ${quiz.passingScore}%. Try again!`;
    }

    // Save quiz attempt record
    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      score: achievedScore,
      totalPossible: totalPossibleScore,
      scorePercentage,
      passed,
      pointsEarned: pointsAwarded,
      answers: evaluatedAnswers,
    });

    return successResponse(res, 200, 'Quiz attempt evaluated.', {
      attemptId: attempt._id,
      score: achievedScore,
      totalPossible: totalPossibleScore,
      accuracyPercentage: scorePercentage,
      passed,
      pointsEarned: pointsAwarded,
      pointsMessage,
      feedback: feedbackDetails,
    });
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
  submitQuizAttempt,
  getMyAttempts,
  createQuizAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
};

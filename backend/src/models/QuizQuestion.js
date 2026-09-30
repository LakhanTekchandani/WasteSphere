const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const quizQuestionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
    },
    questionType: {
      type: String,
      enum: ['MCQ', 'Image-based', 'Scenario-based'],
      required: true,
      default: 'MCQ',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    options: {
      type: [optionSchema],
      validate: [
        (opts) => opts.length >= 2,
        'Question must have at least 2 options',
      ],
    },
    points: {
      type: Number,
      default: 10,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);

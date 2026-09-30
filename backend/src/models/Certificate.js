const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    certificateTitle: {
      type: String,
      default: 'Environmental Awareness & Active Citizen Certificate',
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    criteriaSnapshot: {
      quizzesPassed: Number,
      qualifyingComplaints: Number,
      totalPoints: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certificate', certificateSchema);

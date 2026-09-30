const mongoose = require('mongoose');

const pointTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    points: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ['QUIZ_COMPLETION', 'QUALIFYING_COMPLAINT', 'SYSTEM_BONUS'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PointTransaction', pointTransactionSchema);

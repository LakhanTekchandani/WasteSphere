const mongoose = require('mongoose');

const awarenessContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Wet Waste', 'Dry Waste', 'Hazardous Waste', 'E-Waste', 'Segregation', 'Proper Disposal'],
      required: [true, 'Category is required'],
    },
    content: {
      type: String,
      required: [true, 'Content text/markdown is required'],
    },
    summary: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AwarenessContent', awarenessContentSchema);

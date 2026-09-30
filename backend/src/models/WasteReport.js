const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    wastePhoto: {
      url: { type: String, required: true },
      public_id: { type: String, default: '' },
    },
    wasteType: {
      type: String,
      enum: [
        'Organic / Wet Waste',
        'Plastic Waste',
        'Paper / Cardboard',
        'Glass Waste',
        'Metal Waste',
        'E-Waste',
        'Mixed Waste',
        'Other',
      ],
      required: [true, 'Waste type is required'],
    },
    issueType: {
      type: String,
      enum: [
        'Overflowing Garbage Bin',
        'Garbage on Road / Public Area',
        'Missed Waste Collection',
        'Illegal Dumping',
        'Open Waste Burning',
        'Uncollected Waste',
        'Other',
      ],
      required: [true, 'Issue type is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true, trim: true },
    },
    landmark: {
      type: String,
      trim: true,
      default: '',
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: [true, 'Severity is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    assignedTo: {
      type: String,
      default: '',
    },
    resolutionDetails: {
      type: String,
      default: '',
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WasteReport', wasteReportSchema);

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorMiddleware');
const { successResponse, errorResponse } = require('./utils/apiResponse');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminVerificationRoutes = require('./routes/adminVerificationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reportRoutes = require('./routes/reportRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const awarenessRoutes = require('./routes/awarenessRoutes');
const quizRoutes = require('./routes/quizRoutes');
const pointsRoutes = require('./routes/pointsRoutes');
const recognitionRoutes = require('./routes/recognitionRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  return successResponse(res, 200, 'WasteSphere Backend API is healthy and operational.', {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root API Endpoint
app.get('/api', (req, res) => {
  return successResponse(res, 200, 'Welcome to WasteSphere Backend API', {
    version: '1.0.0',
    documentation: '/api/docs',
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/verifications', adminVerificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/awareness', awarenessRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/recognition', recognitionRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  return errorResponse(res, 404, `Cannot ${req.method} ${req.originalUrl}`);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;

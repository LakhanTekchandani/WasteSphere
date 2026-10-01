const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const errorHandler = require('./middleware/errorMiddleware');
const { successResponse, errorResponse } = require('./utils/apiResponse');
const connectDB = require('./config/db');

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
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://wastesphere.netlify.app',
        'https://waste-sphere.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000',
      ];
      // Allow requests with no origin (e.g. mobile apps, curl) or allowed origins / previews
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Lazy DB connection for Vercel serverless ────────────────────────────────
// On serverless, each cold-start is a new process; we must ensure Mongoose
// is connected before every request that touches the DB.
app.use(async (req, res, next) => {
  // Skip DB connection for health / root routes
  if (req.path === '/health' || req.path === '/api') return next();

  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[DB] Failed to connect to MongoDB:', err.message);
      return errorResponse(res, 503, 'Database connection unavailable. Please try again shortly.');
    }
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  return successResponse(res, 200, 'WasteSphere Backend API is healthy and operational.', {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbState: mongoose.connection.readyState,
  });
});

// Diagnostics endpoint — shows which env vars are SET (not their values)
app.get('/diagnostics', (req, res) => {
  const check = (key) => !!process.env[key] && process.env[key] !== '**********' && process.env[key] !== 'your_twilio_account_sid';
  return successResponse(res, 200, 'Environment diagnostics', {
    MONGODB_URI: check('MONGODB_URI'),
    JWT_SECRET: check('JWT_SECRET'),
    CLOUDINARY_CLOUD_NAME: check('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: check('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: check('CLOUDINARY_API_SECRET'),
    GROQ_API_KEY: check('GROQ_API_KEY'),
    GEMINI_API_KEY: check('GEMINI_API_KEY'),
    SMS_PROVIDER: process.env.SMS_PROVIDER || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set',
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

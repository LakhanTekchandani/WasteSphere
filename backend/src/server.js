const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & start Express server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(` WasteSphere Backend Running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/health`);
      console.log(` API Base URL: http://localhost:${PORT}/api`);
      console.log(`==================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize server:', err.message);
  });

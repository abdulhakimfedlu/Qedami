const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const scout = require('./routes/scout');
const services = require('./routes/services');
const offices = require('./routes/offices');
const geo = require('./routes/geo');
const docs = require('./routes/docs');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/scout', scout);
app.use('/api/v1/services', services);
app.use('/api/v1/offices', offices);
app.use('/api/v1/geo', geo);
app.use('/api/v1', docs); // Documents and Forms are top-level in the doc

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

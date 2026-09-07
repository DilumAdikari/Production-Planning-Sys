const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
/// const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/textrack_db';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✔ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Root / Health-check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'TexTrack Garment Subcon ERP API is running'
  });
});

// API Routes
app.use('/api/analytics', require('./routes/analyticsRoutes'));
// app.use('/api/plants', require('./routes/plantRoutes'));
// app.use('/api/loading', require('./routes/loadingRoutes'));
// app.use('/api/grn', require('./routes/grnRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 TexTrack Server listening on port ${port}`);
});
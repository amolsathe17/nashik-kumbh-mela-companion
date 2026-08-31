const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5173',
  /\.vercel\.app$/
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for mobile/Vercel preview
  },
  credentials: true
}));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err.message));
} else {
  console.log('MONGODB_URI not provided. Running in high-performance standalone mode with built-in memory storage.');
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Nashik Kumbh Mela Backend API',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Standalone Memory Mode'
  });
});

// Mounting API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/daily-information', require('./routes/dailyInfoRoutes'));
app.use('/api/announcements', require('./routes/announcementsRoutes'));
app.use('/api/notifications', require('./routes/notificationsRoutes'));
app.use('/api/locations', require('./routes/locationsRoutes'));
app.use('/api/travel', require('./routes/travelRoutes'));
app.use('/api/facilities', require('./routes/facilitiesRoutes'));
app.use('/api/assistance', require('./routes/assistanceRoutes'));
app.use('/api/programmes', require('./routes/programmesRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource endpoint not found' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Nashik Kumbh Mela API running on port ${PORT}`);
});

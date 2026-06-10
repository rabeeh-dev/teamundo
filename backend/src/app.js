const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { frontendUrl, nodeEnv } = require('./config/env');
const { errorHandler } = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ── Security ──
app.use(helmet());
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ──
if (nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'teamundo API is running',
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Error Handler ──
app.use(errorHandler);

module.exports = app;

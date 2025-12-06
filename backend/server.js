const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/code-explainer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./api/auth');
const userRoutes = require('./api/user');
const usageRoutes = require('./api/usage');
const analyzeRoutes = require('./api/analyze');
const historyRoutes = require('./api/history');
const favoritesRoutes = require('./api/favorites');
const comparisonRoutes = require('./api/comparison');
const templatesRoutes = require('./api/templates');
const shareRoutes = require('./api/share');
const analyticsRoutes = require('./api/analytics');
const aiAgentRoutes = require('./api/ai-agent');
const aiChatRoutes = require('./api/ai-chat');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai-agent', aiAgentRoutes);
app.use('/api/ai-chat', aiChatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

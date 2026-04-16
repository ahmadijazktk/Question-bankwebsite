import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import questionRoutes from './src/routes/questionRoutes.js';
import examRoutes from './src/routes/examRoutes.js';
import subscriptionRoutes from './src/routes/subscriptionRoutes.js';
import statsRoutes from './src/routes/statsRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import { stripeWebhook } from './src/controllers/paymentsController.js';
import { receivePabblyWebhook } from './src/controllers/pabblyWebhookController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Question from './src/models/Question.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:8080',
  'http://localhost:5173',
  'https://study-bloom-medical.netlify.app',
  'https://scholared.ca',
  'https://www.scholared.ca'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Stripe webhook must be registered BEFORE any body parsers on that route
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Pabbly webhook endpoint (before body parsers if needed, or after if JSON is fine)
// JSON/urlencoded body parsers (safe for all other routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pabbly webhook endpoint
app.post('/api/webhooks/pabbly', receivePabblyWebhook);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// EMERGENCY RESTORATION ROUTE
// This allows seeding the database directly from the server to bypass local DNS issues
app.get('/api/emergency-restore-questions', async (req, res) => {
  try {
    console.log('🔄 Starting Emergency Restoration...');
    const jsonPath = path.join(__dirname, 'rheumzoom_mongodb_format.json');
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({ success: false, message: 'Source file not found on server' });
    }

    const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`📖 Found ${questionsData.length} questions to restore`);

    // Optional: Only allow if a secret key is provided in query (simple security)
    if (req.query.secret !== 'restore2025') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    await Question.insertMany(questionsData);
    console.log('✅ Restoration successful');

    res.json({
      success: true,
      message: `Successfully restored ${questionsData.length} questions with all formatting fixes!`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Restoration Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Frontend URL: ${FRONTEND_URL}`);
});

export default app;



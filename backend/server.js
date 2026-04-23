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
// Emergency import — reads updatedquestion.txt (batch 11: IgG4)
app.get('/api/emergency-import-anki', async (req, res) => {

  try {
    console.log('🔄 Starting Emergency Anki Import from server...');
    const txtPath = path.join(__dirname, '..', 'updatedquestion.txt');
    if (!fs.existsSync(txtPath)) {
      return res.status(404).json({ success: false, message: 'Source file not found on server at ' + txtPath });
    }

    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    const content = fs.readFileSync(txtPath, 'utf8');
    const lines = content.split(/\r?\n/);

    let importedCount = 0;
    const questionsBatch = [];
    const debug = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith('#')) {
        debug.push(`Line ${i + 1}: Skipped (Comment or Empty)`);
        continue;
      }

      const parts = line.split('\t');
      const rawQuestion = parts[0];
      const rawAnswer = parts[1];

      if (!rawQuestion || !rawAnswer) {
        debug.push(`Line ${i + 1}: Skipped (Missing Q or A). Parts length: ${parts.length}`);
        continue;
      }

      const processHtml = (html) => {
        if (!html) return '';
        let normalized = html.replace(/src="([^"]+)"/gi, (match, src) => {
          if (src.includes('/') && !src.startsWith('/images/')) return match;
          const base = src.split('/').pop() || src;
          return `src="/collection.media/${base}"`;
        });
        return normalized;
      };

      const questionText = processHtml(rawQuestion);
      const answerText = processHtml(rawAnswer);

      const nonEmptyParts = parts.filter(p => p.trim().length > 0);
      const rawTags = (nonEmptyParts.length > 2) ? nonEmptyParts[nonEmptyParts.length - 1] : 'AnkiImport';
      const tagArray = rawTags.split(' ').map(t => t.trim()).filter(t => t);
      const primaryCategory = tagArray[0] || 'Uncategorized';

      const isImageOcclusion = /^[a-f0-9-]{20,}/i.test(questionText);
      const displayQuestion = isImageOcclusion ? "What is the missing part in this figure?" : questionText;

      questionsBatch.push({
        text: displayQuestion,
        category: primaryCategory,
        options: [{
          text: answerText,
          explanation: answerText,
          isCorrect: true
        }],
        tags: tagArray,
        createdAt: new Date()
      });
      importedCount++;
      debug.push(`Line ${i + 1}: Processed (${questionText.substring(0, 10)}...)`);
    }

    if (questionsBatch.length > 0) {
      await Question.insertMany(questionsBatch);
    }

    console.log(`✅ Successfully re-imported ${questionsBatch.length} questions.`);

    res.json({
      success: true,
      message: `Successfully imported ${questionsBatch.length} questions from Anki format!`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Import Error:', error);
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



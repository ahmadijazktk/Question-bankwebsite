import express from 'express';
import { body } from 'express-validator';
import {
  submitAnswer,
  getAttempts
} from '../controllers/examController.js';
import { authenticate } from '../middlewares/auth.js';
import { requireSubscription } from '../middlewares/auth.js';

import { optionalAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules
const submitAnswerValidation = [
  body('questionId').isMongoId().withMessage('Valid question ID is required'),
  body('selectedAnswer').trim().notEmpty().withMessage('Selected answer is required'),
  body('timeSpent').optional().isNumeric().withMessage('Time spent must be a number')
];

// Routes
// POST /answer is flexible (handles free trial questions)
router.post('/answer', optionalAuthenticate, submitAnswerValidation, submitAnswer);

// GET /attempts is still protected
router.get('/attempts', authenticate, getAttempts);

export default router;





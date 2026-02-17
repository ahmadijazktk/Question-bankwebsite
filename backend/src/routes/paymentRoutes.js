import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { createCheckoutSession, confirmCheckoutSession } from '../controllers/paymentsController.js';

const router = express.Router();

// All payment routes require authentication
router.use(authenticate);

router.post('/create-checkout-session', createCheckoutSession);
router.post('/confirm-checkout-session', confirmCheckoutSession);

export default router;






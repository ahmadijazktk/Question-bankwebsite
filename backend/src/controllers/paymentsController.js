import Stripe from 'stripe';
import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

import { PRICING, PLAN_DURATIONS } from '../config/pricing.js';

let stripeClient;

const getStripeClient = () => {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'Stripe secret key is not configured. Set STRIPE_SECRET_KEY in your environment variables.',
    );
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: '2024-09-30.acacia',
  });

  return stripeClient;
};

const calculateEndDate = (startDate, plan) => {
  const months = PLAN_DURATIONS[plan];

  if (!months) {
    throw new Error('Invalid plan duration');
  }

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + months);
  return endDate;
};

const activateSubscriptionForUser = async ({ userId, category, plan, price, stripeSessionId }) => {
  console.log('🔄 ========== ACTIVATING SUBSCRIPTION ==========');
  console.log('👤 User ID:', userId);
  console.log('📦 Category:', category);
  console.log('📅 Plan:', plan);
  console.log('💰 Price:', price);
  console.log('🔗 Stripe Session ID:', stripeSessionId);

  const startDate = new Date();
  const endDate = calculateEndDate(startDate, plan);
  console.log('📅 Start Date:', startDate);
  console.log('📅 End Date:', endDate);

  // If we already created a subscription for this Stripe session, do nothing.
  if (stripeSessionId) {
    console.log('🔍 Checking for existing subscription with this session...');
    const existing = await Subscription.findOne({
      userId,
      'paymentDetails.stripeSessionId': stripeSessionId,
    });
    if (existing) {
      console.log('✅ Subscription already exists for this session:', existing._id);
      return existing;
    }
    console.log('✅ No existing subscription found, proceeding...');
  }

  // Cancel existing actives
  console.log('🚫 Cancelling existing active subscriptions...');
  const cancelResult = await Subscription.updateMany({ userId, status: 'active' }, { status: 'cancelled' });
  console.log('🚫 Cancelled', cancelResult.modifiedCount, 'subscriptions');

  console.log('💾 Creating new subscription...');
  const subscription = await Subscription.create({
    userId,
    category,
    plan,
    price: price ?? PRICING[category][plan],
    status: 'active',
    startDate,
    endDate,
    paymentMethod: 'card',
    paymentDetails: stripeSessionId ? { stripeSessionId } : {},
  });
  console.log('✅ Subscription created:', subscription._id);

  console.log('👤 Updating user subscription status...');
  const userUpdate = await User.findByIdAndUpdate(userId, {
    'subscriptionStatus.isActive': true,
    'subscriptionStatus.category': category,
    'subscriptionStatus.plan': plan,
    'subscriptionStatus.startDate': startDate,
    'subscriptionStatus.endDate': endDate,
    'subscriptionStatus.autoRenew': false,
  }, { new: true });

  if (userUpdate) {
    console.log('✅ User subscription status updated');
    console.log('📊 User subscription status:', userUpdate.subscriptionStatus);
  } else {
    console.error('❌ Failed to update user subscription status');
  }

  console.log('🎉 ========== SUBSCRIPTION ACTIVATED ==========');
  return subscription;
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { category, plan } = req.body;
  const stripe = getStripeClient();

  if (!PRICING[category] || !PRICING[category][plan]) {
    return res.status(400).json({ success: false, message: 'Invalid category or plan' });
  }

  const priceUsd = PRICING[category][plan];
  const amountCents = Math.round(priceUsd * 100);

  // Include the Stripe session id so the frontend can call confirm endpoint as a fallback
  // (webhooks can be delayed/misconfigured in some environments).
  const successUrl = `${process.env.FRONTEND_URL}/subscription?status=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.FRONTEND_URL}/checkout?status=cancel`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `RheumZoom ${category} (${plan})`,
            description: 'Subscription access for selected category and duration',
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: String(req.user._id),
      category,
      plan,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return res.json({ success: true, data: { url: session.url, sessionId: session.id } });
});

/**
 * @route   POST /api/payments/confirm-checkout-session
 * @desc    Confirm a Stripe checkout session and activate subscription (fallback if webhook not received)
 */
export const confirmCheckoutSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const stripe = getStripeClient();

  if (!sessionId) {
    return res.status(400).json({ success: false, message: 'sessionId is required' });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Only treat paid sessions as successful
  if (session.payment_status !== 'paid') {
    return res.status(400).json({
      success: false,
      message: `Checkout session not paid (status: ${session.payment_status})`,
    });
  }

  const { userId, category, plan } = session.metadata || {};

  // Ensure the session belongs to the authenticated user
  if (!userId || String(userId) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Session does not belong to authenticated user',
    });
  }

  if (!category || !plan || !PRICING[category] || !PRICING[category][plan]) {
    return res.status(400).json({ success: false, message: 'Invalid category or plan in session metadata' });
  }

  const priceCents = session.amount_total;
  const price = priceCents ? Math.round(priceCents) / 100 : undefined;

  const subscription = await activateSubscriptionForUser({
    userId,
    category,
    plan,
    price,
    stripeSessionId: session.id,
  });

  return res.json({
    success: true,
    message: 'Subscription activated',
    data: { subscription },
  });
});

export const stripeWebhook = async (req, res) => {
  let stripe;

  try {
    stripe = getStripeClient();
  } catch (error) {
    console.error('Stripe configuration error:', error.message);
    return res.status(500).send('Stripe configuration error');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(500).send('Webhook secret not configured');
    }
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, category, plan } = session.metadata || {};
    const priceCents = session.amount_total;
    const price = priceCents ? Math.round(priceCents) / 100 : undefined;

    if (userId && category && plan) {
      await activateSubscriptionForUser({
        userId,
        category,
        plan,
        price,
        stripeSessionId: session.id,
      });
    }
  }

  res.json({ received: true });
};






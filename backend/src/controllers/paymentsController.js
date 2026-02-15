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

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { category, plan } = req.body;
  const stripe = getStripeClient();

  if (!PRICING[category] || !PRICING[category][plan]) {
    return res.status(400).json({ success: false, message: 'Invalid category or plan' });
  }

  const priceUsd = PRICING[category][plan];
  const amountCents = Math.round(priceUsd * 100);

  const successUrl = `${process.env.FRONTEND_URL}/subscription?status=success`;
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
      const startDate = new Date();
      const endDate = calculateEndDate(startDate, plan);

      // Cancel existing actives
      await Subscription.updateMany({ userId, status: 'active' }, { status: 'cancelled' });

      const subscription = await Subscription.create({
        userId,
        category,
        plan,
        price: price ?? PRICING[category][plan],
        status: 'active',
        startDate,
        endDate,
        paymentMethod: 'card',
        paymentDetails: { stripeSessionId: session.id },
      });

      await User.findByIdAndUpdate(userId, {
        'subscriptionStatus.isActive': true,
        'subscriptionStatus.category': category,
        'subscriptionStatus.plan': plan,
        'subscriptionStatus.startDate': startDate,
        'subscriptionStatus.endDate': endDate,
        'subscriptionStatus.autoRenew': false,
      });
    }
  }

  res.json({ received: true });
};






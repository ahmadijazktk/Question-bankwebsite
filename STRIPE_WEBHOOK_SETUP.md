# 🔧 Stripe Webhook Configuration Guide

## ⚠️ CRITICAL: This Must Be Done for Subscriptions to Work!

Without properly configured Stripe webhooks, subscriptions **will not activate** after payment.

---

## 📋 Step-by-Step Setup

### Step 1: Get Your Backend URL

Your backend is deployed on Render at:
```
https://study-bloom-backend.onrender.com
```

The webhook endpoint will be:
```
https://study-bloom-backend.onrender.com/api/payments/webhook
```

---

### Step 2: Configure Webhook in Stripe Dashboard

1. **Go to Stripe Dashboard**
   - Visit: https://dashboard.stripe.com/webhooks
   - Log in with your Stripe account

2. **Click "Add endpoint"** (top right corner)

3. **Enter Endpoint URL**:
   ```
   https://study-bloom-backend.onrender.com/api/payments/webhook
   ```

4. **Select Events to Listen For**:
   - Click "Select events"
   - Search for: `checkout.session.completed`
   - Check the box next to it
   - Click "Add events"

5. **Click "Add endpoint"** at the bottom

6. **Copy the Signing Secret**:
   - After creating the endpoint, you'll see a "Signing secret" section
   - Click "Reveal" next to the signing secret
   - Copy the value (starts with `whsec_...`)

---

### Step 3: Add Webhook Secret to Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Find your backend service: `study-bloom-backend`

2. **Go to Environment Variables**:
   - Click on your service
   - Click "Environment" in the left sidebar
   - Click "Add Environment Variable"

3. **Add the Webhook Secret**:
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_...` (paste the secret you copied from Stripe)
   - Click "Save Changes"

4. **Your backend will automatically redeploy** (wait 2-3 minutes)

---

### Step 4: Verify Other Stripe Environment Variables

Make sure these are also set in Render:

```env
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
FRONTEND_URL=https://your-app.netlify.app
```

---

### Step 5: Test the Webhook

1. **Make a Test Payment**:
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC (e.g., 123)

2. **Check Stripe Dashboard**:
   - Go to: https://dashboard.stripe.com/webhooks
   - Click on your webhook endpoint
   - Click "Events" tab
   - You should see `checkout.session.completed` events

3. **Check Render Logs**:
   - Go to your Render service
   - Click "Logs" tab
   - Look for:
     ```
     🔄 ========== ACTIVATING SUBSCRIPTION ==========
     ✅ Subscription created: ...
     ✅ User subscription status updated
     🎉 ========== SUBSCRIPTION ACTIVATED ==========
     ```

---

## 🔍 Troubleshooting

### Issue: Webhook not receiving events

**Solution**:
1. Check the webhook URL is correct
2. Make sure your backend is running (not sleeping)
3. Verify the endpoint is publicly accessible

### Issue: Webhook signature verification failed

**Solution**:
1. Make sure `STRIPE_WEBHOOK_SECRET` matches the secret in Stripe Dashboard
2. Restart your backend service after adding the secret

### Issue: Subscription still not activating

**Solution**:
1. Check Render logs for errors
2. Make sure MongoDB connection is working
3. Verify the user exists in the database
4. Check that the confirm endpoint is being called (browser console)

---

## 🧪 Testing Checklist

After setup, test the following:

- [ ] Webhook endpoint is accessible
- [ ] Webhook secret is set in Render
- [ ] Test payment goes through
- [ ] Webhook event appears in Stripe Dashboard
- [ ] Subscription is created in MongoDB
- [ ] User's subscriptionStatus is updated
- [ ] Questions unlock in the Exam page
- [ ] "Show Answer" button works

---

## 📞 Quick Reference

**Webhook URL**: `https://study-bloom-backend.onrender.com/api/payments/webhook`

**Event to Listen For**: `checkout.session.completed`

**Environment Variable**: `STRIPE_WEBHOOK_SECRET=whsec_...`

**Test Card**: `4242 4242 4242 4242`

---

## 🎯 What Happens After Setup

1. User completes payment on Stripe
2. Stripe sends webhook to your backend
3. Backend receives `checkout.session.completed` event
4. Backend activates subscription in database
5. User's subscriptionStatus.isActive = true
6. Questions unlock automatically
7. User can see correct answers

---

## ⚡ Quick Test Command

After setup, run this in your browser console after payment:

```javascript
fetch('/api/subscriptions/current', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('Subscription:', data);
  if (data.data?.subscription) {
    console.log('✅ SUBSCRIPTION ACTIVE!');
  } else {
    console.log('❌ No active subscription');
  }
});
```

---

## 🚀 You're All Set!

Once you complete these steps, your subscription system will work perfectly:
- ✅ Payments will be processed
- ✅ Subscriptions will activate automatically
- ✅ Questions will unlock
- ✅ Users will see correct answers

If you have any issues, check the logs in both Stripe Dashboard and Render!

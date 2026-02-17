# Stripe Webhook Setup Guide - RheumZoom Subscription Activation

## Problem
After purchasing a subscription, users are charged successfully but cannot see the answers to questions. This happens because Stripe is not properly communicating with your server to activate the subscription.

## Solution
Configure Stripe webhooks to notify your server when a payment is completed.

---

## IMPORTANT: If You're Using Pabbly Connect

**Before starting this guide**, check if you have existing webhooks that use Pabbly Connect:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Look for any webhook endpoints that point to Pabbly (URL will contain "pabbly")
3. **DO NOT DELETE THEM YET** - Just click on each one and click **"Disable"**
4. This allows you to re-enable them if needed

**Why disable Pabbly?**
- Pabbly intercepts the webhook events before they reach your server
- Your backend never gets the signal to activate subscriptions
- Once the direct webhook is working, you won't need Pabbly anymore

**After completing this guide and confirming everything works:**
- Monitor for 24-48 hours
- If no issues, you can safely delete the Pabbly webhooks

---

## Step-by-Step Instructions

### Part 1: Configure Stripe Webhook (5 minutes)

1. **Login to Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/
   - Login with your Stripe account credentials

2. **Navigate to Webhooks**
   - Click on **"Developers"** in the top navigation bar
   - Click on **"Webhooks"** in the left sidebar

3. **Remove Old Webhooks (if any exist)**
   - If you see any existing webhook endpoints, click on each one
   - Click **"Delete"** or **"Remove"** to delete them
   - This ensures we start fresh with the correct configuration

4. **Add New Webhook Endpoint**
   - Click the **"+ Add endpoint"** button (top right)
   - In the "Endpoint URL" field, enter EXACTLY this URL:
     ```
     https://study-bloom-backend.onrender.com/api/stripe/webhook
     ```
   - **IMPORTANT:** Make sure there are NO extra spaces or typos

5. **Select Events to Listen To**
   - Click on **"Select events"** button
   - In the search box, type: `checkout.session.completed`
   - Check the box next to **"checkout.session.completed"**
   - Click **"Add events"** button at the bottom

6. **Save the Endpoint**
   - Click **"Add endpoint"** button to save

7. **Copy the Signing Secret**
   - After creating the endpoint, you'll see a page with endpoint details
   - Look for **"Signing secret"** section
   - Click **"Reveal"** to show the secret
   - It will look like: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **COPY THIS ENTIRE SECRET** (you'll need it in Part 2)

---

### Part 2: Update Render Environment Variable (3 minutes)

1. **Login to Render Dashboard**
   - Go to: https://dashboard.render.com/
   - Login with your Render account credentials

2. **Select Your Backend Service**
   - Click on your backend service (should be named something like "study-bloom-backend")

3. **Navigate to Environment Variables**
   - In the left sidebar, click on **"Environment"**
   - You'll see a list of environment variables

4. **Update STRIPE_WEBHOOK_SECRET**
   - Find the variable named `STRIPE_WEBHOOK_SECRET`
   - Click the **pencil icon** (edit) next to it
   - **Delete the old value**
   - **Paste the NEW secret** you copied from Stripe (Step 7 in Part 1)
   - Click **"Save Changes"**

5. **Wait for Service to Restart**
   - Render will automatically restart your service (this takes 1-2 minutes)
   - Wait until you see "Live" status before testing

---

### Part 3: Test the Webhook (2 minutes)

1. **Go Back to Stripe Dashboard**
   - Navigate to **Developers** → **Webhooks**
   - Click on the webhook endpoint you just created

2. **Send Test Webhook**
   - Click **"Send test webhook"** button
   - Select **"checkout.session.completed"** from the dropdown
   - Click **"Send test webhook"**

3. **Verify Success**
   - You should see a **green checkmark** and "200 OK" response
   - If you see an error, double-check:
     - The endpoint URL is exactly: `https://study-bloom-backend.onrender.com/api/stripe/webhook`
     - The webhook secret in Render matches the one shown in Stripe
     - Your Render service shows "Live" status

---

### Part 4: Verify Subscription Activation Works (5 minutes)

1. **Make a Test Purchase**
   - Go to your website: https://study-bloom-medical.netlify.app
   - Login or create a new test account
   - Navigate to **Subscription** page
   - Select any plan (1 month for $59.99)
   - Click **"Upgrade Now"**

2. **Complete Payment on Stripe**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Complete the payment

3. **Verify Subscription is Active**
   - After payment, you should be redirected back to your site
   - Go to **"Take Exam"** page
   - Select a question and click **"Show Answer"**
   - **You should now see the correct answer** (not an error message)

---

## Troubleshooting

### Issue: Still getting "Active subscription required" error after payment

**Solution 1: Check Webhook Logs in Stripe**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Scroll down to "Recent deliveries"
4. Look for recent events - they should show "200" status
5. If you see "400" or "500" errors, the webhook secret is wrong

**Solution 2: Verify Environment Variables in Render**
1. Go to Render Dashboard → Your Service → Environment
2. Verify these variables exist and are correct:
   - `STRIPE_WEBHOOK_SECRET` = The secret from Stripe (starts with `whsec_`)
   - `FRONTEND_URL` = `https://study-bloom-medical.netlify.app`
   - `STRIPE_SECRET_KEY` = Your Stripe secret key (starts with `sk_live_`)

**Solution 3: Check Render Logs**
1. Go to Render Dashboard → Your Service → Logs
2. Look for errors related to "webhook" or "stripe"
3. If you see "Webhook secret not configured" - the secret is missing or wrong

### Issue: Webhook test shows "404 Not Found"

**Solution:**
- The endpoint URL is wrong
- Make sure it's exactly: `https://study-bloom-backend.onrender.com/api/stripe/webhook`
- Note the `/api/` in the middle - this is required!

### Issue: Webhook test shows "401 Unauthorized" or "400 Bad Request"

**Solution:**
- The webhook secret doesn't match
- Delete the webhook in Stripe
- Create a new one
- Copy the NEW secret
- Update Render with the NEW secret

---

## Quick Reference

### Correct Webhook URL
```
https://study-bloom-backend.onrender.com/api/stripe/webhook
```

### Event to Listen For
```
checkout.session.completed
```

### Where to Find Webhook Secret
- Stripe Dashboard → Developers → Webhooks → Click your endpoint → Signing secret

### Where to Update Webhook Secret
- Render Dashboard → Your Service → Environment → STRIPE_WEBHOOK_SECRET

---

## Expected Result

After completing this setup:
1. ✅ Users can purchase subscriptions for $59.99
2. ✅ Payment is processed successfully through Stripe
3. ✅ User is automatically redirected back to the website
4. ✅ Subscription is immediately activated in the database
5. ✅ User can click "Show Answer" and see correct answers
6. ✅ No more "Active subscription required" errors

---

## Support

If you still experience issues after following this guide:
1. Check Stripe webhook logs for delivery failures
2. Check Render service logs for errors
3. Verify all environment variables are correct
4. Try creating a completely new webhook endpoint with a fresh secret

The most common mistake is having a typo in the webhook URL or using an old webhook secret that doesn't match.

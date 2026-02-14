# 🚀 Deployment Guide - Study Bloom App

This guide will walk you through deploying your medical study application with:
- **Frontend**: Netlify (Free tier available)
- **Backend**: Render.com (Free tier available)
- **Database**: MongoDB Atlas (Already configured)

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account
- ✅ Netlify account (sign up at netlify.com)
- ✅ Render account (sign up at render.com)
- ✅ MongoDB Atlas connection string (you already have this)
- ✅ Stripe API keys (you already have these)

---

## Part 1: Prepare Your Code for Deployment

### Step 1: Create Production Build Configuration

We need to ensure your app is ready for production.

#### A. Update Frontend Environment Variables

Create a file `.env.production` in the root directory:

```env
VITE_API_URL=https://your-backend-app.onrender.com
```

(We'll update this URL after deploying the backend)

#### B. Update Backend for Production

Your backend is already mostly ready, but let's verify the CORS settings.

---

## Part 2: Deploy Backend to Render.com

### Step 1: Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   cd c:\Users\Administrator\Music\studyApp\study-bloom-15-main\study-bloom-15-main
   git init
   git add .
   git commit -m "Initial commit - Study Bloom App"
   ```

2. **Create a new repository on GitHub**:
   - Go to github.com
   - Click "New Repository"
   - Name it: `study-bloom-app`
   - Don't initialize with README (we already have code)
   - Click "Create Repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/study-bloom-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy Backend on Render

1. **Go to Render.com** and sign in

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your `study-bloom-app` repository

3. **Configure the Service**:
   - **Name**: `study-bloom-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add these:

   ```
   MONGO_URI=your_mongodb_connection_string
   
   JWT_SECRET=your_random_jwt_secret
   
   PORT=5000
   
   FRONTEND_URL=https://your-app-name.netlify.app
   
   STRIPE_SECRET_KEY=sk_live_... (Your live secret key)
   
   STRIPE_PUBLISHABLE_KEY=pk_live_... (Your live publishable key)
   
   STRIPE_WEBHOOK_SECRET=whsec_... (Your webhook secret)
   
   NODE_ENV=production
   ```

5. **Click "Create Web Service"**

6. **Wait for deployment** (5-10 minutes)

7. **Copy your backend URL**: It will be something like:
   `https://study-bloom-backend.onrender.com`

---

## Part 3: Deploy Frontend to Netlify

### Step 1: Prepare Frontend Build

1. **Update the API URL**:
   
   Edit `src/lib/api.ts` and update the base URL:
   
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

2. **Create `.env.production`** in the root directory:
   ```
   VITE_API_URL=https://study-bloom-backend.onrender.com
   ```
   (Use the URL from Render)

3. **Create `netlify.toml`** in the root directory:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     NODE_VERSION = "18"
   ```

### Step 2: Deploy to Netlify

**Option A: Deploy via Netlify UI (Recommended)**

1. **Go to Netlify** (app.netlify.com)

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub**:
   - Authorize Netlify
   - Select your `study-bloom-app` repository

4. **Configure Build Settings**:
   - **Base directory**: Leave empty (or `.` for root)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. **Add Environment Variables**:
   - Go to "Site settings" → "Environment variables"
   - Add: `VITE_API_URL` = `https://study-bloom-backend.onrender.com`

6. **Click "Deploy site"**

7. **Wait for build** (3-5 minutes)

8. **Your site is live!** Copy the URL (e.g., `https://amazing-app-123.netlify.app`)

**Option B: Deploy via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build your app
npm run build

# Deploy
netlify deploy --prod
```

### Step 3: Update Backend CORS Settings

Now that you have your Netlify URL, update the backend:

1. **Go back to Render.com**
2. **Open your backend service**
3. **Go to "Environment"**
4. **Update `FRONTEND_URL`** to your Netlify URL:
   ```
   FRONTEND_URL=https://your-actual-app.netlify.app
   ```
5. **Click "Save Changes"** (this will redeploy the backend)

---

## Part 4: Configure Custom Domain (Optional)

### For Netlify (Frontend):

1. **Go to Site Settings** → "Domain management"
2. **Click "Add custom domain"**
3. **Enter your domain** (e.g., `studybloom.com`)
4. **Follow DNS configuration instructions**
5. **Enable HTTPS** (automatic with Let's Encrypt)

### For Render (Backend):

1. **Go to your service** → "Settings"
2. **Scroll to "Custom Domain"**
3. **Add your API subdomain** (e.g., `api.studybloom.com`)
4. **Update DNS records** as instructed

---

## Part 5: Post-Deployment Checklist

### ✅ Test Your Deployment

1. **Visit your Netlify URL**
2. **Test user registration**
3. **Test login**
4. **Test exam questions**
5. **Test subscription flow**
6. **Test image zoom feature**

### ✅ Monitor Your Apps

**Netlify:**
- Check build logs: Site → "Deploys"
- Monitor analytics: Site → "Analytics"

**Render:**
- Check logs: Service → "Logs"
- Monitor metrics: Service → "Metrics"

### ✅ Set Up Continuous Deployment

Both Netlify and Render automatically redeploy when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature X"
git push origin main

# Both frontend and backend will auto-deploy!
```

---

## 🔧 Troubleshooting

### Frontend Issues

**Build fails on Netlify:**
- Check Node version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

**API calls fail:**
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running on Render

### Backend Issues

**Backend won't start:**
- Check environment variables are set
- Verify MongoDB connection string
- Check Render logs for errors

**CORS errors:**
- Verify `FRONTEND_URL` matches your Netlify URL exactly
- Check `server.js` CORS configuration

**Database connection fails:**
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check connection string is correct

---

## 📊 Free Tier Limitations

### Netlify Free Tier:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment

### Render Free Tier:
- ✅ 750 hours/month (enough for 1 service)
- ⚠️ Spins down after 15 min of inactivity (first request may be slow)
- ✅ Automatic HTTPS
- ✅ Continuous deployment

### MongoDB Atlas Free Tier:
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ Good for ~5000-10000 questions

---

## 🚀 Next Steps

1. **Set up monitoring**: Use services like UptimeRobot to keep your backend awake
2. **Configure backups**: Set up MongoDB Atlas backups
3. **Add analytics**: Integrate Google Analytics or similar
4. **Set up error tracking**: Use Sentry or similar service
5. **Optimize images**: Compress images in `src/images/` for faster loading

---

## 📞 Need Help?

If you encounter issues:
1. Check the logs (Netlify Deploy logs, Render Service logs)
2. Verify all environment variables are set correctly
3. Test API endpoints directly using Postman or curl
4. Check MongoDB Atlas network access settings

---

**Congratulations! Your medical study app is now live! 🎉**

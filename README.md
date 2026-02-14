# Study Bloom - Medical Education Platform

A comprehensive medical study application for rheumatology education with interactive flashcards, image-based questions, and subscription-based premium features.

## 🚀 Quick Deploy

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for step-by-step deployment instructions.

## 📚 Features

- **Interactive Flashcards**: 662+ rheumatology questions with detailed explanations
- **Image-Based Learning**: Clinical images with zoom functionality
- **Smart Subscription Model**: First question free, premium access for detailed explanations
- **Progress Tracking**: Monitor your learning journey
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui components

**Backend:**
- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- Stripe Payments

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account (for payments)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/study-bloom-app.git
   cd study-bloom-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   FRONTEND_URL=http://localhost:8080
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Run the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   npm run dev
   ```

5. **Access the app**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:5000

## 📦 Deployment

### Frontend (Netlify)
- Automatic deployment from GitHub
- Environment variable: `VITE_API_URL`
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Backend (Render.com)
- Automatic deployment from GitHub
- Free tier available
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📝 License

All rights reserved. This is proprietary software for medical education.

## 🤝 Support

For issues or questions, please contact the development team.

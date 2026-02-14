# 🚀 PathDojo Backend Setup Instructions

## Step-by-Step Setup Guide

### 1️⃣ Install MongoDB

**Option A: Local MongoDB**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/pathdojo`)

### 2️⃣ Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from example)
# Windows:
copy .env.example .env

# macOS/Linux:
cp .env.example .env
```

### 3️⃣ Configure Environment Variables

Edit `backend/.env`:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/pathdojo
# OR for Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pathdojo

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8080

# Node Environment
NODE_ENV=development
```

**Generate JWT Secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Seed Database (Load Questions)

```bash
cd backend
npm run seed
```

This will:
- Connect to MongoDB
- Clear existing questions
- Insert 50 pathology questions
- Show category breakdown

### 5️⃣ Start Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📍 Frontend URL: http://localhost:8080
```

### 6️⃣ Test the API

Open browser or use Postman:
```
GET http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-XX..."
}
```

---

## 🔗 Frontend Integration

### Update Frontend API Configuration

Create/update `src/config/api.ts` or similar:

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};
```

### Update Auth Page (`src/pages/Auth.tsx`)

Replace the mock authentication:

```typescript
import { apiRequest } from '@/config/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await apiRequest('/auth/' + (isSignUp ? 'register' : 'login'), {
      method: 'POST',
      body: JSON.stringify({
        ...(isSignUp && { fullName }),
        email,
        password,
      }),
    });

    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: isSignUp 
          ? "Your account has been created successfully." 
          : "You have been logged in successfully.",
      });
      
      navigate("/dashboard");
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
```

### Update Exam Page (`src/pages/Exam.tsx`)

Fetch questions from API:

```typescript
import { useEffect, useState } from 'react';
import { apiRequest } from '@/config/api';

const [questions, setQuestions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const response = await apiRequest('/questions?limit=50');
      if (response.success) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchQuestions();
}, []);
```

### Update Subscription & Checkout

Similar pattern - replace mock calls with `apiRequest()` calls to:
- `/api/subscriptions/plans`
- `/api/subscriptions/create`
- `/api/subscriptions/current`

### Update Stats Page

Fetch real statistics:
```typescript
const fetchStats = async () => {
  try {
    const [summary, performance, category] = await Promise.all([
      apiRequest('/stats/summary'),
      apiRequest('/stats/performance'),
      apiRequest('/stats/category'),
    ]);
    
    // Update state with real data
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};
```

---

## 🔐 Protected Routes

Add authentication check in frontend:

```typescript
// Create src/utils/auth.ts
export const getAuthToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getAuthToken();

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth';
};

// Use in App.tsx or create AuthRoute component
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" />;
  }
  return children;
};
```

---

## 📝 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Questions (with token):**
```bash
curl http://localhost:5000/api/questions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the collection (if available)
2. Set environment variable `base_url = http://localhost:5000/api`
3. Set `token` variable after login
4. Use `{{token}}` in Authorization header

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- Check firewall/network settings

### Port Already in Use
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or kill process using port 5000

### CORS Errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check browser console for specific CORS error

### Token Expired
- Tokens expire after 30 days
- User needs to login again
- Or implement token refresh logic

### Questions Not Loading
- Run `npm run seed` to populate database
- Check MongoDB connection
- Verify question collection exists

---

## 📦 Production Deployment

### Environment Variables
Set production values:
```env
NODE_ENV=production
MONGO_URI=<production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
FRONTEND_URL=<production-frontend-url>
PORT=5000
```

### Build & Deploy
```bash
# Install production dependencies only
npm ci --production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name pathdojo-api

# Or use Docker
# (Create Dockerfile if needed)
```

---

## ✅ Checklist

- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Database seeded (`npm run seed`)
- [ ] Backend server running (`npm run dev`)
- [ ] Health check works (`/api/health`)
- [ ] Frontend API calls updated
- [ ] Authentication flow working
- [ ] Questions loading from API
- [ ] Statistics displaying correctly

---

## 📞 Need Help?

Check the backend README.md for detailed API documentation:
```
backend/README.md
```

For questions or issues, refer to the API documentation or check server logs.





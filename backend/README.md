# PathDojo Backend API

Complete Node.js + Express + MongoDB backend for the PathDojo pathology learning platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   ```env
   MONGO_URI=mongodb://localhost:27017/pathdojo
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   FRONTEND_URL=http://localhost:8080
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod --dbpath /path/to/data
   ```

5. **Seed the database** (optional - loads 50 questions)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com"
}
```

### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 📝 Questions Endpoints

### Get All Questions
```http
GET /api/questions?category=anatomic&difficulty=medium&page=1&limit=20
```

**Query Parameters:**
- `category` (optional): anatomic, clinical, forensic, cytopathology, anatomic-clinical
- `difficulty` (optional): easy, medium, hard
- `page` (optional): page number (default: 1)
- `limit` (optional): items per page (default: 50)

### Get Question by ID
```http
GET /api/questions/:id
```

### Get Category Statistics
```http
GET /api/questions/stats/categories
```

**Admin Only:**
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

---

## 📊 Exam Endpoints

**Requires:** Authentication + Active Subscription

### Submit Answer
```http
POST /api/exam/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionId": "507f1f77bcf86cd799439011",
  "selectedAnswer": "Correct answer text",
  "timeSpent": 45
}
```

### Get Exam Attempts
```http
GET /api/exam/attempts?page=1&limit=20&questionId=507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

---

## 💳 Subscription Endpoints

### Get Available Plans
```http
GET /api/subscriptions/plans
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plans": {
      "anatomic-clinical": {
        "1m": 59.99,
        "3m": 99.99,
        "12m": 149.99
      },
      ...
    }
  }
}
```

### Get Current Subscription
```http
GET /api/subscriptions/current
Authorization: Bearer <token>
```

### Create Subscription
```http
POST /api/subscriptions/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "anatomic-clinical",
  "plan": "3m",
  "paymentMethod": "card",
  "paymentDetails": {
    "last4": "4242"
  }
}
```

### Cancel Subscription
```http
PUT /api/subscriptions/:id/cancel
Authorization: Bearer <token>
```

### Renew Subscription
```http
PUT /api/subscriptions/:id/renew
Authorization: Bearer <token>
```

---

## 📈 Statistics Endpoints

**Requires:** Authentication

### Get Stats Summary
```http
GET /api/stats/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalQuestionsAnswered": 148,
    "totalCorrect": 121,
    "totalIncorrect": 27,
    "accuracyRate": 82,
    "totalStudyTime": 86400,
    "studyTimeHours": 24.0
  }
}
```

### Get Performance Over Time
```http
GET /api/stats/performance?weeks=4
Authorization: Bearer <token>
```

### Get Category Breakdown
```http
GET /api/stats/category
Authorization: Bearer <token>
```

---

## 📧 Contact Endpoint

### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about features",
  "message": "I have a question..."
}
```

---

## 🗄️ Database Models

### User
- fullName, email, password (hashed)
- role (user/admin)
- subscriptionStatus

### Question
- text, category, options[], summary, diagram, difficulty

### ExamAttempt
- userId, questionId, selectedAnswer, isCorrect, timeSpent

### Subscription
- userId, category, plan, price, status, startDate, endDate

### UserProgress
- Aggregated statistics and performance data

### ContactMessage
- name, email, subject, message, status

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS configuration
- Error handling middleware

---

## 🛠️ Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed database with questions

### Project Structure
```
backend/
├── src/
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middlewares/   # Auth, error handling
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   └── utils/         # Helper functions
├── server.js          # Entry point
├── package.json
└── .env.example
```

---

## 📝 Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...] // Optional validation errors
}
```

---

## 🔗 Frontend Integration

Update your frontend API calls to use:
```javascript
const API_URL = 'http://localhost:5000/api';

// Example: Login
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      // Save user data
    }
  });
```

---

## 📞 Support

For issues or questions, contact: support@pathdojo.com

---

## 📄 License

ISC





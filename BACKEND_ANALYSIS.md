# Backend Analysis & Database Schema Proposal

## Frontend Analysis Summary

### 1. Authentication System
- **Sign Up**: fullName, email, password
- **Sign In**: email, password
- **Profile Update**: fullName, email
- **Password Change**: (mentioned in sidebar)
- **Current Implementation**: Mock with setTimeout

### 2. Question Bank System
- **50 questions** stored in `src/data/questions.ts`
- **Question Structure**:
  - text (question)
  - options[] (text, explanation, isCorrect)
  - summary (optional)
  - diagram (boolean)
- **Categories**: Anatomic, Clinical, Forensic, Cytopathology, Anatomic+Clinical (combined)
- **Current Implementation**: Static array

### 3. Exam System
- Navigate through questions (Previous/Next)
- Select answer
- Show/Hide answer with explanations
- Track progress through question set
- **Current Implementation**: Client-side only

### 4. Subscription System
- **5 Categories**:
  1. Anatomic and Clinical Pathology (combined) - $159/1m, $399/3m, $699/6m, $1199/12m
  2. Anatomic Pathology - $99/1m, $249/3m, $449/6m, $799/12m
  3. Clinical Pathology - $89/1m, $229/3m, $399/6m, $699/12m
  4. Forensic Pathology - $69/1m, $179/3m, $299/6m, $499/12m
  5. Cytopathology - $59/1m, $149/3m, $259/6m, $449/12m
- **Billing Periods**: 1 month, 3 months, 6 months, 12 months
- **Payment Methods**: Card, Cash App Pay, Bank Transfer
- **Checkout**: Email, payment method, billing address (for bank)
- **Subscription Status**: Check if user is subscribed
- **Current Implementation**: Mock navigation

### 5. Statistics/Progress Tracking
- Performance over time (bar chart)
- Questions by category (pie chart)
- Total questions answered
- Accuracy rate
- Study time
- **Current Implementation**: Static mock data

### 6. Contact Form
- Name, email, subject, message
- **Current Implementation**: Toast notification only

### 7. Dashboard
- Shows subscription status
- Links to exam, stats, subscription
- **Current Implementation**: Static

---

## Proposed Database Schema

### 1. User Model
```javascript
{
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (default: 'user'),
  subscriptionStatus: {
    isActive: Boolean,
    category: String,
    plan: String, // '1m', '3m', '6m', '12m'
    startDate: Date,
    endDate: Date,
    autoRenew: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Question Model
```javascript
{
  _id: ObjectId,
  text: String (required),
  category: String (required), // 'anatomic', 'clinical', 'forensic', 'cytopathology', 'anatomic-clinical'
  options: [{
    text: String (required),
    explanation: String (required),
    isCorrect: Boolean (required)
  }],
  summary: String,
  diagram: Boolean (default: false),
  difficulty: String, // 'easy', 'medium', 'hard'
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Exam Attempt Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  questionId: ObjectId (ref: Question),
  selectedAnswer: String,
  isCorrect: Boolean,
  timeSpent: Number, // seconds
  createdAt: Date
}
```

### 4. Subscription Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  category: String (required),
  plan: String (required), // '1m', '3m', '6m', '12m'
  price: Number (required),
  status: String, // 'active', 'expired', 'cancelled'
  startDate: Date,
  endDate: Date,
  autoRenew: Boolean (default: false),
  paymentMethod: String, // 'card', 'cashapp', 'bank'
  paymentDetails: {
    // Store minimal info, use payment provider for actual processing
    last4?: String,
    bankName?: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Contact Message Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  status: String (default: 'new'), // 'new', 'read', 'replied'
  createdAt: Date
}
```

### 6. User Progress Model (for statistics)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  totalQuestionsAnswered: Number (default: 0),
  totalCorrect: Number (default: 0),
  totalIncorrect: Number (default: 0),
  accuracyRate: Number (default: 0), // percentage
  totalStudyTime: Number (default: 0), // seconds
  categoryStats: {
    anatomic: { answered: Number, correct: Number },
    clinical: { answered: Number, correct: Number },
    forensic: { answered: Number, correct: Number },
    cytopathology: { answered: Number, correct: Number },
    'anatomic-clinical': { answered: Number, correct: Number }
  },
  weeklyPerformance: [{
    week: String, // 'YYYY-WW'
    correct: Number,
    incorrect: Number
  }],
  updatedAt: Date
}
```

---

## API Endpoints Required

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me (get current user)
- PUT /api/auth/profile (update profile)
- PUT /api/auth/change-password

### Questions
- GET /api/questions (with filters: category, difficulty, pagination)
- GET /api/questions/:id
- POST /api/questions (admin only - for seeding)
- PUT /api/questions/:id (admin only)
- DELETE /api/questions/:id (admin only)

### Exam
- POST /api/exam/start (create exam session)
- POST /api/exam/answer (submit answer)
- GET /api/exam/attempts (user's exam attempts)

### Subscriptions
- GET /api/subscriptions/plans (get all available plans)
- GET /api/subscriptions/current (get user's current subscription)
- POST /api/subscriptions/create (create subscription)
- PUT /api/subscriptions/:id/cancel (cancel subscription)
- PUT /api/subscriptions/:id/renew (renew subscription)

### Statistics
- GET /api/stats/summary (user's stats summary)
- GET /api/stats/performance (performance over time)
- GET /api/stats/category (category breakdown)

### Contact
- POST /api/contact (submit contact form)

---

## Required Backend Features

1. **JWT Authentication** - Token-based auth
2. **Password Hashing** - bcrypt
3. **Input Validation** - Zod or express-validator
4. **Error Handling** - Centralized error handler
5. **Database Seeding** - Script to seed questions from questions.ts
6. **CORS** - Enable CORS for frontend
7. **Environment Variables** - MongoDB URI, JWT secret, port

---

## Next Steps

1. ✅ Analysis complete
2. ⏳ Waiting for approval of database schema
3. ⏳ Generate backend code after approval



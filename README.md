# 💰 The Financial Atelier

**A modern, full-stack personal finance management application**

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

[View in AI Studio](https://ai.studio/apps/e2ccbe36-e2be-49b0-83a1-68335a39a7ff)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [UI Design](#-ui-design)
- [Quick Start](#-quick-start)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)

---

## 🎯 Overview

**The Financial Atelier** is a comprehensive personal finance management platform that helps users track expenses, manage budgets, set financial goals, and analyze spending patterns. Built with modern technologies and best practices, it offers a seamless experience across all devices.

---

## ✨ Features

### 💳 Transaction Management
- Add, edit, and delete income/expense transactions
- Categorize transactions (Food, Transport, Entertainment, etc.)
- Real-time transaction history with MongoDB integration
- Search and filter capabilities
- **CSV Export** - Download filtered transactions with timestamps
- **PDF Export** - Generate printable transaction reports

### 📊 Budget Tracking
- Create monthly budgets by category
- Visual progress indicators with real spending data
- Budget vs. actual spending comparison from MongoDB
- **Over-budget warnings** with red indicators
- Real-time spending calculations

### 🎯 Financial Goals
- Set savings goals with target amounts
- Track progress with visual indicators
- Update goal contributions
- Goal completion tracking
- **Real-time progress** on Dashboard

### 💵 Cash Flow Management
- Track cash in/out transactions
- Real-time cash balance
- Separate from bank transactions
- Cash flow summary

### 💰 Loan Management
- Track money lent to others
- Track money borrowed from others
- Due date reminders
- Loan status tracking
- **Card grid layout** (3-column responsive design)
- Summary cards with total lent/borrowed amounts

### 📈 Analytics & Insights
- **Real MongoDB data integration**
- Monthly spending trends with dynamic calculations
- Category-wise breakdown with percentages
- Income vs. expense charts
- Financial health overview with KPIs
- Interactive donut charts
- Trend indicators (up/down arrows)

### 👤 User Management
- Secure authentication (JWT + Google OAuth)
- User profile management
- Password encryption
- Session management
- **Profile image upload** (base64 storage, max 2MB)
- **Profile image display** in TopBar with initials fallback
- Real-time profile updates

### 💎 Subscription Management
- **Free tier** ($0/month) with basic features
- **Pro tier** ($9.99/month) with advanced features
- Monthly/Yearly billing toggle with 20% savings
- Feature comparison table
- FAQ section

### 🎧 Support System
- **Ticket submission** (name, email, category, subject, message)
- Ticket history with status indicators
- FAQ accordion
- Contact options (Email, Phone, Live Chat)

### 🔔 Notifications
- **4 notification types** (Budget, Goals, Payments, System)
- Filter by type and read/unread status
- Mark as read/delete actions
- Notification preferences
- Relative timestamps

### 🎨 Modern UI/UX
- Responsive design (Mobile, Tablet, Desktop)
- Material Design 3 principles
- Smooth animations with Framer Motion
- Consistent color scheme (Primary #0145f2, Secondary #006499)
- Typography system (Manrope headlines, Inter body)
- Mobile-first responsive font scaling
- Intuitive navigation

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **React Router** | Client-side routing |
| **Motion** (Framer Motion) | Animations |
| **Lucide React** | Icon library |
| **@react-oauth/google** | Google authentication |
| **@google/genai** | AI integration |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python web framework |
| **Motor** | Async MongoDB driver |
| **MongoDB** | NoSQL database |
| **JWT** | Token-based authentication |
| **Bcrypt** | Password hashing |
| **Pydantic** | Data validation |
| **Uvicorn** | ASGI server |
| **Python-Jose** | JWT encoding/decoding |
| **Authlib** | OAuth implementation |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│              (React + TypeScript + Vite)                 │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     │ JWT Authentication
┌────────────────────▼────────────────────────────────────┐
│                  FastAPI Backend                         │
│              (Python + Async/Await)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Routes: Auth, Transactions, Budgets, Goals      │   │
│  │  Middleware: CORS, Authentication                │   │
│  │  Validation: Pydantic Schemas                    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ Motor (Async Driver)
┌────────────────────▼────────────────────────────────────┐
│                   MongoDB Database                       │
│  Collections: users, transactions, budgets, goals,       │
│               cash, loans                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Design

### Design System
- **Framework**: Material Design 3
- **Color Palette**: Custom financial theme
  - Primary: Blue tones
  - Success: Green
  - Warning: Orange
  - Error: Red
- **Typography**: System fonts with fallbacks
- **Spacing**: 4px base unit
- **Border Radius**: Rounded corners (8px, 12px, 16px)

### Pages & Components

#### 🏠 Landing Page
- Hero section with CTA
- Feature highlights
- Responsive layout

#### 🔐 Authentication Page
- Login/Register forms
- Google OAuth integration
- Form validation
- Error handling

#### 📊 Dashboard
- Financial overview cards
- Recent transactions
- Budget summary
- Quick actions
- Analytics preview

#### 💸 Transactions Page
- Transaction list with filters
- Add/Edit transaction forms
- Category badges
- Date sorting

#### 💰 Budget Page
- Budget cards with progress bars
- Add budget form
- Category-wise tracking
- Visual indicators

#### 🎯 Goals Page
- Goal cards with progress
- Add/Update goal forms
- Completion tracking
- Visual progress bars

#### 💵 Cash Management
- Cash in/out entries
- Balance summary
- Transaction history

#### 📈 Analytics Page
- Interactive charts
- Monthly trends
- Category breakdown
- Spending insights

#### ⚙️ Settings Page
- Profile management
- Edit user information
- Account settings

### Responsive Breakpoints
```css
Mobile:  375px - 767px
Tablet:  768px - 1023px
Desktop: 1024px+
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn**

### Clone Repository
```bash
git clone <repository-url>
cd the-financial-atelier
```

---

## 🔧 Backend Setup

### 1. Install MongoDB
```bash
# Ubuntu/Debian
sudo apt install mongodb
sudo systemctl start mongodb

# macOS
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### 2. Setup Python Environment
```bash
cd backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create `backend/.env`:
```env
MONGODB_URL=mongodb+srv://Druminaa:Dipak%40141202@money911.ivts6m3.mongodb.net/
DATABASE_NAME=Druminaa
SECRET_KEY=your-super-secret-key-change-in-production
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

**Note**: The project uses MongoDB Atlas cloud database. For local development, you can use `mongodb://localhost:27017` instead.

### 5. Run Backend Server
```bash
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

---

## 💻 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT token | ❌ |
| POST | `/api/auth/google` | Google OAuth login | ❌ |

### Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/transactions` | Get all transactions | ✅ |
| POST | `/api/transactions` | Create transaction | ✅ |
| DELETE | `/api/transactions/{id}` | Delete transaction | ✅ |
| GET | `/api/transactions/summary` | Income/expense summary | ✅ |

### Budget Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/budgets` | Get all budgets | ✅ |
| POST | `/api/budgets` | Create budget | ✅ |
| DELETE | `/api/budgets/{id}` | Delete budget | ✅ |

### Goals Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/goals` | Get all goals | ✅ |
| POST | `/api/goals` | Create goal | ✅ |
| PATCH | `/api/goals/{id}` | Update goal progress | ✅ |
| DELETE | `/api/goals/{id}` | Delete goal | ✅ |

### Cash Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cash` | Get cash entries | ✅ |
| POST | `/api/cash` | Add cash entry | ✅ |
| DELETE | `/api/cash/{id}` | Delete cash entry | ✅ |
| GET | `/api/cash/summary` | Cash balance summary | ✅ |

### Loan Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/loans` | Get all loans | ✅ |
| POST | `/api/loans` | Create loan | ✅ |
| DELETE | `/api/loans/{id}` | Delete loan | ✅ |

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/summary` | Analytics overview | ✅ |
| GET | `/api/analytics/monthly` | Monthly breakdown | ✅ |
| GET | `/api/analytics/categories` | Category breakdown | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user | ✅ |
| PATCH | `/api/users/me` | Update profile | ✅ |

---

## 🗄 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  created_at: DateTime,
  google_id: String (optional),
  profile_image: String (optional, base64 encoded, max 2MB)
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  type: String ("income" | "expense"),
  amount: Number,
  category: String,
  description: String,
  date: DateTime,
  created_at: DateTime
}
```

### Budgets Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  category: String,
  amount: Number,
  month: String,
  created_at: DateTime
}
```

### Goals Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  name: String,
  target_amount: Number,
  current_amount: Number,
  deadline: DateTime,
  created_at: DateTime
}
```

### Cash Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  type: String ("in" | "out"),
  amount: Number,
  description: String,
  date: DateTime,
  created_at: DateTime
}
```

### Loans Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  type: String ("lent" | "borrowed"),
  person: String,
  amount: Number,
  due_date: DateTime,
  status: String,
  created_at: DateTime
}
```

---

## 🔐 Authentication

### JWT Authentication
- Token-based authentication
- Tokens stored in localStorage
- Automatic token refresh
- Protected routes

### Google OAuth 2.0
- One-click Google sign-in
- Auto-create user accounts
- Secure token verification
- See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for setup

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- CORS protection
- Input validation
- SQL injection prevention

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

Environment variables:
```env
VITE_API_URL=https://your-backend-api.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend Deployment (Railway/Render/AWS)
```bash
cd backend
# Deploy with Dockerfile or requirements.txt
```

Environment variables:
```env
MONGODB_URL=mongodb+srv://...
DATABASE_NAME=financial_atelier
SECRET_KEY=production-secret-key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 📁 Project Structure

```
the-financial-atelier/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── forms/         # Form components
│   │   │   ├── Layout.tsx     # Main layout
│   │   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   │   └── TopBar.tsx     # Top navigation
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── Budget.tsx
│   │   │   ├── Goals.tsx
│   │   │   ├── Cash.tsx
│   │   │   ├── BorrowLoan.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Subscription.tsx
│   │   │   ├── Support.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── AuthPage.tsx
│   │   │   └── LandingPage.tsx
│   │   ├── lib/               # Utilities
│   │   │   └── api.ts         # API client
│   │   ├── App.tsx            # Main app
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.local
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   │   ├── auth.py
│   │   │   ├── transactions.py
│   │   │   ├── budgets.py
│   │   │   ├── goals.py
│   │   │   └── other.py
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── auth.py            # Auth utilities
│   │   ├── config.py          # Configuration
│   │   └── database.py        # DB connection
│   ├── main.py                # FastAPI app
│   ├── requirements.txt
│   └── .env
│
├── GOOGLE_OAUTH_SETUP.md       # OAuth setup guide
└── README.md                   # This file
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Restart MongoDB
sudo systemctl restart mongodb
```

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 🎯 Implementation Status

### ✅ Phase 1 (7 Features - Complete)
1. ✅ Goals page form submission fix
2. ✅ Dashboard real MongoDB data integration
3. ✅ Transactions CSV/PDF export
4. ✅ Analytics real data connection
5. ✅ Budget real data with over-budget warnings
6. ✅ Borrow/Loan card grid layout
7. ✅ TopBar real user data with profile images

### ✅ Phase 2 (4 Features - Complete)
1. ✅ Settings image upload (base64, max 2MB)
2. ✅ Subscription page (Free/Pro tiers)
3. ✅ Support page (ticket system + FAQ)
4. ✅ Notifications page (filtering + management)

### 📊 Overall Progress: 11/11 Features (100%)

---

## 🎨 Design System

### Color Palette
- **Primary**: #0145f2 (Blue)
- **Secondary**: #006499 (Teal)
- **Tertiary**: #9f403a (Red)
- **Success**: Green tones
- **Warning**: Orange tones
- **Error**: Red tones

### Typography
- **Headlines**: Manrope font family
- **Body**: Inter font family
- **Font Scale**: 10px (timestamps) to 24px (titles)
- **Responsive**: Mobile-first with `md:` breakpoint at 768px

### Spacing & Layout
- **Mobile**: 12-16px padding
- **Desktop**: 20-32px padding
- **Cards**: rounded-2xl (16px radius)
- **Buttons**: rounded-full
- **Grid**: 3-column responsive layout

---

## 🔄 Recent Updates

### Latest Changes
- Fixed font sizes across all pages for better readability
- Implemented mobile-first responsive font scaling
- Added profile image upload with base64 storage
- Created Subscription, Support, and Notifications pages
- Integrated real MongoDB data across Dashboard, Analytics, Budget
- Added CSV/PDF export functionality to Transactions
- Converted Borrow/Loan to card grid layout

### Known Limitations
- Subscription, Support, and Notifications use mock data (backend endpoints pending)
- Dark/Light theme toggle not yet implemented
- Email notifications not yet configured

---

## 📧 Support

For issues and questions, please open an issue on GitHub or use the in-app Support page.

---

<div align="center">

**Built with ❤️ using React, FastAPI, and MongoDB**

**Money911 - The Financial Atelier**

</div>

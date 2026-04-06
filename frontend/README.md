# 🎨 Frontend - The Financial Atelier

React + TypeScript + Vite frontend application.

## 📁 Structure

```
frontend/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── lib/           # Utilities and API client
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── index.html         # HTML template
├── package.json       # Dependencies
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── .env.local         # Environment variables
```

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔧 Environment Variables

Create `.env.local` file:

```env
VITE_API_URL=http://localhost:8000
```

## 📦 Dependencies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Motion** (Framer Motion) - Animations
- **Lucide React** - Icons

## 🎯 Features

- ✅ User authentication (Login/Register)
- ✅ Dashboard with financial overview
- ✅ Transaction management
- ✅ Budget tracking
- ✅ Financial goals
- ✅ Cash flow management
- ✅ User profile settings
- ✅ Responsive design
- ✅ Real-time data from MongoDB

## 🔗 API Integration

Frontend connects to backend API at `http://localhost:8000`

All API calls are in: `src/lib/api.ts`

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Lint
npm run lint         # Run ESLint
```

## 🌐 Pages

- `/` - Landing page
- `/auth` - Login/Register
- `/dashboard` - Main dashboard
- `/transactions` - Transaction management
- `/budget` - Budget tracking
- `/goals` - Financial goals
- `/cash` - Cash flow
- `/analytics` - Analytics & charts
- `/settings` - User profile & settings

## 🎨 Styling

Uses Tailwind CSS with custom Material Design 3 theme.

Colors defined in `src/index.css`

## 🔐 Authentication

JWT tokens stored in localStorage:
- `token` - JWT access token
- `user` - User information

Protected routes require authentication.

## 📱 Responsive Design

- Mobile: 375px+
- Tablet: 768px+
- Desktop: 1024px+

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Environment Variables for Production
```env
VITE_API_URL=https://your-backend-api.com
```

## 🆘 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
npm run build -- --debug
```

## 📞 Support

For issues, check the main project documentation in the root folder.

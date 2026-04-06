import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from './components/Layout';
import CoinFlipLoader from './components/CoinFlipLoader';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Budget = lazy(() => import('./pages/Budget'));
const Goals = lazy(() => import('./pages/Goals'));
const BorrowLoan = lazy(() => import('./pages/BorrowLoan'));
const Settings = lazy(() => import('./pages/Settings'));
const Cash = lazy(() => import('./pages/Cash'));

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Suspense fallback={<CoinFlipLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes (Wrapped in Layout) */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/borrow-loan" element={<BorrowLoan />} />
              <Route path="/cash" element={<Cash />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

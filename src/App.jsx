import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { CompetitorLeaderboard } from './pages/CompetitorLeaderboard';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import { GrowthJourney } from './pages/GrowthJourney';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded } = useApp();
  return (isAuthenticated && isOnboarded) ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="competitors" element={<CompetitorLeaderboard />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="subscription" element={<SubscriptionPlans />} />
        <Route path="journey" element={<GrowthJourney />} />
        <Route path="settings" element={<div className="text-center py-20 text-gray-600">Settings page coming soon...</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <SpeedInsights />
        <Analytics />
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;

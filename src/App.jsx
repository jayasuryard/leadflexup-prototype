import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import { GrowthJourney } from './pages/GrowthJourney';
import { WebsiteBuilder } from './pages/WebsiteBuilder';
import { ContentStudio } from './pages/ContentStudio';
import { AutomationHub } from './pages/AutomationHub';
import { LeadManager } from './pages/LeadManager';

// Only require onboarded (analysis done), NOT authenticated
const OnboardedRoute = ({ children }) => {
  const { isOnboarded } = useApp();
  return isOnboarded ? children : <Navigate to="/" replace />;
};

// Require both auth + onboarded for premium features
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded } = useApp();
  return (isAuthenticated && isOnboarded) ? children : <Navigate to="/dashboard/analytics" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <OnboardedRoute>
            <DashboardLayout />
          </OnboardedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="website" element={<AuthRoute><WebsiteBuilder /></AuthRoute>} />
        <Route path="content" element={<AuthRoute><ContentStudio /></AuthRoute>} />
        <Route path="automation" element={<AuthRoute><AutomationHub /></AuthRoute>} />
        <Route path="leads" element={<AuthRoute><LeadManager /></AuthRoute>} />
        <Route path="subscription" element={<SubscriptionPlans />} />
        <Route path="journey" element={<AuthRoute><GrowthJourney /></AuthRoute>} />
        <Route path="settings" element={<AuthRoute><div className="text-center py-20 text-navy-400">Settings coming soon...</div></AuthRoute>} />
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

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { NewspaperHome } from './pages/NewspaperHome';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import { WebsiteBuilder } from './pages/WebsiteBuilder';
import { ContentStudio } from './pages/ContentStudio';
import { AutomationHub } from './pages/AutomationHub';
import { LeadManager } from './pages/LeadManager';
import { ProspectIntelligence } from './pages/ProspectIntelligence';
import { UnifiedInbox } from './pages/UnifiedInbox';
import { SettingsPage } from './pages/SettingsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { BlogPage } from './pages/BlogPage';
import { ProductAnalytics } from './pages/products/ProductAnalytics';
import { ProductWebsiteBuilder } from './pages/products/ProductWebsiteBuilder';
import { ProductContentStudio } from './pages/products/ProductContentStudio';
import { ProductAutomation } from './pages/products/ProductAutomation';
import { ProductLeadManager } from './pages/products/ProductLeadManager';
import { ProductInbox } from './pages/products/ProductInbox';
import { ProductProspectIntel } from './pages/products/ProductProspectIntel';
import { ProductVoiceAgent } from './pages/products/ProductVoiceAgent';
import { ProductCompetitorIntel } from './pages/products/ProductCompetitorIntel';

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
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/products/analytics" element={<ProductAnalytics />} />
      <Route path="/products/website-builder" element={<ProductWebsiteBuilder />} />
      <Route path="/products/content-studio" element={<ProductContentStudio />} />
      <Route path="/products/automation" element={<ProductAutomation />} />
      <Route path="/products/lead-manager" element={<ProductLeadManager />} />
      <Route path="/products/inbox" element={<ProductInbox />} />
      <Route path="/products/prospect-intel" element={<ProductProspectIntel />} />
      <Route path="/products/voice-agent" element={<ProductVoiceAgent />} />
      <Route path="/products/competitor-intel" element={<ProductCompetitorIntel />} />
      <Route
        path="/dashboard"
        element={
          <OnboardedRoute>
            <DashboardLayout />
          </OnboardedRoute>
        }
      >
        <Route index element={<NewspaperHome />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="website" element={<AuthRoute><WebsiteBuilder /></AuthRoute>} />
        <Route path="content" element={<AuthRoute><ContentStudio /></AuthRoute>} />
        <Route path="automation" element={<AuthRoute><AutomationHub /></AuthRoute>} />
        <Route path="leads" element={<AuthRoute><LeadManager /></AuthRoute>} />
        <Route path="inbox" element={<UnifiedInbox />} />
        <Route path="prospects" element={<AuthRoute><ProspectIntelligence /></AuthRoute>} />
        <Route path="subscription" element={<SubscriptionPlans />} />
        <Route path="settings" element={<AuthRoute><SettingsPage /></AuthRoute>} />
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

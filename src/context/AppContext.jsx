import { createContext, useContext, useState, useEffect } from 'react';
import { generateAnalyticsData, generateRecommendations } from '../data/mockDatabase';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [currentUser, setCurrentUser] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [growthProgress, setGrowthProgress] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('leadflexup_data');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setCurrentUser(p.currentUser || null);
        setBusinessData(p.businessData || null);
        setAnalyticsData(p.analyticsData || null);
        setRecommendations(p.recommendations || []);
        setSubscription(p.subscription || null);
        setGrowthProgress(p.growthProgress || {});
        setIsAuthenticated(p.isAuthenticated || false);
        setIsOnboarded(p.isOnboarded || false);
        setLanguage(p.language || 'en');
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser || businessData || subscription) {
      localStorage.setItem('leadflexup_data', JSON.stringify({
        currentUser, businessData, analyticsData, recommendations,
        subscription, growthProgress, isAuthenticated, isOnboarded, language
      }));
    }
  }, [currentUser, businessData, analyticsData, recommendations, subscription, growthProgress, isAuthenticated, isOnboarded, language]);

  const signup = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setBusinessData(null);
    setAnalyticsData(null);
    setRecommendations([]);
    setSubscription(null);
    setGrowthProgress({});
    setIsAuthenticated(false);
    setIsOnboarded(false);
    localStorage.removeItem('leadflexup_data');
  };

  const onboardBusiness = (data) => {
    setBusinessData(data);
    const analytics = generateAnalyticsData(45);
    setAnalyticsData(analytics);
    const recs = generateRecommendations(data, analytics);
    setRecommendations(recs);
    setIsOnboarded(true);
  };

  const selectSubscription = (plan) => setSubscription(plan);

  const updateGrowthProgress = (stepId, taskId, completed) => {
    setGrowthProgress(prev => ({ ...prev, [`${stepId}-${taskId}`]: completed }));
    if (completed && analyticsData) {
      const newScore = Math.min(95, analyticsData.digitalPresence.overall + 5);
      const newAnalytics = generateAnalyticsData(newScore);
      setAnalyticsData(newAnalytics);
      if (businessData) setRecommendations(generateRecommendations(businessData, newAnalytics));
    }
  };

  const changeLanguage = (lang) => setLanguage(lang);

  const value = {
    language, changeLanguage,
    currentUser, isAuthenticated, signup, logout,
    businessData, analyticsData, recommendations,
    subscription, growthProgress, isOnboarded,
    onboardBusiness, selectSubscription, updateGrowthProgress
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

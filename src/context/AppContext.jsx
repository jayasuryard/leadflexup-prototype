import { createContext, useContext, useState, useEffect } from 'react';
import { generateAnalyticsData, generateRecommendations } from '../data/mockDatabase';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
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
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('leadflexup_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setBusinessData(parsed.businessData);
        setAnalyticsData(parsed.analyticsData);
        setRecommendations(parsed.recommendations);
        setSubscription(parsed.subscription);
        setGrowthProgress(parsed.growthProgress || {});
        setIsOnboarded(parsed.isOnboarded || false);
        setLanguage(parsed.language || 'en');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (businessData || subscription) {
      const dataToSave = {
        businessData,
        analyticsData,
        recommendations,
        subscription,
        growthProgress,
        isOnboarded,
        language
      };
      localStorage.setItem('leadflexup_data', JSON.stringify(dataToSave));
    }
  }, [businessData, analyticsData, recommendations, subscription, growthProgress, isOnboarded, language]);

  const onboardBusiness = (data) => {
    setBusinessData(data);
    const analytics = generateAnalyticsData(45); // New business starts with low score
    setAnalyticsData(analytics);
    const recs = generateRecommendations(data, analytics);
    setRecommendations(recs);
    setIsOnboarded(true);
  };

  const selectSubscription = (plan) => {
    setSubscription(plan);
  };

  const updateGrowthProgress = (stepId, taskId, completed) => {
    setGrowthProgress(prev => ({
      ...prev,
      [`${stepId}-${taskId}`]: completed
    }));

    // Improve analytics score as tasks are completed
    if (completed && analyticsData) {
      const currentScore = analyticsData.digitalPresence.overall;
      const newScore = Math.min(95, currentScore + 5);
      const newAnalytics = generateAnalyticsData(newScore);
      setAnalyticsData(newAnalytics);
      
      if (businessData) {
        const newRecs = generateRecommendations(businessData, newAnalytics);
        setRecommendations(newRecs);
      }
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const resetApp = () => {
    setBusinessData(null);
    setAnalyticsData(null);
    setRecommendations([]);
    setSubscription(null);
    setGrowthProgress({});
    setIsOnboarded(false);
    localStorage.removeItem('leadflexup_data');
  };

  const value = {
    language,
    changeLanguage,
    currentUser,
    businessData,
    analyticsData,
    recommendations,
    subscription,
    growthProgress,
    isOnboarded,
    onboardBusiness,
    selectSubscription,
    updateGrowthProgress,
    resetApp
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

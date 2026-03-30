import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Tag, TrendingUp, Sparkles, BarChart3, Target, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { businessCategories } from '../data/mockDatabase';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { language, onboardBusiness } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    category: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    onboardBusiness(formData);
    navigate('/dashboard');
  };

  const features = [
    { 
      icon: BarChart3, 
      title: 'Real-time Analytics',
      description: 'Track digital presence, traffic, and social media performance'
    },
    { 
      icon: Target, 
      title: 'Competitor Intelligence',
      description: 'Know exactly where you stand against competitors'
    },
    { 
      icon: Sparkles, 
      title: 'AI Recommendations',
      description: 'Get actionable insights to improve your market position'
    },
    { 
      icon: Zap, 
      title: 'Marketing Automation',
      description: 'Automated campaigns that generate qualified leads'
    }
  ];

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('onboardingTitle', language)}
              </h2>
              <p className="text-gray-600">
                We'll analyze your market and create a personalized growth strategy
              </p>
            </div>

            {isAnalyzing ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
                />
                <p className="text-lg font-semibold text-gray-900">
                  {t('analyzing', language)}
                </p>
                <p className="text-gray-600 mt-2">
                  Scanning competitors, analyzing market trends...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label={t('businessName', language)}
                  placeholder={t('businessNamePlaceholder', language)}
                  icon={Store}
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />

                <Input
                  label={t('businessAddress', language)}
                  placeholder={t('businessAddressPlaceholder', language)}
                  icon={MapPin}
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  required
                />

                <Select
                  label={t('businessCategory', language)}
                  icon={Tag}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">{t('selectCategory', language)}</option>
                  {businessCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {getLocalizedText(cat.label, language)}
                    </option>
                  ))}
                </Select>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full"
                >
                  {t('continueToAnalysis', language)}
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="border-b border-white/50 backdrop-blur-sm bg-white/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LeadFlexUp
              </span>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => {}}
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-indigo-200 mb-8">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600">
                {t('trustedBy', language)}
              </span>
            </div>
            
            <h1 className="text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
              {t('heroTitle', language)} <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('heroSubtitle', language)}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              {t('heroDescription', language)}
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowOnboarding(true)}
              >
                {t('getStarted', language)}
              </Button>
              <Button variant="outline" size="lg">
                {t('watchDemo', language)}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="p-6 text-center h-full" hover>
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

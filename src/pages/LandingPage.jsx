import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Target, Sparkles, Zap, Globe, Rocket, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { subscriptionPlans } from '../data/mockDatabase';

// Import landing page components
import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
  Footer,
  LanguageSelectorPopup,
  VoiceInputModal,
  SignUpModal,
  LoginModal,
  SocialMediaSidebar
} from '../components/landingpage';

// Business illustration imports
import imgTravel from '../assets/businesses/travel-agency.png';
import imgHotel from '../assets/businesses/hotel-business.png';
import imgToy from '../assets/businesses/toy-shop.png';
import imgIron from '../assets/businesses/iron-fabricator.png';
import imgRestaurant from '../assets/businesses/restaurant-cafe.png';
import imgSalon from '../assets/businesses/beauty-salon.png';

// Trust logo imports
import logoQuickserve from '../assets/logos/logo-quickserve.svg';
import logoPaylocal from '../assets/logos/logo-paylocal.svg';
import logoRideease from '../assets/logos/logo-rideease.svg';
import logoShopnear from '../assets/logos/logo-shopnear.svg';
import logoCraftmart from '../assets/logos/logo-craftmart.svg';
import logoGrowbiz from '../assets/logos/logo-growbiz.svg';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, signup, login, onboardBusiness, subscription, tempFormData, setTempFormData } = useApp();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [languagePopupPosition, setLanguagePopupPosition] = useState({ x: 0, y: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [highlightForm, setHighlightForm] = useState(false);
  
  const planIcons = { starter: Sparkles, professional: Crown, enterprise: Rocket };
  
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    category: '',
    location: null
  });

  // Wrapper to also update context
  const updateFormData = (newData) => {
    setFormData(newData);
    setTempFormData(newData);
  };

  const handleOnboard = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 5000));
    onboardBusiness({
      ...formData,
      businessAddress: formData.location?.address || '',
      businessCity: formData.location?.city || '',
      businessState: formData.location?.state || '',
      businessPincode: formData.location?.pincode || '',
      lat: formData.location?.lat,
      lng: formData.location?.lng
    });
    navigate('/dashboard/analytics');
  };

  const handleGetStarted = () => {
    setHighlightForm(true);
    // Smooth scroll to hero section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignUp = (userData) => {
    signup(userData);
    setShowSignUp(false);
  };

  const handleLogin = (userData) => {
    login(userData);
    setShowLogin(false);
    navigate('/dashboard');
  };

  const handleVoiceTranscript = (transcript) => {
    updateFormData({ ...formData, businessName: transcript });
  };

  const handleLanguageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLanguagePopupPosition({
      x: rect.left,
      y: rect.bottom + 8
    });
    setShowLanguagePopup(true);
  };

  // Data for sections
  const features = [
    { icon: BarChart3, title: t('lpFeature1Title', language), desc: t('lpFeature1Desc', language) },
    { icon: Target, title: t('lpFeature2Title', language), desc: t('lpFeature2Desc', language) },
    { icon: Sparkles, title: t('lpFeature3Title', language), desc: t('lpFeature3Desc', language) },
    { icon: Zap, title: t('lpFeature4Title', language), desc: t('lpFeature4Desc', language) },
    { icon: Globe, title: t('lpFeature5Title', language), desc: t('lpFeature5Desc', language) },
    { icon: Rocket, title: t('lpFeature6Title', language), desc: t('lpFeature6Desc', language) }
  ];

  const trustLogos = [logoQuickserve, logoPaylocal, logoRideease, logoShopnear, logoCraftmart, logoGrowbiz];

  const steps = [
    { n: '01', title: t('lpStep1Title', language), desc: t('lpStep1Desc', language) },
    { n: '02', title: t('lpStep2Title', language), desc: t('lpStep2Desc', language) },
    { n: '03', title: t('lpStep3Title', language), desc: t('lpStep3Desc', language) },
    { n: '04', title: t('lpStep4Title', language), desc: t('lpStep4Desc', language) }
  ];

  const testimonialImages = [
    { n: 1, img: imgRestaurant },
    { n: 2, img: imgTravel },
    { n: 3, img: imgSalon }
  ];

  const cardFade = (i = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  });

  return (
    <div className="min-h-screen bg-blue-300 relative overflow-hidden">
      <div className={`transition-all duration-500 ${highlightForm ? 'grayscale' : ''}`}>
        <Navbar
          language={language}
          onGetStartedClick={handleGetStarted}
          onLoginClick={() => setShowLogin(true)}
          hasSubscription={!!subscription}
        />
      </div>

      <Hero
        language={language}
        formData={formData}
        setFormData={updateFormData}
        isAnalyzing={isAnalyzing}
        onSubmit={handleOnboard}
        showLocationPicker={showLocationPicker}
        setShowLocationPicker={setShowLocationPicker}
        onVoiceClick={() => setShowVoiceInput(true)}
        onLanguageClick={handleLanguageClick}
        highlighted={highlightForm}
        onFormFocus={() => setHighlightForm(false)}
      />

      <div className={`transition-all duration-500 ${highlightForm ? 'grayscale' : ''}`}>
        <Features
          language={language}
          features={features}
          cardFade={cardFade}
        />

        <HowItWorks
          language={language}
          steps={steps}
        />

        <Pricing
          language={language}
          subscriptionPlans={subscriptionPlans}
          planIcons={planIcons}
          onSignUpClick={(planId, isYearly) => navigate('/checkout', { state: { planId, isYearly } })}
          cardFade={cardFade}
        />

        <FAQ
          language={language}
          faqOpen={faqOpen}
          setFaqOpen={setFaqOpen}
        />

        <CTA
          language={language}
          onSignUpClick={() => navigate('/checkout')}
          cardFade={cardFade}
        />

        <Footer
          language={language}
          changeLanguage={changeLanguage}
        />
      </div>

      {/* Modals */}
      <SignUpModal
        open={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSignUp={handleSignUp}
        language={language}
        initialPhone={formData.phone}
      />

      <LanguageSelectorPopup
        open={showLanguagePopup}
        onClose={() => setShowLanguagePopup(false)}
        onSelect={changeLanguage}
        currentLanguage={language}
        position={languagePopupPosition}
      />

      <VoiceInputModal
        open={showVoiceInput}
        onClose={() => setShowVoiceInput(false)}
        onTranscript={handleVoiceTranscript}
        language={language}
      />

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />

      {/* Sticky Social Media Sidebar */}
      <SocialMediaSidebar />
    </div>
  );
};

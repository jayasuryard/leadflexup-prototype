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
  TrustStrip,
  Stories,
  Stats,
  Features,
  HowItWorks,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
  Footer,
  LanguageSelectorPopup,
  VoiceInputModal,
  SignUpModal
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
  const { language, changeLanguage, signup, onboardBusiness } = useApp();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [languagePopupPosition, setLanguagePopupPosition] = useState({ x: 0, y: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  
  const planIcons = { starter: Sparkles, professional: Crown, enterprise: Rocket };
  
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    category: '',
    location: null
  });

  const handleOnboard = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
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

  const handleSignUp = (userData) => {
    signup(userData);
    setShowSignUp(false);
  };

  const handleVoiceTranscript = (transcript) => {
    setFormData({ ...formData, businessName: transcript });
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

  const stories = [
    { img: imgTravel, biz: t('lpStory1Biz', language), quote: t('lpStory1Quote', language), stat: t('lpStory1Stat', language), label: t('lpStory1Label', language), accent: 'from-orange-500/10 to-amber-500/5' },
    { img: imgHotel, biz: t('lpStory2Biz', language), quote: t('lpStory2Quote', language), stat: t('lpStory2Stat', language), label: t('lpStory2Label', language), accent: 'from-teal-500/10 to-emerald-500/5' },
    { img: imgToy, biz: t('lpStory3Biz', language), quote: t('lpStory3Quote', language), stat: t('lpStory3Stat', language), label: t('lpStory3Label', language), accent: 'from-yellow-500/10 to-amber-500/5' },
    { img: imgIron, biz: t('lpStory4Biz', language), quote: t('lpStory4Quote', language), stat: t('lpStory4Stat', language), label: t('lpStory4Label', language), accent: 'from-slate-500/10 to-gray-500/5' },
    { img: imgRestaurant, biz: t('lpStory5Biz', language), quote: t('lpStory5Quote', language), stat: t('lpStory5Stat', language), label: t('lpStory5Label', language), accent: 'from-red-500/10 to-rose-500/5' },
    { img: imgSalon, biz: t('lpStory6Biz', language), quote: t('lpStory6Quote', language), stat: t('lpStory6Stat', language), label: t('lpStory6Label', language), accent: 'from-pink-500/10 to-fuchsia-500/5' },
  ];

  const trustLogos = [logoQuickserve, logoPaylocal, logoRideease, logoShopnear, logoCraftmart, logoGrowbiz];

  const stats = [
    { value: t('lpStat1Value', language), label: t('lpStat1Label', language) },
    { value: t('lpStat2Value', language), label: t('lpStat2Label', language) },
    { value: t('lpStat3Value', language), label: t('lpStat3Label', language) },
    { value: t('lpStat4Value', language), label: t('lpStat4Label', language) }
  ];

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
      <Navbar
        language={language}
        onSignUpClick={() => setShowSignUp(true)}
      />

      <Hero
        language={language}
        formData={formData}
        setFormData={setFormData}
        isAnalyzing={isAnalyzing}
        onSubmit={handleOnboard}
        showLocationPicker={showLocationPicker}
        setShowLocationPicker={setShowLocationPicker}
        onVoiceClick={() => setShowVoiceInput(true)}
        onLanguageClick={handleLanguageClick}
      />

      <TrustStrip
        language={language}
        trustLogos={trustLogos}
      />

      <Stories
        language={language}
        stories={stories}
        cardFade={cardFade}
      />

      <Stats
        language={language}
        stats={stats}
        cardFade={cardFade}
      />

      <Features
        language={language}
        features={features}
        cardFade={cardFade}
      />

      <HowItWorks
        language={language}
        steps={steps}
      />

      <Testimonials
        language={language}
        testimonialImages={testimonialImages}
        cardFade={cardFade}
      />

      <Pricing
        language={language}
        subscriptionPlans={subscriptionPlans}
        planIcons={planIcons}
        onSignUpClick={() => setShowSignUp(true)}
        cardFade={cardFade}
      />

      <FAQ
        language={language}
        faqOpen={faqOpen}
        setFaqOpen={setFaqOpen}
      />

      <CTA
        language={language}
        onSignUpClick={() => setShowSignUp(true)}
        cardFade={cardFade}
      />

      <Footer
        language={language}
        changeLanguage={changeLanguage}
      />

      {/* Modals */}
      <SignUpModal
        open={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSignUp={handleSignUp}
        language={language}
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
    </div>
  );
};

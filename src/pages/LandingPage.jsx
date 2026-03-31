import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Store, MapPin, Tag, TrendingUp, Sparkles, BarChart3, Target, Zap,
  Phone, Mail, Lock, Eye, EyeOff, X, CheckCircle, ArrowRight,
  Globe, Users, Shield, LineChart, Rocket, Star, ChevronRight,
  Check, Crown, ChevronDown, MessageSquare, Layers, PieChart,
  Mic, MicOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { businessCategories, subscriptionPlans } from '../data/mockDatabase';
import { LocationPicker } from '../components/LocationPicker';

/* ─── Language → BCP-47 map for Speech Recognition ─── */
const sttLangMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN', te: 'te-IN', ml: 'ml-IN' };

/* ─── Inline Voice Input Button ─── */
const VoiceMicButton = ({ onResult, lang = 'en', hint }) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = sttLangMap[lang] || 'en-IN';
      rec.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false); };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec;
    }
  }, [onResult, lang]);

  if (!supported) return null;

  const toggle = () => {
    if (!recRef.current) return;
    if (listening) { recRef.current.stop(); setListening(false); }
    else {
      recRef.current.lang = sttLangMap[lang] || 'en-IN';
      recRef.current.start(); setListening(true);
    }
  };

  return (
    <button type="button" onClick={toggle}
      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all z-10 ${
        listening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' : 'hover:bg-navy-100 text-navy-400'}`}
      title={listening ? t('voiceListening', lang) : (hint || t('voiceTapToSpeak', lang))}>
      {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
};

/* ─── Sign-up Modal ─── */
const SignUpModal = ({ open, onClose, onSignUp, language }) => {
  const [form, setForm] = useState({ email: '', password: '', phone: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onSignUp(form);
    setLoading(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="paper-card-raised rounded-2xl p-8 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-navy-800">{t('lpCreateAccount', language)}</h3>
              <p className="text-sm text-navy-400 mt-1">{t('lpStartJourney', language)}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-navy-50 text-navy-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">{t('lpEmailLabel', language)}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t('lpEmailPlaceholder', language)}
                  className="matte-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">{t('lpPhoneLabel', language)}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                <input
                  type="tel" required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t('lpPhonePlaceholder', language)}
                  className="matte-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">{t('lpPasswordLabel', language)}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                <input
                  type={showPwd ? 'text' : 'password'} required minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={t('lpPasswordPlaceholder', language)}
                  className="matte-input w-full pl-10 pr-10 py-2.5 rounded-lg text-sm"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-navy-700 text-white font-semibold rounded-xl hover:bg-navy-800 disabled:opacity-60 text-sm"
            >
              {loading ? t('lpCreatingAccount', language) : t('lpSignUpBtn', language)}
            </button>

            <p className="text-xs text-navy-400 text-center leading-relaxed">
              {t('lpTerms', language)}
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Landing Page ─── */

/* Business illustration imports */
import imgTravel from '../assets/businesses/travel-agency.png';
import imgHotel from '../assets/businesses/hotel-business.png';
import imgToy from '../assets/businesses/toy-shop.png';
import imgIron from '../assets/businesses/iron-fabricator.png';
import imgRestaurant from '../assets/businesses/restaurant-cafe.png';
import imgSalon from '../assets/businesses/beauty-salon.png';

/* Trust logo imports */
import logoQuickserve from '../assets/logos/logo-quickserve.svg';
import logoPaylocal from '../assets/logos/logo-paylocal.svg';
import logoRideease from '../assets/logos/logo-rideease.svg';
import logoShopnear from '../assets/logos/logo-shopnear.svg';
import logoCraftmart from '../assets/logos/logo-craftmart.svg';
import logoGrowbiz from '../assets/logos/logo-growbiz.svg';

/* Animated counter hook */
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = { current: null };
  const start = () => { if (!started) setStarted(true); };

  useState(() => {
    if (!started) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started]);

  return [count, start];
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, signup, onboardBusiness, isAuthenticated } = useApp();
  const [showSignUp, setShowSignUp] = useState(false);
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

  const cardFade = (i = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  });

  return (
    <div className="min-h-screen bg-[#f3f0ea]">

      {/* ═══ NAVBAR — matte pill navigation ═══ */}
      <nav className="sticky top-0 z-50 bg-[#f3f0ea]/85 backdrop-blur-lg border-b border-navy-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-navy-700 rounded-xl flex items-center justify-center shadow-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy-800">LeadFlexUp</span>
            </div>

            <div className="hidden md:flex items-center">
              <div className="flex items-center bg-white/60 rounded-full px-1 py-1 border border-navy-200/50 shadow-sm">
                {[
                  { label: t('lpNavHome', language), href: '#' },
                  { label: t('lpNavFeatures', language), href: '#features' },
                  { label: t('lpNavStories', language), href: '#stories' },
                  { label: t('lpNavPricing', language), href: '#pricing' },
                  { label: t('lpNavContact', language), href: '#contact' },
                ].map((nav, i) => (
                  <a key={i} href={nav.href}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${i === 0 ? 'bg-navy-700 text-white shadow-sm' : 'text-navy-500 hover:text-navy-800 hover:bg-white/60'}`}
                  >{nav.label}</a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select value={language} onChange={(e) => changeLanguage(e.target.value)}
                className="px-2 py-1.5 rounded-lg border border-navy-200/50 bg-white/60 text-xs font-medium text-navy-600"
              >
                <option value="en">EN</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="te">తెలుగు</option>
                <option value="ml">മലയാളം</option>
              </select>
              <button onClick={() => setShowSignUp(true)}
                className="px-5 py-2.5 bg-navy-700 text-white text-sm font-semibold rounded-full hover:bg-navy-800 shadow-sm hover:shadow-md transition-all"
              >{t('lpSignUp', language)}</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ HERO — headline left + onboarding form right (EXACT SAME) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — headline + moving floating objects */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            <h1 className="text-4xl sm:text-[3.25rem] font-extrabold text-navy-900 leading-[1.1] tracking-tight">
              {t('heroTitle', language)}{' '}
              <span className="text-teal-600">{t('heroSubtitle', language)}</span>
            </h1>

            <p className="text-lg text-navy-500 leading-relaxed mt-6 max-w-lg">
              {t('heroDescription', language)}
            </p>

            {/* Service capability pills — ref image style */}
            <div className="flex flex-wrap gap-2 mt-7">
              {[t('lpPill1', language), t('lpPill2', language), t('lpPill3', language), t('lpPill4', language), t('lpPill5', language), t('lpPill6', language)].map((pill, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="px-3.5 py-2 text-xs font-semibold text-navy-700 bg-white/70 backdrop-blur-sm border border-navy-200/50 rounded-full shadow-sm hover:bg-white/90 transition-colors cursor-default"
                >{pill}</motion.span>
              ))}
            </div>
            <p className="text-xs font-medium text-navy-400 mt-3">{t('lpHeroTagline', language)}</p>

            {/* Floating stat cards — moving objects */}
            <div className="mt-8 flex flex-wrap items-end gap-4">
              {/* Avatars + happy biz */}
              <motion.div
                animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 border border-navy-200/40 shadow-sm"
              >
                <div className="flex -space-x-2.5">
                  {[imgTravel, imgHotel, imgRestaurant, imgSalon].map((img, i) => (
                    <img key={i} src={img} alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-500 shadow-sm flex items-center justify-center text-[9px] font-bold text-white">10k+</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-700">10,000 Plus</p>
                  <p className="text-[10px] text-navy-400">{t('lpHappyBiz', language)}</p>
                </div>
              </motion.div>

              {/* Number counter */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-3 border border-navy-200/40 shadow-sm"
              >
                <p className="text-3xl font-extrabold text-navy-800">920+</p>
                <p className="text-[10px] text-navy-400">{t('lpBizGrowing', language)}</p>
              </motion.div>

              {/* 100% success */}
              <motion.div
                animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 border border-navy-200/40 shadow-sm flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-navy-800">100%</p>
                  <p className="text-[10px] text-navy-400">{t('lpSuccessLabel', language)}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — Onboarding form (EXACT SAME) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-navy-200/40 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-navy-700 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-800">{t('onboardingTitle', language)}</h2>
                  <p className="text-xs text-navy-400">{t('lpFormSubtitle', language)}</p>
                </div>
              </div>

              {isAnalyzing ? (
                <div className="text-center py-16">
                  <div className="w-14 h-14 border-[3px] border-navy-200 border-t-teal-500 rounded-full mx-auto mb-4 animate-spin" />
                  <p className="text-base font-semibold text-navy-800">{t('analyzing', language)}</p>
                  <p className="text-sm text-navy-400 mt-1">{t('lpAnalyzingDesc', language)}</p>
                </div>
              ) : (
                <form onSubmit={handleOnboard} className="space-y-4">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      {t('businessName', language)}
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                      <input
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder={t('businessNamePlaceholder', language)}
                        className="matte-input w-full pl-10 pr-12 py-2.5 rounded-lg text-sm"
                      />
                      <VoiceMicButton lang={language} hint={t('voiceInputHint', language)}
                        onResult={(text) => setFormData(prev => ({ ...prev, businessName: text }))} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">{t('lpPhoneLabel', language)}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
                      <input
                        required type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t('lpPhonePlaceholder', language)}
                        className="matte-input w-full pl-10 pr-12 py-2.5 rounded-lg text-sm"
                      />
                      <VoiceMicButton lang={language} hint={t('voicePhoneHint', language)}
                        onResult={(text) => setFormData(prev => ({ ...prev, phone: text.replace(/\s/g, '') }))} />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      {t('businessCategory', language)}
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300 pointer-events-none z-10" />
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="matte-input w-full pl-10 pr-10 py-2.5 rounded-lg text-sm appearance-none cursor-pointer"
                      >
                        <option value="">{t('selectCategory', language)}</option>
                        {businessCategories.map(c => (
                          <option key={c.id} value={c.id}>{getLocalizedText(c.label, language)}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Location Picker */}
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">
                      <MapPin className="inline w-4 h-4 mr-1 -mt-0.5" />
                      {t('lpBusinessLocation', language)}
                    </label>
                    <LocationPicker
                      value={formData.location}
                      onLocationChange={(loc) => setFormData({ ...formData, location: loc })}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 text-sm flex items-center justify-center gap-2"
                  >
                    {t('continueToAnalysis', language)}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-xs text-navy-400 text-center">
                    {t('lpNoSignup', language)}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST STRIP — logos ═══ */}
      <section className="py-10 border-y border-navy-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-navy-400 uppercase tracking-wider mb-6">
            {t('lpTrustCount', language)}
          </p>
          <div className="flex items-center justify-center flex-wrap gap-10">
            {trustLogos.map((logo, i) => (
              <motion.img key={i} src={logo} alt="" className="h-8 opacity-50 hover:opacity-90 transition-opacity grayscale hover:grayscale-0"
                initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STORIES BENTO GRID — real records + business images ═══ */}
      <section id="stories" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpBentoBadge', language)}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpBentoHeading', language)}</h2>
            <p className="text-navy-500">{t('lpBentoDesc', language)}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {stories.map((s, i) => {
              const isLarge = i === 0 || i === 3;
              return (
                <motion.div key={i} {...cardFade(i)}
                  className={`relative group bg-gradient-to-br ${s.accent} rounded-2xl border border-navy-200/30 overflow-hidden hover:shadow-xl transition-all duration-300
                    ${isLarge ? 'md:col-span-2' : ''}`}
                >
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none" />
                  <div className="relative p-6 flex flex-col sm:flex-row items-start gap-5">
                    <div className="flex-shrink-0">
                      <motion.img src={s.img} alt={s.biz}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-sm border border-white/60"
                        animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-navy-500 mb-1.5">{s.biz}</p>
                      <p className="text-sm text-navy-600 leading-relaxed mb-4 italic">&ldquo;{s.quote}&rdquo;</p>
                      <div className="flex items-end gap-2">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                          className="text-3xl sm:text-4xl font-extrabold text-navy-800"
                        >{s.stat}</motion.span>
                        <span className="text-xs font-semibold text-teal-600 mb-1">{s.label}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ NUMBERS — animated counters on dark bg ═══ */}
      <section className="py-16 bg-navy-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">{t('lpNumBadge', language)}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{t('lpNumHeading', language)}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} {...cardFade(i)}
                className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              >
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 150 }}
                  className="text-4xl sm:text-5xl font-extrabold text-white"
                >{s.value}</motion.p>
                <p className="text-sm text-navy-200 mt-2 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES BENTO — matte tactile ═══ */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpPlatformCapabilities', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpFeaturesHeading', language)}</h2>
            <p className="text-navy-500">{t('lpFeaturesDesc', language)}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large — Analytics */}
            <motion.div {...cardFade(0)}
              className="md:col-span-2 lg:col-span-2 bg-navy-700 text-white rounded-2xl p-7 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/15 transition-colors" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{features[0].title}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{features[0].desc}</h3>
                <div className="grid grid-cols-4 gap-3 mt-5">
                  {[
                    { label: t('websiteHealth', language), val: 82, color: 'text-white' },
                    { label: t('socialMediaScore', language), val: 71, color: 'text-teal-400' },
                    { label: t('searchVisibility', language), val: 65, color: 'text-indigo-400' },
                    { label: t('onlineReviews', language), val: 90, color: 'text-amber-400' }
                  ].map((g, j) => (
                    <div key={j} className="text-center">
                      <div className="relative w-12 h-12 mx-auto mb-1">
                        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                          <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="4" />
                          <motion.circle cx="24" cy="24" r="18" fill="none" strokeWidth="4" strokeLinecap="round"
                            className={`stroke-current ${g.color}`}
                            initial={{ strokeDasharray: '0 113' }}
                            whileInView={{ strokeDasharray: `${(g.val / 100) * 113} 113` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + j * 0.15, duration: 0.8 }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{g.val}</span>
                      </div>
                      <span className="text-[9px] text-navy-200">{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Competitor + AI cards */}
            {features.slice(1, 3).map((f, i) => (
              <motion.div key={i} {...cardFade(i + 1)}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 hover:shadow-lg hover:bg-white/80 transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-sm ${i === 0 ? 'bg-navy-700' : 'bg-teal-600'}`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-navy-800 mb-2">{f.title}</h3>
                <p className="text-sm text-navy-500 leading-relaxed mb-4">{f.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                  {t('learnMore', language)} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>
            ))}

            {/* Large — Automation */}
            <motion.div {...cardFade(3)}
              className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-7 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{features[3].title}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{features[3].desc}</h3>
                <div className="flex flex-wrap gap-2 mt-5">
                  {['Social Media', 'Email Campaigns', 'Ad Optimization', 'Review Collection', 'SEO Monitor', 'Lead Scoring'].map((wf, j) => (
                    <motion.div key={j}
                      animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.5 + j * 0.3, ease: 'easeInOut' }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg border border-white/10"
                    >
                      <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
                      <span className="text-xs font-medium">{wf}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Last 2 features */}
            {features.slice(4).map((f, i) => (
              <motion.div key={i} {...cardFade(i + 4)}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 hover:shadow-lg hover:bg-white/80 transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-sm ${i === 0 ? 'bg-navy-50' : 'bg-teal-50'}`}>
                  <f.icon className={`w-5 h-5 ${i === 0 ? 'text-navy-600' : 'text-teal-600'}`} />
                </div>
                <h3 className="text-base font-bold text-navy-800 mb-2">{f.title}</h3>
                <p className="text-sm text-navy-500 leading-relaxed mb-4">{f.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                  {t('learnMore', language)} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — timeline ═══ */}
      <section id="how-it-works" className="py-20 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpHowItWorks', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpHowItWorksHeading', language)}</h2>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-navy-200 -translate-x-1/2" />
            {steps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative flex items-center mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`w-full md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-0' : 'md:pl-0'}`}>
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 shadow-sm">
                    <span className="text-3xl font-extrabold text-navy-100">{s.n}</span>
                    <h3 className="text-base font-bold text-navy-800 mt-2 mb-2">{s.title}</h3>
                    <p className="text-sm text-navy-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-navy-700 rounded-full items-center justify-center z-10 shadow-lg">
                  <span className="text-xs font-bold text-white">{s.n}</span>
                </div>
                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — with business images ═══ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpTestimonialBadge', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpTestimonialTitle', language)}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: 1, img: imgRestaurant },
              { n: 2, img: imgTravel },
              { n: 3, img: imgSalon }
            ].map(({ n, img }, i) => (
              <motion.div key={n} {...cardFade(i)}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 relative hover:shadow-lg transition-all"
              >
                <div className="absolute top-5 right-5 text-navy-100">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 7.5c0-2.21-1.79-4-4-4S3 5.29 3 7.5 4.79 11.5 7 11.5c.25 0 .5-.02.74-.07C7.26 13.56 5.36 15 3 15v2c4.42 0 8-3.58 8-8v-1.5zm13 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c.25 0 .5-.02.74-.07C20.26 13.56 18.36 15 16 15v2c4.42 0 8-3.58 8-8v-1.5z"/>
                  </svg>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-navy-600 leading-relaxed mb-5 italic">
                  &ldquo;{t(`lpTestimonial${n}Quote`, language)}&rdquo;
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 rounded-full mb-5">
                  <TrendingUp className="w-3 h-3 text-teal-600" />
                  <span className="text-[10px] font-bold text-teal-700">{t(`lpTestimonial${n}Metric`, language)}</span>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-navy-200/40">
                  <img src={img} alt="" className="w-10 h-10 rounded-full object-cover border border-white/60" />
                  <div>
                    <p className="text-sm font-bold text-navy-800">{t(`lpTestimonial${n}Name`, language)}</p>
                    <p className="text-[11px] text-navy-400">{t(`lpTestimonial${n}Role`, language)} • {t(`lpTestimonial${n}City`, language)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-20 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpPricingBadge', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpPricingTitle', language)}</h2>
            <p className="text-navy-500">{t('lpPricingDesc', language)}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, i) => {
              const Icon = planIcons[plan.id];
              return (
                <motion.div key={plan.id} {...cardFade(i)} className="relative">
                  {plan.recommended && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
                      <span className="text-[10px] font-bold bg-teal-600 text-white px-3 py-1 rounded-full shadow-lg shadow-teal-600/20">
                        {t('mostPopular', language)}
                      </span>
                    </div>
                  )}
                  <div className={`h-full bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 hover:bg-white/80 transition-all ${
                    plan.recommended ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-navy-200/40'
                  }`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${plan.recommended ? 'bg-teal-600' : 'bg-navy-700'}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 mb-1">{getLocalizedText(plan.name, language)}</h3>
                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-navy-900">{plan.currency}{(plan.price / 100000).toFixed(2)}L</span>
                        <span className="text-xs text-navy-400">{t('perMonth', language)}</span>
                      </div>
                      <p className="text-[11px] text-navy-400 mt-0.5">{t('subBilling', language)}</p>
                    </div>
                    <div className="space-y-2.5 mb-6">
                      {plan.features.slice(0, 5).map((f, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-navy-600">{getLocalizedText(f, language)}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setShowSignUp(true)}
                      className={`w-full py-2.5 text-xs font-semibold rounded-lg ${
                        plan.recommended ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-700 text-white hover:bg-navy-800'
                      }`}
                    >{t('subscribe', language)}</button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpFaqBadge', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3">{t('lpFaqTitle', language)}</h2>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <motion.div key={n} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-navy-200/40 overflow-hidden"
              >
                <button onClick={() => setFaqOpen(faqOpen === n ? null : n)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-navy-800 pr-4">{t(`lpFaq${n}Q`, language)}</span>
                  <motion.div animate={{ rotate: faqOpen === n ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-navy-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === n && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-5 text-sm text-navy-500 leading-relaxed">{t(`lpFaq${n}A`, language)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...cardFade(0)}
            className="bg-navy-700 rounded-2xl p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/8 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
            <div className="relative">
              <Rocket className="w-12 h-12 text-teal-400 mx-auto mb-6" />
              <h2 className="text-3xl font-extrabold text-white mb-4">{t('lpCtaTitle', language)}</h2>
              <p className="text-navy-200 mb-8 max-w-lg mx-auto">{t('lpCtaDesc', language)}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-8 py-3.5 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25"
                >
                  {t('getStarted', language)} <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setShowSignUp(true)}
                  className="px-8 py-3.5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 text-sm"
                >{t('lpSignUp', language)}</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 border-t border-navy-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-navy-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
              </div>
              <p className="text-xs text-navy-400 leading-relaxed">{t('lpFooterTagline', language)}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterProduct', language)}</h4>
              <div className="space-y-2">
                {[t('analytics', language), t('automationHub', language), t('contentStudio', language), t('websiteBuilder', language), t('leadManager', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterCompany', language)}</h4>
              <div className="space-y-2">
                {[t('lpFooterAbout', language), t('lpFooterBlog', language), t('lpFooterCareers', language), t('lpFooterContact', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterLegal', language)}</h4>
              <div className="space-y-2">
                {[t('lpFooterPrivacy', language), t('lpFooterTermsLink', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-navy-200/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-navy-400">{t('lpFooterText', language)}</p>
            <select value={language} onChange={(e) => changeLanguage(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-navy-200/50 bg-white/60 text-xs font-medium text-navy-600"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="te">తెలుగు</option>
              <option value="ml">മലയാളം</option>
            </select>
          </div>
        </div>
      </footer>

      <SignUpModal open={showSignUp} onClose={() => setShowSignUp(false)} onSignUp={handleSignUp} language={language} />
    </div>
  );
};

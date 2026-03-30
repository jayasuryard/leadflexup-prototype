import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Store, MapPin, Tag, TrendingUp, Sparkles, BarChart3, Target, Zap,
  Phone, Mail, Lock, Eye, EyeOff, X, CheckCircle, ArrowRight,
  Globe, Users, Shield, LineChart, Rocket, Star, ChevronRight,
  Check, Crown, ChevronDown, MessageSquare, Layers, PieChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { businessCategories, subscriptionPlans } from '../data/mockDatabase';
import { LocationPicker } from '../components/LocationPicker';

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

  return (
    <div className="paper-texture min-h-screen">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 bg-[#f5f1eb]/80 backdrop-blur-md border-b border-navy-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-navy-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy-800">LeadFlexUp</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-navy-500">
              <a href="#features" className="hover:text-navy-800">{t('lpNavFeatures', language)}</a>
              <a href="#how-it-works" className="hover:text-navy-800">{t('lpNavHowItWorks', language)}</a>
              <a href="#pricing" className="hover:text-navy-800">{t('lpNavPricing', language)}</a>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-2 py-1.5 rounded-md border border-navy-200 bg-white/60 text-xs font-medium text-navy-600"
              >
                <option value="en">EN</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="te">తెలుగు</option>
                <option value="ml">മലയാളം</option>
              </select>
              <button
                onClick={() => setShowSignUp(true)}
                className="px-4 py-2 bg-navy-700 text-white text-sm font-semibold rounded-lg hover:bg-navy-800"
              >
                {t('lpSignUp', language)}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — copy */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 mb-6">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              <span className="text-xs font-semibold text-teal-700">{t('trustedBy', language)}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 leading-[1.15] mb-5">
              {t('heroTitle', language)}{' '}
              <span className="text-teal-600">{t('heroSubtitle', language)}</span>
            </h1>

            <p className="text-lg text-navy-500 leading-relaxed mb-8 max-w-xl">
              {t('heroDescription', language)}
            </p>

            {/* Trust stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-navy-800">{s.value}</p>
                  <p className="text-xs text-navy-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick-trust badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, label: t('lpBadgeEnterprise', language) },
                { icon: Globe, label: t('lpBadgeMultilingual', language) },
                { icon: Users, label: t('lpBadgeNonTech', language) }
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 paper-card rounded-full">
                  <b.icon className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-xs font-medium text-navy-600">{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Onboarding form (inline hero) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="paper-card-raised rounded-2xl p-6 sm:p-8">
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
                        className="matte-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                      />
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
                        className="matte-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                      />
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

      {/* ─── Dashboard Preview ─── */}
      <section className="py-20 bg-white/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpPreviewBadge', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpPreviewTitle', language)}</h2>
            <p className="text-navy-500">{t('lpPreviewDesc', language)}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Browser chrome */}
            <div className="bg-navy-800 rounded-2xl p-1 shadow-2xl shadow-navy-900/30">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-navy-900 rounded-t-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="flex-1 ml-3 bg-navy-700 rounded-md px-3 py-1">
                  <span className="text-[10px] text-navy-400">app.leadflexup.com/dashboard</span>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-navy-50 to-white rounded-b-xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
                  {[
                    { label: t('lpDashScore', language), value: '78', sub: '/ 100', accent: true },
                    { label: t('lpDashAutomations', language), value: '12', sub: t('running', language) },
                    { label: t('lpDashLeads', language), value: '284', sub: '+24%' },
                    { label: t('lpDashContent', language), value: '45', sub: t('active', language) }
                  ].map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-white rounded-xl p-3.5 border border-navy-100 shadow-sm"
                    >
                      <p className={`text-2xl font-bold ${c.accent ? 'text-teal-600' : 'text-navy-800'}`}>{c.value}</p>
                      <p className="text-[10px] text-navy-400 mt-0.5">{c.label}</p>
                      <span className="text-[9px] text-teal-600 font-medium">{c.sub}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-white rounded-xl p-4 border border-navy-100 h-44">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-navy-700">{t('adTrafficLeads', language)}</span>
                      <span className="text-[9px] text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">+24%</span>
                    </div>
                    <svg viewBox="0 0 400 100" className="w-full h-24">
                      <defs>
                        <linearGradient id="lpGrad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14a88a" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#14a88a" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lpGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1e2f52" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#1e2f52" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,80 C50,70 100,55 150,48 C200,40 250,52 300,30 C350,12 380,18 400,8 L400,100 L0,100Z" fill="url(#lpGrad1)" />
                      <path d="M0,80 C50,70 100,55 150,48 C200,40 250,52 300,30 C350,12 380,18 400,8" fill="none" stroke="#14a88a" strokeWidth="2.5" />
                      <path d="M0,90 C50,85 100,78 150,72 C200,68 250,74 300,60 C350,50 380,54 400,45 L400,100 L0,100Z" fill="url(#lpGrad2)" />
                      <path d="M0,90 C50,85 100,78 150,72 C200,68 250,74 300,60 C350,50 380,54 400,45" fill="none" stroke="#1e2f52" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-navy-100">
                    <span className="text-xs font-bold text-navy-700">{t('competitorLeaderboard', language)}</span>
                    <div className="mt-3 space-y-2.5">
                      {[
                        { name: t('yourBusiness', language), pct: 88, you: true },
                        { name: 'Tandoor Palace', pct: 82 },
                        { name: 'Spice Garden', pct: 75 },
                        { name: 'Curry Express', pct: 68 }
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold w-4 ${r.you ? 'text-teal-600' : 'text-navy-400'}`}>#{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`text-[9px] font-semibold ${r.you ? 'text-teal-700' : 'text-navy-500'}`}>{r.name}</span>
                              <span className="text-[9px] font-bold text-navy-600">{r.pct}</span>
                            </div>
                            <div className="bg-navy-100 rounded-full h-1.5">
                              <div className={`${r.you ? 'bg-teal-500' : 'bg-navy-300'} rounded-full h-1.5 transition-all`} style={{ width: `${r.pct}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating automation badge - left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.6 }}
              className="absolute -left-4 top-1/3 bg-white rounded-xl p-3 shadow-xl border border-navy-100 hidden lg:block"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-navy-800">8 {t('running', language)}</p>
                  <p className="text-[9px] text-navy-400">{t('automationHub', language)}</p>
                </div>
              </div>
            </motion.div>

            {/* Floating AI badge - right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.7 }}
              className="absolute -right-4 top-2/3 bg-white rounded-xl p-3 shadow-xl border border-navy-100 hidden lg:block"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-navy-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-navy-800">AI Copilot</p>
                  <p className="text-[9px] text-teal-600 font-medium">● Online</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features Bento ─── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpPlatformCapabilities', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpFeaturesHeading', language)}</h2>
            <p className="text-navy-500">{t('lpFeaturesDesc', language)}</p>
          </div>

          {/* Bento grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large - Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0 }}
              className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-navy-700 to-navy-900 text-white rounded-2xl p-7 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{t('lpFeature1Title', language)}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('lpFeature1Desc', language)}</h3>
                <div className="grid grid-cols-4 gap-3 mt-5">
                  {[
                    { label: t('websiteHealth', language), val: 82, color: 'bg-white' },
                    { label: t('socialMediaScore', language), val: 71, color: 'bg-teal-400' },
                    { label: t('searchVisibility', language), val: 65, color: 'bg-indigo-400' },
                    { label: t('onlineReviews', language), val: 90, color: 'bg-amber-400' }
                  ].map((g, i) => (
                    <div key={i} className="text-center">
                      <div className="relative w-12 h-12 mx-auto mb-1">
                        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                          <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="4" />
                          <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                            className={`${g.color.replace('bg-', 'text-')}`}
                            strokeDasharray={`${(g.val / 100) * 113} 113`} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{g.val}</span>
                      </div>
                      <span className="text-[9px] text-navy-200">{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Competitor Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="paper-card rounded-2xl p-6 hover:shadow-lg transition-shadow border border-navy-100/50"
            >
              <div className="w-11 h-11 bg-navy-700 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-navy-800 mb-2">{t('lpFeature2Title', language)}</h3>
              <p className="text-sm text-navy-500 leading-relaxed mb-4">{t('lpFeature2Desc', language)}</p>
              <div className="flex items-center gap-2 text-teal-600">
                <span className="text-xs font-semibold">{t('learnMore', language)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="paper-card rounded-2xl p-6 hover:shadow-lg transition-shadow border border-navy-100/50"
            >
              <div className="w-11 h-11 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-navy-800 mb-2">{t('lpFeature3Title', language)}</h3>
              <p className="text-sm text-navy-500 leading-relaxed mb-4">{t('lpFeature3Desc', language)}</p>
              <div className="flex items-center gap-2 text-teal-600">
                <span className="text-xs font-semibold">{t('learnMore', language)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Large - Marketing Automation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-7 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{t('lpFeature4Title', language)}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('lpFeature4Desc', language)}</h3>
                <div className="flex flex-wrap gap-2 mt-5">
                  {['Social Media', 'Email Campaigns', 'Ad Optimization', 'Review Collection', 'SEO Monitor', 'Lead Scoring'].map((wf, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
                      <span className="text-xs font-medium">{wf}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Geo Insights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.25 }}
              className="paper-card rounded-2xl p-6 hover:shadow-lg transition-shadow border border-teal-100"
            >
              <div className="w-11 h-11 bg-navy-50 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-navy-600" />
              </div>
              <h3 className="text-base font-bold text-navy-800 mb-2">{t('lpFeature5Title', language)}</h3>
              <p className="text-sm text-navy-500 leading-relaxed mb-4">{t('lpFeature5Desc', language)}</p>
              <div className="flex items-center gap-2 text-teal-600">
                <span className="text-xs font-semibold">{t('learnMore', language)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Growth */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="paper-card rounded-2xl p-6 hover:shadow-lg transition-shadow border border-teal-100"
            >
              <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                <Rocket className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-base font-bold text-navy-800 mb-2">{t('lpFeature6Title', language)}</h3>
              <p className="text-sm text-navy-500 leading-relaxed mb-4">{t('lpFeature6Desc', language)}</p>
              <div className="flex items-center gap-2 text-teal-600">
                <span className="text-xs font-semibold">{t('learnMore', language)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpHowItWorks', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpHowItWorksHeading', language)}</h2>
          </div>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-navy-200 -translate-x-1/2" />

            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative flex items-center mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content card */}
                <div className={`w-full md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-0' : 'md:pl-0'}`}>
                  <div className="paper-card-raised rounded-xl p-6">
                    <span className="text-3xl font-extrabold text-navy-100">{s.n}</span>
                    <h3 className="text-base font-bold text-navy-800 mt-2 mb-2">{s.title}</h3>
                    <p className="text-sm text-navy-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-navy-700 rounded-full items-center justify-center z-10 shadow-lg">
                  <span className="text-xs font-bold text-white">{s.n}</span>
                </div>

                {/* Spacer */}
                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpTestimonialBadge', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpTestimonialTitle', language)}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="paper-card-raised rounded-2xl p-6 relative"
              >
                {/* Quote mark */}
                <div className="absolute top-5 right-5 text-navy-100">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 7.5c0-2.21-1.79-4-4-4S3 5.29 3 7.5 4.79 11.5 7 11.5c.25 0 .5-.02.74-.07C7.26 13.56 5.36 15 3 15v2c4.42 0 8-3.58 8-8v-1.5zm13 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c.25 0 .5-.02.74-.07C20.26 13.56 18.36 15 16 15v2c4.42 0 8-3.58 8-8v-1.5z"/>
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-sm text-navy-600 leading-relaxed mb-5 italic">
                  &ldquo;{t(`lpTestimonial${n}Quote`, language)}&rdquo;
                </p>

                {/* Metric badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 rounded-full mb-5">
                  <TrendingUp className="w-3 h-3 text-teal-600" />
                  <span className="text-[10px] font-bold text-teal-700">{t(`lpTestimonial${n}Metric`, language)}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-navy-100">
                  <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-navy-600">
                      {t(`lpTestimonial${n}Name`, language).charAt(0)}
                    </span>
                  </div>
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

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-24 bg-white/40">
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
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
                      <span className="text-[10px] font-bold bg-teal-600 text-white px-3 py-1 rounded-full shadow-lg shadow-teal-600/20">
                        {t('mostPopular', language)}
                      </span>
                    </div>
                  )}
                  <div className={`h-full paper-card-raised rounded-2xl p-6 border-2 ${
                    plan.recommended ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-transparent'
                  }`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                      plan.recommended ? 'bg-teal-600' : 'bg-navy-700'
                    }`}>
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
                    <button
                      onClick={() => setShowSignUp(true)}
                      className={`w-full py-2.5 text-xs font-semibold rounded-lg ${
                        plan.recommended
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-navy-700 text-white hover:bg-navy-800'
                      }`}
                    >
                      {t('subscribe', language)}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpFaqBadge', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3">{t('lpFaqTitle', language)}</h2>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="paper-card-raised rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === n ? null : n)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-navy-800 pr-4">{t(`lpFaq${n}Q`, language)}</span>
                  <motion.div animate={{ rotate: faqOpen === n ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-navy-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === n && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-5 text-sm text-navy-500 leading-relaxed">
                        {t(`lpFaq${n}A`, language)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 rounded-2xl p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/8 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
            <div className="relative">
              <Rocket className="w-12 h-12 text-teal-400 mx-auto mb-6" />
              <h2 className="text-3xl font-extrabold text-white mb-4">{t('lpCtaTitle', language)}</h2>
              <p className="text-navy-200 mb-8 max-w-lg mx-auto">
                {t('lpCtaDesc', language)}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-8 py-3.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 text-sm flex items-center gap-2"
                >
                  {t('getStarted', language)}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSignUp(true)}
                  className="px-8 py-3.5 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 text-sm"
                >
                  {t('lpSignUp', language)}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 border-t border-navy-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 bg-navy-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
              </div>
              <p className="text-xs text-navy-400 leading-relaxed">{t('lpFooterTagline', language)}</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterProduct', language)}</h4>
              <div className="space-y-2">
                {[t('analytics', language), t('automationHub', language), t('contentStudio', language), t('websiteBuilder', language), t('leadManager', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterCompany', language)}</h4>
              <div className="space-y-2">
                {[t('lpFooterAbout', language), t('lpFooterBlog', language), t('lpFooterCareers', language), t('lpFooterContact', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">{t('lpFooterLegal', language)}</h4>
              <div className="space-y-2">
                {[t('lpFooterPrivacy', language), t('lpFooterTermsLink', language)].map((item, i) => (
                  <p key={i} className="text-xs text-navy-400 hover:text-navy-600 cursor-pointer">{item}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-navy-100/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-navy-400">{t('lpFooterText', language)}</p>
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-2 py-1.5 rounded-md border border-navy-200 bg-white/60 text-xs font-medium text-navy-600"
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
        </div>
      </footer>

      {/* Sign-up Modal */}
      <SignUpModal
        open={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSignUp={handleSignUp}
        language={language}
      />
    </div>
  );
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Store, MapPin, Tag, TrendingUp, Sparkles, BarChart3, Target, Zap,
  Phone, Mail, Lock, Eye, EyeOff, X, CheckCircle, ArrowRight,
  Globe, Users, Shield, LineChart, Rocket, Star, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { businessCategories } from '../data/mockDatabase';
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

      {/* ─── Features ─── */}
      <section id="features" className="py-24 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpPlatformCapabilities', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpFeaturesHeading', language)}</h2>
            <p className="text-navy-500">{t('lpFeaturesDesc', language)}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="paper-card rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-base font-bold text-navy-800 mb-2">{f.title}</h3>
                <p className="text-sm text-navy-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpHowItWorks', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpHowItWorksHeading', language)}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative paper-card rounded-xl p-6"
              >
                <span className="text-4xl font-extrabold text-navy-100">{s.n}</span>
                <h3 className="text-base font-bold text-navy-800 mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-navy-500 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-navy-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="paper-card-raised rounded-2xl p-12">
            <Rocket className="w-12 h-12 text-teal-600 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-navy-900 mb-4">{t('lpCtaTitle', language)}</h2>
            <p className="text-navy-500 mb-8 max-w-lg mx-auto">
              {t('lpCtaDesc', language)}
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3.5 bg-navy-700 text-white font-semibold rounded-xl hover:bg-navy-800 text-sm"
            >
              {t('lpCtaBtn', language)}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 border-t border-navy-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-navy-700 rounded-md flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-navy-700">LeadFlexUp</span>
          </div>
          <p className="text-xs text-navy-400">{t('lpFooterText', language)}</p>
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

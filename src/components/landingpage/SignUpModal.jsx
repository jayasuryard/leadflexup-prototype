import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff, X } from 'lucide-react';
import { t } from '../../utils/i18n';

export const SignUpModal = ({ open, onClose, onSignUp, language, initialPhone = '' }) => {
  const [form, setForm] = useState({ email: '', password: '', phone: initialPhone });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update phone when initialPhone prop changes
  useEffect(() => {
    if (initialPhone) {
      setForm(prev => ({ ...prev, phone: initialPhone }));
    }
  }, [initialPhone]);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onSignUp(form);
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    // Simulate Google OAuth
    alert('Google Sign-In would open here in production');
    // For demo, auto-fill and submit
    const googleUser = {
      email: 'user@gmail.com',
      phone: initialPhone || '9876543210',
      password: 'auto-generated-by-google'
    };
    onSignUp(googleUser);
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
          className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md"
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

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-navy-200"></div>
              <span className="text-xs text-navy-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-navy-200"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-navy-200 text-navy-700 font-semibold rounded-xl hover:bg-navy-50 hover:border-navy-300 transition-colors text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff, X } from 'lucide-react';
import { t } from '../../utils/i18n';

export const SignUpModal = ({ open, onClose, onSignUp, language }) => {
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

            <p className="text-xs text-navy-400 text-center leading-relaxed">
              {t('lpTerms', language)}
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

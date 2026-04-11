import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { t } from '../../utils/i18n';

export const Navbar = ({ language, onGetStartedClick }) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-4 z-50 mx-auto max-w-6xl px-4 relative"
    >
      <div className="bg-white/60 backdrop-blur-xl rounded-full shadow-lg border border-white/50 px-6 py-3 mt-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-800 hidden sm:inline">LeadFlexUp</span>
          </motion.div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: t('lpNavHome', language), href: '#' },
              { label: t('lpNavFeatures', language), href: '#features' },
              { label: t('lpNavStories', language), href: '#stories' },
              { label: t('lpNavPricing', language), href: '#pricing' },
              { label: 'Docs', href: '#' },
              { label: 'Blog', href: '#' },
              { label: 'Careers', href: '#' }
            ].map((nav, i) => (
              <motion.a
                key={i}
                href={nav.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-900 rounded-full hover:bg-white/40 transition-all"
              >
                {nav.label}
              </motion.a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGetStartedClick}
              className="px-4 py-2 bg-navy-900 text-white text-sm font-semibold rounded-full hover:bg-navy-800 transition-all shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

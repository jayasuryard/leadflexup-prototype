import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import { t } from '../../utils/i18n';

export const CTA = ({ language, onSignUpClick, cardFade }) => {
  return (
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
              <button onClick={onSignUpClick}
                className="px-8 py-3.5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 text-sm"
              >{t('lpSignUp', language)}</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

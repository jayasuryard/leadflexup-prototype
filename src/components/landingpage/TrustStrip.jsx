import { motion } from 'framer-motion';
import { t } from '../../utils/i18n';

export const TrustStrip = ({ language, trustLogos }) => {
  return (
    <section className="relative z-20 py-10 border-y border-navy-200/30 bg-gradient-to-b from-[#a8c5e0] via-[#c0d9ee] to-[#e8f0f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-navy-400 uppercase tracking-wider mb-6">
          {t('lpTrustCount', language)}
        </p>
        <div className="flex items-center justify-center flex-wrap gap-10">
          {trustLogos.map((logo, i) => (
            <motion.img
              key={i}
              src={logo}
              alt=""
              className="h-8 opacity-50 hover:opacity-90 transition-opacity grayscale hover:grayscale-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

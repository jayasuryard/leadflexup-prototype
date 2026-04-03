import { motion } from 'framer-motion';
import { t } from '../../utils/i18n';

export const Stats = ({ language, stats, cardFade }) => {
  return (
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
            <motion.div
              key={i}
              {...cardFade(i)}
              className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
            >
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 150 }}
                className="text-4xl sm:text-5xl font-extrabold text-white"
              >
                {s.value}
              </motion.p>
              <p className="text-sm text-navy-200 mt-2 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

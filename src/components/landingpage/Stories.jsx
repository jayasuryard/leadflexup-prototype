import { motion } from 'framer-motion';
import { t } from '../../utils/i18n';

export const Stories = ({ language, stories, cardFade }) => {
  return (
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
              <motion.div
                key={i}
                {...cardFade(i)}
                className={`relative group bg-gradient-to-br ${s.accent} rounded-2xl border border-navy-200/30 overflow-hidden hover:shadow-xl transition-all duration-300
                  ${isLarge ? 'md:col-span-2' : ''}`}
              >
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none" />
                <div className="relative p-6 flex flex-col sm:flex-row items-start gap-5">
                  <div className="flex-shrink-0">
                    <motion.img
                      src={s.img}
                      alt={s.biz}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-sm border border-white/60"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' }}
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
                      >
                        {s.stat}
                      </motion.span>
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
  );
};

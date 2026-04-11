import { motion } from 'framer-motion';
import { t } from '../../utils/i18n';

export const HowItWorks = ({ language, steps }) => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpHowItWorks', language)}</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpHowItWorksHeading', language)}</h2>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-navy-800 -translate-x-1/2" />
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative flex items-center mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className={`w-full md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-0' : 'md:pl-0'}`}>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 shadow-sm">
                  <span className="text-3xl font-extrabold text-navy-500">{s.n}</span>
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
  );
};

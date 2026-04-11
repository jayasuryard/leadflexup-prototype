import { motion } from 'framer-motion';
import { BarChart3, Zap, ArrowRight } from 'lucide-react';
import { t } from '../../utils/i18n';

export const Features = ({ language, features, cardFade }) => {
  return (
    <section id="features" className="py-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpPlatformCapabilities', language)}</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpFeaturesHeading', language)}</h2>
          <p className="text-navy-500">{t('lpFeaturesDesc', language)}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large — Analytics */}
          <motion.div {...cardFade(0)}
            className="md:col-span-2 lg:col-span-2 bg-navy-700 text-white rounded-2xl p-7 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/15 transition-colors" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{features[0].title}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{features[0].desc}</h3>
              <div className="grid grid-cols-4 gap-3 mt-5">
                {[
                  { label: t('websiteHealth', language), val: 82, color: 'text-white' },
                  { label: t('socialMediaScore', language), val: 71, color: 'text-teal-400' },
                  { label: t('searchVisibility', language), val: 65, color: 'text-indigo-400' },
                  { label: t('onlineReviews', language), val: 90, color: 'text-amber-400' }
                ].map((g, j) => (
                  <div key={j} className="text-center">
                    <div className="relative w-12 h-12 mx-auto mb-1">
                      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                        <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="4" />
                        <motion.circle cx="24" cy="24" r="18" fill="none" strokeWidth="4" strokeLinecap="round"
                          className={`stroke-current ${g.color}`}
                          initial={{ strokeDasharray: '0 113' }}
                          whileInView={{ strokeDasharray: `${(g.val / 100) * 113} 113` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + j * 0.15, duration: 0.8 }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{g.val}</span>
                    </div>
                    <span className="text-[9px] text-navy-200">{g.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Competitor + AI cards */}
          {features.slice(1, 3).map((f, i) => (
            <motion.div key={i} {...cardFade(i + 1)}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 hover:shadow-lg hover:bg-white/80 transition-all group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-sm ${i === 0 ? 'bg-navy-700' : 'bg-teal-600'}`}>
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-navy-800 mb-2">{f.title}</h3>
              <p className="text-sm text-navy-500 leading-relaxed mb-4">{f.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                {t('learnMore', language)} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}

          {/* Large — Automation */}
          <motion.div {...cardFade(3)}
            className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-7 relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{features[3].title}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{features[3].desc}</h3>
              <div className="flex flex-wrap gap-2 mt-5">
                {['Social Media', 'Email Campaigns', 'Ad Optimization', 'Review Collection', 'SEO Monitor', 'Lead Scoring'].map((wf, j) => (
                  <motion.div key={j}
                    animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.5 + j * 0.3, ease: 'easeInOut' }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg border border-white/10"
                  >
                    <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse" />
                    <span className="text-xs font-medium">{wf}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Last 2 features */}
          {features.slice(4).map((f, i) => (
            <motion.div key={i} {...cardFade(i + 4)}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 hover:shadow-lg hover:bg-white/80 transition-all group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-sm ${i === 0 ? 'bg-navy-50' : 'bg-teal-50'}`}>
                <f.icon className={`w-5 h-5 ${i === 0 ? 'text-navy-600' : 'text-teal-600'}`} />
              </div>
              <h3 className="text-base font-bold text-navy-800 mb-2">{f.title}</h3>
              <p className="text-sm text-navy-500 leading-relaxed mb-4">{f.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                {t('learnMore', language)} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

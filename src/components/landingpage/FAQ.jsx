import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { t } from '../../utils/i18n';
import { Commentable } from '../../components/CommentBox';

export const FAQ = ({ language, faqOpen, setFaqOpen }) => {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Commentable id="faq-heading" label="FAQ Section Heading">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpFaqBadge', language)}</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-3">{t('lpFaqTitle', language)}</h2>
          </div>
        </Commentable>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Commentable key={n} id={`faq-item-${n}`} label={`FAQ Item ${n}`}>
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-navy-200/40 overflow-hidden"
              >
                <button onClick={() => setFaqOpen(faqOpen === n ? null : n)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-navy-800 pr-4">{t(`lpFaq${n}Q`, language)}</span>
                  <motion.div animate={{ rotate: faqOpen === n ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-navy-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {faqOpen === n && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    >
                      <p className="px-5 pb-5 text-sm text-navy-500 leading-relaxed">{t(`lpFaq${n}A`, language)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Commentable>
          ))}
        </div>
      </div>
    </section>
  );
};

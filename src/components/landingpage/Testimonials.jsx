import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { t } from '../../utils/i18n';

export const Testimonials = ({ language, testimonialImages, cardFade }) => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpTestimonialBadge', language)}</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpTestimonialTitle', language)}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonialImages.map(({ n, img }, i) => (
            <motion.div key={n} {...cardFade(i)}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-navy-200/40 relative hover:shadow-lg transition-all"
            >
              <div className="absolute top-5 right-5 text-navy-100">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 7.5c0-2.21-1.79-4-4-4S3 5.29 3 7.5 4.79 11.5 7 11.5c.25 0 .5-.02.74-.07C7.26 13.56 5.36 15 3 15v2c4.42 0 8-3.58 8-8v-1.5zm13 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c.25 0 .5-.02.74-.07C20.26 13.56 18.36 15 16 15v2c4.42 0 8-3.58 8-8v-1.5z"/>
                </svg>
              </div>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-navy-600 leading-relaxed mb-5 italic">
                &ldquo;{t(`lpTestimonial${n}Quote`, language)}&rdquo;
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 rounded-full mb-5">
                <TrendingUp className="w-3 h-3 text-teal-600" />
                <span className="text-[10px] font-bold text-teal-700">{t(`lpTestimonial${n}Metric`, language)}</span>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-navy-200/40">
                <img src={img} alt="" className="w-10 h-10 rounded-full object-cover border border-white/60" />
                <div>
                  <p className="text-sm font-bold text-navy-800">{t(`lpTestimonial${n}Name`, language)}</p>
                  <p className="text-[11px] text-navy-400">{t(`lpTestimonial${n}Role`, language)} • {t(`lpTestimonial${n}City`, language)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

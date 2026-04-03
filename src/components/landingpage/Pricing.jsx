import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { t, getLocalizedText } from '../../utils/i18n';

export const Pricing = ({ language, subscriptionPlans, planIcons, onSignUpClick, cardFade }) => {
  return (
    <section id="pricing" className="py-20 bg-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpPricingBadge', language)}</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpPricingTitle', language)}</h2>
          <p className="text-navy-500">{t('lpPricingDesc', language)}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {subscriptionPlans.map((plan, i) => {
            const Icon = planIcons[plan.id];
            return (
              <motion.div key={plan.id} {...cardFade(i)} className="relative">
                {plan.recommended && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
                    <span className="text-[10px] font-bold bg-teal-600 text-white px-3 py-1 rounded-full shadow-lg shadow-teal-600/20">
                      {t('mostPopular', language)}
                    </span>
                  </div>
                )}
                <div className={`h-full bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 hover:bg-white/80 transition-all ${
                  plan.recommended ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-navy-200/40'
                }`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${plan.recommended ? 'bg-teal-600' : 'bg-navy-700'}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-1">{getLocalizedText(plan.name, language)}</h3>
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-navy-900">{plan.currency}{(plan.price / 100000).toFixed(2)}L</span>
                      <span className="text-xs text-navy-400">{t('perMonth', language)}</span>
                    </div>
                    <p className="text-[11px] text-navy-400 mt-0.5">{t('subBilling', language)}</p>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    {plan.features.slice(0, 5).map((f, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-navy-600">{getLocalizedText(f, language)}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={onSignUpClick}
                    className={`w-full py-2.5 text-xs font-semibold rounded-lg ${
                      plan.recommended ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-700 text-white hover:bg-navy-800'
                    }`}
                  >{t('subscribe', language)}</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

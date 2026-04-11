import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { t, getLocalizedText } from '../../utils/i18n';
import { useState } from 'react';

export const Pricing = ({ language, subscriptionPlans, planIcons, onSignUpClick, cardFade }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{t('lpPricingBadge', language)}</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-3 mb-4">{t('lpPricingTitle', language)}</h2>
          <p className="text-navy-500">{t('lpPricingDesc', language)}</p>
          
          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-navy-900' : 'text-navy-400'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-navy-200 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              style={{ backgroundColor: isYearly ? '#0d9488' : '#cbd5e1' }}
            >
              <span
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{ transform: isYearly ? 'translateX(28px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-navy-900' : 'text-navy-400'}`}>
              Yearly <span className="text-teal-600 text-xs">(Save up to 16%)</span>
            </span>
          </div>
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
                      <span className="text-3xl font-bold text-navy-900">
                        {plan.currency}{((isYearly ? plan.yearlyPrice : plan.price) / 100).toFixed(0)}
                      </span>
                      <span className="text-xs text-navy-400">{t('perMonth', language)}</span>
                    </div>
                    <p className="text-[11px] text-navy-400 mt-0.5">
                      {isYearly ? 'Billed annually' : t('subBilling', language)}
                    </p>
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

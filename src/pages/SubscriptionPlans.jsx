import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { subscriptionPlans } from '../data/mockDatabase';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.35 }
});

export const SubscriptionPlans = () => {
  const { language, subscription, selectSubscription } = useApp();
  const planIcons = { starter: Sparkles, professional: Crown, enterprise: Rocket };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fade()} className="text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-2">{t('choosePlan', language)}</h1>
        <p className="text-sm text-navy-400 max-w-lg mx-auto">
          {t('subDesc', language)}
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {subscriptionPlans.map((plan, i) => {
          const Icon = planIcons[plan.id];
          const isCurrent = subscription?.id === plan.id;

          return (
            <motion.div key={plan.id} {...fade(i)} className="relative">
              {plan.recommended && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center z-10">
                  <span className="text-[10px] font-bold bg-teal-600 text-white px-3 py-1 rounded-full">
                    {t('mostPopular', language)}
                  </span>
                </div>
              )}

              <div className={`h-full bg-white rounded-xl border-2 p-6 ${
                plan.recommended ? 'border-teal-500 shadow-lg shadow-teal-500/10' : 'border-navy-100'
              }`}>
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 ${
                  plan.recommended ? 'bg-teal-600' : 'bg-navy-700'
                }`}>
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
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-navy-600">{getLocalizedText(f, language)}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <button disabled className="w-full py-2.5 text-xs font-semibold rounded-lg border-2 border-navy-200 text-navy-400 cursor-not-allowed">
                    {t('currentPlan', language)}
                  </button>
                ) : (
                  <button
                    onClick={() => selectSubscription(plan)}
                    className={`w-full py-2.5 text-xs font-semibold rounded-lg ${
                      plan.recommended
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-navy-700 text-white hover:bg-navy-800'
                    }`}
                  >
                    {t('subscribe', language)}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Value props */}
      <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {[
          { icon: Check, title: t('subNoCommitment', language), desc: t('subNoCommitmentDesc', language) },
          { icon: Sparkles, title: t('subGrowthGuarantee', language), desc: t('subGrowthGuaranteeDesc', language) },
          { icon: Crown, title: t('subPremiumSupport', language), desc: t('subPremiumSupportDesc', language) }
        ].map((v, i) => (
          <motion.div key={i} {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-5 text-center">
            <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <v.icon className="w-4 h-4 text-navy-600" />
            </div>
            <h4 className="text-xs font-bold text-navy-800 mb-1">{v.title}</h4>
            <p className="text-[11px] text-navy-400">{v.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-navy-400 mb-2">{t('subCustomPlan', language)}</p>
        <button className="text-xs font-semibold text-navy-600 border border-navy-200 px-4 py-2 rounded-lg hover:bg-navy-50">
          {t('subContactSales', language)}
        </button>
      </div>
    </div>
  );
};

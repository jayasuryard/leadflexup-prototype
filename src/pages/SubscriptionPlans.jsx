import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { subscriptionPlans } from '../data/mockDatabase';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const SubscriptionPlans = () => {
  const { language, subscription, selectSubscription } = useApp();

  const planIcons = {
    starter: Sparkles,
    professional: Crown,
    enterprise: Rocket
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('choosePlan', language)}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan to accelerate your business growth. 
            All plans include our AI-powered intelligence platform.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {subscriptionPlans.map((plan, index) => {
          const Icon = planIcons[plan.id];
          const isCurrentPlan = subscription?.id === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge variant="primary" className="text-sm px-4 py-1.5">
                    {t('mostPopular', language)}
                  </Badge>
                </div>
              )}

              <Card 
                className={`h-full ${
                  plan.recommended 
                    ? 'border-2 border-indigo-600 shadow-xl' 
                    : 'border-2 border-transparent'
                }`}
                hover={!isCurrentPlan}
              >
                <CardBody className="p-8">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    plan.recommended 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700'
                  }`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {getLocalizedText(plan.name, language)}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.currency}{(plan.price / 100000).toFixed(2)}L
                      </span>
                      <span className="text-gray-600">
                        {t('perMonth', language)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Billed monthly • Cancel anytime
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">
                          {getLocalizedText(feature, language)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  {isCurrentPlan ? (
                    <Button variant="outline" size="lg" className="w-full" disabled>
                      {t('currentPlan', language)}
                    </Button>
                  ) : (
                    <Button 
                      variant={plan.recommended ? 'primary' : 'outline'}
                      size="lg" 
                      className="w-full"
                      onClick={() => selectSubscription(plan)}
                    >
                      {t('subscribe', language)}
                    </Button>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Value Propositions */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
        <Card>
          <CardBody className="text-center p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb- 2">No Long-term Commitment</h4>
            <p className="text-sm text-gray-600">
              Cancel or change your plan anytime. No hidden fees or contracts.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">4x Revenue Growth Guarantee</h4>
            <p className="text-sm text-gray-600">
              Our Enterprise plan comes with a revenue growth guarantee.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center p-6">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-pink-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Premium Support</h4>
            <p className="text-sm text-gray-600">
              Get dedicated support from our team of growth experts.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* FAQ or Additional Info */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Need a custom plan for multiple locations or special requirements?
        </p>
        <Button variant="outline">
          Contact Sales
        </Button>
      </div>
    </div>
  );
};

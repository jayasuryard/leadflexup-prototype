import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const RecommendationsPage = () => {
  const { language, recommendations, analyticsData } = useApp();

  if (!recommendations || recommendations.length === 0) return null;

  const priorityConfig = {
    critical: { icon: AlertCircle, iconBg: 'bg-red-100', iconColor: 'text-red-600', label: t('criticalPriority', language) },
    high: { icon: AlertCircle, iconBg: 'bg-orange-100', iconColor: 'text-orange-600', label: t('highPriority', language) },
    medium: { icon: Sparkles, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', label: t('mediumPriority', language) },
    low: { icon: CheckCircle2, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', label: t('lowPriority', language) }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('recommendationsTitle', language)}
        </h1>
        <p className="text-gray-600">
          AI-powered actionable insights to improve your market position
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardBody className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Growth Opportunity Summary</h2>
              <p className="text-indigo-100 leading-relaxed">
                Based on your current digital presence score of <strong>{analyticsData.digitalPresence.overall}</strong>, 
                we've identified {recommendations.length} key areas for improvement. Implementing these recommendations 
                can increase your market position by up to <strong>50 points</strong> and generate 
                <strong> 4x more qualified leads</strong>.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const config = priorityConfig[rec.priority];
          const Icon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <CardBody className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Priority Indicator */}
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 ${config.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${config.iconColor}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {getLocalizedText(rec.title, language)}
                            </h3>
                            <Badge variant={rec.priority}>{config.label}</Badge>
                          </div>
                          <p className="text-gray-600">
                            {getLocalizedText(rec.description, language)}
                          </p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('impact', language)}</p>
                          <p className="font-semibold text-gray-900">{rec.impact}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t('timeline', language)}</p>
                          <p className="font-semibold text-gray-900">{rec.timeline}</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <Button variant="outline" size="sm" icon={ArrowRight}>
                          {t('startImplementing', language)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Next Steps */}
      <Card className="border-2 border-indigo-200 bg-indigo-50">
        <CardBody className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Ready to get started?</h3>
          <p className="text-gray-700 mb-4">
            Subscribe to a plan to unlock automated implementation of these recommendations 
            and start your journey to 4x revenue growth.
          </p>
          <Button variant="primary">
            View Subscription Plans
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

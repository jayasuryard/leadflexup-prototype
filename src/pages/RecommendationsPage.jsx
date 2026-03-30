import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

export const RecommendationsPage = () => {
  const { language, recommendations, analyticsData } = useApp();
  const navigate = useNavigate();
  if (!recommendations || recommendations.length === 0) return null;

  const priorityConfig = {
    critical: { icon: AlertCircle, bg: 'bg-red-50', color: 'text-red-600', dot: 'bg-red-500', label: t('criticalPriority', language) },
    high: { icon: AlertCircle, bg: 'bg-orange-50', color: 'text-orange-600', dot: 'bg-orange-500', label: t('highPriority', language) },
    medium: { icon: Sparkles, bg: 'bg-yellow-50', color: 'text-yellow-600', dot: 'bg-yellow-500', label: t('mediumPriority', language) },
    low: { icon: CheckCircle2, bg: 'bg-teal-50', color: 'text-teal-600', dot: 'bg-teal-500', label: t('lowPriority', language) }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">{t('recommendationsTitle', language)}</h1>
        <p className="text-sm text-navy-400 mt-0.5">AI-powered actionable insights</p>
      </div>

      {/* Summary */}
      <motion.div {...fade()} className="bg-navy-700 text-white rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold mb-1">Growth Opportunity Summary</h2>
            <p className="text-sm text-navy-200 leading-relaxed">
              Score: <strong>{analyticsData.digitalPresence.overall}/100</strong> — 
              {recommendations.length} improvements found. Potential: <strong>+50 pts</strong> and <strong>4x leads</strong>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const cfg = priorityConfig[rec.priority];
          const Icon = cfg.icon;
          return (
            <motion.div key={i} {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${cfg.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-bold text-navy-800">{getLocalizedText(rec.title, language)}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-navy-500 leading-relaxed">{getLocalizedText(rec.description, language)}</p>

                  <div className="flex gap-6 mt-3 p-3 bg-navy-50 rounded-lg">
                    <div>
                      <p className="text-[10px] text-navy-400">{t('impact', language)}</p>
                      <p className="text-xs font-semibold text-navy-700">{rec.impact}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-navy-400">{t('timeline', language)}</p>
                      <p className="text-xs font-semibold text-navy-700">{rec.timeline}</p>
                    </div>
                  </div>

                  <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700">
                    {t('startImplementing', language)} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div {...fade()} className="bg-navy-50 border border-navy-200 rounded-xl p-5">
        <h3 className="text-sm font-bold text-navy-800 mb-1">Ready to get started?</h3>
        <p className="text-xs text-navy-500 mb-3">Subscribe to unlock automated implementation.</p>
        <button
          onClick={() => navigate('/dashboard/subscription')}
          className="px-4 py-2 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800"
        >
          View Subscription Plans
        </button>
      </motion.div>
    </div>
  );
};

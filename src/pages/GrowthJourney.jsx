import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trophy, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { growthJourneySteps } from '../data/mockDatabase';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

export const GrowthJourney = () => {
  const { language, growthProgress, updateGrowthProgress } = useApp();
  const [expandedStep, setExpandedStep] = useState(null);

  const totalTasks = growthJourneySteps.reduce((a, s) => a + s.tasks.length, 0);
  const completedTasks = Object.values(growthProgress).filter(Boolean).length;
  const overallProgress = (completedTasks / totalTasks) * 100;

  const isStepDone = (id) => growthJourneySteps.find(s => s.id === id)?.tasks.every(t => growthProgress[`${id}-${t.id}`]);
  const stepPct = (id) => {
    const step = growthJourneySteps.find(s => s.id === id);
    if (!step) return 0;
    return (step.tasks.filter(t => growthProgress[`${id}-${t.id}`]).length / step.tasks.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">{t('yourGrowthJourney', language)}</h1>
        <p className="text-sm text-navy-400 mt-0.5">{t('gjSubtitle', language)}</p>
      </div>

      {/* Overall Progress */}
      <motion.div {...fade()} className="bg-navy-700 text-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold mb-1">{t('gjYourProgress', language)}</h2>
            <p className="text-sm text-navy-200">{completedTasks} {t('of', language)} {totalTasks} {t('gjTasksCompleted', language)}</p>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-teal-400" />
          </div>
        </div>
        <div className="w-full bg-white/15 rounded-full h-2">
          <div className="bg-teal-400 rounded-full h-2 transition-all" style={{ width: `${overallProgress}%` }} />
        </div>
        <p className="text-xs text-navy-300 mt-2 text-right">{Math.round(overallProgress)}%</p>
      </motion.div>

      {/* Steps */}
      <div className="space-y-3">
        {growthJourneySteps.map((step, i) => {
          const done = isStepDone(step.id);
          const pct = stepPct(step.id);
          const open = expandedStep === step.id;

          return (
            <motion.div key={step.id} {...fade(i)} className={`bg-white rounded-xl border ${done ? 'border-teal-300' : 'border-navy-100'}`}>
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedStep(open ? null : step.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? 'bg-teal-50' : 'bg-navy-50'}`}>
                    {done ? <CheckCircle2 className="w-5 h-5 text-teal-600" /> : <span className="text-sm font-bold text-navy-600">{step.id}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-navy-800">{getLocalizedText(step.title, language)}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        done ? 'bg-teal-50 text-teal-700' : pct > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-navy-50 text-navy-500'
                      }`}>
                        {done ? t('completed', language) : pct > 0 ? t('inProgress', language) : t('notStarted', language)}
                      </span>
                    </div>
                    <p className="text-xs text-navy-400 mb-2">{getLocalizedText(step.description, language)}</p>
                    <div className="w-full bg-navy-100 rounded-full h-1.5">
                      <div className="bg-teal-500 rounded-full h-1.5 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <motion.div animate={{ rotate: open ? 180 : 0 }} className="flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-navy-100"
                >
                  <div className="p-5 space-y-2 bg-navy-50/50">
                    {step.tasks.map(task => {
                      const key = `${step.id}-${task.id}`;
                      const taskDone = growthProgress[key];
                      return (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <button onClick={() => updateGrowthProgress(step.id, task.id, !taskDone)} className="flex-shrink-0">
                              {taskDone ? <CheckCircle2 className="w-5 h-5 text-teal-600" /> : <Circle className="w-5 h-5 text-navy-300 hover:text-teal-500" />}
                            </button>
                            <span className={`text-xs font-medium ${taskDone ? 'text-navy-400 line-through' : 'text-navy-700'}`}>
                              {getLocalizedText(task.label, language)}
                            </span>
                          </div>
                          {!taskDone && (
                            <button
                              onClick={() => updateGrowthProgress(step.id, task.id, true)}
                              className="text-[11px] font-semibold text-navy-500 border border-navy-200 px-2.5 py-1 rounded-md hover:bg-navy-50"
                            >
                              {t('markComplete', language)}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Celebration */}
      {overallProgress === 100 && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-teal-600 text-white rounded-xl p-8 text-center"
        >
          <Rocket className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-1">{t('gjCongrats', language)}</h2>
          <p className="text-sm text-teal-100">{t('gjCongratsDesc', language)}</p>
        </motion.div>
      )}
    </div>
  );
};

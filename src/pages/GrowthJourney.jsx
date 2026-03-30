import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trophy, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { growthJourneySteps } from '../data/mockDatabase';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const GrowthJourney = () => {
  const { language, growthProgress, updateGrowthProgress } = useApp();
  const [expandedStep, setExpandedStep] = useState(null);

  const calculateProgress = () => {
    const totalTasks = growthJourneySteps.reduce((acc, step) => acc + step.tasks.length, 0);
    const completedTasks = Object.values(growthProgress).filter(Boolean).length;
    return (completedTasks / totalTasks) * 100;
  };

  const isStepCompleted = (stepId) => {
    const step = growthJourneySteps.find(s => s.id === stepId);
    return step?.tasks.every(task => growthProgress[`${stepId}-${task.id}`]);
  };

  const getStepProgress = (stepId) => {
    const step = growthJourneySteps.find(s => s.id === stepId);
    if (!step) return 0;
    const completed = step.tasks.filter(task => growthProgress[`${stepId}-${task.id}`]).length;
    return (completed / step.tasks.length) * 100;
  };

  const overallProgress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('yourGrowthJourney', language)}
        </h1>
        <p className="text-gray-600">
          Follow this step-by-step roadmap to achieve 4x revenue growth
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardBody className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
              <p className="text-indigo-100">
                {Object.values(growthProgress).filter(Boolean).length} of{' '}
                {growthJourneySteps.reduce((acc, step) => acc + step.tasks.length, 0)} tasks completed
              </p>
            </div>
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12" />
            </div>
          </div>
          <ProgressBar 
            value={overallProgress} 
            showLabel={true}
            className="[&_.bg-gray-200]:bg-white/20 [&_.bg-indigo-600]:bg-white"
          />
        </CardBody>
      </Card>

      {/* Journey Steps */}
      <div className="space-y-4">
        {growthJourneySteps.map((step, index) => {
          const isCompleted = isStepCompleted(step.id);
          const stepProgress = getStepProgress(step.id);
          const isExpanded = expandedStep === step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`${isCompleted ? 'border-2 border-green-500' : ''}`}
                hover
              >
                <CardBody className="p-0">
                  {/* Step Header */}
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Number/Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCompleted 
                          ? 'bg-green-100' 
                          : 'bg-gradient-to-r from-indigo-100 to-purple-100'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <span className="text-lg font-bold text-indigo-600">{step.id}</span>
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {getLocalizedText(step.title, language)}
                          </h3>
                          {isCompleted ? (
                            <Badge variant="success">{t('completed', language)}</Badge>
                          ) : stepProgress > 0 ? (
                            <Badge variant="warning">{t('inProgress', language)}</Badge>
                          ) : (
                            <Badge variant="default">{t('notStarted', language)}</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">
                          {getLocalizedText(step.description, language)}
                        </p>
                        <ProgressBar value={stepProgress} showLabel={true} />
                      </div>

                      {/* Expand Icon */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Tasks List (Expandable) */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-6 space-y-3 bg-gray-50">
                        {step.tasks.map(task => {
                          const taskKey = `${step.id}-${task.id}`;
                          const isTaskCompleted = growthProgress[taskKey];

                          return (
                            <div 
                              key={task.id}
                              className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateGrowthProgress(step.id, task.id, !isTaskCompleted)}
                                  className="flex-shrink-0"
                                >
                                  {isTaskCompleted ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                  ) : (
                                    <Circle className="w-6 h-6 text-gray-300 hover:text-indigo-600 transition-colors" />
                                  )}
                                </button>
                                <span className={`font-medium ${
                                  isTaskCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>
                                  {getLocalizedText(task.label, language)}
                                </span>
                              </div>
                              {!isTaskCompleted && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateGrowthProgress(step.id, task.id, true)}
                                >
                                  {t('markComplete', language)}
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Celebration */}
      {overallProgress === 100 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardBody className="p-8 text-center">
              <Rocket className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Congratulations! 🎉</h2>
              <p className="text-lg text-green-100 mb-4">
                You've completed your growth journey! Your business is now fully optimized 
                for maximum lead generation and revenue growth.
              </p>
              <Button variant="secondary" size="lg">
                Continue to Advanced Strategies
              </Button>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

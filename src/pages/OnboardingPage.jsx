import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Share2, MapPin, ArrowRight, SkipForward,
  Check, TrendingUp, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const onboardingSteps = [
  {
    id: 'website',
    title: 'Set Up Your Website',
    description: 'Create a professional web presence for your business. We\'ll guide you through building a beautiful, mobile-friendly website.',
    icon: Globe,
    color: 'bg-navy-700',
    items: [
      { label: 'Choose a template', desc: 'Pick from industry-specific designs' },
      { label: 'Add your business info', desc: 'Logo, description, contact details' },
      { label: 'Customize colors & fonts', desc: 'Match your brand identity' },
      { label: 'Publish your website', desc: 'Go live with one click' }
    ],
    actionLabel: 'Set Up Website',
    skipWarning: 'Without a website, you\'ll miss out on 70% of potential customers who search online.'
  },
  {
    id: 'social_media',
    title: 'Connect Social Media',
    description: 'Boost your online visibility by connecting your social media profiles. Post across platforms from one dashboard.',
    icon: Share2,
    color: 'bg-teal-600',
    items: [
      { label: 'Connect Facebook Page', desc: 'Link or create your business page' },
      { label: 'Connect Instagram', desc: 'Share visual content automatically' },
      { label: 'Connect Google Business', desc: 'Appear in local searches' },
      { label: 'Schedule first post', desc: 'AI-generated content ready to go' }
    ],
    actionLabel: 'Connect Social Media',
    skipWarning: 'Social media drives 30% of local business discovery. You can set this up later from your profile.'
  },
  {
    id: 'google_business',
    title: 'Google Business Profile',
    description: 'Get found on Google Maps and Search. Claim and optimize your Google Business Profile to attract nearby customers.',
    icon: MapPin,
    color: 'bg-navy-700',
    items: [
      { label: 'Verify your business', desc: 'Confirm your business location' },
      { label: 'Add photos & hours', desc: 'Show customers what to expect' },
      { label: 'Set up categories', desc: 'Help Google match you to searches' },
      { label: 'Enable messaging', desc: 'Let customers reach you directly' }
    ],
    actionLabel: 'Set Up Google Profile',
    skipWarning: 'Businesses with Google profiles get 5x more views. You can set this up later from your profile.'
  }
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser, updateOnboardingTasks } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepDone, setStepDone] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const step = onboardingSteps[currentStep];
  const totalSteps = onboardingSteps.length;

  const handleAction = async () => {
    setIsSimulating(true);
    // Simulate setup process
    await new Promise(r => setTimeout(r, 2500));
    setIsSimulating(false);
    setStepDone(true);
    setCompletedSteps(prev => [...prev, step.id]);
  };

  const handleSkip = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkip = () => {
    setSkippedSteps(prev => [...prev, step.id]);
    setShowSkipConfirm(false);
    goNext();
  };

  const goNext = () => {
    setStepDone(false);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // All steps done
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    const tasks = onboardingSteps.map(s => ({
      id: s.id,
      title: s.title,
      completed: completedSteps.includes(s.id),
      skipped: skippedSteps.includes(s.id) || (!completedSteps.includes(s.id) && s.id !== step.id)
    }));

    // If current step was just completed, mark it
    if (stepDone) {
      const t = tasks.find(t => t.id === step.id);
      if (t) { t.completed = true; t.skipped = false; }
    }

    if (typeof updateOnboardingTasks === 'function') {
      updateOnboardingTasks(tasks);
    }
    setAllDone(true);
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  if (allDone) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          {/* Celebration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <TrendingUp className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-2xl font-bold text-navy-900 mb-3">You're All Set!</h1>
            <p className="text-sm text-navy-400 mb-6">
              Your online presence journey has begun. Head to your dashboard to track your growth.
            </p>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-navy-100 p-5 mb-8 text-left"
          >
            <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">Setup Summary</h3>
            <div className="space-y-2.5">
              {onboardingSteps.map(s => {
                const done = completedSteps.includes(s.id);
                const skipped = skippedSteps.includes(s.id);
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      done ? 'bg-teal-100' : 'bg-amber-100'
                    }`}>
                      {done ? (
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <SkipForward className="w-3 h-3 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-navy-800">{s.title}</p>
                      <p className="text-[10px] text-navy-400">
                        {done ? 'Completed' : 'Skipped - available in your TODO list'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={handleFinish}
            className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <div className="bg-white border-b border-navy-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
          </div>
          <span className="text-xs font-medium text-navy-400">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-8">
          {onboardingSteps.map((s, i) => (
            <div
              key={s.id}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i < currentStep || completedSteps.includes(s.id)
                  ? 'bg-teal-500'
                  : i === currentStep
                    ? 'bg-teal-300'
                    : 'bg-navy-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
          >
            {/* Step Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900">{step.title}</h2>
                <p className="text-sm text-navy-400 mt-1">{step.description}</p>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-xl border border-navy-100 p-5 mb-6">
              <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-4">What We'll Set Up</h3>
              <div className="space-y-3">
                {step.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                      stepDone ? 'bg-teal-100' : 'bg-navy-100'
                    } transition-colors duration-500`}>
                      {stepDone ? (
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <span className="text-[10px] font-bold text-navy-400">{i + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-800">{item.label}</p>
                      <p className="text-xs text-navy-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action / Simulating / Done states */}
            {isSimulating ? (
              <div className="bg-white rounded-xl border border-navy-100 p-6 text-center">
                <div className="onboard-loader mx-auto mb-4"></div>
                <p className="text-sm font-semibold text-navy-800">Setting up {step.title.toLowerCase()}...</p>
                <p className="text-xs text-navy-400 mt-1">This may take a moment</p>
              </div>
            ) : stepDone ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-teal-50 rounded-xl border border-teal-200 p-5 text-center"
              >
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-bold text-teal-800 mb-1">{step.title} Complete!</p>
                <p className="text-xs text-teal-600 mb-4">Great job! Let's move to the next step.</p>
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
                >
                  {currentStep < totalSteps - 1 ? 'Next Step' : 'Finish Setup'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAction}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
                >
                  {step.actionLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-1.5 px-4 py-3 border border-navy-200 text-navy-500 text-sm font-medium rounded-xl hover:bg-navy-50 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Skip Confirmation Modal */}
      <AnimatePresence>
        {showSkipConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4"
            onClick={() => setShowSkipConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-navy-900">Skip this step?</h3>
                <button onClick={() => setShowSkipConfirm(false)} className="p-1 hover:bg-navy-50 rounded-lg">
                  <X className="w-4 h-4 text-navy-400" />
                </button>
              </div>
              <p className="text-xs text-navy-500 mb-4">{step.skipWarning}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSkipConfirm(false)}
                  className="flex-1 px-4 py-2 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmSkip}
                  className="flex-1 px-4 py-2 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Skip Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loader CSS */}
      <style>{`
        .onboard-loader {
          width: 40px;
          height: 40px;
          border: 3px solid #dce3f0;
          border-top-color: #0d886f;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

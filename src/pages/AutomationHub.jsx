import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Play, Pause, Clock, CheckCircle2,
  BarChart3, Settings, Eye, Sparkles, X,
  ArrowRight, ChevronRight, Activity, TrendingUp, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { automationTasks, hotelAutomationTasks } from '../data/mockDatabase';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

const statusColors = { running: 'border-teal-300', paused: 'border-yellow-300', error: 'border-red-300' };
const statusBg = { running: 'bg-teal-500', paused: 'bg-yellow-500', error: 'bg-red-500' };
const statusLabels = (language) => ({ running: t('running', language), paused: t('paused', language), error: t('error', language) });

/* ─── Workflow Visual Preview Modal ─── */
const WorkflowPreview = ({ workflow, onClose, language }) => {
  if (!workflow) return null;

  const awfTypes = ['Social', 'Reviews', 'Email', 'Seo', 'Competitor', 'Chat', 'Billing', 'Ads'];
  const awfTypeMap = { social: 'Social', reviews: 'Reviews', email: 'Email', seo: 'Seo', competitor: 'Competitor', chat: 'Chat', billing: 'Billing', ads: 'Ads' };
  const buildSteps = (type) => {
    const key = awfTypeMap[type] || 'Social';
    const statuses = {
      Social: ['done','done','active','pending','pending'],
      Reviews: ['done','done','active','pending','pending'],
      Email: ['done','done','active','active','pending'],
      Seo: ['done','done','active','pending','pending'],
      Competitor: ['done','active','active','pending','pending'],
      Chat: ['done','active','active','pending','pending'],
      Billing: ['done','done','active','pending','pending'],
      Ads: ['done','done','active','active','pending'],
    };
    const s = statuses[key] || statuses.Social;
    return [1,2,3,4,5].map((n, i) => ({
      label: t(`awf${key}${n}Label`, language),
      status: s[i],
      detail: t(`awf${key}${n}Detail`, language),
      metric: t(`awf${key}${n}Metric`, language),
    }));
  };
  const steps = {};
  Object.keys(awfTypeMap).forEach(k => { steps[k] = buildSteps(k); });

  const workflowSteps = steps[workflow.type] || steps.social;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-100 flex items-center gap-3">
          <span className="text-2xl">{workflow.icon}</span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-navy-800">{workflow.name}</h3>
            <p className="text-[11px] text-navy-400">{workflow.schedule} • {t('last', language)} {workflow.lastRun}</p>
          </div>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${statusBg[workflow.status]}`}>
            {workflow.status === 'running' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            {statusLabels(language)[workflow.status]}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-50"><X className="w-4 h-4 text-navy-400" /></button>
        </div>

        {/* Visual Pipeline */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <p className="text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-4">{t('autoPipeline', language)}</p>
          <div className="space-y-3">
            {workflowSteps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl border p-4 ${
                  step.status === 'done' ? 'border-teal-200 bg-teal-50/30' :
                  step.status === 'active' ? 'border-teal-400 bg-white workflow-glow' :
                  'border-navy-100 bg-navy-50/30'
                }`}>
                {/* Connector line */}
                {i < workflowSteps.length - 1 && (
                  <div className="absolute -bottom-3 left-7 w-0.5 h-3 bg-navy-200" />
                )}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    step.status === 'done' ? 'bg-teal-500 text-white' :
                    step.status === 'active' ? 'bg-teal-100 text-teal-600' :
                    'bg-navy-100 text-navy-400'
                  }`}>
                    {step.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> :
                     step.status === 'active' ? <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} /> :
                     <span className="text-[10px] font-bold">{i + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-[12px] font-bold ${step.status === 'done' ? 'text-teal-700' : step.status === 'active' ? 'text-navy-800' : 'text-navy-400'}`}>{step.label}</h4>
                      {step.status === 'active' && (
                        <span className="relative flex items-center gap-1 text-[8px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">
                          <span className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" /> {t('autoInProgress', language)}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] mt-0.5 ${step.status === 'pending' ? 'text-navy-300' : 'text-navy-500'}`}>{step.detail}</p>
                    <div className={`mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      step.status === 'done' ? 'bg-teal-100 text-teal-700' :
                      step.status === 'active' ? 'bg-navy-100 text-navy-600' :
                      'bg-navy-50 text-navy-400'
                    }`}>
                      <BarChart3 className="w-2.5 h-2.5" /> {step.metric}
                    </div>
                  </div>
                </div>
                {/* Active step shimmer */}
                {step.status === 'active' && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100/20 to-transparent animate-shimmer" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AutomationHub = () => {
  const { language, businessData, isAuthenticated, workflows, addWorkflow, updateWorkflowStatus } = useApp();
  const [tasks, setTasks] = useState(businessData?.category === 'hotel' ? hotelAutomationTasks : automationTasks);
  const [previewTask, setPreviewTask] = useState(null);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'running' ? 'paused' : 'running' } : t));
  };

  // Merge context-created workflows with static tasks
  const allTasks = [
    ...tasks,
    ...workflows.map(wf => ({
      id: wf.id, name: wf.name, status: wf.status || 'running', type: wf.type,
      schedule: t('autoAiCreated', language), lastRun: 'Just now', icon: wf.icon,
      isWorkflow: true, steps: wf.steps,
    }))
  ];

  const running = allTasks.filter(t => t.status === 'running').length;
  const total = allTasks.length;

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {previewTask && <WorkflowPreview workflow={previewTask} onClose={() => setPreviewTask(null)} language={language} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div {...fade(0)} className="bg-gradient-to-r from-navy-700 via-navy-800 to-navy-700 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-7 h-7 text-teal-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold mb-1">{t('automationHub', language)}</h1>
            <p className="text-[12px] text-navy-200 leading-relaxed max-w-xl">
              {t('autoHeroMsg', language).replace('{name}', businessData?.businessName || '')}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold text-teal-400">{running}/{total}</div>
            <p className="text-[10px] text-navy-300">{t('autoActiveCount', language)}</p>
          </div>
        </div>
        <div className="mt-4 w-full bg-white/10 rounded-full h-2">
          <div className="bg-teal-400 rounded-full h-2 transition-all" style={{ width: `${(running / total) * 100}%` }} />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: '📧', label: t('autoStatEmails', language), value: '128', delta: t('autoStatEmailsDelta', language) },
          { icon: '⭐', label: t('autoStatReviews', language), value: '18', delta: t('autoStatReviewsDelta', language) },
          { icon: '📱', label: t('autoStatPosts', language), value: '32', delta: t('autoStatPostsDelta', language) },
          { icon: '📢', label: t('autoStatAds', language), value: '₹12.4K', delta: t('autoStatAdsDelta', language) },
        ].map((stat, i) => (
          <motion.div key={i} {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-4">
            <span className="text-lg">{stat.icon}</span>
            <p className="text-xl font-bold text-navy-900 mt-1">{stat.value}</p>
            <p className="text-[10px] text-navy-500 mt-0.5">{stat.label}</p>
            <p className="text-[9px] text-teal-600 font-medium mt-1">{stat.delta}</p>
          </motion.div>
        ))}
      </div>

      {/* AI-Created Workflows section */}
      {workflows.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-navy-800">{t('autoAiCreated', language)}</h2>
            <span className="text-[9px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full font-semibold">{t('autoAiCreatedBadge', language)}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mb-5">
            {workflows.map((wf, i) => (
              <motion.div key={wf.id} {...fade(i)}
                onClick={() => setPreviewTask({ ...wf, schedule: t('autoAiCreated', language), lastRun: 'Just now' })}
                className="bg-white rounded-xl border border-teal-200 p-4 cursor-pointer hover:shadow-lg transition-all relative overflow-hidden workflow-glow group">
                {/* Shimmer overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100/20 to-transparent animate-shimmer" />
                </div>
                <div className="relative z-10 flex items-start gap-3">
                  <span className="text-2xl">{wf.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-bold text-navy-800">{wf.name}</h3>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white bg-teal-500">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> {t('running', language)}
                      </span>
                    </div>
                    <p className="text-[10px] text-navy-400 mt-0.5">{wf.description || t('autoAutonomousWf', language)}</p>
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {(wf.steps || []).slice(0, 3).map((step, j) => (
                        <span key={j} className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
                          j === 0 ? 'bg-teal-100 text-teal-700' : 'bg-navy-50 text-navy-400'
                        }`}>{step}</span>
                      ))}
                      {(wf.steps || []).length > 3 && <span className="text-[8px] text-navy-300">+{wf.steps.length - 3} {t('more', language)}</span>}
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-navy-300 group-hover:text-teal-600 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Automation Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map((task, i) => (
          <motion.div key={task.id} {...fade(i)}
            className={`bg-white rounded-xl border overflow-hidden transition-all cursor-pointer hover:shadow-md ${statusColors[task.status]} ${
              task.status === 'running' ? 'workflow-glow' : ''
            }`}
            onClick={() => setPreviewTask(task)}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{task.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-bold text-navy-800">{task.name}</h3>
                    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white ${statusBg[task.status]}`}>
                      {task.status === 'running' ? <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> : null}
                      {statusLabels(language)[task.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-navy-300" />
                    <span className="text-[10px] text-navy-400">{task.schedule}</span>
                    <span className="text-[10px] text-navy-300">•</span>
                    <span className="text-[10px] text-navy-400">{t('last', language)} {task.lastRun}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded-lg hover:bg-navy-50 text-navy-300 hover:text-teal-600" onClick={(e) => { e.stopPropagation(); setPreviewTask(task); }}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                    className={`p-2 rounded-lg transition-colors ${
                      task.status === 'running' ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                    }`}>
                    {task.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {task.type === 'social' && (
                  <>{[t('metricReach', language), task.reach, t('metricDaily', language), t('metricFrequency', language), t('metricActive', language), t('metricStatus', language)].reduce((acc, v, j) => {
                    if (j % 2 === 0) acc.push([v]); else acc[acc.length-1].push(v);
                    return acc;
                  }, []).map(([l, v], j) => (
                    <div key={j} className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{v}</p><p className="text-[8px] text-navy-400">{l}</p></div>
                  ))}</>
                )}
                {task.type === 'reviews' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.sent}</p><p className="text-[8px] text-navy-400">{t('metricSent', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.responded}</p><p className="text-[8px] text-navy-400">{t('metricResponded', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{Math.round((task.responded/task.sent)*100)}%</p><p className="text-[8px] text-navy-400">{t('metricRate', language)}</p></div></>
                )}
                {task.type === 'email' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.sent}</p><p className="text-[8px] text-navy-400">{t('metricSent', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.opened}</p><p className="text-[8px] text-navy-400">{t('metricOpened', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.clicked}</p><p className="text-[8px] text-navy-400">{t('metricClicked', language)}</p></div></>
                )}
                {task.type === 'seo' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.score}</p><p className="text-[8px] text-navy-400">{t('metricScore', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.issues}</p><p className="text-[8px] text-navy-400">{t('metricIssues', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">6h</p><p className="text-[8px] text-navy-400">{t('metricInterval', language)}</p></div></>
                )}
                {task.type === 'competitor' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.tracked}</p><p className="text-[8px] text-navy-400">{t('metricTracked', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.alerts}</p><p className="text-[8px] text-navy-400">{t('metricAlerts', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{t('metricDaily', language)}</p><p className="text-[8px] text-navy-400">{t('metricCheck', language)}</p></div></>
                )}
                {task.type === 'chat' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.replied}</p><p className="text-[8px] text-navy-400">{t('metricReplied', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.avgResponse}</p><p className="text-[8px] text-navy-400">{t('metricAvgTime', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">24/7</p><p className="text-[8px] text-navy-400">{t('metricUptime', language)}</p></div></>
                )}
                {task.type === 'billing' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.generated}</p><p className="text-[8px] text-navy-400">{t('metricGenerated', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.pending}</p><p className="text-[8px] text-navy-400">{t('metricPending', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{t('metricAuto', language)}</p><p className="text-[8px] text-navy-400">{t('metricMode', language)}</p></div></>
                )}
                {task.type === 'ads' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.spend}</p><p className="text-[8px] text-navy-400">{t('metricSpend', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.leads}</p><p className="text-[8px] text-navy-400">{t('metricLeads', language)}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.cpl}</p><p className="text-[8px] text-navy-400">{t('metricCPL', language)}</p></div></>
                )}
              </div>
            </div>
            {/* Running shimmer bar */}
            {task.status === 'running' && (
              <div className="h-1 bg-navy-50 relative overflow-hidden">
                <div className="h-1 bg-teal-400 rounded-r-full" style={{ width: '75%' }} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-200/40 to-transparent animate-shimmer" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div {...fade()} className="bg-navy-50 rounded-xl p-5 border border-navy-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-teal-400" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-navy-800">{t('autoCta', language)}</p>
          <p className="text-[10px] text-navy-400 mt-0.5">{t('autoCtaDesc', language)}</p>
        </div>
        <button className="px-4 py-2 bg-navy-700 text-white text-[10px] font-semibold rounded-lg hover:bg-navy-800 flex items-center gap-1.5 flex-shrink-0">
          <Settings className="w-3 h-3" /> {t('manage', language)}
        </button>
      </motion.div>
    </div>
  );
};

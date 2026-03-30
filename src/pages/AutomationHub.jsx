import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Play, Pause, Clock, CheckCircle2,
  BarChart3, Settings, Eye, Sparkles, X,
  ArrowRight, ChevronRight, Activity, TrendingUp, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { automationTasks } from '../data/mockDatabase';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

const statusColors = { running: 'border-teal-300', paused: 'border-yellow-300', error: 'border-red-300' };
const statusBg = { running: 'bg-teal-500', paused: 'bg-yellow-500', error: 'bg-red-500' };
const statusLabels = { running: 'Running', paused: 'Paused', error: 'Error' };

/* ─── Workflow Visual Preview Modal ─── */
const WorkflowPreview = ({ workflow, onClose }) => {
  if (!workflow) return null;

  const steps = {
    social: [
      { label: 'Content Calendar AI', status: 'done', detail: 'Generated 30 posts across Instagram, Facebook, LinkedIn', metric: '30 posts scheduled' },
      { label: 'Design Generator', status: 'done', detail: 'Created visual templates matching brand guidelines', metric: '15 designs created' },
      { label: 'Scheduling Engine', status: 'active', detail: 'Publishing at optimal engagement times using AI', metric: 'Next post in 2h' },
      { label: 'Engagement Monitor', status: 'pending', detail: 'Track likes, comments, shares in real-time', metric: 'Waiting...' },
      { label: 'Performance Optimizer', status: 'pending', detail: 'A/B test content and adjust strategy', metric: 'Waiting...' },
    ],
    reviews: [
      { label: 'Customer Identifier', status: 'done', detail: 'Found 45 recent customers who had positive interactions', metric: '45 customers found' },
      { label: 'Review Request Sender', status: 'done', detail: 'Sent personalized review requests via SMS + Email', metric: '45 sent' },
      { label: 'Response Monitor', status: 'active', detail: 'Tracking incoming reviews across Google, FB, Yelp', metric: '18 received' },
      { label: 'Sentiment Analyzer', status: 'pending', detail: 'Classify reviews and flag negative ones for response', metric: 'Waiting...' },
      { label: 'Auto-Responder', status: 'pending', detail: 'Generate personalized responses to each review', metric: 'Waiting...' },
    ],
    email: [
      { label: 'Audience Segmenter', status: 'done', detail: 'Segmented 500 contacts into 4 nurture tracks', metric: '4 segments' },
      { label: 'Email Composer', status: 'done', detail: 'AI-written email sequences for each segment', metric: '12 emails ready' },
      { label: 'A/B Tester', status: 'active', detail: 'Testing 3 subject line variations per segment', metric: '67% open rate leader' },
      { label: 'Delivery Engine', status: 'active', detail: 'Sending drip emails at optimal times', metric: '128 sent today' },
      { label: 'Conversion Tracker', status: 'pending', detail: 'Track clicks, sign-ups, and purchases', metric: '23 conversions' },
    ],
    seo: [
      { label: 'Site Crawler', status: 'done', detail: 'Crawled 148 pages, analyzed structure and meta data', metric: '148 pages scanned' },
      { label: 'Keyword Analyzer', status: 'done', detail: 'Identified 25 high-value keyword opportunities', metric: '25 opportunities' },
      { label: 'Issue Fixer', status: 'active', detail: 'Auto-fixing meta tags, alt text, broken links', metric: '3 issues left' },
      { label: 'Backlink Builder', status: 'pending', detail: 'Reaching out to relevant sites for link building', metric: 'Queued' },
      { label: 'Rank Tracker', status: 'pending', detail: 'Monitor weekly ranking changes for target keywords', metric: 'Score: 72' },
    ],
    competitor: [
      { label: 'Web Scanner', status: 'done', detail: 'Monitoring 5 competitors across web and social', metric: '5 competitors' },
      { label: 'Price Monitor', status: 'active', detail: 'Tracking pricing changes and promotional activity', metric: '2 alerts today' },
      { label: 'Content Analyzer', status: 'active', detail: 'Analyzing competitor content strategy and gaps', metric: 'Running...' },
      { label: 'Opportunity Finder', status: 'pending', detail: 'Identifying market gaps you can exploit', metric: 'Analyzing...' },
      { label: 'Report Generator', status: 'pending', detail: 'Weekly competitive intelligence PDF report', metric: 'Next: Monday' },
    ],
    chat: [
      { label: 'Message Receiver', status: 'done', detail: 'Connected to WhatsApp Business API', metric: 'Always on' },
      { label: 'Intent Classifier', status: 'active', detail: 'Understanding customer questions using NLP', metric: '84 handled' },
      { label: 'Response Generator', status: 'active', detail: 'AI-crafted responses based on your FAQ and products', metric: '< 1m avg' },
      { label: 'Handoff Manager', status: 'pending', detail: 'Escalate complex queries to human agents', metric: '3 escalated' },
      { label: 'Analytics Reporter', status: 'pending', detail: 'Track conversation quality and customer satisfaction', metric: '4.7/5 avg' },
    ],
    billing: [
      { label: 'Order Detector', status: 'done', detail: 'Listening for new orders from all channels', metric: '34 orders' },
      { label: 'Invoice Creator', status: 'done', detail: 'Auto-generating GST-compliant invoices', metric: '34 created' },
      { label: 'Payment Tracker', status: 'active', detail: 'Tracking payment status and sending reminders', metric: '2 pending' },
      { label: 'Reconciler', status: 'pending', detail: 'Auto-reconcile payments with bank statements', metric: 'Daily sync' },
      { label: 'Report Builder', status: 'pending', detail: 'Generate monthly revenue and tax reports', metric: 'Next: Apr 1' },
    ],
    ads: [
      { label: 'Audience Builder', status: 'done', detail: 'Created lookalike audiences from existing customers', metric: '3 audiences' },
      { label: 'Creative Generator', status: 'done', detail: 'AI-designed ad variations for each platform', metric: '12 creatives' },
      { label: 'Campaign Launcher', status: 'active', detail: 'Running across Google Ads and Facebook Ads', metric: '₹12,400 spent' },
      { label: 'Bid Optimizer', status: 'active', detail: 'Real-time bid adjustments for best CPA', metric: 'CPA: ₹326' },
      { label: 'ROI Reporter', status: 'pending', detail: 'Track conversions and calculate true ROAS', metric: '38 leads' },
    ],
  };

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
            <p className="text-[11px] text-navy-400">{workflow.schedule} • Last run: {workflow.lastRun}</p>
          </div>
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${statusBg[workflow.status]}`}>
            {workflow.status === 'running' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            {statusLabels[workflow.status]}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-50"><X className="w-4 h-4 text-navy-400" /></button>
        </div>

        {/* Visual Pipeline */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <p className="text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-4">Internal Pipeline</p>
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
                          <span className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" /> In Progress
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
  const [tasks, setTasks] = useState(automationTasks);
  const [previewTask, setPreviewTask] = useState(null);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'running' ? 'paused' : 'running' } : t));
  };

  // Merge context-created workflows with static tasks
  const allTasks = [
    ...tasks,
    ...workflows.map(wf => ({
      id: wf.id, name: wf.name, status: wf.status || 'running', type: wf.type,
      schedule: 'AI-Created', lastRun: 'Just now', icon: wf.icon,
      isWorkflow: true, steps: wf.steps,
    }))
  ];

  const running = allTasks.filter(t => t.status === 'running').length;
  const total = allTasks.length;

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {previewTask && <WorkflowPreview workflow={previewTask} onClose={() => setPreviewTask(null)} />}
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
              Hey {businessData?.businessName || 'there'}! 👋 Your autonomous marketing engine is running.
              Click any workflow to see what's happening inside — in real-time! 🚀
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold text-teal-400">{running}/{total}</div>
            <p className="text-[10px] text-navy-300">Active Automations</p>
          </div>
        </div>
        <div className="mt-4 w-full bg-white/10 rounded-full h-2">
          <div className="bg-teal-400 rounded-full h-2 transition-all" style={{ width: `${(running / total) * 100}%` }} />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: '📧', label: 'Emails Sent', value: '128', delta: '+23 this week' },
          { icon: '⭐', label: 'Reviews Collected', value: '18', delta: '+5 this week' },
          { icon: '📱', label: 'Posts Published', value: '32', delta: 'Auto-scheduled' },
          { icon: '📢', label: 'Ad Spend', value: '₹12.4K', delta: '38 leads captured' },
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
            <h2 className="text-sm font-bold text-navy-800">AI-Created Workflows</h2>
            <span className="text-[9px] bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full font-semibold">Auto-generated from your conversations</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mb-5">
            {workflows.map((wf, i) => (
              <motion.div key={wf.id} {...fade(i)}
                onClick={() => setPreviewTask({ ...wf, schedule: 'AI-Created', lastRun: 'Just now' })}
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
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Running
                      </span>
                    </div>
                    <p className="text-[10px] text-navy-400 mt-0.5">{wf.description || 'Autonomous workflow'}</p>
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {(wf.steps || []).slice(0, 3).map((step, j) => (
                        <span key={j} className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
                          j === 0 ? 'bg-teal-100 text-teal-700' : 'bg-navy-50 text-navy-400'
                        }`}>{step}</span>
                      ))}
                      {(wf.steps || []).length > 3 && <span className="text-[8px] text-navy-300">+{wf.steps.length - 3} more</span>}
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
                      {statusLabels[task.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-navy-300" />
                    <span className="text-[10px] text-navy-400">{task.schedule}</span>
                    <span className="text-[10px] text-navy-300">•</span>
                    <span className="text-[10px] text-navy-400">Last: {task.lastRun}</span>
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
                  <>{['Reach', task.reach, 'Daily', 'Frequency', 'Active', 'Status'].reduce((acc, v, j) => {
                    if (j % 2 === 0) acc.push([v]); else acc[acc.length-1].push(v);
                    return acc;
                  }, []).map(([l, v], j) => (
                    <div key={j} className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{v}</p><p className="text-[8px] text-navy-400">{l}</p></div>
                  ))}</>
                )}
                {task.type === 'reviews' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.sent}</p><p className="text-[8px] text-navy-400">Sent</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.responded}</p><p className="text-[8px] text-navy-400">Responded</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{Math.round((task.responded/task.sent)*100)}%</p><p className="text-[8px] text-navy-400">Rate</p></div></>
                )}
                {task.type === 'email' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.sent}</p><p className="text-[8px] text-navy-400">Sent</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.opened}</p><p className="text-[8px] text-navy-400">Opened</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.clicked}</p><p className="text-[8px] text-navy-400">Clicked</p></div></>
                )}
                {task.type === 'seo' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.score}</p><p className="text-[8px] text-navy-400">Score</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.issues}</p><p className="text-[8px] text-navy-400">Issues</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">6h</p><p className="text-[8px] text-navy-400">Interval</p></div></>
                )}
                {task.type === 'competitor' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.tracked}</p><p className="text-[8px] text-navy-400">Tracked</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.alerts}</p><p className="text-[8px] text-navy-400">Alerts</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">Daily</p><p className="text-[8px] text-navy-400">Check</p></div></>
                )}
                {task.type === 'chat' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.replied}</p><p className="text-[8px] text-navy-400">Replied</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.avgResponse}</p><p className="text-[8px] text-navy-400">Avg Time</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">24/7</p><p className="text-[8px] text-navy-400">Uptime</p></div></>
                )}
                {task.type === 'billing' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.generated}</p><p className="text-[8px] text-navy-400">Generated</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.pending}</p><p className="text-[8px] text-navy-400">Pending</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">Auto</p><p className="text-[8px] text-navy-400">Mode</p></div></>
                )}
                {task.type === 'ads' && (
                  <><div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.spend}</p><p className="text-[8px] text-navy-400">Spend</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.leads}</p><p className="text-[8px] text-navy-400">Leads</p></div>
                  <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.cpl}</p><p className="text-[8px] text-navy-400">CPL</p></div></>
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
          <p className="text-[12px] font-bold text-navy-800">Your marketing runs on autopilot! 🎉</p>
          <p className="text-[10px] text-navy-400 mt-0.5">All automations work 24/7 — predict traffic, decide content, and go live autonomously. You're the CEO, they're the marketing team.</p>
        </div>
        <button className="px-4 py-2 bg-navy-700 text-white text-[10px] font-semibold rounded-lg hover:bg-navy-800 flex items-center gap-1.5 flex-shrink-0">
          <Settings className="w-3 h-3" /> Manage
        </button>
      </motion.div>
    </div>
  );
};

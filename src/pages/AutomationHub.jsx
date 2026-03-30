import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Play, Pause, RefreshCw, Clock, CheckCircle2, AlertTriangle,
  BarChart3, Settings, Eye, Sparkles, ArrowRight, TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { automationTasks } from '../data/mockDatabase';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

const statusColors = { running: 'bg-teal-500', paused: 'bg-yellow-500', error: 'bg-red-500' };
const statusLabels = { running: 'Running', paused: 'Paused', error: 'Error' };

export const AutomationHub = () => {
  const { language, businessData, isAuthenticated } = useApp();
  const [tasks, setTasks] = useState(automationTasks);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'running' ? 'paused' : 'running' } : t));
  };

  const running = tasks.filter(t => t.status === 'running').length;
  const total = tasks.length;

  return (
    <div className="space-y-5">
      {/* Friendly Header */}
      <motion.div {...fade(0)} className="bg-gradient-to-r from-navy-700 via-navy-800 to-navy-700 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-7 h-7 text-teal-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold mb-1">{t('automationHub', language)}</h1>
            <p className="text-[12px] text-navy-200 leading-relaxed max-w-xl">
              Hey {businessData?.businessName || 'there'}! 👋 All your automations are running in the background.
              You just chill — we handle the heavy lifting! Here's what's happening right now:
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold text-teal-400">{running}/{total}</div>
            <p className="text-[10px] text-navy-300">Active Automations</p>
          </div>
        </div>
        {/* Running bar */}
        <div className="mt-4 w-full bg-white/10 rounded-full h-2">
          <div className="bg-teal-400 rounded-full h-2 transition-all" style={{ width: `${(running / total) * 100}%` }} />
        </div>
      </motion.div>

      {/* Stats Row */}
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

      {/* Automation Cards — visual, easy to understand */}
      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map((task, i) => (
          <motion.div key={task.id} {...fade(i)}
            className={`bg-white rounded-xl border overflow-hidden transition-colors ${
              task.status === 'running' ? 'border-teal-200' : task.status === 'paused' ? 'border-yellow-200' : 'border-red-200'
            }`}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{task.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-bold text-navy-800">{task.name}</h3>
                    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white ${statusColors[task.status]}`}>
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
                <button onClick={() => toggleTask(task.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    task.status === 'running' ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                  }`}>
                  {task.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Task-specific metrics */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {task.type === 'social' && (
                  <>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.reach}</p><p className="text-[8px] text-navy-400">Reach</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">Daily</p><p className="text-[8px] text-navy-400">Frequency</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">Active</p><p className="text-[8px] text-navy-400">Status</p></div>
                  </>
                )}
                {task.type === 'reviews' && (
                  <>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.sent}</p><p className="text-[8px] text-navy-400">Sent</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.responded}</p><p className="text-[8px] text-navy-400">Responded</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{Math.round((task.responded/task.sent)*100)}%</p><p className="text-[8px] text-navy-400">Rate</p></div>
                  </>
                )}
                {task.type === 'email' && (
                  <>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.sent}</p><p className="text-[8px] text-navy-400">Sent</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.opened}</p><p className="text-[8px] text-navy-400">Opened</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.clicked}</p><p className="text-[8px] text-navy-400">Clicked</p></div>
                  </>
                )}
                {task.type === 'seo' && (
                  <>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.score}</p><p className="text-[8px] text-navy-400">Score</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.issues}</p><p className="text-[8px] text-navy-400">Issues</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">6h</p><p className="text-[8px] text-navy-400">Interval</p></div>
                  </>
                )}
                {task.type === 'competitor' && (
                  <>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.tracked}</p><p className="text-[8px] text-navy-400">Tracked</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.alerts}</p><p className="text-[8px] text-navy-400">Alerts</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">Daily</p><p className="text-[8px] text-navy-400">Check</p></div>
                  </>
                )}
                {task.type === 'chat' && (
                  <>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.replied}</p><p className="text-[8px] text-navy-400">Replied</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.avgResponse}</p><p className="text-[8px] text-navy-400">Avg Time</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">24/7</p><p className="text-[8px] text-navy-400">Uptime</p></div>
                  </>
                )}
                {task.type === 'billing' && (
                  <>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.generated}</p><p className="text-[8px] text-navy-400">Generated</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-yellow-600">{task.pending}</p><p className="text-[8px] text-navy-400">Pending</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">Auto</p><p className="text-[8px] text-navy-400">Mode</p></div>
                  </>
                )}
                {task.type === 'ads' && (
                  <>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.spend}</p><p className="text-[8px] text-navy-400">Spend</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-teal-600">{task.leads}</p><p className="text-[8px] text-navy-400">Leads</p></div>
                    <div className="bg-navy-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-navy-800">{task.cpl}</p><p className="text-[8px] text-navy-400">CPL</p></div>
                  </>
                )}
              </div>
            </div>
            {/* Progress indicator for running tasks */}
            {task.status === 'running' && (
              <div className="h-1 bg-navy-50">
                <div className="h-1 bg-teal-400 rounded-r-full animate-pulse" style={{ width: '75%' }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Friendly CTA */}
      <motion.div {...fade()} className="bg-navy-50 rounded-xl p-5 border border-navy-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-teal-400" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-navy-800">Everything is running smoothly! 🎉</p>
          <p className="text-[10px] text-navy-400 mt-0.5">Your automations are working 24/7 while you focus on what matters. Need to add more? Upgrade your plan for unlimited automations.</p>
        </div>
        <button className="px-4 py-2 bg-navy-700 text-white text-[10px] font-semibold rounded-lg hover:bg-navy-800 flex items-center gap-1.5 flex-shrink-0">
          <Settings className="w-3 h-3" /> Manage
        </button>
      </motion.div>
    </div>
  );
};

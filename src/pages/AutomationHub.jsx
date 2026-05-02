import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Play, Pause, CheckCircle2, BarChart3, Eye, Sparkles, X,
  ArrowRight, ChevronRight, Activity, TrendingUp, RefreshCw,
  Globe, Users, Mail, Share2, MessageCircle, FileText, Target,
  Clock, Bell, Bot, Send, UserPlus, Megaphone, LayoutDashboard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { Commentable } from '../components/CommentBox';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

/* ─── Core AI Automation Pipelines ─── */
const automationPipelines = [
  {
    id: 'social_content',
    name: 'Social Media Content',
    icon: Share2,
    color: 'bg-teal-600',
    lightColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    description: 'AI generates → WhatsApp notification → Approval → Post',
    status: 'running',
    metrics: { generated: 47, approved: 42, posted: 42, rejected: 5 },
    steps: [
      { id: 1, label: 'AI Content Generation', detail: 'Trending topics analyzed, content created', status: 'done', icon: Sparkles },
      { id: 2, label: 'WhatsApp Notification', detail: 'Content sent for your approval via WhatsApp', status: 'done', icon: MessageCircle },
      { id: 3, label: 'Approval Gate', detail: 'You approve or reject → re-generate if rejected', status: 'active', icon: CheckCircle2 },
      { id: 4, label: 'Auto Post', detail: 'Published to all connected platforms', status: 'pending', icon: Send },
    ],
    flow: 'Content Generated → Notify User on WhatsApp → Approved ✓ [Posted] / Disapproved ✗ [Regenerate & Re-approve]'
  },
  {
    id: 'lead_nurture',
    name: 'Lead Pipeline',
    icon: Target,
    color: 'bg-navy-700',
    lightColor: 'bg-navy-50',
    textColor: 'text-navy-700',
    description: 'Collect → Nurture → Email → Deliver to you',
    status: 'running',
    metrics: { collected: 156, nurtured: 89, emailed: 67, delivered: 45 },
    steps: [
      { id: 1, label: 'Lead Collection', detail: 'Forms, website, social media sources', status: 'done', icon: UserPlus },
      { id: 2, label: 'AI Nurturing', detail: 'Automated email sequences & engagement', status: 'done', icon: Mail },
      { id: 3, label: 'Lead Scoring', detail: 'AI scores intent & readiness', status: 'active', icon: BarChart3 },
      { id: 4, label: 'Deliver to You', detail: 'Hot leads sent to your dashboard & WhatsApp', status: 'pending', icon: Send },
    ],
    flow: 'Leads Collected → Nurtured via Email → Scored → Hot Leads Sent to You'
  },
  {
    id: 'website_updates',
    name: 'Website Auto-Updates',
    icon: Globe,
    color: 'bg-teal-600',
    lightColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    description: 'AI monitors trends & auto-updates your website',
    status: 'running',
    metrics: { updates: 12, seoFixes: 8, speedOpt: 5, contentRefresh: 7 },
    steps: [
      { id: 1, label: 'Trend Monitoring', detail: 'Track industry trends & competitor changes', status: 'done', icon: TrendingUp },
      { id: 2, label: 'Change Detection', detail: 'Identify what needs updating', status: 'active', icon: Eye },
      { id: 3, label: 'Auto Apply', detail: 'SEO, content, speed optimizations', status: 'pending', icon: Zap },
      { id: 4, label: 'Notify Owner', detail: 'Summary of changes sent to you', status: 'pending', icon: Bell },
    ],
    flow: 'Monitor Trends → Detect Changes Needed → Auto-Apply → Notify You'
  },
  {
    id: 'forms_circulation',
    name: 'Forms & Outreach',
    icon: FileText,
    color: 'bg-navy-600',
    lightColor: 'bg-navy-50',
    textColor: 'text-navy-600',
    description: 'Auto-create & circulate lead capture forms',
    status: 'running',
    metrics: { forms: 6, circulated: 340, responses: 89, leads: 34 },
    steps: [
      { id: 1, label: 'Form Generation', detail: 'AI creates targeted forms for your business', status: 'done', icon: FileText },
      { id: 2, label: 'Circulation', detail: 'Shared via email, social, WhatsApp', status: 'done', icon: Share2 },
      { id: 3, label: 'Response Collection', detail: 'Automatic response tracking', status: 'active', icon: UserPlus },
      { id: 4, label: 'Lead Extraction', detail: 'Qualified leads added to pipeline', status: 'pending', icon: Target },
    ],
    flow: 'Create Forms → Circulate Online → Collect Responses → Extract Leads'
  },
  {
    id: 'email_outreach',
    name: 'Email Campaigns',
    icon: Mail,
    color: 'bg-teal-700',
    lightColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    description: 'AI writes & sends targeted email sequences',
    status: 'running',
    metrics: { sent: 1240, opened: 623, clicked: 187, converted: 34 },
    steps: [
      { id: 1, label: 'Audience Segmentation', detail: 'AI groups contacts by behavior', status: 'done', icon: Users },
      { id: 2, label: 'Content Creation', detail: 'Personalized email sequences', status: 'done', icon: Sparkles },
      { id: 3, label: 'Auto Send', detail: 'Optimal timing for each segment', status: 'active', icon: Send },
      { id: 4, label: 'Track & Optimize', detail: 'A/B test and improve', status: 'pending', icon: BarChart3 },
    ],
    flow: 'Segment → Write → Send at Best Time → Track & Optimize'
  },
  {
    id: 'reachout',
    name: 'Smart Reachouts',
    icon: Megaphone,
    color: 'bg-navy-500',
    lightColor: 'bg-navy-50',
    textColor: 'text-navy-600',
    description: 'AI identifies & reaches out to potential customers',
    status: 'paused',
    metrics: { identified: 230, contacted: 156, responded: 45, converted: 12 },
    steps: [
      { id: 1, label: 'Prospect Discovery', detail: 'AI finds potential customers in your area', status: 'done', icon: Eye },
      { id: 2, label: 'Personalized Outreach', detail: 'Tailored messages for each prospect', status: 'done', icon: MessageCircle },
      { id: 3, label: 'Follow-up Sequences', detail: 'Automated multi-touch follow-ups', status: 'active', icon: RefreshCw },
      { id: 4, label: 'Convert & Handoff', detail: 'Warm leads delivered to you', status: 'pending', icon: Target },
    ],
    flow: 'Discover Prospects → Personalized Contact → Follow-up → Deliver Leads'
  },
];

/* ─── Pipeline Flow Visual ─── */
const PipelineFlowPopup = ({ pipeline, onClose }) => {
  if (!pipeline) return null;
  const Icon = pipeline.icon;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-5 border-b border-navy-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${pipeline.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-navy-900">{pipeline.name}</h2>
                <p className="text-[10px] text-navy-400">{pipeline.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
          </div>

          <div className="p-5 space-y-4">
            {/* Flow Summary */}
            <div className={`${pipeline.lightColor} rounded-lg p-3 border border-opacity-20`}>
              <p className="text-[10px] font-bold text-navy-700 mb-1">Automation Flow</p>
              <p className="text-[11px] text-navy-600">{pipeline.flow}</p>
            </div>

            {/* Steps */}
            <div className="space-y-0">
              {pipeline.steps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id}>
                    <div className="flex items-center gap-3 py-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'done' ? 'bg-teal-100' : step.status === 'active' ? pipeline.color : 'bg-navy-100'
                      }`}>
                        {step.status === 'done' ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> :
                         step.status === 'active' ? <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> :
                         <StepIcon className="w-3.5 h-3.5 text-navy-400" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${step.status === 'done' ? 'text-teal-700' : step.status === 'active' ? 'text-navy-800' : 'text-navy-500'}`}>{step.label}</p>
                        <p className="text-[10px] text-navy-400">{step.detail}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        step.status === 'done' ? 'bg-teal-100 text-teal-700' : step.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-navy-100 text-navy-400'
                      }`}>{step.status === 'done' ? 'Complete' : step.status === 'active' ? 'Running' : 'Queued'}</span>
                    </div>
                    {i < pipeline.steps.length - 1 && <div className="ml-4 w-px h-4 bg-navy-200" />}
                  </div>
                );
              })}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(pipeline.metrics).map(([key, val]) => (
                <div key={key} className="bg-navy-50 rounded-lg p-2.5 text-center">
                  <p className="text-lg font-bold text-navy-800">{val.toLocaleString()}</p>
                  <p className="text-[9px] text-navy-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const AutomationHub = () => {
  const { language, businessData } = useApp();
  const [pipelines, setPipelines] = useState(automationPipelines);
  const [previewPipeline, setPreviewPipeline] = useState(null);
  const [animatedMetric, setAnimatedMetric] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setAnimatedMetric(prev => (prev + 1) % 4), 3000);
    return () => clearInterval(interval);
  }, []);

  const togglePipeline = (id) => {
    setPipelines(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'running' ? 'paused' : 'running' } : p));
  };

  const runningCount = pipelines.filter(p => p.status === 'running').length;
  const totalLeads = pipelines.reduce((s, p) => s + (p.metrics.converted || p.metrics.leads || p.metrics.delivered || 0), 0);
  const totalEmails = pipelines.find(p => p.id === 'email_outreach')?.metrics.sent || 0;
  const totalPosts = pipelines.find(p => p.id === 'social_content')?.metrics.posted || 0;

  const kpis = [
    { label: 'Active Automations', value: `${runningCount}/${pipelines.length}`, icon: Zap, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Leads Generated', value: totalLeads.toString(), icon: Target, color: 'text-navy-700', bg: 'bg-navy-50' },
    { label: 'Emails Sent', value: totalEmails.toLocaleString(), icon: Mail, color: 'text-teal-700', bg: 'bg-teal-50' },
    { label: 'Posts Published', value: totalPosts.toString(), icon: Share2, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <Commentable id="automation-hub" label="Marketing Automation Hub">
    <div className="space-y-5">
      {/* Header */}
      <Commentable id="automation-hub-header" label="Automation Hub Header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('automationHub', language)}</h1>
          <p className="text-sm text-navy-400 mt-0.5">AI-driven automations running on autopilot</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-semibold text-teal-700">{runningCount} Running</span>
          </div>
        </div>
      </div>
      </Commentable>

      {/* KPI Cards */}
      <Commentable id="automation-hub-kpi-cards" label="Automation KPI Cards">
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i} {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-navy-800">{kpi.value}</p>
              <p className="text-[10px] text-navy-400 mt-0.5">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>
      </Commentable>

      {/* Social Media Flow Highlight */}
      <Commentable id="automation-hub-social-flow" label="Social Media Content Flow">
      <motion.div {...fade(1)} className="bg-navy-700 rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-5 h-5" />
          <h2 className="text-sm font-bold">Social Media Content Flow</h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['AI Generates Content', '📲 Notify on WhatsApp', '✅ Approved → Posted', '❌ Rejected → Regenerate'].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[11px] font-medium bg-white/20 px-3 py-1.5 rounded-lg">{step}</span>
              {i < 3 && <ArrowRight className="w-3.5 h-3.5 text-white/60" />}
            </div>
          ))}
        </div>
      </motion.div>
      </Commentable>

      {/* Lead Pipeline Flow Highlight */}
      <Commentable id="automation-hub-lead-flow" label="Lead Pipeline Flow">
      <motion.div {...fade(2)} className="bg-teal-700 rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5" />
          <h2 className="text-sm font-bold">Lead Pipeline Flow</h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['Leads Collected', '🤝 AI Nurturing', '📧 Email Sequences', '📬 Hot Leads Sent to You'].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[11px] font-medium bg-white/20 px-3 py-1.5 rounded-lg">{step}</span>
              {i < 3 && <ArrowRight className="w-3.5 h-3.5 text-white/60" />}
            </div>
          ))}
        </div>
      </motion.div>
      </Commentable>

      {/* All Automation Pipelines */}
      <Commentable id="automation-hub-pipelines-grid" label="All Automation Pipelines Grid">
      <div>
        <h2 className="text-sm font-bold text-navy-800 mb-3">All Automations</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {pipelines.map((pl, i) => {
            const Icon = pl.icon;
            const isRunning = pl.status === 'running';
            return (
              <motion.div key={pl.id} {...fade(i)}
                className={`bg-white rounded-xl border border-navy-100 p-4 relative overflow-hidden ${isRunning ? 'ring-1 ring-teal-200' : ''}`}>
                {isRunning && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-100">
                    <motion.div className={`h-full ${pl.color}`} initial={{ width: '0%' }}
                      animate={{ width: '100%' }} transition={{ duration: 3, repeat: Infinity }} />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${pl.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-800">{pl.name}</p>
                      <p className="text-[10px] text-navy-400">{pl.description}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isRunning ? 'bg-teal-100 text-teal-700' : 'bg-navy-100 text-navy-500'
                  }`}>{isRunning ? '● Running' : '⏸ Paused'}</span>
                </div>

                {/* Mini metrics */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {Object.entries(pl.metrics).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="bg-navy-50 rounded-lg p-1.5 text-center">
                      <p className="text-xs font-bold text-navy-700">{val}</p>
                      <p className="text-[8px] text-navy-400 capitalize truncate">{key.replace(/([A-Z])/g, ' $1')}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewPipeline(pl)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-navy-50 text-navy-600 text-[11px] font-semibold rounded-lg hover:bg-navy-100 transition-colors">
                    <Eye className="w-3 h-3" /> View Flow
                  </button>
                  <button onClick={() => togglePipeline(pl.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                      isRunning ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}>
                    {isRunning ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Start</>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      </Commentable>

      {/* Popup */}
      <PipelineFlowPopup pipeline={previewPipeline} onClose={() => setPreviewPipeline(null)} />
    </div>
    </Commentable>
  );
};

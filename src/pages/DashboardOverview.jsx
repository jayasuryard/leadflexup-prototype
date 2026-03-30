import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, Sparkles, Zap, Loader2, AlertCircle, Lock, UserPlus,
  X, MessageCircle, Paperclip, ChevronRight, ArrowLeft, Clock,
  Mic, MicOff, Eye, CheckCircle2, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { sendGroqMessage, groqClient } from '../config/groq';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

const GUEST_CREDITS = 5;

/* ─── Template Cards ─── */
const templateCards = [
  { id: 1, title: 'Optimize Website SEO', desc: 'Get personalized SEO audit & actionable recommendations', category: 'SEO', icons: ['🔍', '📊'], prompt: 'Analyze my website SEO and give me top recommendations to improve search rankings' },
  { id: 2, title: 'Social Media Strategy', desc: 'Build a 30-day content calendar across social platforms', category: 'Social Media', icons: ['📱', '📅'], prompt: 'Create a 30-day social media content calendar for my business' },
  { id: 3, title: 'Generate More Leads', desc: 'Discover lead magnets & capture strategies for your industry', category: 'Lead Generation', icons: ['🎯', '💡'], prompt: 'Suggest lead generation strategies and lead magnets for my business category' },
  { id: 4, title: 'Competitor Deep Dive', desc: 'Analyze competitor strategies and gaps you can exploit', category: 'Analytics', icons: ['🔎', '⚔️'], prompt: 'Do a competitor analysis and identify gaps I can exploit in my market' },
  { id: 5, title: 'Boost Online Reviews', desc: 'Strategy to improve Google ratings and reputation', category: 'Digital Presence', icons: ['⭐', '💬'], prompt: 'Create a plan to get more positive Google reviews and improve my online reputation' },
  { id: 6, title: 'Launch Ad Campaign', desc: 'Design targeted ad campaigns with ROI projections', category: 'Content', icons: ['📢', '💰'], prompt: 'Help me design an effective advertising campaign for my business with budget recommendations' },
  { id: 7, title: 'Content Strategy', desc: 'Plan high-impact content that drives traffic', category: 'Content', icons: ['✍️', '🚀'], prompt: 'Create a content strategy plan that will drive traffic and engagement to my business' },
  { id: 8, title: 'Growth Roadmap', desc: 'Complete step-by-step action plan for online growth', category: 'Lead Generation', icons: ['🗺️', '📈'], prompt: 'Create a complete growth roadmap with milestones for my business for the next 3 months' },
];

const categories = ['All', 'Lead Generation', 'Digital Presence', 'Social Media', 'SEO', 'Content', 'Analytics'];

/* ─── Detect actionable intents → auto-create workflows ─── */
const detectWorkflowIntent = (text) => {
  const wfs = [];
  if (/social media|content calendar|post(ing)? schedule|instagram|facebook/i.test(text))
    wfs.push({ name: 'Social Media Auto-Publisher', type: 'social', icon: '📱', description: 'Auto schedule & publish posts', steps: ['Analyze audience timing', 'Generate content', 'Schedule posts', 'Monitor engagement', 'Optimize timing'] });
  if (/email|nurture|newsletter|campaign/i.test(text))
    wfs.push({ name: 'Email Campaign Automation', type: 'email', icon: '📧', description: 'Automated lead nurture sequences', steps: ['Segment audience', 'Create templates', 'Set drip schedule', 'A/B test subjects', 'Track conversions'] });
  if (/seo|search ranking|keyword|backlink/i.test(text))
    wfs.push({ name: 'SEO Monitor & Optimizer', type: 'seo', icon: '🔍', description: 'Monitor and improve search rankings', steps: ['Crawl pages', 'Analyze keywords', 'Fix issues', 'Build backlinks', 'Track rankings'] });
  if (/ad(s|vertis)|google ads|facebook ads|budget/i.test(text))
    wfs.push({ name: 'Ad Campaign Auto-Manager', type: 'ads', icon: '📢', description: 'AI-managed ad campaigns', steps: ['Set audience', 'Create ads', 'Launch campaigns', 'Optimize bids', 'Report ROI'] });
  if (/review|rating|reputation/i.test(text))
    wfs.push({ name: 'Review Collection Engine', type: 'reviews', icon: '⭐', description: 'Auto-request customer reviews', steps: ['Find happy customers', 'Send requests', 'Monitor responses', 'Respond to reviews', 'Analyze sentiment'] });
  if (/lead|prospect|funnel|conversion/i.test(text))
    wfs.push({ name: 'Lead Scoring & Routing', type: 'leads', icon: '🎯', description: 'Score and route leads', steps: ['Capture data', 'Score by intent', 'Route to pipeline', 'Trigger nurture', 'Alert team'] });
  if (/content|blog|article|video|reel/i.test(text))
    wfs.push({ name: 'Content Auto-Producer', type: 'content', icon: '✍️', description: 'Generate trending content', steps: ['Research trends', 'Generate drafts', 'Design visuals', 'Schedule posts', 'Measure performance'] });
  if (/competitor|market|benchmark/i.test(text))
    wfs.push({ name: 'Competitor Intelligence', type: 'competitor', icon: '📊', description: 'Track competitor moves', steps: ['Monitor competitors', 'Analyze pricing', 'Track offerings', 'Detect gaps', 'Generate reports'] });
  return wfs;
};

/* ─── Detect live activities from AI responses ─── */
const detectActivities = (text) => {
  const acts = [];
  if (/social media|post|instagram|facebook/i.test(text))
    acts.push({ type: 'social', label: 'Social Media Campaign', status: 'launching', icon: '📱', color: 'bg-purple-500', steps: ['Creating content calendar', 'Designing templates', 'Scheduling 30 days', 'Connecting accounts'] });
  if (/website|seo|landing page/i.test(text))
    acts.push({ type: 'website', label: 'Website Optimization', status: 'running', icon: '🌐', color: 'bg-blue-500', steps: ['Running SEO audit', 'Optimizing meta tags', 'Improving speed', 'Building sitemap'] });
  if (/email|nurture/i.test(text))
    acts.push({ type: 'email', label: 'Email Sequences', status: 'building', icon: '📧', color: 'bg-teal-500', steps: ['Segmenting contacts', 'Writing copy', 'Setting automation', 'A/B testing'] });
  if (/ad|advertis|google ads/i.test(text))
    acts.push({ type: 'ads', label: 'Ad Campaign', status: 'configuring', icon: '📢', color: 'bg-orange-500', steps: ['Defining audience', 'Creating ads', 'Setting budget', 'Launching'] });
  if (/lead|prospect/i.test(text))
    acts.push({ type: 'leads', label: 'Lead Pipeline', status: 'active', icon: '🎯', color: 'bg-red-500', steps: ['Building forms', 'Setting scoring', 'Creating flows', 'CRM sync'] });
  if (/review|rating/i.test(text))
    acts.push({ type: 'reviews', label: 'Review Campaign', status: 'sending', icon: '⭐', color: 'bg-yellow-500', steps: ['Identifying customers', 'Sending requests', 'Monitoring', 'Updating'] });
  return acts;
};

/* ─── Voice Input Hook ─── */
const useVoiceInput = (onResult) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      recognition.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false); };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, [onResult]);

  const toggle = () => {
    if (!recognitionRef.current) return;
    if (listening) { recognitionRef.current.stop(); setListening(false); }
    else { recognitionRef.current.start(); setListening(true); }
  };
  return { listening, supported, toggle };
};

/* ─── Signup Prompt Modal ─── */
const SignupPrompt = ({ open, onClose, language, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  if (!open) return null;
  const handleSubmit = (e) => { e.preventDefault(); if (email && password) { onSignup({ email, password }); onClose(); } };
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center"><UserPlus className="w-4 h-4 text-white" /></div>
              <h3 className="text-sm font-bold text-navy-800">{t('signUpToUnlock', language)}</h3></div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy-50"><X className="w-4 h-4 text-navy-400" /></button>
          </div>
          <p className="text-[11px] text-navy-400 mb-4">{t('signupCopilotDesc', language)}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
              className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-[11px] text-navy-700 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
              className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-[11px] text-navy-700 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            <button type="submit" className="w-full py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" /> {t('signUpFree', language)}
            </button>
          </form>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {['🚀 Agent Mode', '🎤 Voice Chat', '📊 Lead Manager'].map((f, i) => (
              <div key={i} className="text-center p-1.5 bg-navy-50 rounded-lg"><span className="text-[8px] text-navy-600 font-medium">{f}</span></div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Activity Preview Panel (Right Side — Lovable-style) ─── */
const ActivityPreviewPanel = ({ activities, workflows }) => {
  const [expandedAct, setExpandedAct] = useState(null);

  if (activities.length === 0 && workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-14 h-14 bg-navy-50 rounded-2xl flex items-center justify-center mb-3">
          <Activity className="w-6 h-6 text-navy-300" />
        </div>
        <h4 className="text-[12px] font-bold text-navy-600 mb-1">Live Activity Preview</h4>
        <p className="text-[10px] text-navy-400 max-w-[200px]">Start a conversation and watch your marketing activities come alive here</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {workflows.length > 0 && (
        <div>
          <p className="text-[9px] font-bold text-navy-400 uppercase tracking-wider mb-2 px-1">Auto-Created Workflows</p>
          {workflows.slice(0, 4).map((wf, i) => (
            <motion.div key={i} {...fade(i)} className="mb-2 bg-white rounded-xl border border-teal-200 p-3 relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100/30 to-transparent" style={{ animation: 'shimmer 2s infinite' }} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{wf.icon}</span>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-navy-800">{wf.name}</p>
                    <p className="text-[9px] text-teal-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" /> Running
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {wf.steps.map((step, j) => (
                    <div key={j} className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] ${
                        j === 0 ? 'bg-teal-500 text-white' : j === 1 ? 'bg-teal-100 text-teal-600' : 'bg-navy-50 text-navy-300'}`}>
                        {j === 0 ? '✓' : j + 1}
                      </div>
                      <span className={`text-[9px] ${j === 0 ? 'text-teal-700 line-through' : j === 1 ? 'text-navy-700 font-medium' : 'text-navy-400'}`}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {activities.length > 0 && (
        <div>
          <p className="text-[9px] font-bold text-navy-400 uppercase tracking-wider mb-2 px-1">Live Activities</p>
          {activities.map((act, i) => (
            <motion.div key={i} {...fade(i)}
              className="mb-2 bg-white rounded-xl border border-navy-100 overflow-hidden cursor-pointer hover:border-navy-200"
              onClick={() => setExpandedAct(expandedAct === i ? null : i)}>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 ${act.color} rounded-lg flex items-center justify-center text-lg`}>{act.icon}</span>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-navy-800">{act.label}</p>
                    <p className="text-[9px] text-navy-400 capitalize">{act.status}</p>
                  </div>
                  <div className="relative w-8 h-8">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e8ecf3" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#14a88a" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${((i % 3 + 1) * 25 / 100) * 88} 88`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-navy-700">{(i % 3 + 1) * 25}%</span>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {expandedAct === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-3 pb-3 space-y-1">
                      {act.steps.map((step, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-[9px]">
                          {j < Math.ceil(act.steps.length * ((i % 3 + 1) * 0.25)) ? (
                            <CheckCircle2 className="w-3 h-3 text-teal-500 flex-shrink-0" />
                          ) : <div className="w-3 h-3 rounded-full border border-navy-200 flex-shrink-0" />}
                          <span className={j < Math.ceil(act.steps.length * ((i % 3 + 1) * 0.25)) ? 'text-teal-700' : 'text-navy-400'}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="h-0.5 bg-navy-50">
                <motion.div className="h-0.5 bg-teal-400" initial={{ width: 0 }}
                  animate={{ width: `${(i % 3 + 1) * 25}%` }} transition={{ duration: 1, delay: 0.5 }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Chat View ─── */
const ChatView = ({ messages, loading, input, setInput, handleSend, mode, setMode, isAuthenticated,
  onRequestSignup, language, onBack, activities, workflows, onVoiceResult, guestCreditsLeft }) => {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const handleAgentClick = () => { if (!isAuthenticated) { onRequestSignup(); return; } setMode('agent'); };
  const voiceCallback = useCallback((transcript) => { onVoiceResult(transcript); }, [onVoiceResult]);
  const { listening, supported, toggle: toggleVoice } = useVoiceInput(voiceCallback);

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 min-w-0">
        <div className="px-5 py-3 border-b border-navy-100 flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-navy-50"><ArrowLeft className="w-4 h-4 text-navy-500" /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
            <div><h3 className="text-sm font-bold text-navy-800">{t('copilot', language)}</h3><p className="text-[10px] text-navy-400">Powered by GROQ AI</p></div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!isAuthenticated && <span className="text-[10px] font-medium text-navy-400 bg-navy-50 px-2 py-1 rounded-full">{guestCreditsLeft} left</span>}
            <button onClick={() => setMode('chat')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${mode === 'chat' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
              <MessageCircle className="w-3 h-3" /> Chat
            </button>
            <button onClick={handleAgentClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${!isAuthenticated ? 'bg-navy-50 text-navy-300 cursor-not-allowed' : mode === 'agent' ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
              {!isAuthenticated ? <Lock className="w-3 h-3" /> : <Zap className="w-3 h-3" />} Agent
              {!isAuthenticated && <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded ml-1">PRO</span>}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div key={i} {...fade()} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 ${msg.isError ? 'bg-red-500' : mode === 'agent' ? 'bg-teal-600' : 'bg-navy-700'}`}>
                  {msg.isError ? <AlertCircle className="w-3.5 h-3.5 text-white" /> : mode === 'agent' ? <Zap className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-navy-700 text-white rounded-br-md' :
                msg.isError ? 'bg-red-50 text-red-700 rounded-bl-md border border-red-100' :
                'bg-navy-50 text-navy-700 rounded-bl-md'}`}>
                {msg.text}
                {msg.isVoice && <span className="inline-flex ml-1.5 text-[9px] opacity-60">🎙️</span>}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 ${mode === 'agent' ? 'bg-teal-600' : 'bg-navy-700'}`}>
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              </div>
              <div className="bg-navy-50 text-navy-400 rounded-2xl rounded-bl-md px-4 py-3 text-[12px]">{t('copilotThinking', language)}</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-5 pb-4 pt-2">
          <div className="flex items-center gap-3 bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500/40">
            {supported && (
              <button onClick={toggleVoice} className={`p-1.5 rounded-lg transition-all ${listening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-navy-100 text-navy-400'}`}>
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }} disabled={loading}
              placeholder={listening ? '🎤 Listening...' : t('copilotPlaceholder', language)}
              className="flex-1 bg-transparent text-[13px] text-navy-700 placeholder:text-navy-300 focus:outline-none disabled:opacity-50" />
            <button onClick={() => handleSend()} disabled={loading || !input.trim()}
              className={`w-9 h-9 rounded-lg flex items-center justify-center disabled:opacity-40 ${mode === 'agent' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-navy-700 hover:bg-navy-800'}`}>
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          {listening && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(i => (
                <motion.div key={i} className="w-0.5 bg-red-400 rounded-full" animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} />
              ))}</div>
              <span className="text-[11px] text-red-600 font-medium">Listening... speak now</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right: Activity Preview */}
      <div className="hidden lg:flex flex-col w-[300px] border-l border-navy-100 bg-navy-50/30">
        <div className="px-3 py-2.5 border-b border-navy-100 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-navy-400" /><span className="text-[10px] font-bold text-navy-600">Live Preview</span>
          {(activities.length > 0 || workflows.length > 0) && (
            <span className="ml-auto flex items-center gap-1 text-[8px] font-bold text-teal-600">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" /> Active
            </span>
          )}
        </div>
        <div className="flex-1 overflow-hidden"><ActivityPreviewPanel activities={activities} workflows={workflows} /></div>
      </div>
    </div>
  );
};

/* ─── Hero Input with Voice ─── */
const HeroInput = ({ input, setInput, handleSend, mode, handleAgentToggle, isAuthenticated, language, loading }) => {
  const voiceCallback = useCallback((transcript) => {
    setInput(transcript);
    setTimeout(() => handleSend(transcript, true), 300);
  }, [setInput, handleSend]);
  const { listening, supported, toggle: toggleVoice } = useVoiceInput(voiceCallback);

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={listening ? '🎤 Listening... speak naturally' : (language === 'en' ? 'Ask me anything about growing your business...' : t('copilotPlaceholder', language))}
          rows={3} className="w-full bg-transparent text-[14px] text-navy-700 placeholder:text-navy-300 focus:outline-none resize-none leading-relaxed" />
      </div>
      {listening && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(i => (
              <motion.div key={i} className="w-0.5 bg-red-400 rounded-full" animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.08 }} />
            ))}</div>
            <span className="text-[11px] text-red-600 font-medium">Listening... speak now</span>
          </div>
        </div>
      )}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {supported && (
            <button onClick={toggleVoice} className={`p-2 rounded-lg transition-all ${listening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' : 'hover:bg-navy-50 text-navy-400'}`}
              title={listening ? 'Stop' : 'Voice input'}>
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-navy-50" title="Attach"><Paperclip className="w-4 h-4 text-navy-400" /></button>
          <div className="h-5 w-px bg-navy-100 mx-1" />
          <button onClick={handleAgentToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${
              !isAuthenticated ? 'bg-navy-50 text-navy-300' : mode === 'agent' ? 'bg-teal-600 text-white shadow-sm' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
            {!isAuthenticated ? <Lock className="w-3 h-3" /> : <Zap className="w-3 h-3" />} AI Agent
            {!isAuthenticated && <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded ml-0.5">PRO</span>}
          </button>
        </div>
        <button onClick={() => handleSend()} disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-navy-700 text-white text-[12px] font-semibold rounded-xl hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed">
          <Send className="w-3.5 h-3.5" /> Send
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════ */
export const DashboardOverview = () => {
  const { language, businessData, analyticsData, isAuthenticated, signup,
    saveChat, addWorkflow, chatHistory, addLiveActivity } = useApp();
  const [showSignup, setShowSignup] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('chat');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guestMsgCount, setGuestMsgCount] = useState(0);
  const [chatId] = useState(() => `chat-${Date.now()}`);
  const [sessionActivities, setSessionActivities] = useState([]);
  const [sessionWorkflows, setSessionWorkflows] = useState([]);

  if (!analyticsData) return null;
  const filteredTemplates = activeCategory === 'All' ? templateCards : templateCards.filter(c => c.category === activeCategory);
  const guestCreditsLeft = Math.max(0, GUEST_CREDITS - guestMsgCount);

  const voiceResultHandler = useCallback((transcript) => { setInput(transcript); }, []);

  const handleSend = async (text, isVoice = false) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    if (!isAuthenticated && guestMsgCount >= GUEST_CREDITS) { setShowSignup(true); return; }
    if (!isAuthenticated) setGuestMsgCount(prev => prev + 1);

    const greeting = t('copilotGreeting', language).replace('{name}', businessData?.businessName || '');
    const userMessage = { role: 'user', text: userMsg, isVoice };
    const newMessages = chatActive ? [...messages, userMessage] : [{ role: 'bot', text: greeting }, userMessage];
    setMessages(newMessages);
    setInput('');
    setChatActive(true);
    setLoading(true);

    const history = newMessages.slice(-10);
    const result = await sendGroqMessage(history, mode, businessData, analyticsData, language);
    setLoading(false);
    const botMsg = { role: 'bot', text: result.message, isError: result.error };
    setMessages(prev => [...prev, botMsg]);

    if (!result.error && result.message) {
      const newActs = detectActivities(result.message);
      if (newActs.length > 0) {
        setSessionActivities(prev => { const existing = prev.map(a => a.type); return [...prev, ...newActs.filter(a => !existing.includes(a.type))]; });
        newActs.forEach(a => addLiveActivity(a));
      }
      if (isAuthenticated) {
        const newWfs = detectWorkflowIntent(result.message);
        const existingTypes = sessionWorkflows.map(w => w.type);
        const fresh = newWfs.filter(w => !existingTypes.includes(w.type));
        fresh.forEach(wf => addWorkflow(wf));
        if (fresh.length) setSessionWorkflows(prev => [...prev, ...fresh]);
      }
    }
    if (isAuthenticated) {
      const title = userMsg.slice(0, 50) + (userMsg.length > 50 ? '...' : '');
      saveChat(chatId, title, [...newMessages, botMsg]);
    }
  };

  const handleTemplateClick = (template) => { handleSend(template.prompt); };
  const handleBack = () => { setChatActive(false); };
  const handleAgentToggle = () => { if (!isAuthenticated) { setShowSignup(true); return; } setMode(prev => prev === 'agent' ? 'chat' : 'agent'); };

  if (chatActive) {
    return (
      <div className="h-[calc(100vh-80px)] -m-6 flex flex-col">
        <SignupPrompt open={showSignup} onClose={() => setShowSignup(false)} language={language} onSignup={(data) => signup(data)} />
        <ChatView messages={messages} loading={loading} input={input} setInput={setInput}
          handleSend={handleSend} mode={mode} setMode={setMode}
          isAuthenticated={isAuthenticated} onRequestSignup={() => setShowSignup(true)}
          language={language} onBack={handleBack}
          activities={sessionActivities} workflows={sessionWorkflows}
          onVoiceResult={voiceResultHandler} guestCreditsLeft={guestCreditsLeft} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-8">
      <SignupPrompt open={showSignup} onClose={() => setShowSignup(false)} language={language} onSignup={(data) => signup(data)} />

      {!isAuthenticated && (
        <motion.div {...fade(0)} className="mb-4 flex items-center gap-3 px-4 py-2.5 bg-navy-700 rounded-xl">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <p className="text-[11px] text-navy-100 flex-1">You have <span className="font-bold text-teal-300">{guestCreditsLeft} free questions</span> remaining. Sign up for unlimited access + voice mode!</p>
          <button onClick={() => setShowSignup(true)} className="px-3 py-1.5 bg-teal-600 text-white text-[10px] font-semibold rounded-lg hover:bg-teal-700">Sign Up Free</button>
        </motion.div>
      )}

      <motion.div {...fade(0)} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-200 rounded-full mb-5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" /><span className="text-[11px] font-semibold text-teal-700">AI-Powered Business Growth</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy-800 leading-tight mb-3">Your AI Growth Assistant is ready.<br /><span className="text-teal-600">What's your next move?</span></h1>
        <p className="text-sm text-navy-400 max-w-lg mx-auto">🚀 Ask anything about leads, SEO, social media, or get a complete growth plan for <span className="font-semibold text-navy-600">{businessData?.businessName || 'your business'}</span></p>
      </motion.div>

      <motion.div {...fade(1)} className="mb-8">
        <HeroInput input={input} setInput={setInput} handleSend={handleSend} mode={mode} handleAgentToggle={handleAgentToggle} isAuthenticated={isAuthenticated} language={language} loading={loading} />
        {!groqClient && (
          <div className="mt-3 px-4 py-2.5 bg-yellow-50 rounded-xl border border-yellow-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" /><p className="text-[11px] text-yellow-700">{t('noApiKey', language)}</p>
          </div>
        )}
      </motion.div>

      <motion.div {...fade(2)} className="flex items-center gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all ${activeCategory === cat ? 'bg-navy-700 text-white shadow-sm' : 'bg-white text-navy-500 border border-navy-100 hover:border-navy-200 hover:text-navy-700'}`}>
            {cat}
          </button>
        ))}
      </motion.div>

      <motion.div {...fade(3)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {filteredTemplates.map((tmpl) => (
          <motion.button key={tmpl.id} whileHover={{ y: -2 }} onClick={() => handleTemplateClick(tmpl)}
            className="bg-white rounded-xl border border-navy-100 p-4 text-left hover:border-teal-300 hover:shadow-md transition-all group">
            <div className="flex items-center gap-1.5 mb-3">
              {tmpl.icons.map((icon, j) => (
                <span key={j} className="w-7 h-7 rounded-full bg-navy-50 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">{icon}</span>
              ))}
            </div>
            <h4 className="text-[13px] font-bold text-navy-800 mb-1 group-hover:text-teal-700">{tmpl.title}</h4>
            <p className="text-[11px] text-navy-400 leading-relaxed line-clamp-2">{tmpl.desc}</p>
          </motion.button>
        ))}
      </motion.div>

      <motion.div {...fade(4)} className="text-center mb-10">
        <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700">
          Explore more templates <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {isAuthenticated && chatHistory.length > 0 && (
        <motion.div {...fade(5)}>
          <div className="flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-navy-400" /><h3 className="text-[13px] font-bold text-navy-700">Recent Conversations</h3></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {chatHistory.slice(0, 3).map(chat => (
              <button key={chat.id} className="flex items-center gap-3 bg-white rounded-xl border border-navy-100 p-3 hover:border-navy-200 hover:shadow-sm text-left">
                <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0"><MessageCircle className="w-4 h-4 text-navy-400" /></div>
                <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-navy-700 truncate">{chat.title}</p><p className="text-[10px] text-navy-300">{new Date(chat.updatedAt).toLocaleDateString()}</p></div>
                <ChevronRight className="w-3.5 h-3.5 text-navy-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

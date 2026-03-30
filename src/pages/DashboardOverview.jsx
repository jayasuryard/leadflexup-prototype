import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, MessageCircle, Send, Bot, Sparkles, Zap,
  Loader2, AlertCircle, Lock, UserPlus, Eye, X, Target,
  PieChart, LineChart, Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { sendGroqMessage, groqClient } from '../config/groq';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

/* ─── Visual Preview Panel (right side) ─── */
const VisualPreview = ({ messages, mode, analyticsData, language }) => {
  const lastBotMsg = [...messages].reverse().find(m => m.role === 'bot' && !m.isError);
  const { digitalPresence, traffic, socialMedia } = analyticsData || {};

  const hasChartKw = lastBotMsg?.text && /traffic|visit|lead|growth|trend|month|chart|data/i.test(lastBotMsg.text);
  const hasSocialKw = lastBotMsg?.text && /social|instagram|facebook|follower|engagement|post/i.test(lastBotMsg.text);
  const hasScoreKw = lastBotMsg?.text && /score|presence|website|seo|review|health/i.test(lastBotMsg.text);
  const hasActionPlan = mode === 'agent' && lastBotMsg?.text && /step|plan|action|1\.|2\.|3\./i.test(lastBotMsg.text);
  const scoreColor = (s) => s < 30 ? '#ef4444' : s < 60 ? '#eab308' : '#14a88a';

  if (!lastBotMsg || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mb-4"><Eye className="w-7 h-7 text-navy-300" /></div>
        <h4 className="text-sm font-bold text-navy-700 mb-1">{t('visualPreview', language)}</h4>
        <p className="text-[10px] text-navy-400 max-w-[200px]">{t('visualPreviewDesc', language)}</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {hasActionPlan && (
        <motion.div {...fade(0)} className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-4 border border-teal-200">
          <div className="flex items-center gap-2 mb-3"><Target className="w-4 h-4 text-teal-600" /><span className="text-[11px] font-bold text-teal-800">Action Plan Progress</span></div>
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${i === 1 ? 'bg-teal-600 text-white' : 'bg-white text-navy-400 border border-navy-200'}`}>{i}</div>
                <div className="flex-1 bg-white/60 rounded-full h-1.5"><div className="bg-teal-500 rounded-full h-1.5" style={{ width: i === 1 ? '100%' : i === 2 ? '40%' : '0%' }} /></div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {(hasScoreKw || (!hasChartKw && !hasSocialKw && !hasActionPlan)) && digitalPresence && (
        <motion.div {...fade(0)} className="bg-white rounded-xl border border-navy-100 p-3">
          <div className="flex items-center gap-1.5 mb-2"><PieChart className="w-3.5 h-3.5 text-navy-500" /><span className="text-[10px] font-bold text-navy-700">Score Breakdown</span></div>
          <div className="flex items-center justify-center mb-2">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e8ecf3" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke={scoreColor(digitalPresence.overall)} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(digitalPresence.overall / 100) * 213.6} 213.6`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-lg font-bold text-navy-800">{digitalPresence.overall}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[{ l: 'Website', v: digitalPresence.website, c: '#3b82f6' },{ l: 'Social', v: digitalPresence.socialMedia, c: '#8b5cf6' },{ l: 'SEO', v: digitalPresence.searchVisibility, c: '#f59e0b' },{ l: 'Reviews', v: digitalPresence.onlineReviews, c: '#10b981' }].map((m, i) => (
              <div key={i} className="bg-navy-50/50 rounded-lg p-1.5">
                <div className="flex items-center justify-between mb-0.5"><span className="text-[8px] text-navy-500">{m.l}</span><span className="text-[9px] font-bold" style={{ color: m.c }}>{m.v}</span></div>
                <div className="w-full bg-navy-100 rounded-full h-1"><div className="rounded-full h-1" style={{ width: `${m.v}%`, backgroundColor: m.c }} /></div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      {hasChartKw && traffic && (
        <motion.div {...fade(1)} className="bg-white rounded-xl border border-navy-100 p-3">
          <div className="flex items-center gap-1.5 mb-2"><LineChart className="w-3.5 h-3.5 text-navy-500" /><span className="text-[10px] font-bold text-navy-700">Traffic Trend</span></div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={traffic.monthly}>
              <defs>
                <linearGradient id="cpV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e2f52" stopOpacity={.2} /><stop offset="100%" stopColor="#1e2f52" stopOpacity={0} /></linearGradient>
                <linearGradient id="cpL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14a88a" stopOpacity={.2} /><stop offset="100%" stopColor="#14a88a" stopOpacity={0} /></linearGradient>
              </defs>
              <Area type="monotone" dataKey="visits" stroke="#1e2f52" strokeWidth={1.5} fill="url(#cpV)" />
              <Area type="monotone" dataKey="leads" stroke="#14a88a" strokeWidth={1.5} fill="url(#cpL)" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8ecf3', fontSize: 9, padding: '4px 8px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
      {hasSocialKw && socialMedia && (
        <motion.div {...fade(2)} className="bg-white rounded-xl border border-navy-100 p-3">
          <div className="flex items-center gap-1.5 mb-2"><Users className="w-3.5 h-3.5 text-navy-500" /><span className="text-[10px] font-bold text-navy-700">Social Platforms</span></div>
          <div className="space-y-1.5">
            {socialMedia.platforms.map((p, i) => {
              const max = Math.max(...socialMedia.platforms.map(x => x.followers));
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[9px] text-navy-600 w-14 truncate">{p.name}</span>
                  <div className="flex-1 bg-navy-50 rounded-full h-2"><div className="bg-navy-600 rounded-full h-2" style={{ width: `${(p.followers / max) * 100}%` }} /></div>
                  <span className="text-[8px] font-bold text-navy-700 w-8 text-right">{(p.followers / 1000).toFixed(1)}K</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      {traffic && (
        <motion.div {...fade(3)} className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-xl p-3 text-white">
          <span className="text-[9px] font-semibold text-navy-200">Quick Insight</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div><p className="text-lg font-bold">{traffic.monthly.slice(-1)[0]?.visits}</p><p className="text-[8px] text-navy-300">This month visits</p></div>
            <div><p className="text-lg font-bold text-teal-400">{traffic.monthly.slice(-1)[0]?.leads}</p><p className="text-[8px] text-navy-300">Leads captured</p></div>
          </div>
        </motion.div>
      )}
    </div>
  );
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
            {['🚀 Agent Mode', '🌐 Website Builder', '📊 Lead Manager'].map((f, i) => (
              <div key={i} className="text-center p-1.5 bg-navy-50 rounded-lg"><span className="text-[8px] text-navy-600 font-medium">{f}</span></div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── GROQ-Powered Copilot (Split Pane) ─── */
const Copilot = ({ language, businessData, analyticsData, isAuthenticated, onRequestSignup }) => {
  const [mode, setMode] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'bot', text: t('copilotGreeting', language).replace('{name}', businessData?.businessName || '') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const quickActions = {
    chat: [
      { label: '📈 ' + (language === 'en' ? 'How to get more leads?' : t('leadsGenerated', language) + '?') },
      { label: '🌐 ' + (language === 'en' ? 'Improve website' : t('websiteHealth', language)) },
      { label: '📱 ' + (language === 'en' ? 'Social media tips' : t('socialMediaScore', language)) },
      { label: '⭐ ' + (language === 'en' ? 'Get more reviews' : t('onlineReviews', language)) },
    ],
    agent: [
      { label: '🚀 ' + (language === 'en' ? 'Create a 30-day growth plan' : 'Plan') },
      { label: '🌐 ' + (language === 'en' ? 'Setup my website' : 'Website') },
      { label: '📱 ' + (language === 'en' ? 'Launch social media strategy' : 'Social') },
      { label: '📊 ' + (language === 'en' ? 'Competitor analysis action plan' : 'Competitors') },
    ]
  };

  const handleSend = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    if (!isAuthenticated && !chatStarted) { setChatStarted(true); }
    else if (!isAuthenticated && messages.filter(m => m.role === 'user').length >= 2) { onRequestSignup(); return; }
    const userMessage = { role: 'user', text: userMsg };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    const history = [...messages.slice(-10), userMessage];
    const result = await sendGroqMessage(history, mode, businessData, analyticsData, language);
    setLoading(false);
    setMessages(prev => [...prev, { role: 'bot', text: result.message, isError: result.error }]);
  };

  const handleAgentClick = () => { if (!isAuthenticated) { onRequestSignup(); return; } setMode('agent'); };

  return (
    <div className="flex h-full">
      {/* LEFT: Chat */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="px-4 py-2.5 border-b border-navy-100 flex items-center gap-2">
          <button onClick={() => setMode('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${mode === 'chat' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
            <MessageCircle className="w-3 h-3" /> {t('chatMode', language)}
          </button>
          <button onClick={handleAgentClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              !isAuthenticated ? 'bg-navy-50 text-navy-300 cursor-not-allowed' : mode === 'agent' ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
            {!isAuthenticated ? <Lock className="w-3 h-3" /> : <Zap className="w-3 h-3" />} {t('agentMode', language)}
            {!isAuthenticated && <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded ml-1">PRO</span>}
          </button>
          <span className="ml-auto text-[9px] text-navy-300 hidden sm:block">{mode === 'chat' ? t('chatModeDesc', language) : t('agentModeDesc', language)}</span>
        </div>

        {!groqClient && (
          <div className="mx-3 mt-2 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" /><p className="text-[10px] text-yellow-700">{t('noApiKey', language)}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: 180 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 ${msg.isError ? 'bg-red-500' : mode === 'agent' ? 'bg-teal-600' : 'bg-navy-700'}`}>
                  {msg.isError ? <AlertCircle className="w-3 h-3 text-white" /> : mode === 'agent' ? <Zap className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-white" />}
                </div>
              )}
              <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[11px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-navy-700 text-white rounded-br-sm' :
                msg.isError ? 'bg-red-50 text-red-700 rounded-bl-sm border border-red-100' :
                'bg-navy-50 text-navy-700 rounded-bl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 ${mode === 'agent' ? 'bg-teal-600' : 'bg-navy-700'}`}>
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              </div>
              <div className="bg-navy-50 text-navy-400 rounded-xl rounded-bl-sm px-3 py-2 text-[11px]">{t('copilotThinking', language)}</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
          {quickActions[mode].map((q, i) => (
            <button key={i} onClick={() => handleSend(q.label)} disabled={loading}
              className="text-[9px] px-2 py-1 bg-navy-50 text-navy-600 rounded-full hover:bg-navy-100 font-medium disabled:opacity-50">{q.label}</button>
          ))}
        </div>

        <div className="px-3 pb-3 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()} disabled={loading}
            placeholder={t('copilotPlaceholder', language)}
            className="flex-1 bg-navy-50 border border-navy-100 rounded-lg px-3 py-2 text-[11px] text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50" />
          <button onClick={() => handleSend()} disabled={loading}
            className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50 ${mode === 'agent' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-navy-700 hover:bg-navy-800'}`}>
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* RIGHT: Visual Preview */}
      <div className="hidden lg:flex flex-col w-[280px] border-l border-navy-100 bg-navy-50/30">
        <div className="px-3 py-2 border-b border-navy-100 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-navy-400" /><span className="text-[10px] font-bold text-navy-600">{t('visualPreview', language)}</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <VisualPreview messages={messages} mode={mode} analyticsData={analyticsData} language={language} />
        </div>
      </div>
    </div>
  );
};

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { language, businessData, analyticsData, isAuthenticated, signup } = useApp();
  const [showSignup, setShowSignup] = useState(false);
  if (!analyticsData) return null;
  const { digitalPresence } = analyticsData;
  const scoreColor = (s) => s < 30 ? '#ef4444' : s < 60 ? '#eab308' : '#14a88a';
  const scoreMsg = digitalPresence.overall < 40 ? t('scoreNeedsWork', language) : digitalPresence.overall < 70 ? t('scoreGoodProgress', language) : t('scoreStrong', language);

  return (
    <div className="h-full flex flex-col gap-5">
      <SignupPrompt open={showSignup} onClose={() => setShowSignup(false)} language={language} onSignup={(data) => signup(data)} />

      <motion.div {...fade(0)} className="bg-navy-700 text-white rounded-2xl p-6 flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(digitalPresence.overall)} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${(digitalPresence.overall / 100) * 327} 327`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{digitalPresence.overall}</span><span className="text-[9px] text-navy-200">/ 100</span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">{t('digitalPresence', language)}</h2>
          <p className="text-[12px] text-navy-200 mt-1.5 leading-relaxed">{scoreMsg}</p>
          <button onClick={() => navigate('/dashboard/analytics')} className="mt-3 flex items-center gap-1 text-[11px] text-teal-300 font-semibold hover:text-teal-200">
            {t('viewAll', language)} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {!isAuthenticated && (
          <button onClick={() => setShowSignup(true)} className="px-4 py-2 bg-teal-600 text-white text-[11px] font-semibold rounded-lg hover:bg-teal-700 flex items-center gap-1.5 flex-shrink-0">
            <UserPlus className="w-3.5 h-3.5" /> {t('signUpFree', language)}
          </button>
        )}
      </motion.div>

      <motion.div {...fade(1)} className="flex-1 bg-white rounded-2xl border border-navy-100 overflow-hidden flex flex-col min-h-[400px]">
        <div className="px-4 py-3 border-b border-navy-100 flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
          <div><h3 className="text-xs font-bold text-navy-800">{t('copilot', language)}</h3><p className="text-[9px] text-navy-400">Powered by GROQ AI</p></div>
        </div>
        <Copilot language={language} businessData={businessData} analyticsData={analyticsData}
          isAuthenticated={isAuthenticated} onRequestSignup={() => setShowSignup(true)} />
      </motion.div>
    </div>
  );
};

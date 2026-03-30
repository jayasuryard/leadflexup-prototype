import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, MessageCircle, Send, Bot, Sparkles, Zap,
  Loader2, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { sendGroqMessage, groqClient } from '../config/groq';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

/* ─── GROQ-Powered Copilot ─── */
const Copilot = ({ language, businessData, analyticsData }) => {
  const [mode, setMode] = useState('chat'); // 'chat' | 'agent'
  const [messages, setMessages] = useState([
    { role: 'bot', text: t('copilotGreeting', language).replace('{name}', businessData?.businessName || '') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
    const userMessage = { role: 'user', text: userMsg };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Build message history for GROQ (last 10 messages for context)
    const history = [...messages.slice(-10), userMessage];

    const result = await sendGroqMessage(history, mode, businessData, analyticsData, language);
    setLoading(false);

    if (result.error) {
      setMessages(prev => [...prev, { role: 'bot', text: result.message, isError: true }]);
    } else {
      setMessages(prev => [...prev, { role: 'bot', text: result.message }]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mode toggle */}
      <div className="px-4 py-2.5 border-b border-navy-100 flex items-center gap-2">
        <button onClick={() => setMode('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${mode === 'chat' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
          <MessageCircle className="w-3 h-3" /> {t('chatMode', language)}
        </button>
        <button onClick={() => setMode('agent')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${mode === 'agent' ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
          <Zap className="w-3 h-3" /> {t('agentMode', language)}
        </button>
        <span className="ml-auto text-[9px] text-navy-300">{mode === 'chat' ? t('chatModeDesc', language) : t('agentModeDesc', language)}</span>
      </div>

      {/* No API key banner */}
      {!groqClient && (
        <div className="mx-3 mt-2 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
          <p className="text-[10px] text-yellow-700">{t('noApiKey', language)}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: 200 }}>
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
              'bg-navy-50 text-navy-700 rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 ${mode === 'agent' ? 'bg-teal-600' : 'bg-navy-700'}`}>
              <Loader2 className="w-3 h-3 text-white animate-spin" />
            </div>
            <div className="bg-navy-50 text-navy-400 rounded-xl rounded-bl-sm px-3 py-2 text-[11px]">
              {t('copilotThinking', language)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
        {quickActions[mode].map((q, i) => (
          <button key={i} onClick={() => handleSend(q.label)}
            disabled={loading}
            className="text-[9px] px-2 py-1 bg-navy-50 text-navy-600 rounded-full hover:bg-navy-100 font-medium disabled:opacity-50">
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={loading}
          placeholder={t('copilotPlaceholder', language)}
          className="flex-1 bg-navy-50 border border-navy-100 rounded-lg px-3 py-2 text-[11px] text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50" />
        <button onClick={() => handleSend()} disabled={loading}
          className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50 ${mode === 'agent' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-navy-700 hover:bg-navy-800'}`}>
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { language, businessData, analyticsData } = useApp();

  if (!analyticsData) return null;

  const { digitalPresence } = analyticsData;
  const scoreColor = (s) => s < 30 ? '#ef4444' : s < 60 ? '#eab308' : '#14a88a';
  const scoreMsg = digitalPresence.overall < 40 ? t('scoreNeedsWork', language) :
                   digitalPresence.overall < 70 ? t('scoreGoodProgress', language) :
                   t('scoreStrong', language);

  return (
    <div className="h-full flex flex-col gap-5">
      {/* ─── Digital Presence Score Card ─── */}
      <motion.div {...fade(0)} className="bg-navy-700 text-white rounded-2xl p-6 flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(digitalPresence.overall)} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${(digitalPresence.overall / 100) * 327} 327`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{digitalPresence.overall}</span>
            <span className="text-[9px] text-navy-200">/ 100</span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">{t('digitalPresence', language)}</h2>
          <p className="text-[12px] text-navy-200 mt-1.5 leading-relaxed">{scoreMsg}</p>
          <button onClick={() => navigate('/dashboard/analytics')} className="mt-3 flex items-center gap-1 text-[11px] text-teal-300 font-semibold hover:text-teal-200">
            {t('viewAll', language)} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* ─── Copilot (full remaining height) ─── */}
      <motion.div {...fade(1)} className="flex-1 bg-white rounded-2xl border border-navy-100 overflow-hidden flex flex-col min-h-[400px]">
        <div className="px-4 py-3 border-b border-navy-100 flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
          <div>
            <h3 className="text-xs font-bold text-navy-800">{t('copilot', language)}</h3>
            <p className="text-[9px] text-navy-400">Powered by GROQ AI</p>
          </div>
        </div>
        <Copilot language={language} businessData={businessData} analyticsData={analyticsData} />
      </motion.div>
    </div>
  );
};

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, Sparkles, Zap, Loader2, AlertCircle, Lock, UserPlus,
  X, MessageCircle, Paperclip, Smile, ChevronRight, ArrowLeft, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { sendGroqMessage, groqClient } from '../config/groq';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

/* ─── Template Cards ─── */
const templateCards = [
  { id: 1, title: 'Optimize Website SEO', desc: 'Get personalized SEO audit & actionable recommendations for your site', category: 'SEO', icons: ['🔍', '📊'], prompt: 'Analyze my website SEO and give me top recommendations to improve search rankings' },
  { id: 2, title: 'Social Media Strategy', desc: 'Build a 30-day content calendar across all your social platforms', category: 'Social Media', icons: ['📱', '📅'], prompt: 'Create a 30-day social media content calendar for my business' },
  { id: 3, title: 'Generate More Leads', desc: 'Discover proven lead magnets & capture strategies for your industry', category: 'Lead Generation', icons: ['🎯', '💡'], prompt: 'Suggest lead generation strategies and lead magnets for my business category' },
  { id: 4, title: 'Competitor Deep Dive', desc: 'Analyze competitor strategies, strengths, and gaps you can exploit', category: 'Analytics', icons: ['🔎', '⚔️'], prompt: 'Do a competitor analysis and identify gaps I can exploit in my market' },
  { id: 5, title: 'Boost Online Reviews', desc: 'Get a strategy to improve your Google ratings and reputation', category: 'Digital Presence', icons: ['⭐', '💬'], prompt: 'Create a plan to get more positive Google reviews and improve my online reputation' },
  { id: 6, title: 'Ad Campaign Builder', desc: 'Design targeted advertising campaigns with ROI projections', category: 'Content', icons: ['📢', '💰'], prompt: 'Help me design an effective advertising campaign for my business with budget recommendations' },
  { id: 7, title: 'Content Strategy Plan', desc: 'Plan high-impact content that drives traffic and engagement', category: 'Content', icons: ['✍️', '🚀'], prompt: 'Create a content strategy plan that will drive traffic and engagement to my business' },
  { id: 8, title: 'Growth Roadmap', desc: 'Complete step-by-step action plan to grow your business online', category: 'Lead Generation', icons: ['🗺️', '📈'], prompt: 'Create a complete growth roadmap with milestones for my business for the next 3 months' },
];

const categories = ['All', 'Lead Generation', 'Digital Presence', 'Social Media', 'SEO', 'Content', 'Analytics'];

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

/* ─── Chat View (activated after first message) ─── */
const ChatView = ({ messages, loading, input, setInput, handleSend, mode, setMode, isAuthenticated, onRequestSignup, language, onBack }) => {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const handleAgentClick = () => { if (!isAuthenticated) { onRequestSignup(); return; } setMode('agent'); };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-3 border-b border-navy-100 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-navy-50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-navy-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy-800">{t('copilot', language)}</h3>
            <p className="text-[10px] text-navy-400">Powered by GROQ AI</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setMode('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${mode === 'chat' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
            <MessageCircle className="w-3 h-3" /> Chat
          </button>
          <button onClick={handleAgentClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              !isAuthenticated ? 'bg-navy-50 text-navy-300 cursor-not-allowed' : mode === 'agent' ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
            {!isAuthenticated ? <Lock className="w-3 h-3" /> : <Zap className="w-3 h-3" />} Agent
            {!isAuthenticated && <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded ml-1">PRO</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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

      <div className="px-6 pb-5 pt-2">
        <div className="flex items-center gap-3 bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500/40 transition-all">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }}
            disabled={loading}
            placeholder={t('copilotPlaceholder', language)}
            className="flex-1 bg-transparent text-[13px] text-navy-700 placeholder:text-navy-300 focus:outline-none disabled:opacity-50" />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 ${mode === 'agent' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-navy-700 hover:bg-navy-800'}`}>
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Dashboard Overview (Axiora-Style AI Co-Pilot) ─── */
export const DashboardOverview = () => {
  const { language, businessData, analyticsData, isAuthenticated, signup } = useApp();
  const [showSignup, setShowSignup] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('chat');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guestMsgCount, setGuestMsgCount] = useState(0);
  const [recentChats] = useState([
    { id: 1, title: 'SEO optimization tips', time: '2 min ago' },
    { id: 2, title: 'Social media strategy', time: '1 hour ago' },
    { id: 3, title: 'Lead generation plan', time: 'Yesterday' },
  ]);

  if (!analyticsData) return null;

  const filteredTemplates = activeCategory === 'All'
    ? templateCards
    : templateCards.filter(c => c.category === activeCategory);

  const handleSend = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    if (!isAuthenticated && guestMsgCount >= 2) { setShowSignup(true); return; }
    if (!isAuthenticated) setGuestMsgCount(prev => prev + 1);

    const greeting = t('copilotGreeting', language).replace('{name}', businessData?.businessName || '');
    const userMessage = { role: 'user', text: userMsg };
    const newMessages = chatActive
      ? [...messages, userMessage]
      : [{ role: 'bot', text: greeting }, userMessage];

    setMessages(newMessages);
    setInput('');
    setChatActive(true);
    setLoading(true);

    const history = newMessages.slice(-10);
    const result = await sendGroqMessage(history, mode, businessData, analyticsData, language);
    setLoading(false);
    setMessages(prev => [...prev, { role: 'bot', text: result.message, isError: result.error }]);
  };

  const handleTemplateClick = (template) => { handleSend(template.prompt); };
  const handleBack = () => { setChatActive(false); };
  const handleAgentToggle = () => {
    if (!isAuthenticated) { setShowSignup(true); return; }
    setMode(prev => prev === 'agent' ? 'chat' : 'agent');
  };

  /* ─── Chat mode ─── */
  if (chatActive) {
    return (
      <div className="h-[calc(100vh-80px)] -m-6 flex flex-col">
        <SignupPrompt open={showSignup} onClose={() => setShowSignup(false)} language={language} onSignup={(data) => signup(data)} />
        <ChatView messages={messages} loading={loading} input={input} setInput={setInput}
          handleSend={handleSend} mode={mode} setMode={setMode}
          isAuthenticated={isAuthenticated} onRequestSignup={() => setShowSignup(true)}
          language={language} onBack={handleBack} />
      </div>
    );
  }

  /* ─── Hero / Landing view (Axiora-style) ─── */
  return (
    <div className="max-w-4xl mx-auto pt-4 pb-8">
      <SignupPrompt open={showSignup} onClose={() => setShowSignup(false)} language={language} onSignup={(data) => signup(data)} />

      {/* Hero */}
      <motion.div {...fade(0)} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-200 rounded-full mb-5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[11px] font-semibold text-teal-700">AI-Powered Business Growth</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy-800 leading-tight mb-3">
          Your AI Growth Assistant is ready.<br />
          <span className="text-teal-600">What's your next move?</span>
        </h1>
        <p className="text-sm text-navy-400 max-w-lg mx-auto">
          🚀 Ask anything about leads, SEO, social media, or get a complete growth plan for{' '}
          <span className="font-semibold text-navy-600">{businessData?.businessName || 'your business'}</span>
        </p>
      </motion.div>

      {/* Input Area */}
      <motion.div {...fade(1)} className="mb-8">
        <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
          <div className="p-4">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={language === 'en' ? 'Ask me anything about growing your business...' : t('copilotPlaceholder', language)}
              rows={3}
              className="w-full bg-transparent text-[14px] text-navy-700 placeholder:text-navy-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>
          <div className="px-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-navy-50 transition-colors" title="Attach file">
                <Paperclip className="w-4 h-4 text-navy-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-navy-50 transition-colors" title="Add emoji">
                <Smile className="w-4 h-4 text-navy-400" />
              </button>
              <div className="h-5 w-px bg-navy-100 mx-1" />
              <button onClick={handleAgentToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  !isAuthenticated ? 'bg-navy-50 text-navy-300' :
                  mode === 'agent' ? 'bg-teal-600 text-white shadow-sm' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
                {!isAuthenticated ? <Lock className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                AI Agent
                {!isAuthenticated && <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded ml-0.5">PRO</span>}
              </button>
            </div>
            <button onClick={() => handleSend()} disabled={loading || !input.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-navy-700 text-white text-[12px] font-semibold rounded-xl hover:bg-navy-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>
        </div>
        {!groqClient && (
          <div className="mt-3 px-4 py-2.5 bg-yellow-50 rounded-xl border border-yellow-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <p className="text-[11px] text-yellow-700">{t('noApiKey', language)}</p>
          </div>
        )}
      </motion.div>

      {/* Category Pills */}
      <motion.div {...fade(2)} className="flex items-center gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all ${
              activeCategory === cat
                ? 'bg-navy-700 text-white shadow-sm'
                : 'bg-white text-navy-500 border border-navy-100 hover:border-navy-200 hover:text-navy-700'}`}>
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Template Cards Grid */}
      <motion.div {...fade(3)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {filteredTemplates.map((tmpl) => (
          <motion.button key={tmpl.id} whileHover={{ y: -2 }} onClick={() => handleTemplateClick(tmpl)}
            className="bg-white rounded-xl border border-navy-100 p-4 text-left hover:border-teal-300 hover:shadow-md transition-all group">
            <div className="flex items-center gap-1.5 mb-3">
              {tmpl.icons.map((icon, j) => (
                <span key={j} className="w-7 h-7 rounded-full bg-navy-50 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">{icon}</span>
              ))}
            </div>
            <h4 className="text-[13px] font-bold text-navy-800 mb-1 group-hover:text-teal-700 transition-colors">{tmpl.title}</h4>
            <p className="text-[11px] text-navy-400 leading-relaxed line-clamp-2">{tmpl.desc}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* Explore More */}
      <motion.div {...fade(4)} className="text-center mb-10">
        <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors">
          Explore more templates <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Recent Conversations */}
      {recentChats.length > 0 && (
        <motion.div {...fade(5)}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-navy-400" />
            <h3 className="text-[13px] font-bold text-navy-700">Recent Conversations</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentChats.map(chat => (
              <button key={chat.id} className="flex items-center gap-3 bg-white rounded-xl border border-navy-100 p-3 hover:border-navy-200 hover:shadow-sm transition-all text-left">
                <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-navy-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-navy-700 truncate">{chat.title}</p>
                  <p className="text-[10px] text-navy-300">{chat.time}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-navy-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

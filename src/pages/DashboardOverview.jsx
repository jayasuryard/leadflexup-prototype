import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, Sparkles, Zap, Loader2, AlertCircle, Lock, UserPlus,
  X, MessageCircle, Paperclip, ChevronRight, ArrowLeft, Clock,
  Mic, MicOff, Eye, CheckCircle2, Activity, Volume2, VolumeX,
  Check, Crown, Rocket
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { sendGroqMessage, groqClient } from '../config/groq';
import { VoiceAgent } from '../components/VoiceAgent';
import { subscriptionPlans } from '../data/mockDatabase';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

const GUEST_CREDITS = 5;

/* ─── Template Cards ─── */
const templateCards = [
  { id: 1, category: 'SEO', icons: ['🔍', '📊'], prompt: 'Analyze my website SEO and give me top recommendations to improve search rankings' },
  { id: 2, category: 'Social Media', icons: ['📱', '📅'], prompt: 'Create a 30-day social media content calendar for my business' },
  { id: 3, category: 'Lead Generation', icons: ['🎯', '💡'], prompt: 'Suggest lead generation strategies and lead magnets for my business category' },
  { id: 4, category: 'Analytics', icons: ['🔎', '⚔️'], prompt: 'Do a competitor analysis and identify gaps I can exploit in my market' },
  { id: 5, category: 'Digital Presence', icons: ['⭐', '💬'], prompt: 'Create a plan to get more positive Google reviews and improve my online reputation' },
  { id: 6, category: 'Content', icons: ['📢', '💰'], prompt: 'Help me design an effective advertising campaign for my business with budget recommendations' },
  { id: 7, category: 'Content', icons: ['✍️', '🚀'], prompt: 'Create a content strategy plan that will drive traffic and engagement to my business' },
  { id: 8, category: 'Lead Generation', icons: ['🗺️', '📈'], prompt: 'Create a complete growth roadmap with milestones for my business for the next 3 months' },
];

const categories = ['All', 'Lead Generation', 'Digital Presence', 'Social Media', 'SEO', 'Content', 'Analytics'];
const catKeyMap = { 'All': 'catAll', 'Lead Generation': 'catLeadGen', 'Digital Presence': 'catDigitalPresence', 'Social Media': 'catSocialMedia', 'SEO': 'catSEO', 'Content': 'catContent', 'Analytics': 'catAnalytics' };

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

/* ─── Language → BCP-47 map for Speech Recognition ─── */
const sttLangMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN', te: 'te-IN', ml: 'ml-IN' };

/* ─── Language → BCP-47 map for TTS voices ─── */
const ttsLangMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN', te: 'te-IN', ml: 'ml-IN' };

/* ─── Voice Input Hook (multi-lingual STT) ─── */
const useVoiceInput = (onResult, lang = 'en') => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = sttLangMap[lang] || 'en-IN';
      recognition.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false); };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, [onResult, lang]);

  const toggle = () => {
    if (!recognitionRef.current) return;
    if (listening) { recognitionRef.current.stop(); setListening(false); }
    else {
      recognitionRef.current.lang = sttLangMap[langRef.current] || 'en-IN';
      recognitionRef.current.start(); setListening(true);
    }
  };
  return { listening, supported, toggle };
};

/* ─── TTS Hook (multi-lingual Text-to-Speech) ─── */
const useTTS = (lang = 'en') => {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const utterRef = useRef(null);

  const speak = useCallback((text) => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = ttsLangMap[lang] || 'en-IN';
    utter.rate = 0.95;
    utter.pitch = 1;
    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const target = ttsLangMap[lang] || 'en-IN';
    const match = voices.find(v => v.lang === target) || voices.find(v => v.lang.startsWith(target.split('-')[0]));
    if (match) utter.voice = match;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [lang, supported]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speaking, supported, speak, stop };
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
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t('lpEmailField', language)}
              className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-[11px] text-navy-700 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder={t('lpPasswordField', language)}
              className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-[11px] text-navy-700 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            <button type="submit" className="w-full py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" /> {t('signUpFree', language)}
            </button>
          </form>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[t('doSignupFeature1', language), t('doSignupFeature2', language), t('doSignupFeature3', language)].map((f, i) => (
              <div key={i} className="text-center p-1.5 bg-navy-50 rounded-lg"><span className="text-[8px] text-navy-600 font-medium">{f}</span></div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Subscription Prompt Modal ─── */
const SubscriptionPrompt = ({ open, onClose, language, selectSubscription }) => {
  const [isYearly, setIsYearly] = useState(false);
  const nav = useNavigate();
  if (!open) return null;
  const planIcons = { starter: Sparkles, professional: Crown, enterprise: Rocket };
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/70 backdrop-blur-md p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-navy-800">You have 5 free questions remaining</h2>
              <p className="text-sm text-navy-500 mt-1">Sign up for unlimited access + voice mode!</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-50 text-navy-400"><X className="w-5 h-5" /></button>
          </div>
          
          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-3 mb-5 mt-6">
            <span className={`text-xs font-medium ${!isYearly ? 'text-navy-900' : 'text-navy-400'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-12 h-6 bg-navy-200 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              style={{ backgroundColor: isYearly ? '#0d9488' : '#cbd5e1' }}
            >
              <span
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{ transform: isYearly ? 'translateX(24px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-xs font-medium ${isYearly ? 'text-navy-900' : 'text-navy-400'}`}>
              Yearly <span className="text-teal-600 text-[10px]">(Save up to 16%)</span>
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => {
              const Icon = planIcons[plan.id];
              return (
                <div key={plan.id} className={`rounded-xl border-2 p-5 ${plan.recommended ? 'border-teal-500' : 'border-navy-100'}`}>
                  {plan.recommended && <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">Most Popular</span>}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mt-2 mb-3 ${plan.recommended ? 'bg-teal-600' : 'bg-navy-700'}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-800">{plan.name.en}</h3>
                  <p className="text-2xl font-bold text-navy-900 mt-1">
                    {plan.currency}{((isYearly ? plan.yearlyPrice : plan.price) / 100).toFixed(0)}
                    <span className="text-xs font-normal text-navy-400">/month</span>
                  </p>
                  <p className="text-[10px] text-navy-400 mb-2">{isYearly ? 'Billed annually' : 'Billed monthly'}</p>
                  <div className="space-y-1.5 mt-3 mb-4">
                    {plan.features.slice(0, 4).map((f, j) => (
                      <div key={j} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] text-navy-600">{f.en}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { onClose(); nav('/checkout', { state: { planId: plan.id, isYearly } }); }}
                    className={`w-full py-2 text-xs font-semibold rounded-lg ${plan.recommended ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-700 text-white hover:bg-navy-800'}`}>
                    Subscribe
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Activity Preview Panel (Right Side — Lovable-style) ─── */
const ActivityPreviewPanel = ({ activities, workflows, language }) => {
  const [expandedAct, setExpandedAct] = useState(null);

  if (activities.length === 0 && workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-14 h-14 bg-navy-50 rounded-2xl flex items-center justify-center mb-3">
          <Activity className="w-6 h-6 text-navy-300" />
        </div>
        <h4 className="text-[12px] font-bold text-navy-600 mb-1">{t('doActivityTitle', language)}</h4>
        <p className="text-[10px] text-navy-400 max-w-[200px]">{t('doActivityDesc', language)}</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {workflows.length > 0 && (
        <div>
          <p className="text-[9px] font-bold text-navy-400 uppercase tracking-wider mb-2 px-1">{t('doAutoWorkflows', language)}</p>
          {workflows.slice(0, 4).map((wf, i) => (
            <motion.div key={i} {...fade(i)} className="mb-2 bg-white rounded-xl border border-teal-200 p-3 relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100/30 to-transparent" style={{ animation: 'shimmer 2s infinite' }} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{wf.icon}</span>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-navy-800">{wf.name}</p>
                    <p className="text-[9px] text-teal-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" /> {t('running', language)}
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
          <p className="text-[9px] font-bold text-navy-400 uppercase tracking-wider mb-2 px-1">{t('doLiveActivities', language)}</p>
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
  onRequestSignup, language, onBack, activities, workflows, guestCreditsLeft }) => {
  const endRef = useRef(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const lastMsgCountRef = useRef(messages.length);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const handleAgentClick = () => { if (!isAuthenticated) { onRequestSignup(); return; } setMode('agent'); };
  const tts = useTTS(language);

  // Auto-speak new bot messages
  useEffect(() => {
    if (autoSpeak && messages.length > lastMsgCountRef.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === 'bot' && !lastMsg.isError) {
        tts.speak(lastMsg.text);
      }
    }
    lastMsgCountRef.current = messages.length;
  }, [messages, autoSpeak, tts]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 min-w-0">
        <div className="px-5 py-3 border-b border-navy-100 flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-navy-50"><ArrowLeft className="w-4 h-4 text-navy-500" /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
            <div><h3 className="text-sm font-bold text-navy-800">{t('copilot', language)}</h3><p className="text-[10px] text-navy-400">{t('doPoweredBy', language)}</p></div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!isAuthenticated && <span className="text-[10px] font-medium text-navy-400 bg-navy-50 px-2 py-1 rounded-full">{guestCreditsLeft} {t('doLeft', language)}</span>}
            <button onClick={() => setMode('chat')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${mode === 'chat' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
              <MessageCircle className="w-3 h-3" /> {t('doChat', language)}
            </button>
            <button onClick={handleAgentClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${!isAuthenticated ? 'bg-navy-50 text-navy-300 cursor-not-allowed' : mode === 'agent' ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
              {!isAuthenticated ? <Lock className="w-3 h-3" /> : <Zap className="w-3 h-3" />} {t('doAgent', language)}
              {!isAuthenticated && <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded ml-1">{t('pro', language)}</span>}
            </button>
            {/* Auto-speak toggle */}
            {tts.supported && (
              <button onClick={() => { setAutoSpeak(p => !p); if (tts.speaking) tts.stop(); }}
                className={`p-1.5 rounded-lg transition-all ${autoSpeak ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-400 hover:bg-navy-100'}`}
                title={t('voiceAutoSpeak', language)}>
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            )}
            {/* Voice Agent button */}
            <button onClick={onOpenVoiceAgent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:from-purple-700 hover:to-teal-700 shadow-sm"
              title={t('voiceTapToSpeak', language)}>
              <Mic className="w-3 h-3" /> Voice
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
              <div className={`max-w-[75%] rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-navy-700 text-white rounded-br-md px-4 py-3' :
                msg.isError ? 'bg-red-50 text-red-700 rounded-bl-md border border-red-100 px-4 py-3' :
                'bg-navy-50 text-navy-700 rounded-bl-md px-4 py-3'}`}>
                {msg.text}
                {msg.isVoice && <span className="inline-flex ml-1.5 text-[9px] opacity-60">🎙️</span>}
                {/* TTS speak button for bot messages */}
                {msg.role === 'bot' && !msg.isError && tts.supported && (
                  <button
                    onClick={(e) => { e.stopPropagation(); tts.speaking ? tts.stop() : tts.speak(msg.text); }}
                    className="inline-flex items-center gap-1 ml-2 mt-1 px-1.5 py-0.5 rounded text-[9px] text-navy-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                    title={tts.speaking ? t('voiceStopSpeaking', language) : t('voiceSpeak', language)}>
                    {tts.speaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{tts.speaking ? '■' : '▶'}</span>
                  </button>
                )}
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
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }} disabled={loading}
              placeholder={t('copilotPlaceholder', language)}
              className="flex-1 bg-transparent text-[13px] text-navy-700 placeholder:text-navy-300 focus:outline-none disabled:opacity-50" />
            <button onClick={() => handleSend()} disabled={loading || !input.trim()}
              className={`w-9 h-9 rounded-lg flex items-center justify-center disabled:opacity-40 ${mode === 'agent' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-navy-700 hover:bg-navy-800'}`}>
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Activity Preview */}
      <div className="hidden lg:flex flex-col w-[300px] border-l border-navy-100 bg-navy-50/30">
        <div className="px-3 py-2.5 border-b border-navy-100 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-navy-400" /><span className="text-[10px] font-bold text-navy-600">{t('doLivePreview', language)}</span>
          {(activities.length > 0 || workflows.length > 0) && (
            <span className="ml-auto flex items-center gap-1 text-[8px] font-bold text-teal-600">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" /> {t('active', language)}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-hidden"><ActivityPreviewPanel activities={activities} workflows={workflows} language={language} /></div>
      </div>
    </div>
  );
};

/* ─── Hero Input ─── */
const HeroInput = ({ input, setInput, handleSend, mode, handleAgentToggle, isAuthenticated, language, loading }) => {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={t('doAskAnything', language)}
          rows={3} className="w-full bg-transparent text-[14px] text-navy-700 placeholder:text-navy-300 focus:outline-none resize-none leading-relaxed" />
      </div>
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-navy-50" title="Attach"><Paperclip className="w-4 h-4 text-navy-400" /></button>
          <div className="h-5 w-px bg-navy-100 mx-1" />
          <button onClick={handleAgentToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${
              !isAuthenticated ? 'bg-navy-50 text-navy-300' : mode === 'agent' ? 'bg-teal-600 text-white shadow-sm' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
            {!isAuthenticated ? <Lock className="w-3 h-3" /> : <Zap className="w-3 h-3" />} {t('doAiAgent', language)}
            {!isAuthenticated && <span className="text-[8px] bg-yellow-100 text-yellow-700 px-1 rounded ml-0.5">{t('pro', language)}</span>}
          </button>
        </div>
        <button onClick={() => handleSend()} disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-navy-700 text-white text-[12px] font-semibold rounded-xl hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed">
          <Send className="w-3.5 h-3.5" /> {t('send', language)}
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
    saveChat, addWorkflow, chatHistory, addLiveActivity, selectSubscription } = useApp();
  const [showSignup, setShowSignup] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
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

  const handleSend = async (text, isVoice = false) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    if (!isAuthenticated && guestMsgCount >= GUEST_CREDITS) { setShowSubscription(true); return; }
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
          guestCreditsLeft={guestCreditsLeft} />
      </div>
    );
  }

  const creditsExceeded = !isAuthenticated && guestMsgCount >= GUEST_CREDITS;

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-8">
      <SignupPrompt open={showSignup} onClose={() => setShowSignup(false)} language={language} onSignup={(data) => signup(data)} />
      <SubscriptionPrompt open={showSubscription} onClose={() => setShowSubscription(false)} language={language} selectSubscription={selectSubscription} />

      <div className={creditsExceeded ? 'grayscale pointer-events-none' : ''}>
      <motion.div {...fade(0)} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-200 rounded-full mb-5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" /><span className="text-[11px] font-semibold text-teal-700">{t('doHeroBadge', language)}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy-800 leading-tight mb-3">{t('doHeroTitle', language)}<br /><span className="text-teal-600">{t('doHeroSubtitle', language)}</span></h1>
        <p className="text-sm text-navy-400 max-w-lg mx-auto">{t('doHeroDesc', language).replace('{name}', businessData?.businessName || '')}</p>
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
            {t(catKeyMap[cat], language)}
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
            <h4 className="text-[13px] font-bold text-navy-800 mb-1 group-hover:text-teal-700">{t(`doTmpl${tmpl.id}Title`, language)}</h4>
            <p className="text-[11px] text-navy-400 leading-relaxed line-clamp-2">{t(`doTmpl${tmpl.id}Desc`, language)}</p>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-navy-400" />
              <h3 className="text-[13px] font-bold text-navy-700">{t('doChatHistory', language)}</h3>
              <span className="text-[9px] bg-navy-100 text-navy-500 px-2 py-0.5 rounded-full font-medium">{chatHistory.length} {t('doChatConversations', language)}</span>
            </div>
          </div>
          <div className="space-y-2">
            {chatHistory.map((chat, i) => (
              <motion.button key={chat.id} {...fade(i % 6)}
                onClick={() => handleTemplateClick({ prompt: chat.messages?.[chat.messages.length - 2]?.text || chat.title })}
                className="w-full flex items-center gap-3 bg-white rounded-xl border border-navy-100 p-3.5 hover:border-teal-300 hover:shadow-sm text-left transition-all group">
                <div className="w-9 h-9 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-50 transition-colors">
                  <MessageCircle className="w-4 h-4 text-navy-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-navy-700 truncate group-hover:text-teal-700 transition-colors">{chat.title}</p>
                  <p className="text-[10px] text-navy-300 mt-0.5">{chat.messages?.length || 0} {t('doChatMessages', language)} • {new Date(chat.updatedAt).toLocaleDateString()}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-navy-200 group-hover:text-teal-500 flex-shrink-0 transition-colors" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
};

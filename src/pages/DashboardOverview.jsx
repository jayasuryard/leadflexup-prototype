import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, Lightbulb, ArrowRight, ArrowUpRight,
  Rocket, Eye, MousePointer, Star, MapPin, Share2,
  MessageCircle, Send, Bot, Sparkles, BarChart3, Globe
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

/* ─── Copilot Chat ─── */
const CopilotChat = ({ language, businessData, analyticsData }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: t('copilotGreeting', language).replace('{name}', businessData?.businessName || 'there') }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const quickActions = [
    { label: 'How to get more leads?', reply: `Based on your current score of ${analyticsData?.digitalPresence?.overall}/100, I recommend: 1) Optimize your Google Business listing, 2) Run a local Facebook ad campaign targeting your area, 3) Add call-to-action buttons on your website. These 3 actions alone can boost leads by 40%.` },
    { label: 'Social media tips', reply: `Your social engagement is at ${(analyticsData?.socialMedia?.platforms.reduce((a, p) => a + p.engagement, 0) / (analyticsData?.socialMedia?.platforms.length || 1)).toFixed(1)}%. To improve: Post 3-5 times/week, use local hashtags, respond to comments within 1 hour, share customer testimonials, and run weekly polls or Q&As.` },
    { label: 'Website improvements', reply: `Your website health score is ${analyticsData?.digitalPresence?.website}/100. Key improvements: Add SSL certificate, improve page load speed (aim for <3s), make it mobile-responsive, add clear contact info on every page, and set up Google Analytics tracking.` },
    { label: 'Review strategy', reply: `You have a review score of ${analyticsData?.digitalPresence?.onlineReviews}/100. To improve: Ask satisfied customers for reviews right after service, respond to ALL reviews (positive & negative) within 24 hours, and share positive reviews on your social channels. Aim for 5+ new reviews per month.` }
  ];

  const handleSend = (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    const matched = quickActions.find(q => q.label === userMsg);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: matched ? matched.reply : `Great question! Based on your analytics, I'd suggest focusing on improving your weakest area first. Your digital presence score is ${analyticsData?.digitalPresence?.overall}/100 — let's work on getting that higher. Would you like specific tips for website, social media, or reviews?`
      }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ maxHeight: 280 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"><Bot className="w-3 h-3 text-white" /></div>}
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${msg.role === 'user' ? 'bg-navy-700 text-white rounded-br-sm' : 'bg-navy-50 text-navy-700 rounded-bl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {/* Quick actions */}
      <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
        {quickActions.map((q, i) => (
          <button key={i} onClick={() => handleSend(q.label)}
            className="text-[9px] px-2 py-1 bg-navy-50 text-navy-600 rounded-full hover:bg-navy-100 font-medium">
            {q.label}
          </button>
        ))}
      </div>
      {/* Input */}
      <div className="px-3 pb-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={t('copilotPlaceholder', language)}
          className="flex-1 bg-navy-50 border border-navy-100 rounded-lg px-3 py-2 text-[11px] text-navy-700 placeholder:text-navy-300 focus:outline-none focus:ring-1 focus:ring-teal-500" />
        <button onClick={() => handleSend()} className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700">
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { language, businessData, analyticsData, recommendations, subscription } = useApp();

  if (!analyticsData) return null;

  const { digitalPresence, traffic, socialMedia, geoInsights } = analyticsData;
  const lastMonth = traffic.monthly[traffic.monthly.length - 1];

  const scoreColor = (s) => s < 30 ? '#ef4444' : s < 60 ? '#eab308' : '#14a88a';

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-xl font-bold text-navy-900">{t('summary', language)}</h1>
        <p className="text-sm text-navy-400 mt-0.5">{businessData?.businessName}</p>
      </div>

      {/* ─── BENTO BOX GRID ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">

        {/* Bento 1: Welcome / Score ─ spans 2 cols */}
        <motion.div {...fade(0)} className="col-span-2 bg-navy-700 text-white rounded-2xl p-5 flex items-center gap-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(digitalPresence.overall)} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(digitalPresence.overall / 100) * 327} 327`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{digitalPresence.overall}</span>
              <span className="text-[9px] text-navy-200">/ 100</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold">{t('digitalPresence', language)}</p>
            <p className="text-[11px] text-navy-200 mt-1 leading-relaxed">
              {digitalPresence.overall < 40 ? 'Needs improvement — let\'s build your digital presence.' :
               digitalPresence.overall < 70 ? 'Good progress! A few key improvements can boost your reach.' :
               'Strong presence! Focus on optimizing and scaling.'}
            </p>
            <button onClick={() => navigate('/dashboard/analytics')} className="mt-2 flex items-center gap-1 text-[10px] text-teal-300 font-semibold hover:text-teal-200">
              {t('viewAll', language)} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Bento 2: Monthly Visits */}
        <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 p-4 flex flex-col justify-between">
          <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center mb-2"><Eye className="w-4 h-4 text-navy-600" /></div>
          <div>
            <p className="text-2xl font-bold text-navy-900">{lastMonth?.visits}</p>
            <p className="text-[10px] text-navy-400">{t('monthlyVisits', language)}</p>
          </div>
          <span className="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full self-start mt-1">+24%</span>
        </motion.div>

        {/* Bento 3: Leads */}
        <motion.div {...fade(2)} className="bg-white rounded-2xl border border-navy-100 p-4 flex flex-col justify-between">
          <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center mb-2"><MousePointer className="w-4 h-4 text-navy-600" /></div>
          <div>
            <p className="text-2xl font-bold text-navy-900">{lastMonth?.leads}</p>
            <p className="text-[10px] text-navy-400">{t('leadsGenerated', language)}</p>
          </div>
          <span className="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full self-start mt-1">+38%</span>
        </motion.div>

        {/* Bento 4: Copilot ─ spans 2 cols, 2 rows */}
        <motion.div {...fade(3)} className="col-span-2 row-span-2 bg-white rounded-2xl border border-navy-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-navy-100 flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5 text-white" /></div>
            <div>
              <h3 className="text-xs font-bold text-navy-800">{t('copilot', language)}</h3>
              <p className="text-[9px] text-navy-400">AI-powered growth assistant</p>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-teal-500 ml-auto" />
          </div>
          <CopilotChat language={language} businessData={businessData} analyticsData={analyticsData} />
        </motion.div>

        {/* Bento 5: Followers */}
        <motion.div {...fade(4)} className="bg-white rounded-2xl border border-navy-100 p-4 flex flex-col justify-between">
          <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center mb-2"><Users className="w-4 h-4 text-navy-600" /></div>
          <div>
            <p className="text-xl font-bold text-navy-900">{socialMedia.platforms.reduce((a, p) => a + p.followers, 0).toLocaleString()}</p>
            <p className="text-[10px] text-navy-400">{t('totalFollowers', language)}</p>
          </div>
          <span className="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full self-start mt-1">+16%</span>
        </motion.div>

        {/* Bento 6: Engagement */}
        <motion.div {...fade(5)} className="bg-white rounded-2xl border border-navy-100 p-4 flex flex-col justify-between">
          <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center mb-2"><Star className="w-4 h-4 text-navy-600" /></div>
          <div>
            <p className="text-xl font-bold text-navy-900">{(socialMedia.platforms.reduce((a, p) => a + p.engagement, 0) / socialMedia.platforms.length).toFixed(1)}%</p>
            <p className="text-[10px] text-navy-400">{t('avgEngagement', language)}</p>
          </div>
          <span className="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full self-start mt-1">+12%</span>
        </motion.div>

        {/* Bento 7: Traffic mini chart ─ spans 2 cols */}
        <motion.div {...fade(6)} className="col-span-2 bg-white rounded-2xl border border-navy-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-navy-800">Traffic & Leads</h3>
            <span className="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">+24% vs last month</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={traffic.monthly}>
              <defs>
                <linearGradient id="bV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e2f52" stopOpacity={.12} /><stop offset="100%" stopColor="#1e2f52" stopOpacity={0} /></linearGradient>
                <linearGradient id="bL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14a88a" stopOpacity={.12} /><stop offset="100%" stopColor="#14a88a" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8da5cd' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8ecf3', fontSize: 10 }} />
              <Area type="monotone" dataKey="visits" stroke="#1e2f52" strokeWidth={1.5} fill="url(#bV)" />
              <Area type="monotone" dataKey="leads" stroke="#14a88a" strokeWidth={1.5} fill="url(#bL)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bento 8: Traffic sources donut */}
        <motion.div {...fade(7)} className="bg-white rounded-2xl border border-navy-100 p-4">
          <h3 className="text-xs font-bold text-navy-800 mb-2">{t('trafficSources', language)}</h3>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart><Pie data={traffic.sources} cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={3} dataKey="value">
              {traffic.sources.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie></PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-1">
            {traffic.sources.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[9px]">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-navy-500">{s.name}</span></div>
                <span className="font-bold text-navy-700">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bento 9: Top Locations */}
        <motion.div {...fade(8)} className="bg-white rounded-2xl border border-navy-100 p-4">
          <h3 className="text-xs font-bold text-navy-800 mb-2">{t('geoInsights', language)}</h3>
          <div className="space-y-2">
            {geoInsights.topCities.slice(0, 4).map((city, i) => (
              <div key={i} className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-navy-300 flex-shrink-0" />
                <span className="text-[10px] text-navy-600 flex-1 truncate">{city.city}</span>
                <div className="w-12 bg-navy-100 rounded-full h-1"><div className="bg-navy-600 rounded-full h-1" style={{ width: `${city.percentage}%` }} /></div>
                <span className="text-[9px] font-bold text-navy-700 w-7 text-right">{city.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bento 10: Recommendations ─ spans 2 cols */}
        <motion.div {...fade(9)} className="col-span-2 bg-white rounded-2xl border border-navy-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-teal-600" /><h3 className="text-xs font-bold text-navy-800">{t('recommendationsTitle', language)}</h3></div>
            <button onClick={() => navigate('/dashboard/recommendations')} className="text-[10px] font-semibold text-navy-400 hover:text-navy-600 flex items-center gap-0.5">{t('viewAll', language)} <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {recommendations.slice(0, 4).map((rec, i) => {
              const colors = { critical: 'bg-red-500', high: 'bg-yellow-500', medium: 'bg-navy-400', low: 'bg-teal-500' };
              return (
                <div key={i} onClick={() => navigate('/dashboard/recommendations')} className="flex items-start gap-2 p-2.5 rounded-lg bg-navy-50/50 hover:bg-navy-50 cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colors[rec.priority]}`} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-navy-700 truncate">{getLocalizedText(rec.title, language)}</p>
                    <p className="text-[9px] text-navy-400">{rec.impact} • {rec.timeline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Bento 11: Social snapshot ─ spans 2 cols */}
        <motion.div {...fade(10)} className="col-span-2 bg-white rounded-2xl border border-navy-100 p-4">
          <h3 className="text-xs font-bold text-navy-800 mb-2">Social Media</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {socialMedia.platforms.map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-navy-50/50 rounded-lg">
                <div className="w-7 h-7 bg-navy-700 rounded-lg flex items-center justify-center"><Share2 className="w-3 h-3 text-white" /></div>
                <div>
                  <p className="text-[10px] font-semibold text-navy-700">{p.name}</p>
                  <p className="text-[9px] text-navy-400">{p.followers.toLocaleString()} • {p.engagement}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

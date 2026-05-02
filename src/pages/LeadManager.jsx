import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, ChevronRight, User, Mail, Phone, Globe,
  TrendingUp, Target, Eye, ArrowUpRight, BarChart3, Clock, Star, Sparkles,
  Download, X, MapPin, MessageCircle, Calendar, CheckCircle2,
  UserPlus, Flame, ThumbsUp, Send, RefreshCw, Building2, SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { Commentable } from '../components/CommentBox';

/* ─── Lead Copilot Response Helper ─── */
const getLeadCopilotResponse = (query, lead, businessData) => {
  const q = query.toLowerCase();
  const name = lead?.name || 'this lead';
  const biz = businessData?.name || 'your business';
  if (q.includes('convert') || q.includes('close') || q.includes('win'))
    return `Here's my recommended strategy to convert ${name}:\n\n1. ${lead?.intent === 'hot' ? '🔥 This is a HOT lead — act within 2 hours!' : lead?.intent === 'warm' ? '⚡ Warm lead — follow up within 24 hours' : '❄️ Cold lead — nurture first before pushing for conversion'}\n2. Their inquiry was about "${lead?.inquiry}" — mention that specifically\n3. ${lead?.source === 'Google Search' ? 'They found you on Google — they\'re actively searching. Share your best reviews!' : `They came via ${lead?.source} — personalize your outreach accordingly`}\n4. Lead score is ${lead?.score}/100 — ${lead?.score >= 80 ? 'very promising, prioritize this one!' : lead?.score >= 60 ? 'decent potential, needs nurturing' : 'needs warming up first'}\n\nSuggested message: "Hi ${lead?.name?.split(' ')[0]}, thanks for your interest in ${lead?.inquiry?.toLowerCase()} at ${biz}. I'd love to help you with that. When would be a good time to connect?"`;
  if (q.includes('message') || q.includes('draft') || q.includes('write') || q.includes('whatsapp') || q.includes('email'))
    return `Here's a personalized message for ${name}:\n\n📱 WhatsApp:\n"Hi ${lead?.name?.split(' ')[0]}! 👋 This is from ${biz}. We noticed your interest in ${lead?.inquiry?.toLowerCase()}. We'd love to assist! Would you prefer a quick call or should I share the details here?"\n\n📧 Email subject: "Quick update on your ${lead?.inquiry?.toLowerCase()} inquiry"\n\nBody:\n"Dear ${lead?.name?.split(' ')[0]},\n\nThank you for reaching out about ${lead?.inquiry?.toLowerCase()}. At ${biz}, we take pride in offering the best experience.\n\n[Add relevant details/offers here]\n\nWhen would be a convenient time to discuss this further?\n\nBest regards"`;
  if (q.includes('history') || q.includes('activity') || q.includes('timeline'))
    return `Activity timeline for ${name}:\n\n📋 Lead added: ${lead?.addedAt}\n📊 Current stage: ${lead?.stageLabel}\n🎯 Intent level: ${lead?.intent?.toUpperCase()}\n⏰ Last activity: ${lead?.lastActivity}\n\n${lead?.nurtured ? '✅ AI Nurture: Active (' + lead?.emailsSent + ' emails sent)' : '⚠️ AI Nurture: Not active — consider enabling it'}\n${lead?.whatsappSent ? '✅ WhatsApp follow-up sent' : '⚠️ No WhatsApp follow-up yet'}\n\n💡 Recommendation: ${lead?.lastActivity?.includes('24') || lead?.lastActivity?.includes('48') ? 'It\'s been a while — reach out today!' : 'Recent activity detected — good timing to follow up!'}`;
  return `Here's what I know about ${name}:\n\n👤 Score: ${lead?.score}/100 (${lead?.score >= 80 ? 'High priority' : lead?.score >= 60 ? 'Medium priority' : 'Building interest'})\n🎯 Intent: ${lead?.intent?.toUpperCase()} | Stage: ${lead?.stageLabel}\n📞 Source: ${lead?.source}\n💼 Inquiry: ${lead?.inquiry}\n📍 Location: ${lead?.area}\n\n${lead?.intent === 'hot' ? '🔥 This lead is HOT — reach out immediately!' : lead?.intent === 'warm' ? '⚡ Warm lead — a timely follow-up can push them to convert' : '❄️ Cold lead — use AI nurture to warm them up first'}\n\nWant me to draft a follow-up message or suggest a conversion strategy?`;
};

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

/* ─── Mock local leads data ─── */
const generateLocalLeads = (category, city) => {
  const sources = ['Google Search', 'Website Form', 'WhatsApp', 'Social Media', 'Referral', 'Walk-in', 'Phone Call'];
  const stages = ['new', 'contacted', 'interested', 'negotiating', 'converted', 'lost'];
  const intents = ['cold', 'warm', 'hot'];
  const stageLabels = { new: 'New Lead', contacted: 'Contacted', interested: 'Interested', negotiating: 'Negotiating', converted: 'Converted', lost: 'Lost' };
  const stageColors = { new: 'bg-blue-100 text-blue-700', contacted: 'bg-amber-100 text-amber-700', interested: 'bg-purple-100 text-purple-700', negotiating: 'bg-orange-100 text-orange-700', converted: 'bg-teal-100 text-teal-700', lost: 'bg-red-100 text-red-700' };
  const intentColors = { cold: 'bg-sky-100 text-sky-700', warm: 'bg-amber-100 text-amber-700', hot: 'bg-red-100 text-red-700' };

  const firstNames = ['Priya', 'Rahul', 'Ananya', 'Vikram', 'Deepa', 'Arun', 'Sneha', 'Karthik', 'Meera', 'Suresh', 'Lakshmi', 'Rajesh', 'Kavitha', 'Mohan', 'Divya', 'Ganesh', 'Roja', 'Venkat', 'Swathi', 'Prakash'];
  const lastNames = ['Sharma', 'Patel', 'Reddy', 'Kumar', 'Singh', 'Joshi', 'Naidu', 'Rao', 'Iyer', 'Menon', 'Gupta', 'Verma', 'Nair', 'Pillai', 'Das'];
  const areas = [`${city} Main Road`, `${city} Market`, `MG Road, ${city}`, `Station Road, ${city}`, `Ring Road, ${city}`, `Bus Stand, ${city}`, `Temple Street, ${city}`, `Lake View, ${city}`];

  return Array.from({ length: 24 }, (_, i) => {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const stage = stages[Math.floor(Math.random() * (stages.length - 1))]; // mostly not lost
    const intent = intents[Math.floor(Math.random() * intents.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const score = Math.floor(Math.random() * 60) + 40;

    return {
      id: i + 1,
      name: `${fn} ${ln}`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@gmail.com`,
      area, city,
      source, stage, intent, score,
      stageLabel: stageLabels[stage],
      stageColor: stageColors[stage],
      intentColor: intentColors[intent],
      inquiry: getCategoryInquiry(category),
      addedAt: `${daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}`,
      lastActivity: `${Math.floor(Math.random() * 48) + 1}h ago`,
      nurtured: Math.random() > 0.4,
      emailsSent: Math.floor(Math.random() * 5),
      whatsappSent: Math.random() > 0.5,
    };
  });
};

function getCategoryInquiry(cat) {
  const map = {
    restaurant: ['Table reservation', 'Catering inquiry', 'Party booking', 'Menu inquiry', 'Home delivery'],
    hotel: ['Room booking', 'Event hall', 'Weekend package', 'Group booking', 'Conference hall'],
    salon: ['Bridal package', 'Hair treatment', 'Facial appointment', 'Spa package', 'Regular service'],
    gym: ['Membership inquiry', 'Personal training', 'Trial session', 'Group class', 'Annual plan'],
    medical: ['Doctor appointment', 'Health checkup', 'Consultation', 'Follow-up visit', 'Emergency inquiry'],
    education: ['Course inquiry', 'Admission', 'Demo class', 'Fee structure', 'Placement info'],
    professional: ['Service inquiry', 'Quote request', 'Consultation booking', 'Project discussion', 'Partnership'],
    automotive: ['Service booking', 'Repair quote', 'Insurance claim', 'Parts inquiry', 'AC service'],
    retail: ['Product inquiry', 'Bulk order', 'Price check', 'Return request', 'New arrival info'],
  };
  const items = map[cat] || map.professional;
  return items[Math.floor(Math.random() * items.length)];
}

export const LeadManager = () => {
  const { language, businessData } = useApp();
  const category = businessData?.category || 'professional';
  const city = businessData?.businessCity || 'Your City';

  const [leads] = useState(() => generateLocalLeads(category, city));
  const [view, setView] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [filterSearch, setFilterSearch] = useState('');
  // Multi-select filters (arrays)
  const [stageFilters, setStageFilters] = useState([]);
  const [intentFilters, setIntentFilters] = useState([]);
  const [sourceFilters, setSourceFilters] = useState([]);
  const [scoreRange, setScoreRange] = useState([0, 100]);
  // Copilot state
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState([]);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotThinking, setCopilotThinking] = useState(false);
  const [copilotLead, setCopilotLead] = useState(null);
  const copilotEndRef = useRef(null);

  useEffect(() => {
    if (copilotEndRef.current) copilotEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, copilotThinking]);

  const openCopilotForLead = (lead) => {
    setCopilotLead(lead);
    const autoMsg = getLeadCopilotResponse('analyze', lead, businessData);
    setCopilotMessages([{ role: 'ai', text: autoMsg }]);
    setCopilotInput('');
    setShowCopilot(true);
  };

  const toggleFilter = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const activeFilterCount = stageFilters.length + intentFilters.length + sourceFilters.length + (scoreRange[0] > 0 || scoreRange[1] < 100 ? 1 : 0);

  const clearAllFilters = () => {
    setStageFilters([]); setIntentFilters([]); setSourceFilters([]); setScoreRange([0, 100]); setFilterSearch('');
  };

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (searchTerm && !l.name.toLowerCase().includes(searchTerm.toLowerCase()) && !l.phone.includes(searchTerm) && !l.inquiry.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (stageFilters.length > 0 && !stageFilters.includes(l.stage)) return false;
      if (intentFilters.length > 0 && !intentFilters.includes(l.intent)) return false;
      if (sourceFilters.length > 0 && !sourceFilters.includes(l.source)) return false;
      if (l.score < scoreRange[0] || l.score > scoreRange[1]) return false;
      return true;
    });
  }, [leads, searchTerm, stageFilters, intentFilters, sourceFilters, scoreRange]);

  const stages = ['new', 'contacted', 'interested', 'negotiating', 'converted'];
  const stageLabels = { new: 'New', contacted: 'Contacted', interested: 'Interested', negotiating: 'Negotiating', converted: 'Converted' };
  const allSources = ['Google Search', 'Website Form', 'WhatsApp', 'Social Media', 'Referral', 'Walk-in', 'Phone Call'];

  const kpis = [
    { label: 'Total Leads', value: leads.length, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Hot Leads', value: leads.filter(l => l.intent === 'hot').length, icon: Flame, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Converted', value: leads.filter(l => l.stage === 'converted').length, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Nurtured by AI', value: leads.filter(l => l.nurtured).length, icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg Score', value: Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length), icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  // Filter options that match filterSearch
  const matchesFilterSearch = (label) => !filterSearch || label.toLowerCase().includes(filterSearch.toLowerCase());

  const showRightSidebar = showFilters;

  return (
    <Commentable id="lead-manager" label="Lead Manager">
    <div className="space-y-5">
      {/* Header */}
      <Commentable id="lead-manager-header" label="Lead Manager Header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('leadManager', language)}</h1>
          <p className="text-sm text-navy-400 mt-0.5">Local leads from {city} &middot; AI-nurtured & scored</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy-600 bg-white border border-navy-100 rounded-lg hover:bg-navy-50">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>
      </Commentable>

      {/* KPI Row */}
      <Commentable id="lead-manager-kpi-row" label="Lead KPI Statistics Row">
      <div className={`grid gap-3 ${showRightSidebar ? 'grid-cols-5' : 'grid-cols-5'}`}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i} {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-3">
              <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="text-xl font-bold text-navy-800">{kpi.value}</p>
              <p className="text-[10px] text-navy-400">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>
      </Commentable>

      {/* Main Layout: Content + Right Sidebar */}
      <div className="flex gap-4 items-start">
        {/* Left: Main Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <Commentable id="lead-manager-toolbar" label="Lead Search and Filter Toolbar">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search leads by name, phone, inquiry..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-navy-100 rounded-xl text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border transition-colors ${
                showFilters ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-navy-600 border-navy-100 hover:bg-navy-50'
              }`}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 bg-teal-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            <div className="flex items-center gap-1 bg-white rounded-lg border border-navy-100 p-0.5">
              <button onClick={() => setView('pipeline')} className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${view === 'pipeline' ? 'bg-navy-700 text-white' : 'text-navy-500'}`}>Pipeline</button>
              <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${view === 'table' ? 'bg-navy-700 text-white' : 'text-navy-500'}`}>Table</button>
            </div>
          </div>
          </Commentable>

          {/* Active Filter Chips Bar */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-navy-400">Active:</span>
              {stageFilters.map(s => (
                <span key={s} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200">
                  {stageLabels[s]} <button onClick={() => toggleFilter(stageFilters, setStageFilters, s)} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              {intentFilters.map(i => (
                <span key={i} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-full border border-amber-200">
                  {i.charAt(0).toUpperCase() + i.slice(1)} <button onClick={() => toggleFilter(intentFilters, setIntentFilters, i)} className="hover:bg-amber-200 rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              {sourceFilters.map(s => (
                <span key={s} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-full border border-purple-200">
                  {s} <button onClick={() => toggleFilter(sourceFilters, setSourceFilters, s)} className="hover:bg-purple-200 rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              {(scoreRange[0] > 0 || scoreRange[1] < 100) && (
                <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-semibold rounded-full border border-teal-200">
                  Score: {scoreRange[0]}–{scoreRange[1]} <button onClick={() => setScoreRange([0, 100])} className="hover:bg-teal-200 rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
                </span>
              )}
              <span className="text-[10px] text-navy-400 ml-1">{filtered.length} results</span>
            </div>
          )}

          {/* Pipeline View */}
          <Commentable id="lead-manager-pipeline-view" label="Lead Pipeline View">
          {view === 'pipeline' && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {stages.map(stage => {
                const stageLeads = filtered.filter(l => l.stage === stage);
                return (
                  <div key={stage} className="min-w-[220px] flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-navy-700">{stageLabels[stage]}</h3>
                      <span className="text-[10px] font-semibold bg-navy-100 text-navy-500 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                    </div>
                    <div className="space-y-2">
                      {stageLeads.slice(0, 8).map(lead => (
                        <motion.div key={lead.id} whileHover={{ y: -2 }} onClick={() => setSelectedLead(lead)}
                          className="bg-white rounded-xl border border-navy-100 p-3 cursor-pointer hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs font-bold text-navy-800">{lead.name}</p>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${lead.intentColor}`}>{lead.intent.toUpperCase()}</span>
                          </div>
                          <p className="text-[10px] text-navy-500 mb-1">{lead.inquiry}</p>
                          <div className="flex items-center gap-2 text-[9px] text-navy-400">
                            <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {lead.area.split(',')[0]}</span>
                            <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {lead.lastActivity}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              {lead.nurtured && <span className="text-[8px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full font-semibold">AI</span>}
                              {lead.whatsappSent && <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-semibold">WA</span>}
                            </div>
                            <div className="w-6 h-6 rounded-full bg-navy-50 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-navy-600">{lead.score}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {stageLeads.length > 8 && (
                        <p className="text-[10px] text-center text-navy-400 py-1">+{stageLeads.length - 8} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </Commentable>

          {/* Table View */}
          <Commentable id="lead-manager-table-view" label="Lead Table View">
          {view === 'table' && (
            <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-navy-50 text-[10px] font-bold text-navy-500 uppercase">
                      <th className="text-left px-4 py-2.5">Lead</th>
                      <th className="text-left px-3 py-2.5">Inquiry</th>
                      <th className="text-left px-3 py-2.5">Source</th>
                      <th className="text-left px-3 py-2.5">Stage</th>
                      <th className="text-left px-3 py-2.5">Intent</th>
                      <th className="text-center px-3 py-2.5">Score</th>
                      <th className="text-left px-3 py-2.5">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 20).map(lead => (
                      <tr key={lead.id} onClick={() => setSelectedLead(lead)}
                        className={`border-t border-navy-50 hover:bg-navy-50/50 cursor-pointer transition-colors ${selectedLead?.id === lead.id ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''}`}>
                        <td className="px-4 py-2.5">
                          <p className="text-xs font-semibold text-navy-800">{lead.name}</p>
                          <p className="text-[10px] text-navy-400">{lead.phone}</p>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-navy-600">{lead.inquiry}</td>
                        <td className="px-3 py-2.5 text-[11px] text-navy-500">{lead.source}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${lead.stageColor}`}>{lead.stageLabel}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${lead.intentColor}`}>{lead.intent}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`text-xs font-bold ${lead.score >= 80 ? 'text-teal-600' : lead.score >= 60 ? 'text-amber-600' : 'text-navy-500'}`}>{lead.score}</span>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-navy-400">{lead.addedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </Commentable>
        </div>

        {/* ─── Right Sidebar: Filters ─── */}
        <Commentable id="lead-manager-filter-sidebar" label="Lead Filter Sidebar">
        <AnimatePresence mode="wait">
          {showRightSidebar && (
            <motion.div
              key="right-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 relative"
              style={{ width: 300 }}
            >
              <div className="sticky top-5 w-[300px]">
                {/* ─── Advanced Filter Panel ─── */}
                <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                  {/* Filter Header */}
                  <div className="px-4 py-3 border-b border-navy-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy-800">Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded min-w-[18px] text-center">{activeFilterCount}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {activeFilterCount > 0 && (
                        <button onClick={clearAllFilters} className="text-[11px] text-blue-600 font-medium hover:underline">Clear All</button>
                      )}
                      <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-navy-50 rounded-lg">
                        <ChevronRight className="w-4 h-4 text-navy-400" />
                      </button>
                    </div>
                  </div>

                  {/* Filter Search */}
                  <div className="px-4 py-2.5 border-b border-navy-50">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-navy-400" />
                      <input value={filterSearch} onChange={e => setFilterSearch(e.target.value)}
                        placeholder="Search filters or values"
                        className="w-full pl-8 pr-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-[11px] text-navy-800 placeholder-navy-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" />
                    </div>
                  </div>

                  {/* Scrollable Filter Sections */}
                  <div className="overflow-y-auto px-4 py-3 space-y-5" style={{ maxHeight: 'calc(100vh - 310px)' }}>

                    {/* Lead Source */}
                    {matchesFilterSearch('source') && (
                      <div>
                        <h4 className="text-xs font-bold text-navy-800 mb-2">Lead Source</h4>
                        {sourceFilters.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {sourceFilters.map(s => (
                              <span key={s} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200">
                                {s} <button onClick={() => toggleFilter(sourceFilters, setSourceFilters, s)} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="space-y-1">
                          {allSources.filter(s => matchesFilterSearch(s)).map(s => (
                            <label key={s} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-navy-50 cursor-pointer group">
                              <input type="checkbox" checked={sourceFilters.includes(s)} onChange={() => toggleFilter(sourceFilters, setSourceFilters, s)}
                                className="w-3.5 h-3.5 rounded border-navy-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                              <span className="text-[11px] text-navy-700 group-hover:text-navy-900">{s}</span>
                              <span className="text-[9px] text-navy-400 ml-auto">{leads.filter(l => l.source === s).length}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pipeline Stage */}
                    {matchesFilterSearch('stage pipeline') && (
                      <div>
                        <h4 className="text-xs font-bold text-navy-800 mb-2">Pipeline Stage</h4>
                        {stageFilters.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {stageFilters.map(s => (
                              <span key={s} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200">
                                {stageLabels[s]} <button onClick={() => toggleFilter(stageFilters, setStageFilters, s)} className="hover:bg-blue-200 rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="space-y-1">
                          {stages.filter(s => matchesFilterSearch(stageLabels[s])).map(s => (
                            <label key={s} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-navy-50 cursor-pointer group">
                              <input type="checkbox" checked={stageFilters.includes(s)} onChange={() => toggleFilter(stageFilters, setStageFilters, s)}
                                className="w-3.5 h-3.5 rounded border-navy-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                              <span className="text-[11px] text-navy-700 group-hover:text-navy-900">{stageLabels[s]}</span>
                              <span className="text-[9px] text-navy-400 ml-auto">{leads.filter(l => l.stage === s).length}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Intent Score */}
                    {matchesFilterSearch('intent') && (
                      <div>
                        <h4 className="text-xs font-bold text-navy-800 mb-2">Intent Score</h4>
                        {intentFilters.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {intentFilters.map(i => (
                              <span key={i} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-full border border-amber-200">
                                {i.charAt(0).toUpperCase() + i.slice(1)} <button onClick={() => toggleFilter(intentFilters, setIntentFilters, i)} className="hover:bg-amber-200 rounded-full p-0.5"><X className="w-2.5 h-2.5" /></button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="space-y-1">
                          {['hot', 'warm', 'cold'].filter(i => matchesFilterSearch(i)).map(i => (
                            <label key={i} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-navy-50 cursor-pointer group">
                              <input type="checkbox" checked={intentFilters.includes(i)} onChange={() => toggleFilter(intentFilters, setIntentFilters, i)}
                                className="w-3.5 h-3.5 rounded border-navy-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                              <span className="text-[11px] text-navy-700 group-hover:text-navy-900 capitalize">{i}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${i === 'hot' ? 'bg-red-100 text-red-600' : i === 'warm' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>
                                {leads.filter(l => l.intent === i).length}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lead Score Range */}
                    {matchesFilterSearch('score range') && (
                      <div>
                        <h4 className="text-xs font-bold text-navy-800 mb-2">Lead Score</h4>
                        <div className="bg-navy-50 rounded-lg p-3">
                          <div className="flex items-center justify-between text-[10px] text-navy-500 mb-2">
                            <span>Min: {scoreRange[0]}</span>
                            <span>Max: {scoreRange[1]}</span>
                          </div>
                          <div className="space-y-2">
                            <input type="range" min="0" max="100" value={scoreRange[0]}
                              onChange={e => setScoreRange([Math.min(+e.target.value, scoreRange[1]), scoreRange[1]])}
                              className="w-full h-1 accent-blue-600" />
                            <input type="range" min="0" max="100" value={scoreRange[1]}
                              onChange={e => setScoreRange([scoreRange[0], Math.max(+e.target.value, scoreRange[0])])}
                              className="w-full h-1 accent-blue-600" />
                          </div>
                          <div className="flex justify-between text-[9px] text-navy-400 mt-1"><span>0</span><span>50</span><span>100</span></div>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {matchesFilterSearch('location area') && (
                      <div>
                        <h4 className="text-xs font-bold text-navy-800 mb-2">Location</h4>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full border border-blue-200">
                            {city} <span className="text-blue-400">•</span>
                          </span>
                        </div>
                        <p className="text-[9px] text-navy-400 mt-1.5">All leads from {city} area</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-navy-100">
                    <div className="text-center">
                      <p className="text-[10px] text-navy-400">{filtered.length} of {leads.length} leads</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </Commentable>
      </div>

      {/* ─── Lead Detail Panel (full-screen slide-in) ─── */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-end bg-navy-950/40 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}>
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md h-full bg-white shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>

              <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-navy-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-navy-900">{selectedLead.name}</h2>
                  <p className="text-[11px] text-navy-400">{selectedLead.area}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
              </div>

              <div className="p-5 space-y-4">
                {/* Score & Intent */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-navy-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-navy-800">{selectedLead.score}</p>
                    <p className="text-[9px] text-navy-400">Lead Score</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${selectedLead.intentColor.replace('text-', 'bg-').replace('700', '50')}`}>
                    <p className="text-sm font-bold capitalize">{selectedLead.intent}</p>
                    <p className="text-[9px]">Intent Level</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${selectedLead.stageColor.replace('text-', 'bg-').replace('700', '50')}`}>
                    <p className="text-sm font-bold">{selectedLead.stageLabel}</p>
                    <p className="text-[9px]">Stage</p>
                  </div>
                </div>

                {/* ZoomInfo-style Contact Actions */}
                <div className="bg-white rounded-xl border border-navy-100 p-4">
                  <h3 className="text-xs font-bold text-navy-700 mb-3">Contact Actions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-navy-50/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Phone className="w-4 h-4 text-blue-600" /></div>
                        <div><p className="text-xs font-semibold text-navy-800">{selectedLead.phone}</p><p className="text-[9px] text-navy-400">Mobile • Direct</p></div>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"><Phone className="w-3 h-3" /> Call</button>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-navy-50/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><MessageCircle className="w-4 h-4 text-green-600" /></div>
                        <div><p className="text-xs font-semibold text-navy-800">WhatsApp</p><p className="text-[9px] text-navy-400">{selectedLead.phone}</p></div>
                      </div>
                      <button className="px-3 py-1.5 bg-green-600 text-white text-[10px] font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Chat</button>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-navy-50/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><Mail className="w-4 h-4 text-purple-600" /></div>
                        <div><p className="text-xs font-semibold text-navy-800">{selectedLead.email}</p><p className="text-[9px] text-navy-400">Email • Verified</p></div>
                      </div>
                      <button className="px-3 py-1.5 bg-purple-600 text-white text-[10px] font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"><Mail className="w-3 h-3" /> Email</button>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-navy-50/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-navy-600" /></div>
                        <div><p className="text-xs font-semibold text-navy-800">AI Nurture</p><p className="text-[9px] text-navy-400">{selectedLead.nurtured ? 'Active • ' + selectedLead.emailsSent + ' emails sent' : 'Not started'}</p></div>
                      </div>
                      <button className="px-3 py-1.5 bg-navy-700 text-white text-[10px] font-semibold rounded-lg hover:bg-navy-800 transition-colors flex items-center gap-1"><Send className="w-3 h-3" /> {selectedLead.nurtured ? 'Active' : 'Start'}</button>
                    </div>
                  </div>
                </div>

                {/* Ask Copilot Button */}
                <button onClick={() => openCopilotForLead(selectedLead)}
                  className="w-full py-3 bg-gradient-to-r from-navy-800 to-navy-900 text-white text-xs font-semibold rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all flex items-center justify-center gap-2 shadow-md">
                  <Sparkles className="w-4 h-4 text-teal-400" /> Ask Copilot About This Lead
                </button>

                {/* Lead Details */}
                <div className="bg-white rounded-xl border border-navy-100 p-4 space-y-2.5">
                  <h3 className="text-xs font-bold text-navy-700 mb-2">Lead Details</h3>
                  <div className="flex items-center justify-between text-xs"><span className="text-navy-400">Inquiry</span><span className="font-semibold text-navy-700">{selectedLead.inquiry}</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-navy-400">Source</span><span className="font-semibold text-navy-700">{selectedLead.source}</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-navy-400">Added</span><span className="font-semibold text-navy-700">{selectedLead.addedAt}</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-navy-400">Last Activity</span><span className="font-semibold text-navy-700">{selectedLead.lastActivity}</span></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-navy-400">Location</span><span className="font-semibold text-navy-700">{selectedLead.area}, {selectedLead.city}</span></div>
                </div>

                {/* AI Nurture Activity */}
                <div className="bg-white rounded-xl border border-navy-100 p-4">
                  <h3 className="text-xs font-bold text-navy-700 mb-2">AI Nurture Activity</h3>
                  <div className="space-y-2">
                    {selectedLead.nurtured && (
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <div><p className="text-[11px] font-semibold text-purple-700">AI nurture sequence active</p><p className="text-[10px] text-purple-500">{selectedLead.emailsSent} emails sent</p></div>
                      </div>
                    )}
                    {selectedLead.whatsappSent && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <div><p className="text-[11px] font-semibold text-green-700">WhatsApp message sent</p><p className="text-[10px] text-green-500">Automated follow-up</p></div>
                      </div>
                    )}
                    {!selectedLead.nurtured && !selectedLead.whatsappSent && (
                      <p className="text-[11px] text-navy-400">No AI nurture activity yet</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Copilot Chat Popup ─── */}
      <AnimatePresence>
        {showCopilot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4"
            onClick={() => setShowCopilot(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg h-[70vh] flex flex-col shadow-xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="px-5 py-4 border-b border-navy-100 flex items-center justify-between bg-gradient-to-r from-navy-800 to-navy-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Lead Copilot</h3>
                    <p className="text-[9px] text-navy-300">{copilotLead ? `Analyzing ${copilotLead.name}` : 'Ask anything about your leads'}</p>
                  </div>
                </div>
                <button onClick={() => setShowCopilot(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              {/* Lead context bar */}
              {copilotLead && (
                <div className="px-4 py-2.5 bg-navy-50 border-b border-navy-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-navy-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-navy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy-800 truncate">{copilotLead.name}</p>
                    <p className="text-[9px] text-navy-400">{copilotLead.inquiry} • Score: {copilotLead.score} • {copilotLead.intent.toUpperCase()}</p>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full shrink-0 ${copilotLead.intentColor}`}>{copilotLead.intent}</span>
                </div>
              )}
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {copilotMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="w-10 h-10 text-teal-500 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-semibold text-navy-700">How can I help with your leads?</p>
                    <p className="text-[11px] text-navy-400 mt-1 max-w-xs mx-auto">Ask about conversion strategies, follow-up messages, or lead analysis.</p>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                      {['How do I convert this lead?', 'Draft a follow-up message', 'Show activity timeline', 'Suggest best approach'].map((q, i) => (
                        <button key={i} onClick={() => { setCopilotMessages([{ role: 'user', text: q }]); setCopilotThinking(true); setTimeout(() => { setCopilotMessages(prev => [...prev, { role: 'ai', text: getLeadCopilotResponse(q, copilotLead, businessData) }]); setCopilotThinking(false); }, 1200); }}
                          className="text-[10px] px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200 hover:bg-teal-100 transition-colors">{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {copilotMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-teal-100' : 'bg-navy-700'}`}>
                      {msg.role === 'ai' ? <Sparkles className="w-3 h-3 text-teal-600" /> : <User className="w-3 h-3 text-white" />}
                    </div>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-navy-700 text-white rounded-2xl rounded-tr-sm px-3 py-2' : 'bg-navy-50 text-navy-700 rounded-2xl rounded-tl-sm px-3 py-2'}`}>
                      <p className="text-[11px] leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {copilotThinking && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"><Sparkles className="w-3 h-3 text-teal-600" /></div>
                    <div className="bg-navy-50 rounded-2xl rounded-tl-sm px-3 py-2">
                      <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
                    </div>
                  </div>
                )}
                <div ref={copilotEndRef} />
              </div>
              {/* Input */}
              <div className="p-3 border-t border-navy-100">
                <div className="flex items-center gap-2">
                  <input value={copilotInput} onChange={e => setCopilotInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && copilotInput.trim()) { const q = copilotInput.trim(); setCopilotMessages(prev => [...prev, { role: 'user', text: q }]); setCopilotInput(''); setCopilotThinking(true); setTimeout(() => { setCopilotMessages(prev => [...prev, { role: 'ai', text: getLeadCopilotResponse(q, copilotLead, businessData) }]); setCopilotThinking(false); }, 1200); } }}
                    placeholder="Ask about this lead..."
                    className="flex-1 px-3 py-2.5 bg-navy-50 border border-navy-100 rounded-xl text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                  <button onClick={() => { if (!copilotInput.trim()) return; const q = copilotInput.trim(); setCopilotMessages(prev => [...prev, { role: 'user', text: q }]); setCopilotInput(''); setCopilotThinking(true); setTimeout(() => { setCopilotMessages(prev => [...prev, { role: 'ai', text: getLeadCopilotResponse(q, copilotLead, businessData) }]); setCopilotThinking(false); }, 1200); }}
                    className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </Commentable>
  );
};

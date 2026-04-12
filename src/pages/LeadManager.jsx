import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, ChevronRight, User, Mail, Phone, Globe,
  TrendingUp, Target, Eye, ArrowUpRight, BarChart3, Clock, Star, Sparkles,
  Download, X, MapPin, MessageCircle, Calendar, CheckCircle2,
  UserPlus, Flame, ThumbsUp, Send, RefreshCw, Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

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
  const [view, setView] = useState('table'); // table | pipeline
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [intentFilter, setIntentFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (searchTerm && !l.name.toLowerCase().includes(searchTerm.toLowerCase()) && !l.phone.includes(searchTerm) && !l.inquiry.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (stageFilter !== 'all' && l.stage !== stageFilter) return false;
      if (intentFilter !== 'all' && l.intent !== intentFilter) return false;
      return true;
    });
  }, [leads, searchTerm, stageFilter, intentFilter]);

  const stages = ['new', 'contacted', 'interested', 'negotiating', 'converted'];
  const stageLabels = { new: 'New', contacted: 'Contacted', interested: 'Interested', negotiating: 'Negotiating', converted: 'Converted' };

  const kpis = [
    { label: 'Total Leads', value: leads.length, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Hot Leads', value: leads.filter(l => l.intent === 'hot').length, icon: Flame, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Converted', value: leads.filter(l => l.stage === 'converted').length, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Nurtured by AI', value: leads.filter(l => l.nurtured).length, icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg Score', value: Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length), icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
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

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3">
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

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, phone, inquiry..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-navy-100 rounded-xl text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg border border-navy-100 p-0.5">
          <button onClick={() => setView('pipeline')} className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${view === 'pipeline' ? 'bg-navy-700 text-white' : 'text-navy-500'}`}>Pipeline</button>
          <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${view === 'table' ? 'bg-navy-700 text-white' : 'text-navy-500'}`}>Table</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-navy-500">Stage:</span>
        {['all', ...stages].map(s => (
          <button key={s} onClick={() => setStageFilter(s)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
              stageFilter === s ? 'bg-navy-700 text-white' : 'bg-white border border-navy-100 text-navy-500 hover:bg-navy-50'
            }`}>{s === 'all' ? 'All' : stageLabels[s]}</button>
        ))}
        <div className="w-px h-4 bg-navy-200 mx-1" />
        <span className="text-[10px] font-semibold text-navy-500">Intent:</span>
        {['all', 'cold', 'warm', 'hot'].map(i => (
          <button key={i} onClick={() => setIntentFilter(i)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
              intentFilter === i ? 'bg-navy-700 text-white' : 'bg-white border border-navy-100 text-navy-500 hover:bg-navy-50'
            }`}>{i === 'all' ? 'All' : i.charAt(0).toUpperCase() + i.slice(1)}</button>
        ))}
      </div>

      {/* Pipeline View */}
      {view === 'pipeline' && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {stages.map(stage => {
            const stageLeads = filtered.filter(l => l.stage === stage);
            return (
              <div key={stage} className="min-w-[260px] flex-shrink-0">
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
                          {lead.nurtured && <span className="text-[8px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full font-semibold">AI Nurtured</span>}
                          {lead.whatsappSent && <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-semibold">WhatsApp</span>}
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

      {/* Table View */}
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
                  <th className="text-left px-3 py-2.5">Area</th>
                  <th className="text-left px-3 py-2.5">Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 20).map(lead => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)}
                    className="border-t border-navy-50 hover:bg-navy-50/50 cursor-pointer transition-colors">
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
                    <td className="px-3 py-2.5 text-[11px] text-navy-500">{lead.area.split(',')[0]}</td>
                    <td className="px-3 py-2.5 text-[11px] text-navy-400">{lead.addedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail Panel */}
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

                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-navy-100 p-4 space-y-2.5">
                  <h3 className="text-xs font-bold text-navy-700 mb-2">Contact Information</h3>
                  <div className="flex items-center gap-3 text-xs text-navy-600"><Phone className="w-4 h-4 text-navy-400" /> {selectedLead.phone}</div>
                  <div className="flex items-center gap-3 text-xs text-navy-600"><Mail className="w-4 h-4 text-navy-400" /> {selectedLead.email}</div>
                  <div className="flex items-center gap-3 text-xs text-navy-600"><MapPin className="w-4 h-4 text-navy-400" /> {selectedLead.area}, {selectedLead.city}</div>
                </div>

                {/* Inquiry & Source */}
                <div className="bg-white rounded-xl border border-navy-100 p-4 space-y-2.5">
                  <h3 className="text-xs font-bold text-navy-700 mb-2">Lead Details</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-navy-400">Inquiry</span>
                    <span className="font-semibold text-navy-700">{selectedLead.inquiry}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-navy-400">Source</span>
                    <span className="font-semibold text-navy-700">{selectedLead.source}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-navy-400">Added</span>
                    <span className="font-semibold text-navy-700">{selectedLead.addedAt}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-navy-400">Last Activity</span>
                    <span className="font-semibold text-navy-700">{selectedLead.lastActivity}</span>
                  </div>
                </div>

                {/* AI Nurture Activity */}
                <div className="bg-white rounded-xl border border-navy-100 p-4">
                  <h3 className="text-xs font-bold text-navy-700 mb-2">AI Nurture Activity</h3>
                  <div className="space-y-2">
                    {selectedLead.nurtured && (
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-[11px] font-semibold text-purple-700">AI nurture sequence active</p>
                          <p className="text-[10px] text-purple-500">{selectedLead.emailsSent} emails sent</p>
                        </div>
                      </div>
                    )}
                    {selectedLead.whatsappSent && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-[11px] font-semibold text-green-700">WhatsApp message sent</p>
                          <p className="text-[10px] text-green-500">Automated follow-up</p>
                        </div>
                      </div>
                    )}
                    {!selectedLead.nurtured && !selectedLead.whatsappSent && (
                      <p className="text-[11px] text-navy-400">No AI nurture activity yet</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800">
                    <Send className="w-3.5 h-3.5" /> AI Nurture
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

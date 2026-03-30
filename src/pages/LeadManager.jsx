import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, ChevronDown, ChevronRight, Building2, User, Mail, Phone,
  Globe, TrendingUp, Target, Zap, Eye, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart, Clock, Star, Flame, Sparkles, Download, MoreHorizontal,
  SlidersHorizontal, X, Activity, DollarSign, Users, Briefcase, MapPin, Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { generateLeadData, getPipelineSummary } from '../data/mockDatabase';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart as RPie, Pie, Cell, AreaChart, Area, CartesianGrid, Treemap } from 'recharts';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

const stageColors = { new: '#6366f1', contacted: '#3b82f6', qualified: '#14b8a6', proposal: '#f59e0b', negotiation: '#f97316', won: '#22c55e', lost: '#ef4444' };
const intentColors = { low: '#94a3b8', medium: '#f59e0b', high: '#f97316', surging: '#ef4444' };
const intentBg = { low: 'bg-slate-50 text-slate-600', medium: 'bg-yellow-50 text-yellow-700', high: 'bg-orange-50 text-orange-700', surging: 'bg-red-50 text-red-700' };
const bjColors = { awareness: '#8b5cf6', consideration: '#3b82f6', decision: '#f59e0b', purchase: '#22c55e' };

export const LeadManager = () => {
  const { language, businessData } = useApp();
  const [leads] = useState(() => generateLeadData());
  const [view, setView] = useState('pipeline'); // pipeline | table | analytics
  const [selectedLead, setSelectedLead] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [intentFilter, setIntentFilter] = useState('all');

  const filtered = useMemo(() => leads.filter(l => {
    if (stageFilter !== 'all' && l.stage !== stageFilter) return false;
    if (intentFilter !== 'all' && l.intent !== intentFilter) return false;
    if (searchTerm && !l.company.name.toLowerCase().includes(searchTerm.toLowerCase()) && !l.contact.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }), [leads, stageFilter, intentFilter, searchTerm]);

  const pipeline = useMemo(() => getPipelineSummary(leads), [leads]);
  const totalValue = leads.reduce((a, l) => a + l.dealValue, 0);
  const totalWeighted = leads.reduce((a, l) => a + l.weightedValue, 0);
  const avgScore = Math.round(leads.reduce((a, l) => a + l.combinedScore, 0) / leads.length);

  // Charts data
  const pipelineChartData = pipeline.stageOrder.filter(s => s !== 'lost').map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1), value: pipeline.stages[s].value, count: pipeline.stages[s].count, fill: stageColors[s]
  }));
  const intentDist = ['low','medium','high','surging'].map(i => ({ name: i, value: leads.filter(l => l.intent === i).length, fill: intentColors[i] }));
  const channelDist = {};
  leads.forEach(l => { channelDist[l.channel] = (channelDist[l.channel] || 0) + 1; });
  const channelData = Object.entries(channelDist).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  const bjDist = ['awareness','consideration','decision','purchase'].map(s => ({ name: s, value: leads.filter(l => l.buyerJourney === s).length, fill: bjColors[s] }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('leadManager', language)}</h1>
          <p className="text-sm text-navy-400 mt-0.5">{t('leadManagerDesc', language)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-[10px] font-semibold bg-navy-50 text-navy-600 rounded-lg hover:bg-navy-100 flex items-center gap-1">
            <Download className="w-3 h-3" /> {t('export', language)}
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { icon: Users, label: t('lmTotalLeads', language), value: leads.length, change: '+12%', color: 'text-blue-600' },
          { icon: DollarSign, label: t('lmPipelineValue', language), value: `₹${(totalValue/100000).toFixed(1)}L`, change: '+28%', color: 'text-teal-600' },
          { icon: Target, label: t('lmWeightedValue', language), value: `₹${(totalWeighted/100000).toFixed(1)}L`, change: '+18%', color: 'text-purple-600' },
          { icon: Zap, label: t('lmAvgScore', language), value: avgScore, change: null, color: 'text-orange-600' },
          { icon: Flame, label: t('lmSurgingIntent', language), value: leads.filter(l => l.intent === 'surging').length, change: 'Hot!', color: 'text-red-600' },
        ].map((kpi, i) => (
          <motion.div key={i} {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-4">
            <div className="flex items-center justify-between mb-1.5">
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              {kpi.change && <span className="text-[9px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">{kpi.change}</span>}
            </div>
            <p className="text-xl font-bold text-navy-900">{kpi.value}</p>
            <p className="text-[10px] text-navy-400 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* View Tabs + Filters */}
      <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-navy-100 flex items-center gap-4 flex-wrap">
          <div className="flex gap-1">
            {[{ k: 'pipeline', l: t('lmPipeline', language) }, { k: 'table', l: t('lmTable', language) }, { k: 'analytics', l: t('lmAnalyticsTab', language) }].map(v => (
              <button key={v.k} onClick={() => setView(v.k)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${view === v.k ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
                {v.l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-50 rounded-lg border border-navy-100 w-52">
            <Search className="w-3.5 h-3.5 text-navy-400" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder={t('lmSearchPlaceholder', language)} className="bg-transparent text-[11px] outline-none w-full text-navy-700 placeholder:text-navy-300" />
          </div>
          <button onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-1 px-3 py-1.5 bg-navy-50 text-navy-600 rounded-lg text-[11px] font-medium hover:bg-navy-100">
            <SlidersHorizontal className="w-3 h-3" /> {t('filters', language)}
          </button>
          {(stageFilter !== 'all' || intentFilter !== 'all') && (
            <button onClick={() => { setStageFilter('all'); setIntentFilter('all'); }}
              className="text-[10px] text-red-500 font-medium hover:text-red-700 flex items-center gap-0.5">
              <X className="w-3 h-3" /> {t('clear', language)}
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="px-4 py-3 border-b border-navy-100 bg-navy-50/50 flex gap-6 flex-wrap">
            <div>
              <span className="text-[9px] font-bold text-navy-500 uppercase mb-1 block">{t('lmStage', language)}</span>
              <div className="flex gap-1 flex-wrap">
                {['all','new','contacted','qualified','proposal','negotiation','won','lost'].map(s => (
                  <button key={s} onClick={() => setStageFilter(s)}
                    className={`px-2 py-0.5 rounded text-[9px] font-semibold capitalize ${stageFilter === s ? 'text-white' : 'bg-white text-navy-500 border border-navy-200'}`}
                    style={stageFilter === s ? { backgroundColor: stageColors[s] || '#1e2f52' } : {}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-navy-500 uppercase mb-1 block">{t('lmIntent', language)}</span>
              <div className="flex gap-1">
                {['all','low','medium','high','surging'].map(i => (
                  <button key={i} onClick={() => setIntentFilter(i)}
                    className={`px-2 py-0.5 rounded text-[9px] font-semibold capitalize ${intentFilter === i ? 'text-white' : 'bg-white text-navy-500 border border-navy-200'}`}
                    style={intentFilter === i ? { backgroundColor: intentColors[i] || '#1e2f52' } : {}}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PIPELINE VIEW ═══ */}
        {view === 'pipeline' && (
          <div className="p-4">
            {/* Funnel */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pipeline.stageOrder.map((stage, si) => {
                const stageLeads = filtered.filter(l => l.stage === stage);
                return (
                  <div key={stage} className="min-w-[200px] flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stageColors[stage] }} />
                        <span className="text-[11px] font-bold text-navy-700 capitalize">{stage}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-navy-600">{stageLeads.length}</span>
                        <span className="text-[9px] text-navy-400">₹{(pipeline.stages[stage].value/100000).toFixed(1)}L</span>
                      </div>
                    </div>
                    <div className="space-y-2 min-h-[100px]">
                      {stageLeads.map(lead => (
                        <motion.div key={lead.id} {...fade()} onClick={() => setSelectedLead(lead)}
                          className="bg-white rounded-lg border border-navy-100 p-2.5 cursor-pointer hover:border-teal-300 hover:shadow-sm transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-navy-800 truncate max-w-[140px]">{lead.company.name}</span>
                            <span className={`text-[8px] font-bold px-1 py-0.5 rounded capitalize ${intentBg[lead.intent]}`}>{lead.intent}</span>
                          </div>
                          <p className="text-[9px] text-navy-400 truncate">{lead.contact.name} • {lead.contact.title}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] font-bold text-navy-700">₹{(lead.dealValue/1000).toFixed(0)}K</span>
                            <div className="flex items-center gap-1">
                              <div className="w-10 bg-navy-100 rounded-full h-1"><div className="bg-teal-500 rounded-full h-1" style={{ width: `${lead.combinedScore}%` }} /></div>
                              <span className="text-[8px] font-bold text-navy-500">{lead.combinedScore}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ TABLE VIEW ═══ */}
        {view === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-50">
                <tr>
                  {[t('lmCompany', language), t('lmContact', language), t('lmStage', language), t('lmIntent', language), t('metricScore', language), t('lmDealValue', language), t('lmChannel', language), t('lmLastActivity', language)].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[9px] font-bold text-navy-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-navy-50/50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-navy-100 rounded-lg flex items-center justify-center"><Building2 className="w-3.5 h-3.5 text-navy-500" /></div>
                        <div>
                          <p className="text-[11px] font-bold text-navy-800">{lead.company.name}</p>
                          <p className="text-[9px] text-navy-400">{lead.company.industry} • {lead.company.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-[10px] font-semibold text-navy-700">{lead.contact.name}</p>
                      <p className="text-[9px] text-navy-400">{lead.contact.title}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded capitalize" style={{ backgroundColor: stageColors[lead.stage] }}>{lead.stage}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {lead.intent === 'surging' && <Flame className="w-3 h-3 text-red-500" />}
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${intentBg[lead.intent]}`}>{lead.intent}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 bg-navy-100 rounded-full h-1.5"><div className="rounded-full h-1.5" style={{ width: `${lead.combinedScore}%`, backgroundColor: lead.combinedScore > 70 ? '#22c55e' : lead.combinedScore > 40 ? '#f59e0b' : '#94a3b8' }} /></div>
                        <span className="text-[10px] font-bold text-navy-700">{lead.combinedScore}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-[10px] font-bold text-navy-700">₹{(lead.dealValue/1000).toFixed(0)}K</td>
                    <td className="px-3 py-2.5 text-[10px] text-navy-500">{lead.channel}</td>
                    <td className="px-3 py-2.5 text-[10px] text-navy-400">{lead.lastActivityDaysAgo}d ago</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ═══ ANALYTICS VIEW ═══ */}
        {view === 'analytics' && (
          <div className="p-5 space-y-5">
            {/* Revenue Intelligence */}
            <div className="grid lg:grid-cols-2 gap-4">
              <motion.div {...fade(0)} className="bg-white rounded-xl border border-navy-100 p-4">
                <h3 className="text-[12px] font-bold text-navy-800 mb-3 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-navy-500" /> {t('lmPipelineByStage', language)}
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={pipelineChartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#8da5cd' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8ecf3', fontSize: 10 }}
                      formatter={(v) => [`₹${(v/1000).toFixed(0)}K`, 'Value']} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {pipelineChartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div {...fade(1)} className="bg-white rounded-xl border border-navy-100 p-4">
                <h3 className="text-[12px] font-bold text-navy-800 mb-3 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-navy-500" /> {t('lmBuyerJourney', language)}
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RPie>
                    <Pie data={bjDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {bjDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 10 }} />
                  </RPie>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 mt-2">
                  {bjDist.map((b, i) => (
                    <div key={i} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.fill }} /><span className="text-[9px] text-navy-500 capitalize">{b.name}</span></div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Intent + Channels */}
            <div className="grid lg:grid-cols-3 gap-4">
              <motion.div {...fade(2)} className="bg-white rounded-xl border border-navy-100 p-4">
                <h3 className="text-[12px] font-bold text-navy-800 mb-3 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" /> {t('lmIntentDist', language)}
                </h3>
                <div className="space-y-2">
                  {intentDist.map((id, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] text-navy-600 capitalize w-14">{id.name}</span>
                      <div className="flex-1 bg-navy-50 rounded-full h-3">
                        <div className="rounded-full h-3 flex items-center justify-end pr-1 transition-all" style={{ width: `${(id.value / leads.length) * 100}%`, backgroundColor: id.fill }}>
                          <span className="text-[7px] font-bold text-white">{id.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div {...fade(3)} className="lg:col-span-2 bg-white rounded-xl border border-navy-100 p-4">
                <h3 className="text-[12px] font-bold text-navy-800 mb-3 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-navy-500" /> {t('lmLeadSources', language)}
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={channelData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#4a6490' }} width={85} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 10 }} />
                    <Bar dataKey="value" fill="#1e2f52" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Predictive Insights */}
            <motion.div {...fade(4)} className="bg-gradient-to-r from-navy-700 to-navy-800 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold">{t('lmPredictiveTitle', language)}</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-[9px] text-navy-200 mb-1">{t('lmPredictedClose', language)}</p>
                  <p className="text-2xl font-bold text-teal-400">34%</p>
                  <p className="text-[9px] text-navy-300 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3 text-teal-400" /> {t('lmCloseVsLast', language)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-[9px] text-navy-200 mb-1">{t('lmExpectedRevenue', language)}</p>
                  <p className="text-2xl font-bold">₹{(totalWeighted/100000).toFixed(1)}L</p>
                  <p className="text-[9px] text-navy-300 mt-1">{t('lmRevenueBase', language)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-[9px] text-navy-200 mb-1">{t('lmAvgSalesCycle', language)}</p>
                  <p className="text-2xl font-bold">42 <span className="text-sm font-normal text-navy-300">{t('days', language)}</span></p>
                  <p className="text-[9px] text-navy-300 mt-1 flex items-center gap-1"><ArrowDownRight className="w-3 h-3 text-teal-400" /> {t('lmCycleImprove', language)}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* ═══ LEAD DETAIL PANEL ═══ */}
      {selectedLead && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] flex items-stretch justify-end bg-navy-950/40 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}>
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-navy-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center"><Building2 className="w-5 h-5 text-navy-600" /></div>
                <div>
                  <h3 className="text-sm font-bold text-navy-800">{selectedLead.company.name}</h3>
                  <p className="text-[10px] text-navy-400">{selectedLead.company.industry} • {selectedLead.company.city}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg hover:bg-navy-50"><X className="w-4 h-4 text-navy-400" /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Scores */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-navy-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-navy-800">{selectedLead.combinedScore}</p>
                  <p className="text-[9px] text-navy-500">{t('lmCombinedScore', language)}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-orange-600">{selectedLead.intentScore}</p>
                  <p className="text-[9px] text-navy-500">{t('lmIntentScore', language)}</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-teal-600">{selectedLead.fitScore}</p>
                  <p className="text-[9px] text-navy-500">{t('lmFitScore', language)}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl border border-navy-100 p-4">
                <h4 className="text-[11px] font-bold text-navy-700 mb-2 flex items-center gap-1"><User className="w-3.5 h-3.5" /> {t('lmContact', language)}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><User className="w-3 h-3 text-navy-300" /><span className="text-[11px] text-navy-700">{selectedLead.contact.name} • {selectedLead.contact.title}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-navy-300" /><span className="text-[11px] text-navy-600">{selectedLead.contact.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-navy-300" /><span className="text-[11px] text-navy-600">{selectedLead.contact.phone}</span></div>
                </div>
              </div>

              {/* Deal Info */}
              <div className="bg-white rounded-xl border border-navy-100 p-4">
                <h4 className="text-[11px] font-bold text-navy-700 mb-2 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {t('lmDeal', language)}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-navy-50 rounded-lg p-2"><p className="text-[8px] text-navy-400">{t('lmValue', language)}</p><p className="text-[12px] font-bold text-navy-800">₹{(selectedLead.dealValue/1000).toFixed(0)}K</p></div>
                  <div className="bg-navy-50 rounded-lg p-2"><p className="text-[8px] text-navy-400">{t('lmProbability', language)}</p><p className="text-[12px] font-bold text-navy-800">{selectedLead.probability}%</p></div>
                  <div className="bg-navy-50 rounded-lg p-2"><p className="text-[8px] text-navy-400">{t('lmStage', language)}</p><p className="text-[12px] font-bold capitalize" style={{ color: stageColors[selectedLead.stage] }}>{selectedLead.stage}</p></div>
                  <div className="bg-navy-50 rounded-lg p-2"><p className="text-[8px] text-navy-400">{t('lmChannel', language)}</p><p className="text-[12px] font-bold text-navy-800">{selectedLead.channel}</p></div>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-xl border border-navy-100 p-4">
                <h4 className="text-[11px] font-bold text-navy-700 mb-2 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {t('lmCompany', language)}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px]"><span className="text-navy-400">{t('lmEmployees', language)}</span> <span className="font-semibold text-navy-700">{selectedLead.company.employees}</span></div>
                  <div className="text-[10px]"><span className="text-navy-400">{t('lmRevenue', language)}</span> <span className="font-semibold text-navy-700">{selectedLead.company.revenue}</span></div>
                  <div className="text-[10px]"><span className="text-navy-400">{t('lmCity', language)}</span> <span className="font-semibold text-navy-700">{selectedLead.company.city}</span></div>
                  <div className="text-[10px]"><span className="text-navy-400">{t('lmDomain', language)}</span> <span className="font-semibold text-navy-700">{selectedLead.company.domain}</span></div>
                </div>
                <div className="mt-2">
                  <span className="text-[9px] font-bold text-navy-500">{t('lmTechStack', language)}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedLead.company.tech.map((t, i) => (
                      <span key={i} className="text-[8px] bg-navy-50 text-navy-600 px-1.5 py-0.5 rounded font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Intent Signals */}
              <div className="bg-white rounded-xl border border-navy-100 p-4">
                <h4 className="text-[11px] font-bold text-navy-700 mb-2 flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> {t('lmIntentSignals', language)}</h4>
                <div className="space-y-1.5">
                  {selectedLead.signals.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]"><Zap className="w-3 h-3 text-orange-400" /><span className="text-navy-600">{s}</span></div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-xl border border-navy-100 p-4">
                <h4 className="text-[11px] font-bold text-navy-700 mb-2 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t('lmRecentActivity', language)}</h4>
                <div className="space-y-2">
                  {selectedLead.activities.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-navy-300 rounded-full mt-1.5 flex-shrink-0" />
                      <div><p className="text-[10px] text-navy-700">{a.label}</p><p className="text-[8px] text-navy-400">{a.time}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

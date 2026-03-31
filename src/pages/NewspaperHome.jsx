import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, Eye, Users, Star, Target,
  BarChart3, Globe, ArrowRight, Zap, Cloud, CloudRain, Sun,
  Newspaper, Quote, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { competitorDatabase } from '../data/mockDatabase';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.4 }
});

/* ─── Tiny sparkline component ─── */
const Sparkline = ({ data, color = '#0d9488' }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = 32;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
};

/* ─── Newspaper date formatter ─── */
const fmtDate = () => {
  const d = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export const NewspaperHome = () => {
  const navigate = useNavigate();
  const { language, businessData, analyticsData, recommendations } = useApp();

  const score = analyticsData?.digitalPresence?.overall || 0;
  const traffic = analyticsData?.traffic;
  const social = analyticsData?.socialMedia;
  const geo = analyticsData?.geoInsights;

  /* derived data */
  const totalFollowers = useMemo(() =>
    social?.platforms?.reduce((s, p) => s + p.followers, 0) || 0, [social]);

  const monthlyVisits = useMemo(() =>
    traffic?.monthly?.[traffic.monthly.length - 1]?.visits || 0, [traffic]);

  const monthlyLeads = useMemo(() =>
    traffic?.monthly?.[traffic.monthly.length - 1]?.leads || 0, [traffic]);

  const convRate = monthlyVisits ? ((monthlyLeads / monthlyVisits) * 100).toFixed(1) : '0';

  const trafficTrend = useMemo(() =>
    traffic?.monthly?.map(m => m.visits) || [], [traffic]);

  const growthPct = useMemo(() => {
    if (!traffic?.monthly || traffic.monthly.length < 2) return 0;
    const prev = traffic.monthly[traffic.monthly.length - 2].visits;
    return prev ? (((monthlyVisits - prev) / prev) * 100).toFixed(0) : 0;
  }, [traffic, monthlyVisits]);

  const competitors = useMemo(() => {
    const cat = businessData?.category || 'restaurant';
    return competitorDatabase[cat] || competitorDatabase.restaurant;
  }, [businessData]);

  const myPosition = useMemo(() => {
    const sorted = [...competitors].sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex(c => c.score <= score);
    return idx === -1 ? sorted.length + 1 : idx + 1;
  }, [competitors, score]);

  const leader = competitors[0];

  /* weather metaphor */
  const weatherIcon = score >= 70 ? Sun : score >= 40 ? Cloud : CloudRain;
  const weatherLabel = score >= 70 ? t('nhWeatherSunny', language)
    : score >= 40 ? t('nhWeatherCloudy', language)
    : t('nhWeatherStormy', language);
  const weatherColor = score >= 70 ? 'text-amber-500' : score >= 40 ? 'text-slate-400' : 'text-red-400';

  const growthTrend = growthPct > 5 ? t('nhGrowthUp', language) : growthPct > 0 ? t('nhGrowthFlat', language) : t('nhGrowthDown', language);

  const topActions = useMemo(() =>
    (recommendations || []).slice(0, 4), [recommendations]);

  const pipelineValue = monthlyLeads * 2500;

  const sources = traffic?.sources || [];
  const direct = sources.find(s => s.name === 'Direct')?.value || 0;
  const search = sources.find(s => s.name === 'Search')?.value || 0;
  const socialSrc = sources.find(s => s.name === 'Social')?.value || 0;
  const referral = sources.find(s => s.name === 'Referral')?.value || 0;

  const bizName = businessData?.name || 'Your Business';
  const edition = `${t('nhVol', language)} 1 • ${t('nhIssue', language)} ${new Date().getDate()}`;

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Matte texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Cpath d=\'M5 0h1L0 5V4zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="max-w-[1100px] mx-auto px-3 sm:px-5 py-4 sm:py-6 relative z-10">

        {/* ─── MASTHEAD ─── */}
        <motion.header {...fade(0)} className="text-center border-b-4 border-double border-stone-800 pb-3 mb-1">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] tracking-[0.2em] text-stone-500 uppercase font-medium mb-1">
            <span>{edition}</span>
            <span>{fmtDate()}</span>
            <span>{t('nhEdition', language)}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-none mb-1"
            style={{ fontFamily: "'Playfair Display', 'Georgia', 'Times New Roman', serif" }}>
            {t('nhMasthead', language)}
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-stone-500 font-medium">
            {t('nhTagline', language)} — {bizName}
          </p>
        </motion.header>

        {/* thin rule */}
        <div className="border-b border-stone-300 mb-3" />

        {/* ─── BENTO GRID ─── */}
        <div className="grid grid-cols-12 gap-3 auto-rows-min">

          {/* ═══ LEAD STORY — Digital Score ═══ */}
          <motion.article {...fade(1)}
            className="col-span-12 lg:col-span-8 bg-[#faf7f2] border border-stone-200 p-4 sm:p-5 cursor-pointer hover:shadow-md transition-shadow group"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/dashboard/analytics')}>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-700 text-white text-[8px] sm:text-[9px] font-bold tracking-wider px-2 py-0.5 uppercase">{t('nhBreaking', language)}</span>
              <span className="text-[9px] text-stone-400 tracking-wide uppercase">{t('nhHeadlineDigital', language)}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 leading-tight mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {t('nhScoreHeadline', language).replace('{score}', score)}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Score gauge */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e7e5e4" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none"
                      stroke={score >= 70 ? '#059669' : score >= 40 ? '#d97706' : '#dc2626'}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(score / 100) * 264} 264`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black text-stone-900">{score}</span>
                    <span className="text-[9px] text-stone-400 tracking-wide">/100</span>
                  </div>
                </div>
              </div>
              {/* body text */}
              <div className="flex-1">
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed mb-3"
                  style={{ fontFamily: "'Georgia', serif", lineHeight: '1.7' }}>
                  {score < 40 ? t('nhScoreLow', language) : score < 70 ? t('nhScoreMid', language) : t('nhScoreHigh', language)}
                </p>
                {/* mini KPI strip */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    { label: 'Website', val: analyticsData?.digitalPresence?.website || 0 },
                    { label: 'Social', val: analyticsData?.digitalPresence?.socialMedia || 0 },
                    { label: 'Search', val: analyticsData?.digitalPresence?.searchVisibility || 0 },
                    { label: 'Reviews', val: analyticsData?.digitalPresence?.onlineReviews || 0 },
                  ].map((k, i) => (
                    <div key={i} className="text-center">
                      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${k.val}%`, backgroundColor: k.val >= 60 ? '#059669' : k.val >= 30 ? '#d97706' : '#dc2626' }} />
                      </div>
                      <span className="text-[9px] text-stone-500 font-medium">{k.label}</span>
                      <span className="text-[10px] text-stone-700 font-bold ml-1">{k.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-teal-700 font-medium mt-3 group-hover:underline">{t('nhReadMore', language)}</p>
              </div>
            </div>
          </motion.article>

          {/* ═══ WEATHER FORECAST (sidebar) ═══ */}
          <motion.aside {...fade(2)}
            className="col-span-12 lg:col-span-4 bg-[#faf7f2] border border-stone-200 p-4 flex flex-col justify-between"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}>
            <div>
              <span className="text-[9px] tracking-wider uppercase text-stone-400 font-medium">{t('nhHeadlineWeather', language)}</span>
              <div className="flex items-center gap-3 mt-3 mb-3">
                {(() => {
                  const WIcon = weatherIcon;
                  return <WIcon className={`w-12 h-12 sm:w-14 sm:h-14 ${weatherColor}`} strokeWidth={1.5} />;
                })()}
                <div>
                  <p className="font-serif text-sm sm:text-base font-bold text-stone-800" style={{ fontFamily: "Georgia, serif" }}>
                    {weatherLabel}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-[11px] text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>Digital Score</span>
                  <span className="font-bold text-stone-800">{score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Traffic Trend</span>
                  <span className="flex items-center gap-1 font-bold text-stone-800">
                    {growthPct > 0 ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : growthPct < 0 ? <TrendingDown className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3 text-stone-400" />}
                    {growthPct}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Market Rank</span>
                  <span className="font-bold text-stone-800">#{myPosition} of {competitors.length + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Leads This Month</span>
                  <span className="font-bold text-stone-800">{monthlyLeads}</span>
                </div>
              </div>
            </div>
            {/* Quote */}
            <div className="mt-4 pt-3 border-t border-stone-200">
              <div className="flex items-start gap-2">
                <Quote className="w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-stone-500 italic leading-relaxed">{t('nhQuote', language)}</p>
                  <p className="text-[8px] text-stone-400 mt-1 uppercase tracking-wider">{t('nhQuoteOfDay', language)}</p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ═══ SOCIAL MEDIA DISPATCH ═══ */}
          <motion.article {...fade(3)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#faf7f2] border border-stone-200 p-4 cursor-pointer hover:shadow-md transition-shadow group"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/dashboard/analytics')}>
            <span className="text-[9px] tracking-wider uppercase text-stone-400 font-medium">{t('nhHeadlineSocial', language)}</span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {t('nhSocialHeadline', language).replace('{total}', totalFollowers.toLocaleString())}
            </h3>
            <div className="space-y-1.5 mb-3">
              {social?.platforms?.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-600">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-800 font-semibold">{p.followers.toLocaleString()}</span>
                    <span className="text-stone-400">|</span>
                    <span className="text-teal-700 font-medium">{p.engagement}%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-teal-700 font-medium group-hover:underline">{t('nhReadMore', language)}</p>
          </motion.article>

          {/* ═══ COMPETITOR INTELLIGENCE ═══ */}
          <motion.article {...fade(4)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#faf7f2] border border-stone-200 p-4 cursor-pointer hover:shadow-md transition-shadow group"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/dashboard/analytics')}>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-stone-800 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 uppercase">{t('nhExclusive', language)}</span>
              <span className="text-[9px] tracking-wider uppercase text-stone-400 font-medium">{t('nhHeadlineCompetitor', language)}</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {t('nhCompetitorHeadline', language).replace('{count}', competitors.length)}
            </h3>
            {/* Top 5 leaderboard */}
            <div className="space-y-1 mb-2">
              {competitors.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  <span className="w-4 text-stone-400 font-bold text-right">{i + 1}.</span>
                  <span className="flex-1 text-stone-700 truncate">{c.name}</span>
                  <div className="w-16 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-stone-600 rounded-full" style={{ width: `${c.score}%` }} />
                  </div>
                  <span className="text-stone-800 font-bold w-6 text-right">{c.score}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-stone-500 border-t border-stone-200 pt-2">
              {t('yourPosition', language)}: <span className="font-bold text-stone-900">#{myPosition}</span> | {t('adScore', language)} <span className="font-bold text-stone-900">{score}</span>
            </div>
            <p className="text-[10px] text-teal-700 font-medium mt-2 group-hover:underline">{t('nhReadMore', language)}</p>
          </motion.article>

          {/* ═══ TRAFFIC & ANALYTICS ═══ */}
          <motion.article {...fade(5)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#faf7f2] border border-stone-200 p-4 cursor-pointer hover:shadow-md transition-shadow group"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/dashboard/analytics')}>
            <span className="text-[9px] tracking-wider uppercase text-stone-400 font-medium">{t('nhHeadlineTraffic', language)}</span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {t('nhTrafficHeadline', language).replace('{visits}', monthlyVisits.toLocaleString())}
            </h3>
            {/* Sparkline */}
            <div className="flex items-center gap-3 mb-3">
              <Sparkline data={trafficTrend} />
              <div className="flex items-center gap-1 text-[11px]">
                {growthPct > 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                <span className={`font-bold ${growthPct > 0 ? 'text-emerald-700' : 'text-red-600'}`}>{growthPct}%</span>
                <span className="text-stone-400">MoM</span>
              </div>
            </div>
            {/* Source breakdown */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] border-t border-stone-200 pt-2">
              <div className="flex justify-between"><span className="text-stone-500">Direct</span><span className="font-bold text-stone-800">{direct}%</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Search</span><span className="font-bold text-stone-800">{search}%</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Social</span><span className="font-bold text-stone-800">{socialSrc}%</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Referral</span><span className="font-bold text-stone-800">{referral}%</span></div>
            </div>
            <p className="text-[10px] text-teal-700 font-medium mt-3 group-hover:underline">{t('nhReadMore', language)}</p>
          </motion.article>

          {/* ═══ LEAD PIPELINE BULLETIN ═══ */}
          <motion.article {...fade(6)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#faf7f2] border border-stone-200 p-4 cursor-pointer hover:shadow-md transition-shadow group"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/dashboard/leads')}>
            <span className="text-[9px] tracking-wider uppercase text-stone-400 font-medium">{t('nhHeadlineLeads', language)}</span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {t('nhLeadsHeadline', language).replace('{leads}', monthlyLeads)}
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { icon: Eye, label: t('monthlyVisits', language), val: monthlyVisits.toLocaleString() },
                { icon: Target, label: t('adConversionRate', language), val: `${convRate}%` },
                { icon: Users, label: t('leadsGenerated', language), val: monthlyLeads },
                { icon: BarChart3, label: 'Pipeline', val: `₹${(pipelineValue / 1000).toFixed(0)}K` },
              ].map((item, i) => (
                <div key={i} className="bg-stone-50 border border-stone-100 rounded px-2 py-1.5">
                  <item.icon className="w-3 h-3 text-stone-400 mb-0.5" />
                  <p className="text-[10px] text-stone-500">{item.label}</p>
                  <p className="text-sm font-bold text-stone-900">{item.val}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-teal-700 font-medium group-hover:underline">{t('nhReadMore', language)}</p>
          </motion.article>

          {/* ═══ GROWTH FORECAST ═══ */}
          <motion.article {...fade(7)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#faf7f2] border border-stone-200 p-4 cursor-pointer hover:shadow-md transition-shadow group"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/dashboard/journey')}>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-700 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 uppercase">{t('nhAnalysis', language)}</span>
              <span className="text-[9px] tracking-wider uppercase text-stone-400 font-medium">{t('nhHeadlineGrowth', language)}</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {t('nhGrowthHeadline', language).replace('{trend}', growthTrend)}
            </h3>
            {/* 6-month bar chart */}
            <div className="flex items-end gap-1 h-16 mb-2">
              {traffic?.monthly?.map((m, i) => {
                const maxV = Math.max(...traffic.monthly.map(x => x.visits)) || 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className="w-full bg-stone-300 rounded-t transition-all"
                      style={{
                        height: `${(m.visits / maxV) * 100}%`,
                        backgroundColor: i === traffic.monthly.length - 1 ? '#0d9488' : '#d6d3d1',
                        minHeight: 2
                      }}
                    />
                    <span className="text-[8px] text-stone-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              {t('nhGrowthBody', language)
                .replace('{pct}', growthPct)
                .replace('{projected}', Math.round(monthlyVisits * 1.3).toLocaleString())}
            </p>
            <p className="text-[10px] text-teal-700 font-medium mt-2 group-hover:underline">{t('nhReadMore', language)}</p>
          </motion.article>

          {/* ═══ EDITOR'S ACTION ITEMS (full width) ═══ */}
          <motion.article {...fade(8)}
            className="col-span-12 bg-[#faf7f2] border border-stone-200 p-4 sm:p-5"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-600 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 uppercase">{t('nhEditorial', language)}</span>
              <span className="font-serif text-sm sm:text-base font-bold text-stone-900" style={{ fontFamily: "Georgia, serif" }}>
                {t('nhHeadlineAction', language)}
              </span>
            </div>
            {topActions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {topActions.map((rec, i) => {
                  const title = typeof rec.title === 'object' ? (rec.title[language] || rec.title.en) : rec.title;
                  const desc = typeof rec.description === 'object' ? (rec.description[language] || rec.description.en) : rec.description;
                  const priorityColors = {
                    critical: 'bg-red-100 text-red-700 border-red-200',
                    high: 'bg-amber-50 text-amber-700 border-amber-200',
                    medium: 'bg-blue-50 text-blue-700 border-blue-200',
                    low: 'bg-stone-50 text-stone-600 border-stone-200',
                  };
                  const pCls = priorityColors[rec.priority] || priorityColors.medium;
                  return (
                    <div key={i} className={`border rounded-lg p-3 ${pCls}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {rec.priority === 'critical' ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span className="text-[9px] font-bold uppercase tracking-wider">{rec.priority}</span>
                      </div>
                      <h4 className="text-[12px] font-bold leading-tight mb-1">{title}</h4>
                      <p className="text-[10px] leading-relaxed opacity-80 line-clamp-2">{desc}</p>
                      {rec.impact && (
                        <div className="flex items-center gap-1 mt-2 text-[9px] opacity-70">
                          <Zap className="w-3 h-3" />
                          <span>{rec.impact}</span>
                        </div>
                      )}
                      {rec.timeline && (
                        <div className="flex items-center gap-1 mt-1 text-[9px] opacity-70">
                          <Clock className="w-3 h-3" />
                          <span>{rec.timeline}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-stone-500 italic">{t('nhActionItems', language)}: No pending items. Your business is on track!</p>
            )}
          </motion.article>

          {/* ═══ MARKET OPPORTUNITY GAZETTE ═══ */}
          <motion.article {...fade(9)}
            className="col-span-12 lg:col-span-8 bg-[#faf7f2] border border-stone-200 p-4 cursor-pointer hover:shadow-md transition-shadow group"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}
            onClick={() => navigate('/dashboard/analytics')}>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-700 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 uppercase">{t('nhSpecialReport', language)}</span>
              <span className="text-[9px] tracking-wider uppercase text-stone-400 font-medium">{t('nhHeadlineMarket', language)}</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {t('nhMarketHeadline', language).replace('{value}', (pipelineValue * 3).toLocaleString())}
            </h3>
            <div className="columns-1 sm:columns-2 gap-4">
              <p className="text-[11px] text-stone-600 leading-relaxed mb-2" style={{ fontFamily: "Georgia, serif" }}>
                {t('nhMarketBody', language)}
              </p>
              {/* Market metrics grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t('adMktOppUnclaimed', language), val: `${Math.round(monthlyVisits * 2.5).toLocaleString()}+`, icon: Globe },
                  { label: t('adMktOppReviewGap', language), val: `${leader ? leader.reviews - (monthlyLeads * 5) : 200}+`, icon: Star },
                  { label: t('adMktOppSocialReach', language), val: `${Math.round(totalFollowers * 3.2).toLocaleString()}`, icon: Users },
                  { label: t('adMktOppLeadPool', language), val: `${Math.round(monthlyLeads * 4)}`, icon: Target },
                ].map((m, i) => (
                  <div key={i} className="bg-stone-50 border border-stone-100 rounded px-2 py-1.5">
                    <m.icon className="w-3 h-3 text-stone-400 mb-0.5" />
                    <p className="text-[10px] text-stone-500">{m.label}</p>
                    <p className="text-sm font-bold text-stone-900">{m.val}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-teal-700 font-medium mt-3 group-hover:underline">{t('nhReadMore', language)}</p>
          </motion.article>

          {/* ═══ CUSTOMER VOICE (sidebar) ═══ */}
          <motion.aside {...fade(10)}
            className="col-span-12 lg:col-span-4 bg-[#faf7f2] border border-stone-200 p-4"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}>
            <span className="text-[9px] tracking-wider uppercase text-stone-400 font-medium">{t('nhHeadlineReviews', language)}</span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 mt-1 mb-3"
              style={{ fontFamily: "Georgia, serif" }}>
              {t('nhReviewsHeadline', language).replace('{score}', analyticsData?.digitalPresence?.onlineReviews || 0)}
            </h3>
            <p className="text-[11px] text-stone-600 leading-relaxed mb-3" style={{ fontFamily: "Georgia, serif" }}>
              {t('nhReviewsBody', language)}
            </p>
            {/* Review score visual */}
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map(s => (
                <Star key={s}
                  className={`w-4 h-4 ${s <= Math.round((analyticsData?.digitalPresence?.onlineReviews || 0) / 20) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
              ))}
              <span className="text-[11px] text-stone-500 ml-1">{((analyticsData?.digitalPresence?.onlineReviews || 0) / 20).toFixed(1)}/5</span>
            </div>
            {/* Geo insights */}
            {geo?.topCities && (
              <div className="border-t border-stone-200 pt-3">
                <p className="text-[9px] uppercase tracking-wider text-stone-400 mb-2">{t('geoInsights', language)}</p>
                {geo.topCities.slice(0, 3).map((city, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-stone-600">{city.city}</span>
                    <span className="font-bold text-stone-800">{city.percentage}% • {city.leads} leads</span>
                  </div>
                ))}
              </div>
            )}
          </motion.aside>

          {/* ═══ CLASSIFIED ADS + FOOTER ═══ */}
          <motion.footer {...fade(11)} className="col-span-12 border-t-2 border-stone-800 pt-3 mt-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-stone-400">
              <div className="flex items-center gap-2">
                <Newspaper className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider font-medium">{t('nhMasthead', language)}</span>
              </div>
              <span>{t('nhPrintDate', language)}: {fmtDate()}</span>
              <span className="italic">{t('nhClassifiedDesc', language)}</span>
            </div>
          </motion.footer>

        </div>
      </div>
    </div>
  );
};

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Minus, Eye, Users, Star, Target,
  BarChart3, Globe, Zap, Cloud, CloudRain, Sun,
  Newspaper, Quote, AlertTriangle, CheckCircle2, Clock,
  Bot, MessageSquare, Calendar, Play,
  MapPin, DollarSign, PieChart,
  Camera, Share2, Briefcase, MessageCircle, ChevronRight,
  Shield, Award, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { competitorDatabase } from '../data/mockDatabase';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.4 }
});

/* --- Tiny sparkline --- */
const Sparkline = ({ data, color = '#0d9488', h = 32, w = 120 }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return <svg width={w} height={h} className="inline-block"><polyline fill="none" stroke={color} strokeWidth="1.5" points={points} /></svg>;
};

/* --- Mini bar chart --- */
const MiniBarChart = ({ data, color = '#0d9488', h = 40 }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="flex items-end gap-1" style={{ height: h }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="w-full rounded-t transition-all" style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, minHeight: 2 }} />
          <span className="text-[7px] text-navy-300">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/* --- Donut chart --- */
const DonutChart = ({ segments, size = 80 }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let cumulative = 0;
  const r = 34, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className="transform -rotate-90">
      {segments.map((seg, i) => {
        const offset = (cumulative / total) * c;
        const len = (seg.value / total) * c;
        cumulative += seg.value;
        return <circle key={i} cx="40" cy="40" r={r} fill="none" stroke={seg.color} strokeWidth="8" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
      })}
    </svg>
  );
};

/* --- Date formatter --- */
const fmtDate = () => {
  const d = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

/* --- Platform icon mapper --- */
const PlatformIcon = ({ name, className }) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('instagram')) return <Camera className={className} />;
  if (n.includes('facebook')) return <Share2 className={className} />;
  if (n.includes('linkedin')) return <Briefcase className={className} />;
  return <MessageCircle className={className} />;
};

export const NewspaperHome = () => {
  const navigate = useNavigate();
  const { language, businessData, analyticsData, recommendations, subscription, workflows, liveActivities, growthProgress, chatHistory, onboardingTasks } = useApp();

  const score = analyticsData?.digitalPresence?.overall || 0;
  const traffic = analyticsData?.traffic;
  const social = analyticsData?.socialMedia;
  const geo = analyticsData?.geoInsights;

  const totalFollowers = useMemo(() => social?.platforms?.reduce((s, p) => s + p.followers, 0) || 0, [social]);
  const totalPosts = useMemo(() => social?.platforms?.reduce((s, p) => s + (p.posts || 0), 0) || 0, [social]);
  const monthlyVisits = useMemo(() => traffic?.monthly?.[traffic.monthly.length - 1]?.visits || 0, [traffic]);
  const monthlyLeads = useMemo(() => traffic?.monthly?.[traffic.monthly.length - 1]?.leads || 0, [traffic]);
  const convRate = monthlyVisits ? ((monthlyLeads / monthlyVisits) * 100).toFixed(1) : '0';
  const trafficTrend = useMemo(() => traffic?.monthly?.map(m => m.visits) || [], [traffic]);

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

  const weatherIcon = score >= 70 ? Sun : score >= 40 ? Cloud : CloudRain;
  const weatherLabel = score >= 70 ? 'All Clear' : score >= 40 ? 'Partly Cloudy' : 'Needs Attention';
  const weatherColor = score >= 70 ? 'text-teal-500' : score >= 40 ? 'text-navy-400' : 'text-red-400';

  const growthTrend = growthPct > 5 ? 'Rising' : growthPct > 0 ? 'Steady' : 'Falling';

  const topActions = useMemo(() => (recommendations || []).slice(0, 4), [recommendations]);
  const pipelineValue = monthlyLeads * 2500;

  const sources = traffic?.sources || [];
  const direct = sources.find(s => s.name === 'Direct')?.value || 0;
  const search = sources.find(s => s.name === 'Search')?.value || 0;
  const socialSrc = sources.find(s => s.name === 'Social')?.value || 0;
  const referral = sources.find(s => s.name === 'Referral')?.value || 0;

  const estimatedRevenue = monthlyLeads * 2500;
  const subscriptionCost = subscription?.price ? subscription.price / 100 : 14999;
  const roi = subscriptionCost > 0 ? ((estimatedRevenue - subscriptionCost) / subscriptionCost * 100).toFixed(0) : 0;
  const customerValue = monthlyLeads > 0 ? Math.round(estimatedRevenue / monthlyLeads) : 0;
  const estimatedCustomers = Math.round(monthlyLeads * 0.25);

  const weeklyGrowth = social?.growth || [];
  const weeklyGrowthDelta = weeklyGrowth.length >= 2 ? weeklyGrowth[weeklyGrowth.length - 1].followers - weeklyGrowth[0].followers : 0;

  const radius = geo?.radius || {};

  const activeWorkflows = workflows?.filter(w => w.status === 'running') || [];
  const completedWorkflows = workflows?.filter(w => w.status === 'completed') || [];

  const recentChats = (chatHistory || []).slice(0, 3);

  const bestTimes = useMemo(() => [
    { day: 'Mon', time: '10 AM', engagement: 85 },
    { day: 'Wed', time: '2 PM', engagement: 92 },
    { day: 'Fri', time: '6 PM', engagement: 78 },
    { day: 'Sat', time: '11 AM', engagement: 95 },
  ], []);

  const upcomingContent = useMemo(() => [
    { type: 'Instagram', title: 'Product showcase reel', date: 'Today, 6 PM', status: 'scheduled' },
    { type: 'Facebook', title: 'Customer testimonial post', date: 'Tomorrow, 10 AM', status: 'draft' },
    { type: 'LinkedIn', title: 'Business milestone update', date: 'Wed, 2 PM', status: 'draft' },
    { type: 'Instagram', title: 'Behind the scenes story', date: 'Thu, 5 PM', status: 'idea' },
  ], []);

  const siteHealth = useMemo(() => ({
    uptime: 99.7,
    speed: 2.3,
    mobileScore: score >= 50 ? 78 : 45,
    seoScore: analyticsData?.digitalPresence?.searchVisibility || 0,
  }), [score, analyticsData]);

  const bizName = businessData?.name || 'Your Business';
  const edition = `Vol. 1 \u2022 Issue ${new Date().getDate()}`;

  return (
    <div className="min-h-screen bg-navy-50">
      <div className="max-w-[1100px] mx-auto px-3 sm:px-5 py-4 sm:py-6">

        {/* MASTHEAD */}
        <motion.header {...fade(0)} className="text-center border-b-[3px] border-double border-navy-800 pb-3 mb-1">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] tracking-[0.2em] text-navy-400 uppercase font-medium mb-1">
            <span>{edition}</span>
            <span>{fmtDate()}</span>
            <span>Command Center</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-navy-900 tracking-tight leading-none mb-1"
            style={{ fontFamily: "'Playfair Display', 'Georgia', 'Times New Roman', serif" }}>
            Business Daily
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-navy-400 font-medium">
            Premium Growth Report &mdash; {bizName}
          </p>
        </motion.header>

        <div className="border-b border-navy-200 mb-3" />

        {/* BENTO GRID */}
        <div className="grid grid-cols-12 gap-3 auto-rows-min">

          {/* 1. LEAD STORY — Digital Score */}
          <motion.article {...fade(1)}
            className="col-span-12 lg:col-span-8 bg-white border border-navy-100 rounded-xl p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/analytics')}>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-navy-700 text-white text-[8px] sm:text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">Top Story</span>
              <span className="text-[9px] text-navy-400 tracking-wide uppercase">Online Presence</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-navy-900 leading-tight mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Your Digital Score is {score} out of 100
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e8ecf3" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none"
                      stroke={score >= 70 ? '#0d9488' : score >= 40 ? '#d97706' : '#dc2626'}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(score / 100) * 264} 264`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black text-navy-900">{score}</span>
                    <span className="text-[9px] text-navy-400 tracking-wide">/100</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-navy-600 leading-relaxed mb-3"
                  style={{ fontFamily: "'Georgia', serif", lineHeight: '1.7' }}>
                  {score < 40
                    ? "Your online presence needs work. Most customers search online before visiting a shop \u2014 let's make sure they find you."
                    : score < 70
                    ? "Good start! Your business is showing up online but there's room to grow. A few changes can bring many more customers."
                    : 'Excellent! Your business is doing great online. Keep it up and stay ahead of your competitors.'}
                </p>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    { label: 'Website', val: analyticsData?.digitalPresence?.website || 0 },
                    { label: 'Social', val: analyticsData?.digitalPresence?.socialMedia || 0 },
                    { label: 'Search', val: analyticsData?.digitalPresence?.searchVisibility || 0 },
                    { label: 'Reviews', val: analyticsData?.digitalPresence?.onlineReviews || 0 },
                  ].map((k, i) => (
                    <div key={i} className="text-center">
                      <div className="h-1.5 bg-navy-100 rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${k.val}%`, backgroundColor: k.val >= 60 ? '#0d9488' : k.val >= 30 ? '#d97706' : '#dc2626' }} />
                      </div>
                      <span className="text-[9px] text-navy-400 font-medium">{k.label}</span>
                      <span className="text-[10px] text-navy-700 font-bold ml-1">{k.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-teal-600 font-medium mt-3 group-hover:underline">See full report &rarr;</p>
              </div>
            </div>
          </motion.article>

          {/* 2. QUICK OVERVIEW sidebar */}
          <motion.aside {...fade(2)}
            className="col-span-12 lg:col-span-4 bg-white border border-navy-100 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Quick Look</span>
              <div className="flex items-center gap-3 mt-3 mb-3">
                {(() => {
                  const WIcon = weatherIcon;
                  return <WIcon className={`w-10 h-10 sm:w-12 sm:h-12 ${weatherColor}`} strokeWidth={1.5} />;
                })()}
                <div>
                  <p className="font-serif text-sm sm:text-base font-bold text-navy-800" style={{ fontFamily: "Georgia, serif" }}>
                    {weatherLabel}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 text-[11px] text-navy-500 border-t border-navy-100 pt-2">
                <div className="flex justify-between"><span>Digital Score</span><span className="font-bold text-navy-800">{score}/100</span></div>
                <div className="flex justify-between">
                  <span>Visitors This Month</span>
                  <span className="flex items-center gap-1 font-bold text-navy-800">
                    {growthPct > 0 ? <TrendingUp className="w-3 h-3 text-teal-600" /> : growthPct < 0 ? <TrendingDown className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3 text-navy-400" />}
                    {monthlyVisits.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between"><span>Market Rank</span><span className="font-bold text-navy-800">#{myPosition} of {competitors.length + 1}</span></div>
                <div className="flex justify-between"><span>New Leads</span><span className="font-bold text-navy-800">{monthlyLeads}</span></div>
                <div className="flex justify-between"><span>Followers</span><span className="font-bold text-navy-800">{totalFollowers.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Conversion Rate</span><span className="font-bold text-teal-700">{convRate}%</span></div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-navy-100">
              <div className="flex items-start gap-2">
                <Quote className="w-4 h-4 text-navy-200 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-navy-400 italic leading-relaxed">&ldquo;A satisfied customer is the best business strategy of all.&rdquo;</p>
                  <p className="text-[8px] text-navy-300 mt-0.5 uppercase tracking-wider">Thought of the Day</p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* 3. REVENUE & ROI TRACKER */}
          <motion.article {...fade(3)}
            className="col-span-12 bg-gradient-to-r from-navy-800 via-navy-700 to-teal-800 border border-navy-600 rounded-xl p-4 sm:p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-teal-500 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">Premium</span>
              <span className="text-[9px] tracking-wider uppercase text-navy-200 font-medium">Revenue &amp; ROI</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2.5">
                <DollarSign className="w-4 h-4 text-teal-300 mb-1" />
                <p className="text-[10px] text-navy-200">Est. Monthly Revenue</p>
                <p className="text-lg sm:text-xl font-black text-white">{'\u20B9'}{(estimatedRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2.5">
                <TrendingUp className="w-4 h-4 text-teal-300 mb-1" />
                <p className="text-[10px] text-navy-200">ROI This Month</p>
                <p className="text-lg sm:text-xl font-black text-white">{roi > 0 ? '+' : ''}{roi}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2.5">
                <Target className="w-4 h-4 text-teal-300 mb-1" />
                <p className="text-[10px] text-navy-200">Cost Per Lead</p>
                <p className="text-lg sm:text-xl font-black text-white">{'\u20B9'}{monthlyLeads > 0 ? Math.round(subscriptionCost / monthlyLeads).toLocaleString() : '\u2014'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2.5">
                <Users className="w-4 h-4 text-teal-300 mb-1" />
                <p className="text-[10px] text-navy-200">Est. Customers</p>
                <p className="text-lg sm:text-xl font-black text-white">{estimatedCustomers}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2.5">
                <PieChart className="w-4 h-4 text-teal-300 mb-1" />
                <p className="text-[10px] text-navy-200">Avg. Customer Value</p>
                <p className="text-lg sm:text-xl font-black text-white">{'\u20B9'}{customerValue.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-3 py-2.5">
                <BarChart3 className="w-4 h-4 text-teal-300 mb-1" />
                <p className="text-[10px] text-navy-200">Pipeline Value</p>
                <p className="text-lg sm:text-xl font-black text-white">{'\u20B9'}{(pipelineValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
              <p className="text-[10px] text-navy-200">
                Subscription cost {'\u20B9'}{(subscriptionCost).toLocaleString()}/mo &rarr; generating {'\u20B9'}{(estimatedRevenue).toLocaleString()} in revenue
              </p>
              <span className="text-[10px] text-teal-300 font-bold">{roi > 0 ? `${roi}x return on investment` : 'Building momentum...'}</span>
            </div>
          </motion.article>

          {/* 4. SOCIAL MEDIA + GROWTH CHART */}
          <motion.article {...fade(4)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/analytics')}>
            <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Social Media</span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {totalFollowers.toLocaleString()} Followers &bull; {totalPosts} Posts
            </h3>
            <div className="space-y-1.5 mb-2">
              {social?.platforms?.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-navy-500">
                    <PlatformIcon name={p.name} className="w-3 h-3" />
                    {p.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-navy-800 font-semibold">{p.followers.toLocaleString()}</span>
                    <span className="text-navy-200">|</span>
                    <span className="text-teal-600 font-medium">{p.engagement}%</span>
                    <span className="text-navy-200">|</span>
                    <span className="text-navy-400">{p.posts || 0}p</span>
                  </div>
                </div>
              ))}
            </div>
            {weeklyGrowth.length > 0 && (
              <div className="border-t border-navy-100 pt-2 mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-navy-400 uppercase tracking-wider">Weekly Growth</span>
                  <span className={`text-[10px] font-bold ${weeklyGrowthDelta >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                    {weeklyGrowthDelta >= 0 ? '+' : ''}{weeklyGrowthDelta}
                  </span>
                </div>
                <MiniBarChart
                  data={weeklyGrowth.map(g => ({ label: g.week, value: g.followers }))}
                  color="#0d9488"
                  h={36}
                />
              </div>
            )}
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">See details &rarr;</p>
          </motion.article>

          {/* 5. COMPETITORS — Enhanced Table */}
          <motion.article {...fade(5)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/analytics')}>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-navy-800 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">Intel</span>
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Competition</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {competitors.length} Competitors Tracked
            </h3>
            <div className="flex items-center text-[8px] text-navy-300 uppercase tracking-wider gap-1 mb-1 px-1">
              <span className="w-4">#</span>
              <span className="flex-1">Name</span>
              <span className="w-6 text-center">Web</span>
              <span className="w-8 text-center">Social</span>
              <span className="w-10 text-right">Score</span>
            </div>
            <div className="space-y-0.5 mb-2">
              {competitors.slice(0, 6).map((c, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px] px-1 py-0.5 rounded hover:bg-navy-50">
                  <span className="w-4 text-navy-300 font-bold">{i + 1}</span>
                  <span className="flex-1 text-navy-600 truncate">{c.name}</span>
                  <span className="w-6 text-center">{c.website ? <Globe className="w-3 h-3 text-teal-500 inline" /> : <span className="text-navy-200">&mdash;</span>}</span>
                  <span className="w-8 text-center text-navy-500">{c.socialMedia}</span>
                  <div className="w-10 flex items-center gap-1 justify-end">
                    <div className="w-8 h-1 bg-navy-100 rounded-full overflow-hidden">
                      <div className="h-full bg-navy-500 rounded-full" style={{ width: `${c.score}%` }} />
                    </div>
                    <span className="text-navy-800 font-bold text-[9px]">{c.score}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] text-navy-400 border-t border-navy-100 pt-2">
              <span>Your Rank: <span className="font-bold text-navy-800">#{myPosition}</span></span>
              <span>Score: <span className="font-bold text-navy-800">{score}</span></span>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">Full analysis &rarr;</p>
          </motion.article>

          {/* 6. WEBSITE VISITORS + SITE HEALTH */}
          <motion.article {...fade(6)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/analytics')}>
            <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Website</span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {monthlyVisits.toLocaleString()} Visitors This Month
            </h3>
            <div className="flex items-center gap-3 mb-2">
              <Sparkline data={trafficTrend} />
              <div className="flex items-center gap-1 text-[11px]">
                {growthPct > 0 ? <TrendingUp className="w-3.5 h-3.5 text-teal-600" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                <span className={`font-bold ${growthPct > 0 ? 'text-teal-700' : 'text-red-600'}`}>{growthPct}%</span>
                <span className="text-navy-400">vs last</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-navy-100 pt-2">
              <DonutChart segments={sources.filter(s => s.value > 0).map(s => ({ value: s.value, color: s.color }))} size={50} />
              <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
                <div className="flex justify-between"><span className="text-navy-400">Direct</span><span className="font-bold text-navy-700">{direct}%</span></div>
                <div className="flex justify-between"><span className="text-navy-400">Search</span><span className="font-bold text-navy-700">{search}%</span></div>
                <div className="flex justify-between"><span className="text-navy-400">Social</span><span className="font-bold text-navy-700">{socialSrc}%</span></div>
                <div className="flex justify-between"><span className="text-navy-400">Referral</span><span className="font-bold text-navy-700">{referral}%</span></div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-navy-100">
              {[
                { label: 'Uptime', val: `${siteHealth.uptime}%`, good: siteHealth.uptime > 99 },
                { label: 'Speed', val: `${siteHealth.speed}s`, good: siteHealth.speed < 3 },
                { label: 'Mobile', val: String(siteHealth.mobileScore), good: siteHealth.mobileScore > 60 },
                { label: 'SEO', val: String(siteHealth.seoScore), good: siteHealth.seoScore > 50 },
              ].map((m, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] font-bold" style={{ color: m.good ? '#0d9488' : '#ef4444' }}>{m.val}</p>
                  <p className="text-[8px] text-navy-300">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">See details &rarr;</p>
          </motion.article>

          {/* 7. SALES FUNNEL */}
          <motion.article {...fade(7)}
            className="col-span-12 sm:col-span-6 lg:col-span-6 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/leads')}>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-600 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">Funnel</span>
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Sales Pipeline</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-3"
              style={{ fontFamily: "Georgia, serif" }}>
              From Visitor to Customer
            </h3>
            <div className="space-y-1.5">
              {[
                { label: 'Website Visitors', value: monthlyVisits, pct: 100, color: '#1e3a5f' },
                { label: 'Engaged Users', value: Math.round(monthlyVisits * 0.6), pct: 60, color: '#2a5a8f' },
                { label: 'Leads Generated', value: monthlyLeads, pct: parseFloat(convRate), color: '#0d9488' },
                { label: 'Customers Won', value: estimatedCustomers, pct: monthlyVisits ? ((estimatedCustomers / monthlyVisits) * 100) : 0, color: '#059669' },
              ].map((stage, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="text-navy-500">{stage.label}</span>
                    <span className="font-bold text-navy-800">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(stage.pct, 2)}%`, backgroundColor: stage.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] mt-3 pt-2 border-t border-navy-100">
              <span className="text-navy-400">Overall Conversion</span>
              <span className="font-bold text-teal-700">{convRate}% visitors &rarr; leads</span>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">Manage leads &rarr;</p>
          </motion.article>

          {/* 8. LEADS */}
          <motion.article {...fade(8)}
            className="col-span-12 sm:col-span-6 lg:col-span-6 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/leads')}>
            <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Lead Intelligence</span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              {monthlyLeads} New Leads This Month
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {[
                { icon: Eye, label: 'Visitors', val: monthlyVisits.toLocaleString() },
                { icon: Target, label: 'Converted', val: `${convRate}%` },
                { icon: Users, label: 'Leads', val: String(monthlyLeads) },
                { icon: BarChart3, label: 'Value', val: `\u20B9${(pipelineValue / 1000).toFixed(0)}K` },
              ].map((item, i) => (
                <div key={i} className="bg-navy-50 border border-navy-100 rounded-lg px-2 py-1.5">
                  <item.icon className="w-3 h-3 text-navy-300 mb-0.5" />
                  <p className="text-[10px] text-navy-400">{item.label}</p>
                  <p className="text-sm font-bold text-navy-800">{item.val}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-100 pt-2">
              <span className="text-[9px] text-navy-300 uppercase tracking-wider">Lead trend (6 months)</span>
              <div className="flex items-end gap-1 h-8 mt-1">
                {traffic?.monthly?.map((m, i) => {
                  const maxL = Math.max(...(traffic?.monthly?.map(x => x.leads) || [1])) || 1;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-full rounded-t" style={{ height: `${(m.leads / maxL) * 100}%`, backgroundColor: i === traffic.monthly.length - 1 ? '#0d9488' : '#dce3f0', minHeight: 2 }} />
                      <span className="text-[7px] text-navy-300">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">See all leads &rarr;</p>
          </motion.article>

          {/* 9. ACTIVE AUTOMATIONS */}
          <motion.article {...fade(9)}
            className="col-span-12 lg:col-span-6 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/automation')}>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-navy-700 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">Live</span>
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Automations &amp; Workflows</span>
            </div>
            <h3 className="font-serif text-base font-bold text-navy-900 mb-2" style={{ fontFamily: "Georgia, serif" }}>
              {activeWorkflows.length} Running &bull; {completedWorkflows.length} Completed
            </h3>
            {activeWorkflows.length > 0 ? (
              <div className="space-y-1.5 mb-2">
                {activeWorkflows.slice(0, 3).map((wf, i) => (
                  <div key={i} className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-2.5 py-1.5">
                    <Play className="w-3 h-3 text-teal-600 flex-shrink-0" />
                    <span className="flex-1 text-[11px] text-navy-700 truncate">{wf.name || wf.title || 'Workflow'}</span>
                    <span className="text-[9px] text-teal-600 font-medium">Running</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-navy-50 border border-navy-100 rounded-lg px-3 py-3 mb-2 text-center">
                <Zap className="w-5 h-5 text-navy-300 mx-auto mb-1" />
                <p className="text-[11px] text-navy-400">No automations running yet</p>
                <p className="text-[10px] text-navy-300 mt-0.5">Set up auto-posting, lead alerts, review requests</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 text-center border-t border-navy-100 pt-2">
              <div><p className="text-sm font-bold text-navy-800">{workflows?.length || 0}</p><p className="text-[9px] text-navy-400">Total</p></div>
              <div><p className="text-sm font-bold text-teal-600">{activeWorkflows.length}</p><p className="text-[9px] text-navy-400">Active</p></div>
              <div><p className="text-sm font-bold text-navy-600">{completedWorkflows.length}</p><p className="text-[9px] text-navy-400">Done</p></div>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">Manage automations &rarr;</p>
          </motion.article>

          {/* 10. GEO REACH */}
          <motion.article {...fade(10)}
            className="col-span-12 lg:col-span-6 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/analytics')}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3.5 h-3.5 text-navy-400" />
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Geographic Reach</span>
            </div>
            <h3 className="font-serif text-base font-bold text-navy-900 mt-1 mb-3" style={{ fontFamily: "Georgia, serif" }}>
              Where Your Customers Come From
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-[9px] text-navy-300 uppercase tracking-wider mb-2">By Distance</p>
                <div className="space-y-1.5">
                  {Object.entries(radius).map(([dist, pct], i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span className="text-navy-500">{dist}</span>
                        <span className="font-bold text-navy-800">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-navy-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: i === 0 ? '#0d9488' : i === 1 ? '#14b8a6' : i === 2 ? '#5eead4' : '#a7f3d0' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[9px] text-navy-300 uppercase tracking-wider mb-2">Top Areas</p>
                {geo?.topCities?.slice(0, 4).map((city, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="text-navy-500">{city.city}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-navy-700 font-semibold">{city.percentage}%</span>
                      <span className="text-navy-300">&bull;</span>
                      <span className="text-teal-600 font-medium">{city.leads} leads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-3 group-hover:underline">See full map &rarr;</p>
          </motion.article>

          {/* 11. ACTION ITEMS (full width) */}
          <motion.article {...fade(11)}
            className="col-span-12 bg-white border border-navy-100 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-navy-700 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">To-Do</span>
              <span className="font-serif text-sm sm:text-base font-bold text-navy-900" style={{ fontFamily: "Georgia, serif" }}>
                Things You Should Do Now
              </span>
              {topActions.length > 0 && (
                <span className="ml-auto text-[10px] text-navy-400 bg-navy-50 px-2 py-0.5 rounded-full">{topActions.length} items</span>
              )}
            </div>
            {topActions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {topActions.map((rec, i) => {
                  const title = typeof rec.title === 'object' ? (rec.title[language] || rec.title.en) : rec.title;
                  const desc = typeof rec.description === 'object' ? (rec.description[language] || rec.description.en) : rec.description;
                  const priorityColors = {
                    critical: 'bg-red-50 text-red-700 border-red-200',
                    high: 'bg-navy-50 text-navy-700 border-navy-200',
                    medium: 'bg-teal-50 text-teal-700 border-teal-200',
                    low: 'bg-navy-50 text-navy-500 border-navy-100',
                  };
                  const pCls = priorityColors[rec.priority] || priorityColors.medium;
                  return (
                    <div key={i} className={`border rounded-lg p-3 ${pCls}`}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {rec.priority === 'critical' ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span className="text-[9px] font-bold uppercase tracking-wider">{rec.priority === 'critical' ? 'Urgent' : rec.priority === 'high' ? 'Important' : rec.priority === 'medium' ? 'Helpful' : 'Optional'}</span>
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
              <p className="text-sm text-navy-400 italic">No pending items. Your business is on track!</p>
            )}
          </motion.article>

          {/* 12. GROWTH FORECAST */}
          <motion.article {...fade(12)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/journey')}>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-600 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">Forecast</span>
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Growth</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              Business Growth is {growthTrend}
            </h3>
            <div className="flex items-end gap-1 h-16 mb-2">
              {traffic?.monthly?.map((m, i) => {
                const maxV = Math.max(...traffic.monthly.map(x => x.visits)) || 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full rounded-t transition-all"
                      style={{
                        height: `${(m.visits / maxV) * 100}%`,
                        backgroundColor: i === traffic.monthly.length - 1 ? '#0d9488' : '#dce3f0',
                        minHeight: 2
                      }} />
                    <span className="text-[8px] text-navy-300">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-navy-500 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              Your traffic {growthPct > 0 ? 'grew' : 'dropped'} by {Math.abs(growthPct)}% this month.
              At this pace, next month could bring ~{Math.round(monthlyVisits * 1.3).toLocaleString()} visitors.
            </p>
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">See full journey &rarr;</p>
          </motion.article>

          {/* 13. CONTENT CALENDAR */}
          <motion.article {...fade(13)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/content')}>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-navy-400" />
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Content Calendar</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              Upcoming Posts
            </h3>
            <div className="space-y-1.5">
              {upcomingContent.map((item, i) => {
                const statusColors = {
                  scheduled: 'bg-teal-100 text-teal-700',
                  draft: 'bg-navy-100 text-navy-600',
                  idea: 'bg-navy-50 text-navy-400',
                };
                return (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <PlatformIcon name={item.type} className="w-3 h-3 text-navy-400 flex-shrink-0" />
                    <span className="flex-1 text-navy-600 truncate">{item.title}</span>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${statusColors[item.status] || statusColors.idea}`}>{item.status}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-navy-100 pt-2 mt-2">
              <p className="text-[9px] text-navy-300 uppercase tracking-wider mb-1.5">Best Times to Post</p>
              <div className="flex gap-1.5">
                {bestTimes.map((bt, i) => (
                  <div key={i} className="flex-1 bg-navy-50 rounded px-1.5 py-1 text-center">
                    <p className="text-[9px] font-bold text-navy-700">{bt.day}</p>
                    <p className="text-[8px] text-navy-400">{bt.time}</p>
                    <div className="h-1 bg-navy-100 rounded-full mt-0.5 overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${bt.engagement}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">Content studio &rarr;</p>
          </motion.article>

          {/* 14. AI COPILOT */}
          <motion.article {...fade(14)}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/chats')}>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-3.5 h-3.5 text-teal-500" />
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">AI Copilot</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              Your Business Assistant
            </h3>
            {recentChats.length > 0 ? (
              <div className="space-y-1.5 mb-2">
                <p className="text-[9px] text-navy-300 uppercase tracking-wider">Recent Conversations</p>
                {recentChats.map((chat, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] bg-navy-50 rounded-lg px-2.5 py-1.5">
                    <MessageSquare className="w-3 h-3 text-navy-300 flex-shrink-0" />
                    <span className="flex-1 text-navy-600 truncate">{chat.title || 'Chat'}</span>
                    <ChevronRight className="w-3 h-3 text-navy-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-teal-50 border border-teal-100 rounded-lg px-3 py-3 mb-2 text-center">
                <Sparkles className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                <p className="text-[11px] text-teal-700 font-medium">Ask anything about your business</p>
                <p className="text-[10px] text-teal-500 mt-0.5">&ldquo;How do I get more customers?&rdquo;</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {['Growth tips', 'Write a post', 'Analyze competitors', 'Plan marketing'].map((q, i) => (
                <div key={i} className="text-[9px] text-navy-500 bg-navy-50 rounded px-2 py-1 text-center hover:bg-teal-50 hover:text-teal-700 transition-colors">
                  {q}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-2 group-hover:underline">Open copilot &rarr;</p>
          </motion.article>

          {/* 15. MARKET OPPORTUNITY */}
          <motion.article {...fade(15)}
            className="col-span-12 lg:col-span-8 bg-white border border-navy-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-teal-200 transition-all group"
            onClick={() => navigate('/dashboard/analytics')}>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-navy-700 text-white text-[8px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">Special Report</span>
              <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Market</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              You&apos;re Missing {'\u20B9'}{(pipelineValue * 3).toLocaleString()} in Business
            </h3>
            <div className="columns-1 sm:columns-2 gap-4">
              <p className="text-[11px] text-navy-500 leading-relaxed mb-2" style={{ fontFamily: "Georgia, serif" }}>
                Based on your area and category, there are many customers searching for services like yours who can&apos;t find you yet. Here&apos;s the opportunity you&apos;re missing right now.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Searches You Miss', val: `${Math.round(monthlyVisits * 2.5).toLocaleString()}+`, icon: Globe },
                  { label: 'Review Gap', val: `${leader ? leader.reviews - (monthlyLeads * 5) : 200}+`, icon: Star },
                  { label: 'People You Can Reach', val: Math.round(totalFollowers * 3.2).toLocaleString(), icon: Users },
                  { label: 'Potential Leads', val: String(Math.round(monthlyLeads * 4)), icon: Target },
                ].map((m, i) => (
                  <div key={i} className="bg-navy-50 border border-navy-100 rounded-lg px-2 py-1.5">
                    <m.icon className="w-3 h-3 text-navy-300 mb-0.5" />
                    <p className="text-[10px] text-navy-400">{m.label}</p>
                    <p className="text-sm font-bold text-navy-800">{m.val}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-3 group-hover:underline">See full report &rarr;</p>
          </motion.article>

          {/* 16. CUSTOMER REVIEWS */}
          <motion.aside {...fade(16)}
            className="col-span-12 lg:col-span-4 bg-white border border-navy-100 rounded-xl p-4">
            <span className="text-[9px] tracking-wider uppercase text-navy-400 font-medium">Customer Reviews</span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-navy-900 mt-1 mb-2"
              style={{ fontFamily: "Georgia, serif" }}>
              Score: {analyticsData?.digitalPresence?.onlineReviews || 0}/100
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s}
                  className={`w-4 h-4 ${s <= Math.round((analyticsData?.digitalPresence?.onlineReviews || 0) / 20) ? 'text-teal-500 fill-teal-500' : 'text-navy-200'}`} />
              ))}
              <span className="text-[11px] text-navy-400 ml-1">{((analyticsData?.digitalPresence?.onlineReviews || 0) / 20).toFixed(1)}/5</span>
            </div>
            <p className="text-[11px] text-navy-500 leading-relaxed mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Good reviews help new customers trust your business. Ask happy customers to leave a review.
            </p>
            <div className="border-t border-navy-100 pt-2">
              <p className="text-[9px] uppercase tracking-wider text-navy-300 mb-1.5">Review Comparison</p>
              {competitors.slice(0, 3).map((c, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-navy-500 truncate flex-1">{c.name}</span>
                  <span className="font-bold text-navy-700">{c.reviews} reviews</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-dashed border-navy-100">
                <span className="text-teal-600 font-medium">You</span>
                <span className="font-bold text-teal-700">{monthlyLeads * 5} reviews</span>
              </div>
            </div>
          </motion.aside>

          {/* 17. SUBSCRIPTION VALUE */}
          <motion.article {...fade(17)}
            className="col-span-12 bg-gradient-to-r from-teal-600 to-teal-500 border border-teal-400 rounded-xl p-4 sm:p-5 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-teal-200" />
                  <span className="text-[9px] tracking-wider uppercase text-teal-100 font-medium">Your Subscription</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white" style={{ fontFamily: "Georgia, serif" }}>
                  {subscription?.name?.en || 'Premium Plan'} &mdash; {'\u20B9'}{(subscriptionCost).toLocaleString()}/month
                </h3>
                <p className="text-[11px] text-teal-100 mt-1">{subscription?.features?.length || 6} premium features active</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <Award className="w-5 h-5 text-teal-200 mx-auto mb-0.5" />
                  <p className="text-lg font-black">{roi > 0 ? `${roi}%` : '\u2014'}</p>
                  <p className="text-[9px] text-teal-100">ROI</p>
                </div>
                <div>
                  <Users className="w-5 h-5 text-teal-200 mx-auto mb-0.5" />
                  <p className="text-lg font-black">{monthlyLeads}</p>
                  <p className="text-[9px] text-teal-100">Leads</p>
                </div>
                <div>
                  <TrendingUp className="w-5 h-5 text-teal-200 mx-auto mb-0.5" />
                  <p className="text-lg font-black">{growthPct}%</p>
                  <p className="text-[9px] text-teal-100">Growth</p>
                </div>
              </div>
            </div>
          </motion.article>

          {/* FOOTER */}
          <motion.footer {...fade(18)} className="col-span-12 border-t-2 border-navy-700 pt-3 mt-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-navy-400">
              <div className="flex items-center gap-2">
                <Newspaper className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider font-medium">Business Daily</span>
              </div>
              <span>Published: {fmtDate()}</span>
              <span className="italic">Your premium business growth report powered by LeadFlexUp</span>
            </div>
          </motion.footer>

        </div>
      </div>
    </div>
  );
};

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Eye, Users, Star, Target,
  BarChart3, Globe, Zap, Cloud, CloudRain, Sun,
  AlertTriangle, CheckCircle2, Clock,
  MapPin, DollarSign,
  Camera, Share2, ChevronRight,
  Shield, Award, Activity,
  ArrowRight, ArrowUpRight,
  Wallet, Receipt, UserPlus, Megaphone, CircleDollarSign,
  Banknote
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { competitorDatabase } from '../data/mockDatabase';
import { Commentable } from '../components/CommentBox';

/* --- Animation helper --- */
const fade = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
});

/* --- Layman-friendly tooltip for charts --- */
const SimpleTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-navy-100 text-xs">
      <p className="text-navy-400 font-medium">{label}</p>
      <p className="text-navy-900 font-bold">{prefix}{payload[0].value?.toLocaleString()}{suffix}</p>
    </div>
  );
};

/* --- Main Component --- */
export const NewspaperHome = () => {
  const navigate = useNavigate();
  const { language, businessData, analyticsData, recommendations, subscription, workflows } = useApp();

  /* --- Data extraction --- */
  const score = analyticsData?.digitalPresence?.overall || 0;
  const traffic = analyticsData?.traffic;
  const social = analyticsData?.socialMedia;

  const totalFollowers = useMemo(() => social?.platforms?.reduce((s, p) => s + p.followers, 0) || 0, [social]);
  const monthlyVisits = useMemo(() => traffic?.monthly?.[traffic.monthly.length - 1]?.visits || 0, [traffic]);
  const monthlyLeads = useMemo(() => traffic?.monthly?.[traffic.monthly.length - 1]?.leads || 0, [traffic]);
  const convRate = monthlyVisits ? ((monthlyLeads / monthlyVisits) * 100).toFixed(1) : '0';

  const growthPct = useMemo(() => {
    if (!traffic?.monthly || traffic.monthly.length < 2) return 0;
    const prev = traffic.monthly[traffic.monthly.length - 2].visits;
    return prev ? Math.round(((monthlyVisits - prev) / prev) * 100) : 0;
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

  /* --- Financial KPIs (plain English) --- */
  const estimatedRevenue = monthlyLeads * 2500;
  const subscriptionCost = subscription?.price ? subscription.price / 100 : 14999;
  const roi = subscriptionCost > 0 ? Math.round((estimatedRevenue - subscriptionCost) / subscriptionCost * 100) : 0;
  const costPerLead = monthlyLeads > 0 ? Math.round(subscriptionCost / monthlyLeads) : 0;
  const estimatedCustomers = Math.round(monthlyLeads * 0.25);
  const costPerCustomer = estimatedCustomers > 0 ? Math.round(subscriptionCost / estimatedCustomers) : 0;
  const customerValue = monthlyLeads > 0 ? Math.round(estimatedRevenue / monthlyLeads) : 0;
  const profit = estimatedRevenue - subscriptionCost;

  /* --- Chart data --- */
  const trafficChartData = useMemo(() =>
    (traffic?.monthly || []).map(m => ({
      name: m.month,
      visitors: m.visits,
      leads: m.leads
    })), [traffic]);

  const revenueChartData = useMemo(() =>
    (traffic?.monthly || []).map(m => ({
      name: m.month,
      revenue: m.leads * 2500,
      cost: Math.round(subscriptionCost / 6)
    })), [traffic, subscriptionCost]);

  const sourceData = useMemo(() => {
    const sources = traffic?.sources || [];
    return sources.filter(s => s.value > 0).map(s => ({
      name: s.name, value: s.value, color: s.color
    }));
  }, [traffic]);

  const funnelData = [
    { stage: 'People who saw your business', value: monthlyVisits, color: '#1e3a5f' },
    { stage: 'People interested', value: Math.round(monthlyVisits * 0.6), color: '#2a5a8f' },
    { stage: 'People who contacted you', value: monthlyLeads, color: '#0d9488' },
    { stage: 'Became your customers', value: estimatedCustomers, color: '#059669' },
  ];

  const topActions = useMemo(() => (recommendations || []).slice(0, 3), [recommendations]);

  const bizName = businessData?.name || 'Your Business';
  const healthStatus = score >= 70 ? 'Healthy' : score >= 40 ? 'Needs Work' : 'Critical';
  const healthColor = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600';
  const healthBg = score >= 70 ? 'bg-emerald-50 border-emerald-200' : score >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
  const HealthIcon = score >= 70 ? Sun : score >= 40 ? Cloud : CloudRain;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* === SECTION 1: WELCOME + HEALTH STATUS === */}
        <Commentable id="home-welcome-health" label="Welcome + Health Status">
        <motion.div {...fade(0)} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <Commentable id="home-welcome-greeting" label="Welcome Greeting">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
              </h1>
              <p className="text-sm text-navy-500 mt-1">Here is how <span className="font-semibold text-navy-700">{bizName}</span> is doing today</p>
            </div>
            </Commentable>
            <Commentable id="home-welcome-health-badge" label="Health Status Badge">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${healthBg}`}>
              <HealthIcon className={`w-5 h-5 ${healthColor}`} />
              <div>
                <p className={`text-sm font-bold ${healthColor}`}>Business Health: {healthStatus}</p>
                <p className="text-[10px] text-navy-500">Score {score}/100</p>
              </div>
            </div>
            </Commentable>
          </div>
        </motion.div>
        </Commentable>

        {/* === SECTION 2: THE BIG NUMBERS (Money) === */}
        <Commentable id="home-big-numbers" label="Big Numbers - Revenue & Costs">
        <motion.div {...fade(1)} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-navy-800 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-teal-600" />
              Your Money This Month
            </h2>
            <button onClick={() => navigate('/dashboard/analytics')}
              className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              Detailed View <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Revenue */}
            <Commentable id="home-stat-revenue" label="Revenue Stat Card">
            <div className="bg-white rounded-2xl border border-navy-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {roi > 0 ? `+${roi}%` : `${roi}%`} return
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-navy-900">&#8377;{(estimatedRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-navy-500 mt-1">Money you earned</p>
              <p className="text-[10px] text-navy-400 mt-0.5">from {monthlyLeads} leads this month</p>
            </div>
            </Commentable>

            {/* Spent */}
            <Commentable id="home-stat-spent" label="Marketing Spend Card">
            <div className="bg-white rounded-2xl border border-navy-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-[10px] font-semibold text-navy-500 bg-navy-50 px-2 py-0.5 rounded-full">monthly</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-navy-900">&#8377;{(subscriptionCost / 1000).toFixed(0)}K</p>
              <p className="text-xs text-navy-500 mt-1">Marketing spend</p>
              <p className="text-[10px] text-navy-400 mt-0.5">your LeadFlexUp plan</p>
            </div>
            </Commentable>

            {/* Profit */}
            <Commentable id="home-stat-profit" label="Profit Card">
            <div className={`bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow ${profit >= 0 ? 'border-emerald-200' : 'border-red-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  <CircleDollarSign className={`w-5 h-5 ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`} />
                </div>
                {profit >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              </div>
              <p className={`text-2xl sm:text-3xl font-black ${profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {profit >= 0 ? '+' : ''}&#8377;{(profit / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-navy-500 mt-1">Your profit</p>
              <p className="text-[10px] text-navy-400 mt-0.5">revenue minus marketing cost</p>
            </div>
            </Commentable>

            {/* Cost per customer */}
            <Commentable id="home-stat-cost-per-customer" label="Cost Per Customer Card">
            <div className="bg-white rounded-2xl border border-navy-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-[10px] font-semibold text-navy-500 bg-navy-50 px-2 py-0.5 rounded-full">per person</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-navy-900">&#8377;{costPerCustomer.toLocaleString()}</p>
              <p className="text-xs text-navy-500 mt-1">Cost to get 1 customer</p>
              <p className="text-[10px] text-navy-400 mt-0.5">you got {estimatedCustomers} customers this month</p>
            </div>
            </Commentable>
          </div>
        </motion.div>
        </Commentable>

        {/* === SECTION 3: REVENUE TREND CHART + COST BREAKDOWN === */}
        <Commentable id="home-revenue-chart" label="Revenue Trend Chart + Cost Breakdown">
        <motion.div {...fade(2)} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Revenue chart */}
          <Commentable id="home-revenue-chart-graph" label="Revenue vs Cost Area Chart">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-navy-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-navy-800">Revenue vs Cost (6 months)</h3>
                <p className="text-[11px] text-navy-400 mt-0.5">Green area = money earned, red line = money spent</p>
              </div>
              <button onClick={() => navigate('/dashboard/analytics')}
                className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                Details <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${String.fromCharCode(8377)}${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<SimpleTooltip prefix={String.fromCharCode(8377)} />} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5}
                  fill="url(#revenueGrad)" name="Revenue" />
                <Area type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={1.5}
                  fill="none" strokeDasharray="4 4" name="Cost" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-emerald-500 rounded-full" />Revenue (money in)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 rounded-full" />Cost (money out)</span>
            </div>
          </div>
          </Commentable>

          {/* Cost breakdown */}
          <Commentable id="home-cost-breakdown" label="Cost Breakdown Panel">
          <div className="bg-white rounded-2xl border border-navy-100 p-5">
            <h3 className="text-sm font-bold text-navy-800 mb-1">Where Your Money Goes</h3>
            <p className="text-[11px] text-navy-400 mb-4">Breaking down &#8377;{subscriptionCost.toLocaleString()} spent</p>
            <div className="space-y-3">
              {[
                { label: 'Getting people to notice you', pct: 35, color: '#6366f1', amount: Math.round(subscriptionCost * 0.35) },
                { label: 'Turning visitors into leads', pct: 30, color: '#0d9488', amount: Math.round(subscriptionCost * 0.30) },
                { label: 'Social media & content', pct: 20, color: '#f59e0b', amount: Math.round(subscriptionCost * 0.20) },
                { label: 'Website & tools', pct: 15, color: '#8b5cf6', amount: Math.round(subscriptionCost * 0.15) },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-navy-600">{item.label}</span>
                    <span className="font-bold text-navy-800">&#8377;{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-navy-100">
              <p className="text-[10px] text-navy-400 text-center">
                Each &#8377;1 spent → earned &#8377;{(estimatedRevenue / subscriptionCost).toFixed(1)} back
              </p>
            </div>
          </div>
          </Commentable>
        </motion.div>
        </Commentable>

        {/* === SECTION 4: CUSTOMER JOURNEY (Funnel + Visitors) === */}
        <Commentable id="home-customer-journey" label="Customer Journey Funnel">
        <motion.div {...fade(3)} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Funnel */}
          <Commentable id="home-journey-funnel" label="Customer Conversion Funnel">
          <div className="bg-white rounded-2xl border border-navy-100 p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/leads')}>
            <h3 className="text-sm font-bold text-navy-800 mb-1 flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              How People Become Your Customers
            </h3>
            <p className="text-[11px] text-navy-400 mb-4">This month's journey from discovery to purchase</p>
            <div className="space-y-2">
              {funnelData.map((stage, i) => {
                const widthPct = monthlyVisits > 0 ? Math.max((stage.value / monthlyVisits) * 100, 5) : 50;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-navy-600">{stage.stage}</span>
                      <span className="font-bold text-navy-800">{stage.value.toLocaleString()}</span>
                    </div>
                    <div className="h-6 bg-navy-50 rounded-lg overflow-hidden flex items-center">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                        className="h-full rounded-lg flex items-center justify-end pr-2"
                        style={{ backgroundColor: stage.color }}
                      >
                        {widthPct > 20 && (
                          <span className="text-[9px] font-bold text-white">{Math.round(widthPct)}%</span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between">
              <p className="text-[11px] text-navy-500">
                <span className="font-semibold text-teal-700">{convRate}%</span> of visitors contact you
              </p>
              <span className="text-[10px] text-teal-600 font-medium flex items-center gap-1">
                See all leads <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
          </Commentable>

          {/* Visitors chart */}
          <Commentable id="home-journey-visitors-chart" label="Visitors Bar Chart + Sources">
          <div className="bg-white rounded-2xl border border-navy-100 p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/analytics')}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                People Visiting Your Business Online
              </h3>
              <div className={`flex items-center gap-1 text-xs font-bold ${growthPct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {growthPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {growthPct >= 0 ? '+' : ''}{growthPct}%
              </div>
            </div>
            <p className="text-[11px] text-navy-400 mb-3">
              <span className="font-semibold text-navy-700">{monthlyVisits.toLocaleString()}</span> people visited this month
            </p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={trafficChartData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<SimpleTooltip suffix=" people" />} />
                <Bar dataKey="visitors" radius={[4, 4, 0, 0]}>
                  {trafficChartData.map((entry, i) => (
                    <Cell key={i} fill={i === trafficChartData.length - 1 ? '#0d9488' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Where they come from */}
            <div className="mt-3 pt-3 border-t border-navy-100">
              <p className="text-[10px] text-navy-400 uppercase tracking-wider mb-2 font-medium">Where they find you</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sourceData} cx="50%" cy="50%" innerRadius={14} outerRadius={22} dataKey="value" strokeWidth={0}>
                        {sourceData.map((s, i) => <Cell key={i} fill={s.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                  {sourceData.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-navy-500">{s.name}</span>
                      <span className="font-bold text-navy-700 ml-auto">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </Commentable>
        </motion.div>
        </Commentable>

        {/* === SECTION 5: BUSINESS HEALTH DETAILS === */}
        <Commentable id="home-health-details" label="Business Health Details">
        <motion.div {...fade(4)} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-navy-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Your Business Health Checkup
            </h2>
            <button onClick={() => navigate('/dashboard/analytics')}
              className="text-[11px] text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              Full Analysis <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <Commentable id="home-health-score-cards" label="Health Score Cards Grid">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Website', score: analyticsData?.digitalPresence?.website || 0, good: 'Website is working well', bad: 'Your website needs improvement', tip: 'Add photos, customer reviews' },
              { label: 'Social Media', score: analyticsData?.digitalPresence?.socialMedia || 0, good: 'Good social presence', bad: 'Post more on social media', tip: `${totalFollowers.toLocaleString()} followers` },
              { label: 'Google Search', score: analyticsData?.digitalPresence?.searchVisibility || 0, good: 'People can find you easily', bad: 'Hard to find on Google', tip: `Rank #${myPosition} in your area` },
              { label: 'Reviews', score: analyticsData?.digitalPresence?.onlineReviews || 0, good: 'Great reviews!', bad: 'Need more customer reviews', tip: 'Ask happy customers for reviews' },
            ].map((item, i) => {
              const isGood = item.score >= 60;
              const isMid = item.score >= 30 && item.score < 60;
              return (
                <div key={i} className="bg-white rounded-2xl border border-navy-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/dashboard/analytics')}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                        <circle cx="18" cy="18" r="14" fill="none"
                          stroke={isGood ? '#10b981' : isMid ? '#f59e0b' : '#ef4444'}
                          strokeWidth="3" strokeLinecap="round"
                          strokeDasharray={`${(item.score / 100) * 88} 88`} />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-navy-800">
                        {item.score}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy-800">{item.label}</p>
                      <p className={`text-[10px] font-medium ${isGood ? 'text-emerald-600' : isMid ? 'text-amber-600' : 'text-red-500'}`}>
                        {isGood ? 'Good' : isMid ? 'Fair' : 'Weak'}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-navy-500 leading-relaxed">{isGood ? item.good : item.bad}</p>
                  <p className="text-[10px] text-navy-400 mt-1">{item.tip}</p>
                </div>
              );
            })}
          </div>
          </Commentable>
        </motion.div>
        </Commentable>

        {/* === SECTION 6: WHAT TO DO NEXT === */}
        <Commentable id="home-what-to-do" label="What To Do Next - Actions">
        {topActions.length > 0 && (
          <motion.div {...fade(5)} className="mb-6">
            <Commentable id="home-actions-heading" label="Growth Actions Heading">
            <h2 className="text-lg font-bold text-navy-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Do These Things to Grow Faster
            </h2>
            </Commentable>
            <Commentable id="home-actions-list" label="Recommended Actions Cards">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topActions.map((rec, i) => {
                const title = typeof rec.title === 'object' ? (rec.title[language] || rec.title.en) : rec.title;
                const desc = typeof rec.description === 'object' ? (rec.description[language] || rec.description.en) : rec.description;
                const priorityConfig = {
                  critical: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500 text-white', badgeText: 'DO NOW' },
                  high: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500 text-white', badgeText: 'IMPORTANT' },
                  medium: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-500 text-white', badgeText: 'HELPFUL' },
                  low: { bg: 'bg-navy-50', border: 'border-navy-200', badge: 'bg-navy-400 text-white', badgeText: 'NICE TO DO' },
                };
                const cfg = priorityConfig[rec.priority] || priorityConfig.medium;
                return (
                  <div key={i} className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 hover:shadow-md transition-shadow`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.badgeText}</span>
                      {rec.timeline && <span className="text-[10px] text-navy-400 flex items-center gap-1"><Clock className="w-3 h-3" />{rec.timeline}</span>}
                    </div>
                    <h4 className="text-sm font-bold text-navy-800 leading-snug mb-1">{title}</h4>
                    <p className="text-[11px] text-navy-500 leading-relaxed line-clamp-2">{desc}</p>
                    {rec.impact && (
                      <p className="text-[10px] text-teal-700 font-medium mt-2 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> {rec.impact}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            </Commentable>
          </motion.div>
        )}
        </Commentable>

        {/* === SECTION 7: COMPETITORS + QUICK LINKS === */}
        <Commentable id="home-competitors" label="Competitors + Quick Links">
        <motion.div {...fade(6)} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Competitors */}
          <Commentable id="home-competitor-table" label="Competitor Rankings Table">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-navy-100 p-5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/competitors')}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                How You Compare to Competitors
              </h3>
              <span className="text-[11px] font-bold text-navy-600 bg-navy-50 px-2.5 py-1 rounded-full">
                You are #{myPosition} of {competitors.length + 1}
              </span>
            </div>
            <div className="space-y-2">
              {competitors.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] w-5 text-center font-bold text-navy-400">{i + 1}</span>
                  <span className="flex-1 text-[11px] text-navy-700 truncate">{c.name}</span>
                  <div className="w-24 h-2 bg-navy-50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.score > score ? '#ef4444' : '#10b981' }} />
                  </div>
                  <span className="text-[10px] font-bold text-navy-700 w-7 text-right">{c.score}</span>
                </div>
              ))}
              {/* You */}
              <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-lg px-2 py-1.5 -mx-2">
                <span className="text-[11px] w-5 text-center font-bold text-teal-700">{myPosition}</span>
                <span className="flex-1 text-[11px] font-bold text-teal-700">{bizName} (You)</span>
                <div className="w-24 h-2 bg-teal-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-teal-500" style={{ width: `${score}%` }} />
                </div>
                <span className="text-[10px] font-bold text-teal-700 w-7 text-right">{score}</span>
              </div>
            </div>
            <p className="text-[10px] text-teal-600 font-medium mt-3 flex items-center gap-1">
              See full competitor analysis <ArrowRight className="w-3 h-3" />
            </p>
          </div>
          </Commentable>

          {/* Quick links + social */}
          <div className="space-y-3">
            <Commentable id="home-social-media-card" label="Social Media Followers Card">
            <div className="bg-white rounded-2xl border border-navy-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/dashboard/analytics')}>
              <h3 className="text-xs font-bold text-navy-800 mb-2 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-pink-500" />
                Social Media
              </h3>
              <p className="text-xl font-black text-navy-900">{totalFollowers.toLocaleString()}</p>
              <p className="text-[10px] text-navy-400 mb-2">total followers</p>
              <div className="space-y-1">
                {social?.platforms?.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <span className="text-navy-500">{p.name}</span>
                    <span className="font-semibold text-navy-700">{p.followers.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            </Commentable>

            <Commentable id="home-quick-actions" label="Quick Action Links">
            <div className="bg-white rounded-2xl border border-navy-100 p-4">
              <h3 className="text-xs font-bold text-navy-800 mb-2">Quick Actions</h3>
              <div className="space-y-1.5">
                {[
                  { label: 'View all leads', path: '/dashboard/leads', icon: Users },
                  { label: 'Build your website', path: '/dashboard/website', icon: Globe },
                  { label: 'Create a post', path: '/dashboard/content', icon: Camera },
                  { label: 'Set up automation', path: '/dashboard/automation', icon: Zap },
                ].map((link, i) => (
                  <button key={i} onClick={() => navigate(link.path)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-navy-600 hover:bg-teal-50 hover:text-teal-700 transition-colors text-left">
                    <link.icon className="w-3.5 h-3.5" />
                    <span className="flex-1">{link.label}</span>
                    <ChevronRight className="w-3 h-3 text-navy-300" />
                  </button>
                ))}
              </div>
            </div>
            </Commentable>
          </div>
        </motion.div>
        </Commentable>

        {/* === SECTION 8: SUBSCRIPTION VALUE === */}
        <Commentable id="home-subscription-value" label="Subscription Value CTA">
        <motion.div {...fade(7)}
          className="bg-linear-to-r from-teal-600 to-emerald-600 rounded-2xl p-5 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Commentable id="home-subscription-details" label="Plan Details Text">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-teal-200" />
                <span className="text-[10px] uppercase tracking-widest text-teal-100 font-semibold">Your Plan Summary</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {subscription?.name?.en || 'Premium Plan'} — &#8377;{subscriptionCost.toLocaleString()}/month
              </h3>
              <p className="text-[11px] text-teal-100 mt-1 max-w-md">
                This month your plan generated &#8377;{estimatedRevenue.toLocaleString()} in revenue from {monthlyLeads} leads.
                That is &#8377;{(estimatedRevenue / subscriptionCost).toFixed(1)} back for every &#8377;1 spent.
              </p>
            </div>
            </Commentable>
            <Commentable id="home-subscription-stats" label="Plan ROI Stats">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-black">{roi > 0 ? `${roi}%` : '\u2014'}</p>
                <p className="text-[9px] text-teal-100">Return</p>
              </div>
              <div>
                <p className="text-2xl font-black">{monthlyLeads}</p>
                <p className="text-[9px] text-teal-100">Leads</p>
              </div>
              <div>
                <p className="text-2xl font-black">{growthPct >= 0 ? '+' : ''}{growthPct}%</p>
                <p className="text-[9px] text-teal-100">Growth</p>
              </div>
            </div>
            </Commentable>
          </div>
        </motion.div>
        </Commentable>

      </div>
    </div>
  );
};

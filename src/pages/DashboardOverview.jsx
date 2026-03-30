import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, Target, Lightbulb, ArrowRight, ArrowUpRight,
  BarChart3, Trophy, Rocket, Eye, MousePointer, Star,
  CheckCircle, Clock, AlertCircle, MapPin, Globe, Share2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

const Stat = ({ icon: Icon, label, value, change, i }) => (
  <motion.div {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center">
        <Icon className="w-[18px] h-[18px] text-navy-600" />
      </div>
      {change && (
        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
          {change}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-navy-900">{value}</p>
    <p className="text-xs text-navy-400 mt-1">{label}</p>
  </motion.div>
);

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { language, businessData, analyticsData, recommendations, subscription } = useApp();

  if (!analyticsData) return null;

  const { digitalPresence, traffic, socialMedia, geoInsights } = analyticsData;
  const lastMonth = traffic.monthly[traffic.monthly.length - 1];

  const scoreColor = (s) => s < 30 ? 'text-red-500' : s < 60 ? 'text-yellow-500' : 'text-teal-500';

  return (
    <div className="space-y-6">
      {/* ─── Notification banner ─── */}
      <motion.div {...fade()} className="bg-navy-700 text-white rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Welcome, {businessData?.businessName}!</p>
            <p className="text-xs text-navy-200">Your market analysis is ready. Let's start growing.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/journey')}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded-lg text-xs font-semibold hover:bg-teal-600"
        >
          Start Journey <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* ─── Top stats ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Eye} label={t('monthlyVisits', language)} value={lastMonth?.visits} change="+24%" i={0} />
        <Stat icon={MousePointer} label={t('leadsGenerated', language)} value={lastMonth?.leads} change="+38%" i={1} />
        <Stat icon={Users} label="Total Followers" value={socialMedia.platforms.reduce((a, p) => a + p.followers, 0).toLocaleString()} change="+16%" i={2} />
        <Stat icon={Star} label="Avg. Engagement" value={`${(socialMedia.platforms.reduce((a, p) => a + p.engagement, 0) / socialMedia.platforms.length).toFixed(1)}%`} change="+12%" i={3} />
      </div>

      {/* ─── Row: Score + Map + Shipments-like cards ─── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Digital Presence - big card */}
        <motion.div {...fade()} className="lg:col-span-2 bg-white rounded-xl border border-navy-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-navy-800">{t('digitalPresence', language)}</h2>
              <p className="text-xs text-navy-400 mt-0.5">Overall health of your online presence</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/analytics')}
              className="flex items-center gap-1 text-xs font-semibold text-navy-500 hover:text-navy-700"
            >
              Details <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-5 gap-6 items-center">
            {/* Score circle */}
            <div className="sm:col-span-2 flex justify-center">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e8ecf3" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={digitalPresence.overall < 30 ? '#ef4444' : digitalPresence.overall < 60 ? '#eab308' : '#14a88a'}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(digitalPresence.overall / 100) * 327} 327`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${scoreColor(digitalPresence.overall)}`}>{digitalPresence.overall}</span>
                  <span className="text-[10px] text-navy-400 font-medium">/ 100</span>
                </div>
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="sm:col-span-3 space-y-3">
              {[
                { label: t('websiteHealth', language), val: digitalPresence.website },
                { label: t('socialMediaScore', language), val: digitalPresence.socialMedia },
                { label: t('searchVisibility', language), val: digitalPresence.searchVisibility },
                { label: t('onlineReviews', language), val: digitalPresence.onlineReviews }
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-navy-500">{m.label}</span>
                    <span className="text-xs font-bold text-navy-700">{m.val}</span>
                  </div>
                  <div className="w-full bg-navy-100 rounded-full h-1.5">
                    <div className="bg-teal-500 rounded-full h-1.5" style={{ width: `${m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Other Shipments-style — status breakdown */}
        <motion.div {...fade(1)} className="bg-white rounded-xl border border-navy-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-navy-800">Status Overview</h3>
            <div className="flex gap-1">
              {traffic.sources.slice(0, 3).map((s, i) => (
                <div key={i} className="w-6 h-6 rounded-md" style={{ backgroundColor: s.color, opacity: 0.5 + i * 0.15 }} />
              ))}
            </div>
          </div>

          <p className="text-3xl font-bold text-navy-900 mb-1">
            {socialMedia.platforms.reduce((a, p) => a + p.posts, 0)}
          </p>
          <p className="text-xs text-navy-400 mb-5">Total content pieces</p>

          <div className="space-y-3">
            {[
              { icon: AlertCircle, label: 'Critical Actions', value: recommendations.filter(r => r.priority === 'critical').length, color: 'text-red-500 bg-red-50' },
              { icon: Clock, label: 'In Progress', value: recommendations.filter(r => r.priority === 'high').length, color: 'text-yellow-500 bg-yellow-50' },
              { icon: CheckCircle, label: 'Completed', value: recommendations.filter(r => r.priority === 'low').length, color: 'text-teal-500 bg-teal-50' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-navy-600">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-navy-800">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Row: Traffic chart + Traffic sources ─── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <motion.div {...fade()} className="lg:col-span-2 bg-white rounded-xl border border-navy-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy-800">Traffic & Leads</h3>
              <p className="text-xs text-navy-400 mt-0.5">6-month trend</p>
            </div>
            <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">+24% vs last month</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={traffic.monthly}>
              <defs>
                <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e2f52" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#1e2f52" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14a88a" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#14a88a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8ecf3', fontSize: 12 }} />
              <Area type="monotone" dataKey="visits" stroke="#1e2f52" strokeWidth={2} fill="url(#gVisits)" />
              <Area type="monotone" dataKey="leads" stroke="#14a88a" strokeWidth={2} fill="url(#gLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spendings-by style: Geo insights */}
        <motion.div {...fade(1)} className="bg-white rounded-xl border border-navy-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-navy-800">{t('geoInsights', language)}</h3>
          </div>
          <div className="space-y-3">
            {geoInsights.topCities.map((city, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-navy-300 w-5">#{i + 1}</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-navy-700 truncate">{city.city}</span>
                </div>
                <div className="w-20 bg-navy-100 rounded-full h-1.5 flex-shrink-0">
                  <div className="bg-navy-600 rounded-full h-1.5" style={{ width: `${city.percentage}%` }} />
                </div>
                <span className="text-xs font-bold text-navy-700 w-8 text-right">{city.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-navy-100">
            <h4 className="text-xs font-bold text-navy-700 mb-2">Traffic Sources</h4>
            <div className="flex gap-2 flex-wrap">
              {traffic.sources.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-navy-500">{s.name}</span>
                  <span className="font-bold text-navy-700">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Row: Social + Recommendations ─── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Social media */}
        <motion.div {...fade()} className="bg-white rounded-xl border border-navy-100 p-6">
          <h3 className="text-sm font-bold text-navy-800 mb-4">Social Media Performance</h3>
          <div className="space-y-3">
            {socialMedia.platforms.map((p, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-navy-700">{p.name}</span>
                    <span className="text-xs font-bold text-teal-600">{p.engagement}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] text-navy-400">{p.followers.toLocaleString()} followers</span>
                    <span className="text-[11px] text-navy-400">{p.posts} posts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations preview */}
        <motion.div {...fade(1)} className="bg-white rounded-xl border border-navy-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-navy-800">{t('recommendationsTitle', language)}</h3>
            </div>
            <button onClick={() => navigate('/dashboard/recommendations')} className="text-xs font-semibold text-navy-500 hover:text-navy-700">
              View All
            </button>
          </div>
          <div className="space-y-2.5">
            {recommendations.slice(0, 3).map((rec, i) => {
              const colors = { critical: 'bg-red-500', high: 'bg-yellow-500', medium: 'bg-navy-400', low: 'bg-teal-500' };
              return (
                <div
                  key={i}
                  onClick={() => navigate('/dashboard/recommendations')}
                  className="flex items-start gap-3 p-3 rounded-lg bg-navy-50/50 hover:bg-navy-50 cursor-pointer transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors[rec.priority]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy-700">{rec.title.en}</p>
                    <p className="text-[11px] text-navy-400 mt-0.5">{rec.impact} • {rec.timeline}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-navy-300 flex-shrink-0 mt-0.5" />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ─── CTA ─── */}
      {!subscription && (
        <motion.div {...fade()} className="bg-navy-700 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Unlock Your Full Growth Potential</h3>
              <p className="text-sm text-navy-200">Subscribe to access automated marketing and lead generation.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/subscription')}
            className="px-5 py-2.5 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 text-sm flex-shrink-0"
          >
            View Plans
          </button>
        </motion.div>
      )}
    </div>
  );
};

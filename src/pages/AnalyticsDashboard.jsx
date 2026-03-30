import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Globe, Users, Star, MapPin,
  Eye, MousePointer, Share2, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

export const AnalyticsDashboard = () => {
  const { analyticsData, language, businessData } = useApp();
  if (!analyticsData) return null;

  const { digitalPresence, traffic, socialMedia, geoInsights } = analyticsData;
  const last = traffic.monthly[traffic.monthly.length - 1];
  const scoreColor = (s) => s < 30 ? '#ef4444' : s < 60 ? '#eab308' : '#14a88a';

  const StatCard = ({ icon: Icon, label, value, change, trend, i }) => (
    <motion.div {...fade(i)} className="bg-white rounded-xl border border-navy-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-navy-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-navy-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1.5">
              {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-teal-600" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
              <span className={`text-xs font-semibold ${trend === 'up' ? 'text-teal-600' : 'text-red-500'}`}>{change}</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-navy-600" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-900">{t('analytics', language)}</h1>
        <p className="text-sm text-navy-400 mt-0.5">{businessData?.businessName}'s digital performance</p>
      </div>

      {/* Digital Presence Hero */}
      <motion.div {...fade()} className="bg-navy-700 text-white rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-lg font-bold mb-4">{t('digitalPresence', language)}</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('websiteHealth', language), val: digitalPresence.website },
                { label: t('socialMediaScore', language), val: digitalPresence.socialMedia },
                { label: t('searchVisibility', language), val: digitalPresence.searchVisibility },
                { label: t('onlineReviews', language), val: digitalPresence.onlineReviews }
              ].map((m, i) => (
                <div key={i}>
                  <p className="text-navy-200 text-xs mb-1.5">{m.label}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/15 rounded-full h-1.5">
                      <div className="bg-teal-400 rounded-full h-1.5" style={{ width: `${m.val}%` }} />
                    </div>
                    <span className="text-xs font-bold">{m.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(digitalPresence.overall)} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(digitalPresence.overall / 100) * 327} 327`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{digitalPresence.overall}</span>
                <span className="text-xs text-navy-200">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label={t('monthlyVisits', language)} value={last?.visits} change="+24%" trend="up" i={0} />
        <StatCard icon={MousePointer} label={t('leadsGenerated', language)} value={last?.leads} change="+38%" trend="up" i={1} />
        <StatCard icon={Users} label="Total Followers" value={socialMedia.platforms.reduce((a, p) => a + p.followers, 0).toLocaleString()} change="+16%" trend="up" i={2} />
        <StatCard icon={Star} label="Avg. Engagement" value={`${(socialMedia.platforms.reduce((a, p) => a + p.engagement, 0) / socialMedia.platforms.length).toFixed(1)}%`} change="+12%" trend="up" i={3} />
      </div>

      {/* Traffic + Sources */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div {...fade()} className="lg:col-span-2 bg-white rounded-xl border border-navy-100 p-6">
          <h3 className="text-sm font-bold text-navy-800 mb-4">Traffic & Lead Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={traffic.monthly}>
              <defs>
                <linearGradient id="cV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e2f52" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#1e2f52" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14a88a" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#14a88a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8ecf3', fontSize: 12 }} />
              <Area type="monotone" dataKey="visits" stroke="#1e2f52" strokeWidth={2} fill="url(#cV)" />
              <Area type="monotone" dataKey="leads" stroke="#14a88a" strokeWidth={2} fill="url(#cL)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fade(1)} className="bg-white rounded-xl border border-navy-100 p-6">
          <h3 className="text-sm font-bold text-navy-800 mb-4">{t('trafficSources', language)}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={traffic.sources} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                {traffic.sources.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {traffic.sources.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-navy-600">{s.name}</span>
                </div>
                <span className="font-bold text-navy-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Social + Geo */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div {...fade()} className="bg-white rounded-xl border border-navy-100 p-6">
          <h3 className="text-sm font-bold text-navy-800 mb-4">Social Media Performance</h3>
          <div className="space-y-3">
            {socialMedia.platforms.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-navy-50/50 rounded-lg">
                <div className="w-9 h-9 bg-navy-700 rounded-lg flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
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

        <motion.div {...fade(1)} className="bg-white rounded-xl border border-navy-100 p-6">
          <h3 className="text-sm font-bold text-navy-800 mb-4">{t('geoInsights', language)}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={geoInsights.topCities} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf3" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: '#4a6490' }} width={80} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8ecf3', fontSize: 12 }} />
              <Bar dataKey="percentage" fill="#1e2f52" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

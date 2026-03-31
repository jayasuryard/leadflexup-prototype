import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, Users, Star, MapPin,
  Eye, MousePointer, Share2, Globe, Trophy, AlertTriangle,
  X, Check, Sparkles, Crown, Rocket, ArrowRight,
  Lightbulb, Activity, BarChart3, Search, Target, Zap, IndianRupee,
  Satellite, Layers, Map as MapIcon, Mountain
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { competitorDatabase, subscriptionPlans } from '../data/mockDatabase';

/* ─── Map marker icons ─── */
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const blueIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

/* ─── Map tile layers ─── */
const mapLayers = {
  satellite: {
    name: 'Satellite',
    icon: Satellite,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri'
  },
  hybrid: {
    name: 'Hybrid',
    icon: Layers,
    url: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
    attribution: '&copy; Esri'
  },
  street: {
    name: 'Street',
    icon: MapIcon,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap'
  },
  terrain: {
    name: 'Terrain',
    icon: Mountain,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap'
  }
};

/* ─── Subscription Popup ─── */
const SubscriptionPopup = ({ open, onClose, language, selectSubscription }) => {
  if (!open) return null;
  const planIcons = { starter: Sparkles, professional: Crown, enterprise: Rocket };
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-navy-800">{t('choosePlan', language)}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-50 text-navy-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => {
              const Icon = planIcons[plan.id];
              return (
                <div key={plan.id} className={`rounded-xl border-2 p-5 ${plan.recommended ? 'border-teal-500' : 'border-navy-100'}`}>
                  {plan.recommended && <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">{t('mostPopular', language)}</span>}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mt-2 mb-3 ${plan.recommended ? 'bg-teal-600' : 'bg-navy-700'}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-800">{getLocalizedText(plan.name, language)}</h3>
                  <p className="text-2xl font-bold text-navy-900 mt-1">{plan.currency}{(plan.price / 100000).toFixed(2)}L<span className="text-xs font-normal text-navy-400">{t('perMonth', language)}</span></p>
                  <div className="space-y-1.5 mt-3 mb-4">
                    {plan.features.slice(0, 4).map((f, j) => (
                      <div key={j} className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" /><span className="text-[11px] text-navy-600">{getLocalizedText(f, language)}</span></div>
                    ))}
                  </div>
                  <button onClick={() => { selectSubscription(plan); onClose(); }}
                    className={`w-full py-2 text-xs font-semibold rounded-lg ${plan.recommended ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-700 text-white hover:bg-navy-800'}`}>
                    {t('subscribe', language)}
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

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

/* ─── Radial gauge mini-component ─── */
const MiniGauge = ({ value, label, color }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r="32" fill="none" stroke="#e8ecf3" strokeWidth="6" />
        <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 201} 201`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-navy-100">{value}</span>
    </div>
    <span className="text-[9px] text-navy-50 mt-1 text-center leading-tight">{label}</span>
  </div>
);

export const AnalyticsDashboard = () => {
  const { analyticsData, language, businessData, recommendations, isAuthenticated, selectSubscription } = useApp();
  const [showPlans, setShowPlans] = useState(false);
  const [mapType, setMapType] = useState('satellite'); // Default to satellite
  const [showMapMenu, setShowMapMenu] = useState(false);
  const mapMenuRef = useRef(null);
  
  if (!analyticsData) return null;

  const { digitalPresence, traffic, socialMedia, geoInsights } = analyticsData;
  const last = traffic.monthly[traffic.monthly.length - 1];
  const prev = traffic.monthly[traffic.monthly.length - 2];
  const scoreColor = (s) => s < 30 ? '#ef4444' : s < 60 ? '#eab308' : '#14a88a';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mapMenuRef.current && !mapMenuRef.current.contains(event.target)) {
        setShowMapMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Computed deltas
  const visitDelta = prev && prev.visits > 0 ? Math.round(((last.visits - prev.visits) / prev.visits) * 100) : 0;
  const leadDelta = prev && prev.leads > 0 ? Math.round(((last.leads - prev.leads) / prev.leads) * 100) : 0;

  // Competitor data
  const competitors = competitorDatabase[businessData?.category] || competitorDatabase.restaurant;
  const userScore = digitalPresence.overall;
  const userEntry = { name: businessData?.businessName || 'Your Business', score: userScore, website: userScore > 50, socialMedia: Math.floor(userScore / 25), reviews: Math.floor(userScore * 3), monthlyVisits: Math.floor(userScore * 80), isUser: true };
  const leaderboard = [...competitors, userEntry].sort((a, b) => b.score - a.score);
  const userPosition = leaderboard.findIndex(i => i.isUser) + 1;
  const avgCompScore = Math.round(competitors.reduce((a, c) => a + c.score, 0) / competitors.length);

  // Map
  const bizLat = businessData?.lat || 12.9716;
  const bizLng = businessData?.lng || 77.5946;
  const competitorPositions = competitors.map((c, i) => ({
    ...c,
    lat: bizLat + (c.latOffset != null ? c.latOffset : (Math.sin(i * 2.4) * 0.015) + (i % 2 ? 0.005 : -0.005)),
    lng: bizLng + (c.lngOffset != null ? c.lngOffset : (Math.cos(i * 2.4) * 0.015) + (i % 2 ? -0.005 : 0.005)),
  }));

  // Gaps + recommendations merged
  const gaps = [];
  if (digitalPresence.website < 30) gaps.push({ key: 'noWebsite', icon: Globe, score: digitalPresence.website });
  if (digitalPresence.socialMedia < 30) gaps.push({ key: 'noSocial', icon: Share2, score: digitalPresence.socialMedia });
  if (digitalPresence.onlineReviews < 20) gaps.push({ key: 'noReviews', icon: Star, score: digitalPresence.onlineReviews });
  if (digitalPresence.searchVisibility < 25) gaps.push({ key: 'noSEO', icon: Eye, score: digitalPresence.searchVisibility });

  // Presence breakdown for radial chart
  const presenceData = [
    { name: t('websiteHealth', language), value: digitalPresence.website, fill: '#1e2f52' },
    { name: t('socialMediaScore', language), value: digitalPresence.socialMedia, fill: '#14a88a' },
    { name: t('searchVisibility', language), value: digitalPresence.searchVisibility, fill: '#6366f1' },
    { name: t('onlineReviews', language), value: digitalPresence.onlineReviews, fill: '#f59e0b' },
  ];

  // Conversion rate calc
  const convRate = last.visits > 0 ? ((last.leads / last.visits) * 100).toFixed(1) : '0';

  // ── Market opportunity (curated data based on competitor gap analysis) ──
  const topCompetitor = competitors[0] || { reviews: 300, monthlyVisits: 10000, score: 85 };
  const unclaimedSearches = Math.max(800, Math.round((100 - digitalPresence.searchVisibility) * 42));
  const reviewGap = Math.max(0, topCompetitor.reviews - Math.floor(userScore * 3));
  const socialAudience = Math.max(2000, Math.round((100 - digitalPresence.socialMedia) * 120));
  const untappedLeads = Math.max(30, Math.round((avgCompScore - userScore + 40) * 1.8));
  const revenuePotential = Math.round(untappedLeads * 2800);
  const mktOpportunities = [
    { icon: Search, key: 'adMktOppUnclaimed', descKey: 'adMktOppUnclaimedDesc', value: `${unclaimedSearches.toLocaleString()}+`, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
    { icon: Star, key: 'adMktOppReviewGap', descKey: 'adMktOppReviewGapDesc', value: `${reviewGap}+`, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    { icon: Users, key: 'adMktOppSocialReach', descKey: 'adMktOppSocialReachDesc', value: `${socialAudience.toLocaleString()}+`, color: 'bg-sky-50 text-sky-600', border: 'border-sky-100' },
    { icon: Target, key: 'adMktOppLeadPool', descKey: 'adMktOppLeadPoolDesc', value: `${untappedLeads}/mo`, color: 'bg-teal-50 text-teal-600', border: 'border-teal-100' },
  ];
  const mktWorkflows = [
    { key: 'adMktOppWf1', icon: Eye },
    { key: 'adMktOppWf2', icon: Star },
    { key: 'adMktOppWf3', icon: Share2 },
    { key: 'adMktOppWf4', icon: Target },
  ];

  // Curated lead opportunities for the market opportunity table
  const opportunityLeads = [
    { name: 'Google Search — "best ' + (businessData?.category || 'restaurant') + ' near me"', source: 'SEO', intent: 'Hot', value: '₹8,400', pct: 92 },
    { name: 'Instagram Discovery — local food lovers', source: 'Social', intent: 'Warm', value: '₹4,200', pct: 78 },
    { name: 'Google Maps — no top-3 competitor listing', source: 'Local SEO', intent: 'Hot', value: '₹6,800', pct: 88 },
    { name: 'Facebook Ads — lookalike audience', source: 'Paid', intent: 'Warm', value: '₹3,600', pct: 65 },
    { name: 'Review requests — happy customers', source: 'Reviews', intent: 'Medium', value: '₹2,100', pct: 55 },
    { name: 'Email nurture — past visitors', source: 'Email', intent: 'Warm', value: '₹5,400', pct: 72 },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <SubscriptionPopup open={showPlans} onClose={() => setShowPlans(false)} language={language} selectSubscription={selectSubscription} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('analytics', language)}</h1>
          <p className="text-sm text-navy-400 mt-0.5">{businessData?.businessName}</p>
        </div>
        {!isAuthenticated && (
          <button onClick={() => setShowPlans(true)} className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center gap-1.5 whitespace-nowrap">
            {t('signUpToUnlock', language)} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Layout Grid: Center Content + Right Sidebar */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-5">
        {/* Center Content */}
        <div className="space-y-4 sm:space-y-5">
          {/* ═══ BENTO GRID ═══ */}

      {/* Row 1: Score Hero (full width) */}
      <motion.div {...fade()} className="bg-navy-700 text-white rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(digitalPresence.overall)} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(digitalPresence.overall / 100) * 327} 327`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{digitalPresence.overall}</span>
              <span className="text-[9px] text-navy-200">{t('dlScoreOf', language)}</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-sm font-bold mb-3 text-center sm:text-left">{t('digitalPresence', language)}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <MiniGauge value={digitalPresence.website} label={t('websiteHealth', language)} color="#ffffff" />
              <MiniGauge value={digitalPresence.socialMedia} label={t('socialMediaScore', language)} color="#5eead4" />
              <MiniGauge value={digitalPresence.searchVisibility} label={t('searchVisibility', language)} color="#a5b4fc" />
              <MiniGauge value={digitalPresence.onlineReviews} label={t('onlineReviews', language)} color="#fbbf24" />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] mb-1.5">
            <span className="text-navy-200 text-[9px] sm:text-[10px]">#{userPosition} {t('of', language)} {leaderboard.length} — {t('yourBusiness', language)} vs {t('competitors', language)} avg</span>
            <span className="font-bold whitespace-nowrap">{userScore} <span className="text-navy-300 font-normal">vs</span> {avgCompScore}</span>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white/10">
            <div className="bg-teal-400 rounded-full" style={{ width: `${userScore}%` }} />
            <div className="bg-white/30 rounded-full" style={{ width: `${avgCompScore}%` }} />
          </div>
          <div className="flex justify-between text-[9px] text-navy-300 mt-1">
            <span>{t('adYouLabel', language)} {userScore}</span>
            <span>{t('adAvgLabel', language)} {avgCompScore}</span>
          </div>
        </div>
      </motion.div>

      {/* Row 2: Map (left 2/3) + KPI Cards (right 1/3 stacked) */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-3 sm:gap-4">
        {/* Map */}
        <motion.div {...fade()} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-navy-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy-800">{t('competitorMap', language)}</h3>
              <p className="text-[10px] text-navy-400">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" /> {t('yourBusiness', language)}
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-3 mr-1" /> {t('competitorPin', language)}
              </p>
            </div>
          </div>
          <div className="relative" style={{ height: '280px' }}>
            <MapContainer center={[bizLat, bizLng]} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false} attributionControl={false}>
              {/* Render tile layers based on map type */}
              {mapType === 'hybrid' ? (
                <>
                  <TileLayer
                    attribution={mapLayers.hybrid.attribution}
                    url={mapLayers.hybrid.url[0]}
                  />
                  <TileLayer
                    attribution={mapLayers.hybrid.attribution}
                    url={mapLayers.hybrid.url[1]}
                  />
                </>
              ) : (
                <TileLayer
                  attribution={mapLayers[mapType].attribution}
                  url={mapLayers[mapType].url}
                />
              )}
              <Marker position={[bizLat, bizLng]} icon={redIcon}>
                <Popup><strong>{businessData?.businessName || t('yourBusiness', language)}</strong><br />{t('adScore', language)} {userScore}</Popup>
              </Marker>
              {competitorPositions.map((c, i) => (
                <Marker key={i} position={[c.lat, c.lng]} icon={blueIcon}>
                  <Popup><strong>{c.name}</strong><br />{t('adScore', language)} {c.score}<br />{t('adReviews', language)} {c.reviews}</Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Map Type Switcher - Compact Dropdown */}
            <div ref={mapMenuRef} className="absolute top-3 right-3 z-[1000]">
              <button
                type="button"
                onClick={() => setShowMapMenu(!showMapMenu)}
                className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-navy-200/50 hover:bg-white transition-all"
                title={mapLayers[mapType].name}
              >
                {(() => {
                  const Icon = mapLayers[mapType].icon;
                  return <Icon className="w-4 h-4 text-navy-700" />;
                })()}
              </button>
              
              {showMapMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-navy-200/50 overflow-hidden min-w-[140px]">
                  {Object.entries(mapLayers).map(([key, layer]) => {
                    const Icon = layer.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setMapType(key);
                          setShowMapMenu(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                          mapType === key
                            ? 'bg-navy-700 text-white'
                            : 'text-navy-600 hover:bg-navy-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{layer.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 4 KPI Cards stacked in 2x2 - matching map height */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            { icon: Eye, label: t('monthlyVisits', language), value: last?.visits?.toLocaleString(), delta: `${visitDelta > 0 ? '+' : ''}${visitDelta}%`, up: visitDelta >= 0, accent: 'bg-navy-700' },
            { icon: MousePointer, label: t('leadsGenerated', language), value: last?.leads, delta: `${leadDelta > 0 ? '+' : ''}${leadDelta}%`, up: leadDelta >= 0, accent: 'bg-teal-600' },
            { icon: Activity, label: t('adConversionRate', language), value: `${convRate}%`, delta: '', up: true, accent: 'bg-indigo-600' },
            { icon: Users, label: t('totalFollowers', language), value: socialMedia.platforms.reduce((a, p) => a + p.followers, 0).toLocaleString(), delta: '+16%', up: true, accent: 'bg-amber-500' },
          ].map((s, i) => (
            <motion.div key={i} {...fade(i)} className="bg-white rounded-2xl border border-navy-100 p-3 sm:p-4 flex flex-col justify-between" style={{ minHeight: '130px' }}>
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 ${s.accent} rounded-xl flex items-center justify-center`}><s.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /></div>
                {s.delta && <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${s.up ? 'text-teal-600 bg-teal-50' : 'text-red-600 bg-red-50'}`}>{s.delta}</span>}
              </div>
              <div className="mt-auto">
                <p className="text-xl sm:text-2xl font-bold text-navy-900">{s.value}</p>
                <p className="text-[9px] sm:text-[10px] text-navy-400 mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Row 3: Leaderboard (full width) */}
      <motion.div {...fade()} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-navy-100">
          <h3 className="text-sm font-bold text-navy-800">{t('competitorLeaderboard', language)}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-navy-50">
              <tr>
                {['#', t('competitors', language), t('adScore', language), t('adWeb', language), t('adSocial', language), t('reviewCount', language), t('monthlyVisits', language)].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-navy-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {leaderboard.map((it, i) => (
                <tr key={i} className={it.isUser ? 'bg-teal-50/50' : 'hover:bg-navy-50/50'}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      {i < 3 && <Trophy className={`w-3 h-3 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-500'}`} />}
                      <span className="text-[11px] font-bold text-navy-800">{i + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-semibold ${it.isUser ? 'text-teal-700' : 'text-navy-800'}`}>{it.name}</span>
                      {it.isUser && <span className="text-[9px] font-bold bg-teal-100 text-teal-700 px-1 py-0.5 rounded">{t('adYouBadge', language)}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-navy-800">{it.score}</span>
                      <div className="w-16 bg-navy-100 rounded-full h-1.5"><div className={`${it.isUser ? 'bg-teal-500' : 'bg-navy-600'} rounded-full h-1.5`} style={{ width: `${it.score}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${it.website ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'}`}>
                      {it.website ? '✓' : '✗'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-0.5">{[...Array(4)].map((_, j) => (
                      <Star key={j} className={`w-2.5 h-2.5 ${j < it.socialMedia ? 'text-yellow-400 fill-yellow-400' : 'text-navy-200'}`} />
                    ))}</div>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] font-medium text-navy-700">{it.reviews}</td>
                  <td className="px-4 py-2.5 text-[11px] font-medium text-navy-700">{it.monthlyVisits?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Row 4: Traffic & Leads (2/3) + Traffic Sources (1/3) */}
      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">
        <motion.div {...fade()} className="lg:col-span-2 bg-white rounded-2xl border border-navy-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-navy-800">{t('adTrafficLeads', language)}</h3>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-navy-700 rounded-full" /> {t('adVisits', language)}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-500 rounded-full" /> {t('adLeads', language)}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={traffic.monthly}>
              <defs>
                <linearGradient id="aV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e2f52" stopOpacity={.15} /><stop offset="100%" stopColor="#1e2f52" stopOpacity={0} /></linearGradient>
                <linearGradient id="aL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14a88a" stopOpacity={.15} /><stop offset="100%" stopColor="#14a88a" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8ecf3', fontSize: 11 }} />
              <Area type="monotone" dataKey="visits" stroke="#1e2f52" strokeWidth={2} fill="url(#aV)" name={t('adVisits', language)} />
              <Area type="monotone" dataKey="leads" stroke="#14a88a" strokeWidth={2} fill="url(#aL)" name={t('adLeads', language)} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 p-4 sm:p-5">
          <h3 className="text-sm font-bold text-navy-800 mb-3">{t('trafficSources', language)}</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart><Pie data={traffic.sources} cx="50%" cy="50%" innerRadius={40} outerRadius={58} paddingAngle={4} dataKey="value">
              {traffic.sources.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {traffic.sources.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-navy-600">{s.name}</span></div>
                <span className="font-bold text-navy-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 5: Social Media (1/2) + Geographic Insights (1/2) */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
        <motion.div {...fade()} className="bg-white rounded-2xl border border-navy-100 p-4 sm:p-5">
          <h3 className="text-sm font-bold text-navy-800 mb-3">{t('adSocialMedia', language)}</h3>
          <div className="space-y-2">
            {socialMedia.platforms.map((p, i) => {
              const maxFollowers = Math.max(...socialMedia.platforms.map(pl => pl.followers));
              return (
                <div key={i} className="p-2.5 bg-navy-50/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-navy-700 rounded-lg flex items-center justify-center"><Share2 className="w-3 h-3 text-white" /></div>
                      <span className="text-[11px] font-semibold text-navy-700">{p.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-teal-600">{p.engagement}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-navy-100 rounded-full h-1.5"><div className="bg-navy-600 rounded-full h-1.5" style={{ width: `${(p.followers / maxFollowers) * 100}%` }} /></div>
                    <span className="text-[9px] text-navy-500 w-16 text-right">{p.followers.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 p-4 sm:p-5">
          <h3 className="text-sm font-bold text-navy-800 mb-3">{t('geoInsights', language)}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={geoInsights.topCities} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf3" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#8da5cd' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 10, fill: '#4a6490' }} width={70} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8ecf3', fontSize: 11 }} />
              <Bar dataKey="percentage" fill="#1e2f52" radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ═══ MARKET OPPORTUNITY — Morphing fade-in section ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative"
      >
        {/* Gradient fade-in overlay at top */}
        <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-navy-800/5 pointer-events-none rounded-t-3xl" />

        <div className="bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 rounded-2xl overflow-hidden relative">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative p-6 sm:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-11 h-11 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('adMktOppTitle', language)}</h3>
                <p className="text-xs text-navy-300">{t('adMktOppDesc', language)}</p>
              </div>
            </motion.div>

            {/* Opportunity metric cards — staggered fade */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {mktOpportunities.map((opp, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all group"
                >
                  <div className={`w-9 h-9 ${opp.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <opp.icon className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-white">{opp.value}</p>
                  <p className="text-[10px] font-semibold text-navy-100 mt-1">{t(opp.key, language)}</p>
                  <p className="text-[9px] text-navy-300 mt-0.5 leading-snug">{t(opp.descKey, language)}</p>
                </motion.div>
              ))}
            </div>

            {/* Revenue potential — morphing highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.55, duration: 0.6 }}
              className="p-5 bg-teal-500/15 rounded-xl border border-teal-400/20 mb-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-400/20 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-6 h-6 text-teal-300" />
                  </div>
                  <div>
                    <p className="text-[10px] text-teal-200 uppercase tracking-wider font-semibold">{t('adMktOppRevenue', language)}</p>
                    <p className="text-3xl font-bold text-white">₹{revenuePotential.toLocaleString('en-IN')}<span className="text-base font-normal text-teal-200">/mo</span></p>
                    <p className="text-[10px] text-navy-300">{t('adMktOppRevenueDesc', language)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-400/10 rounded-full border border-teal-400/20">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-teal-200">{t('adMktOppRevenueTime', language)}</span>
                </div>
              </div>
            </motion.div>

            {/* Lead opportunity table — morphing rows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.65, duration: 0.5 }}
              className="mb-6"
            >
              <h4 className="text-xs font-bold text-navy-100 mb-3 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-teal-400" />
                {t('adMktOppLeadsTitle', language)}
              </h4>
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      {[t('adMktOppLeadName', language), t('adMktOppLeadSource', language), t('adMktOppLeadIntent', language), t('adMktOppLeadValue', language), t('adMktOppLeadStatus', language)].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[9px] font-semibold text-navy-300 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {opportunityLeads.map((lead, i) => {
                      const intentColors = { Hot: 'bg-red-400/20 text-red-300', Warm: 'bg-amber-400/20 text-amber-300', Medium: 'bg-sky-400/20 text-sky-300' };
                      return (
                        <motion.tr key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7 + i * 0.08 }}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-medium text-navy-100">{lead.name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-semibold text-navy-200 bg-white/10 px-2 py-0.5 rounded">{lead.source}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${intentColors[lead.intent]}`}>{lead.intent === 'Hot' ? t('adMktOppHot', language) : lead.intent === 'Warm' ? t('adMktOppWarm', language) : t('adMktOppMedium', language)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-bold text-teal-300">{lead.value}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 bg-white/10 rounded-full h-1.5 max-w-[60px]">
                                <div className="bg-teal-400 rounded-full h-1.5" style={{ width: `${lead.pct}%` }} />
                              </div>
                              <span className="text-[9px] font-medium text-teal-300">{t('adMktOppAvailable', language)}</span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Automation workflows */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.5 }}
              className="pt-5 border-t border-white/10 mb-5"
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <p className="text-[11px] font-bold text-navy-100">{t('adMktOppAutomate', language)}</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {mktWorkflows.map((wf, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: 1 + i * 0.08 }}
                    className="flex items-center gap-2 px-3 py-2.5 bg-white/5 rounded-lg border border-white/8 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <wf.icon className="w-3.5 h-3.5 text-teal-300" />
                    </div>
                    <span className="text-[10px] font-medium text-navy-100">{t(wf.key, language)}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-[9px] text-navy-400 mt-2 text-center">{t('adMktOppReady', language)}</p>
            </motion.div>

            {/* CTA — morphing button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 1.1, duration: 0.4 }}
              onClick={() => setShowPlans(true)}
              className="w-full py-4 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all hover:scale-[1.01]"
            >
              {t('adMktOppGrabIt', language)} <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
        </div>
        {/* End of Center Content */}

        {/* Right Sidebar - Sticky */}
        <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-5 lg:self-start">
          {/* Improve Your Presence (Gaps) */}
          <motion.div {...fade()} className="bg-white rounded-2xl border border-navy-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-bold text-navy-800">{t('gapTitle', language)}</h3>
            </div>
            <p className="text-[11px] text-navy-400 mb-4 leading-relaxed">{t('gapDesc', language)}</p>
            <div className="space-y-2.5">
              {gaps.length > 0 ? gaps.map((gap, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-50/60 rounded-lg border border-red-100">
                  <gap.icon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-navy-700">{t(gap.key, language)}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 bg-red-100 rounded-full h-1"><div className="bg-red-400 rounded-full h-1" style={{ width: `${gap.score}%` }} /></div>
                      <span className="text-[9px] font-bold text-red-500">{gap.score}/100</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-100 text-center">
                  <Check className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <p className="text-[11px] font-semibold text-teal-700">{t('adLookingGood', language)}</p>
                </div>
              )}
            </div>
            {gaps.length > 0 && (
              <button onClick={() => setShowPlans(true)}
                className="w-full mt-4 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1.5">
                {t('letsHelp', language)} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>

          {/* Smart Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 p-4 sm:p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <Lightbulb className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-navy-800">{t('recommendationsTitle', language)}</h3>
              </div>
              <div className="space-y-2.5">
                {recommendations.slice(0, 5).map((rec, i) => {
                  const colors = { critical: 'bg-red-500', high: 'bg-yellow-500', medium: 'bg-navy-400', low: 'bg-teal-500' };
                  return (
                    <div key={i} className="flex items-start gap-2.5 p-3 bg-navy-50/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors[rec.priority]}`} />
                      <div>
                        <p className="text-[11px] font-semibold text-navy-700">{getLocalizedText(rec.title, language)}</p>
                        <p className="text-[9px] text-navy-400 mt-0.5">{rec.impact} • {rec.timeline}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
        {/* End of Right Sidebar */}
      </div>
      {/* End of Main Layout Grid */}
    </div>
  );
};

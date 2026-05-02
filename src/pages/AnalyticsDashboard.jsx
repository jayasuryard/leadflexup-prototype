import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, Star, MapPin,
  Eye, MousePointer, Share2, Globe, Trophy, AlertTriangle,
  X, Check, Sparkles, Crown, Rocket, ArrowRight,
  Lightbulb, Activity, BarChart3, Search, Target, Zap, IndianRupee,
  Satellite, Layers, Map as MapIcon, Mountain,
  Phone, Mail, Calendar, Clock, CheckCircle2,
  Wallet, Banknote, Receipt, CircleDollarSign, UserPlus,
  ChevronRight, ArrowUpRight, Megaphone, Camera
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { t, getLocalizedText } from '../utils/i18n';
import { competitorDatabase, subscriptionPlans } from '../data/mockDatabase';
import { Commentable } from '../components/CommentBox';

/* --- Animation helper --- */
const fade = (i = 0) => ({
  initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 }
});

/* --- Layman-friendly chart tooltip --- */
const SimpleTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-navy-100 text-xs">
      <p className="text-navy-400 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-navy-900 font-bold">{prefix}{p.value?.toLocaleString()}{suffix}</p>
      ))}
    </div>
  );
};

/* --- Map marker icons --- */
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

/* --- Map tile layers --- */
const mapLayers = {
  satellite: { name: 'Satellite', icon: Satellite, url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '© Esri' },
  hybrid: { name: 'Hybrid', icon: Layers, url: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'], attribution: '© Esri' },
  street: { name: 'Street', icon: MapIcon, url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap' },
  terrain: { name: 'Terrain', icon: Mountain, url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attribution: '© OpenTopoMap' }
};

/* --- Demo Booking Modal --- */
const DemoBookingModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', time: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const timeSlots = ['10:00 AM – 10:30 AM', '11:00 AM – 11:30 AM', '12:00 PM – 12:30 PM', '2:00 PM – 2:30 PM', '3:00 PM – 3:30 PM', '5:00 PM – 5:30 PM'];
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit mobile required';
    if (!form.business.trim()) e.business = 'Business name is required';
    if (!form.time) e.time = 'Please select a time slot';
    return e;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setStep(2);
  };
  const handleClose = () => { onClose(); setTimeout(() => { setStep(1); setForm({ name: '', email: '', phone: '', business: '', time: '' }); setErrors({}); }, 400); };
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4" onClick={handleClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          {step === 1 ? (
            <>
              <div className="bg-linear-to-r from-navy-800 to-teal-800 px-6 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-teal-400/20 rounded-lg flex items-center justify-center"><Phone className="w-4 h-4 text-teal-300" /></div>
                      <span className="text-[11px] font-bold text-teal-300 uppercase tracking-widest">Growth Expert Session</span>
                    </div>
                    <h2 className="text-xl font-bold text-white leading-tight">Book a Demo Call</h2>
                    <p className="text-sm text-navy-200 mt-1">Talk to a LeadFlexUp Growth Expert.</p>
                  </div>
                  <button onClick={handleClose} className="p-1.5 hover:bg-white/10 rounded-lg text-navy-300 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-teal-500 text-white px-3 py-1.5 rounded-lg"><IndianRupee className="w-3.5 h-3.5" /><span className="text-sm font-bold">499</span><span className="text-[10px] opacity-80">one-time</span></div>
                  <div className="flex items-center gap-1.5 text-[11px] text-navy-200"><Clock className="w-3.5 h-3.5 text-teal-400" /><span>30-min session</span></div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-semibold text-navy-600 mb-1 block">Your Name *</label><input type="text" placeholder="Rajesh Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.name ? 'border-red-400 bg-red-50' : 'border-navy-200'}`} />{errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}</div>
                  <div><label className="text-xs font-semibold text-navy-600 mb-1 block">Business Name *</label><input type="text" placeholder="Hotel Sunrise" value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.business ? 'border-red-400 bg-red-50' : 'border-navy-200'}`} />{errors.business && <p className="text-red-500 text-[10px] mt-1">{errors.business}</p>}</div>
                </div>
                <div><label className="text-xs font-semibold text-navy-600 mb-1 block">Email *</label><div className="relative"><Mail className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="email" placeholder="you@business.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.email ? 'border-red-400 bg-red-50' : 'border-navy-200'}`} /></div>{errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}</div>
                <div><label className="text-xs font-semibold text-navy-600 mb-1 block">Mobile *</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-navy-500 font-medium">+91</span><input type="tel" placeholder="9876543210" maxLength={10} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))} className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.phone ? 'border-red-400 bg-red-50' : 'border-navy-200'}`} /></div>{errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}</div>
                <div><label className="text-xs font-semibold text-navy-600 mb-1.5 block">Preferred Time *</label><div className="grid grid-cols-3 gap-2">{timeSlots.map(slot => (<button key={slot} type="button" onClick={() => setForm(f => ({ ...f, time: slot }))} className={`px-2 py-2 rounded-lg text-[11px] font-medium border transition-all ${form.time === slot ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-navy-600 border-navy-200 hover:border-teal-400'}`}>{slot}</button>))}</div>{errors.time && <p className="text-red-500 text-[10px] mt-1">{errors.time}</p>}</div>
                <button type="submit" disabled={submitting} className="w-full py-3 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 flex items-center justify-center gap-2 disabled:opacity-60">{submitting ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Booking...</> : <><IndianRupee className="w-4 h-4" /> Pay ₹499 & Book Demo</>}</button>
              </form>
            </>
          ) : (
            <div className="px-8 py-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5"><CheckCircle2 className="w-10 h-10 text-teal-600" /></motion.div>
              <h3 className="text-xl font-bold text-navy-800 mb-2">Booking Confirmed!</h3>
              <p className="text-sm text-navy-500 mb-6">Our Growth Expert will reach out to <strong>{form.email}</strong> soon.</p>
              <button onClick={handleClose} className="w-full py-3 bg-navy-700 text-white text-sm font-bold rounded-xl hover:bg-navy-800">Done</button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* --- Subscription Popup --- */
const SubscriptionPopup = ({ open, onClose, language, selectSubscription }) => {
  const [isYearly, setIsYearly] = useState(false);
  const nav = useNavigate();
  if (!open) return null;
  const planIcons = { starter: Sparkles, professional: Crown, enterprise: Rocket };
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-navy-800">{t('choosePlan', language)}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-50 text-navy-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className={`text-xs font-medium ${!isYearly ? 'text-navy-900' : 'text-navy-400'}`}>Monthly</span>
            <button onClick={() => setIsYearly(!isYearly)} className="relative w-12 h-6 rounded-full transition-colors" style={{ backgroundColor: isYearly ? '#0d9488' : '#cbd5e1' }}>
              <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform" style={{ transform: isYearly ? 'translateX(24px)' : 'translateX(0)' }} />
            </button>
            <span className={`text-xs font-medium ${isYearly ? 'text-navy-900' : 'text-navy-400'}`}>Yearly <span className="text-teal-600 text-[10px]">(Save 16%)</span></span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => {
              const Icon = planIcons[plan.id];
              return (
                <div key={plan.id} className={`rounded-xl border-2 p-5 ${plan.recommended ? 'border-teal-500' : 'border-navy-100'}`}>
                  {plan.recommended && <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">{t('mostPopular', language)}</span>}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mt-2 mb-3 ${plan.recommended ? 'bg-teal-600' : 'bg-navy-700'}`}><Icon className="w-4 h-4 text-white" /></div>
                  <h3 className="text-sm font-bold text-navy-800">{getLocalizedText(plan.name, language)}</h3>
                  <p className="text-2xl font-bold text-navy-900 mt-1">{plan.currency}{((isYearly ? plan.yearlyPrice : plan.price) / 100).toFixed(0)}<span className="text-xs font-normal text-navy-400">/{t('perMonth', language)}</span></p>
                  <div className="space-y-1.5 mt-3 mb-4">{plan.features.slice(0, 4).map((f, j) => (<div key={j} className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" /><span className="text-[11px] text-navy-600">{getLocalizedText(f, language)}</span></div>))}</div>
                  <button onClick={() => { onClose(); nav('/checkout', { state: { planId: plan.id, isYearly } }); }} className={`w-full py-2 text-xs font-semibold rounded-lg ${plan.recommended ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-700 text-white hover:bg-navy-800'}`}>{t('subscribe', language)}</button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* --- Copilot Response Helper --- */
const getCopilotResponse = (query, businessData) => {
  const q = query.toLowerCase();
  const name = businessData?.name || 'your business';
  if (q.includes('score') || q.includes('presence')) return `Your overall digital presence score is looking strong! Here's what I see for ${name}:\n\n\u2022 Google listing: Active but could use more photos\n\u2022 Website: Good \u2014 consider adding testimonials\n\u2022 Social media: Regular posting, keep it up!\n\nFocus on getting more Google reviews this week.`;
  if (q.includes('lead') || q.includes('convert')) return `Based on your lead data:\n\n1. Hot leads (score > 80) \u2014 contact today!\n2. Warm leads from Google \u2014 3x higher conversion\n3. Returning visitors \u2014 a WhatsApp message can close the deal\n\nWant me to draft a follow-up message?`;
  if (q.includes('marketing') || q.includes('idea')) return `Marketing ideas for ${name}:\n\n\ud83c\udfaf Quick wins:\n\u2022 Post a behind-the-scenes reel\n\u2022 Ask 5 happy customers for a Google review\n\u2022 Share a special offer on WhatsApp status\n\n\ud83d\udcc8 This month:\n\u2022 Start a weekly content series\n\u2022 Run a small Google Ads campaign\n\u2022 Partner with a local business`;
  if (q.includes('traffic') || q.includes('visitor')) return `Traffic analysis for ${name}:\n\n\ud83d\udcca Key insights:\n1. Peak days: Tuesday and Saturday \u2014 post content then!\n2. Top source: Google Search \u2014 keep listing updated\n3. Mobile: 78% of traffic \u2014 make sure site is fast\n\n\ud83d\udca1 Add \"near me\" keywords to increase local traffic by 20%.`;
  return `Here are my thoughts for ${name}:\n\n\u2022 Business is performing well with room to grow\n\u2022 Leverage existing customers for referrals\n\u2022 Consider a limited-time offer for foot traffic\n\nWould you like me to dive deeper into leads, marketing, or analytics?`;
};

/* ========== MAIN COMPONENT ========== */
export const AnalyticsDashboard = () => {
  const { analyticsData, language, businessData, recommendations, isAuthenticated, selectSubscription, subscription } = useApp();
  const navigate = useNavigate();
  const [showPlans, setShowPlans] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [mapType, setMapType] = useState('hybrid');
  const [showMapMenu, setShowMapMenu] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState([]);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotThinking, setCopilotThinking] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const copilotEndRef = useRef(null);
  const mapMenuRef = useRef(null);

  useEffect(() => { if (copilotEndRef.current) copilotEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [copilotMessages, copilotThinking]);
  useEffect(() => { const h = (e) => { if (mapMenuRef.current && !mapMenuRef.current.contains(e.target)) setShowMapMenu(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);

  if (!analyticsData) return null;

  const { digitalPresence, traffic, socialMedia, geoInsights } = analyticsData;
  const last = traffic.monthly[traffic.monthly.length - 1];
  const prev = traffic.monthly[traffic.monthly.length - 2];

  /* --- Computed Metrics --- */
  const visitDelta = prev?.visits > 0 ? Math.round(((last.visits - prev.visits) / prev.visits) * 100) : 0;
  const leadDelta = prev?.leads > 0 ? Math.round(((last.leads - prev.leads) / prev.leads) * 100) : 0;
  const convRate = last.visits > 0 ? ((last.leads / last.visits) * 100).toFixed(1) : '0';
  const totalFollowers = socialMedia.platforms.reduce((a, p) => a + p.followers, 0);

  /* --- Financial --- */
  const monthlyLeads = last.leads;
  const monthlyVisits = last.visits;
  const estimatedRevenue = monthlyLeads * 2500;
  const subscriptionCost = subscription?.price ? subscription.price / 100 : 14999;
  const profit = estimatedRevenue - subscriptionCost;
  const roi = subscriptionCost > 0 ? Math.round((estimatedRevenue - subscriptionCost) / subscriptionCost * 100) : 0;
  const costPerLead = monthlyLeads > 0 ? Math.round(subscriptionCost / monthlyLeads) : 0;
  const estimatedCustomers = Math.round(monthlyLeads * 0.25);
  const costPerCustomer = estimatedCustomers > 0 ? Math.round(subscriptionCost / estimatedCustomers) : 0;

  /* --- Chart Data --- */
  const revenueChartData = useMemo(() => traffic.monthly.map(m => ({
    name: m.month, revenue: m.leads * 2500, cost: Math.round(subscriptionCost / 6), leads: m.leads, visits: m.visits
  })), [traffic, subscriptionCost]);

  const weeklyData = useMemo(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({
    name: d, visitors: Math.round(monthlyVisits / 7 * (0.7 + Math.sin(i) * 0.5)), leads: Math.round(monthlyLeads / 7 * (0.6 + Math.cos(i) * 0.6))
  })), [monthlyVisits, monthlyLeads]);

  const conversionFunnel = [
    { stage: 'People who saw your business', value: monthlyVisits, pct: 100 },
    { stage: 'People who clicked / explored', value: Math.round(monthlyVisits * 0.6), pct: 60 },
    { stage: 'People who showed interest', value: Math.round(monthlyVisits * 0.25), pct: 25 },
    { stage: 'People who contacted you', value: monthlyLeads, pct: monthlyVisits > 0 ? Math.round((monthlyLeads / monthlyVisits) * 100) : 0 },
    { stage: 'Became paying customers', value: estimatedCustomers, pct: monthlyVisits > 0 ? Math.round((estimatedCustomers / monthlyVisits) * 100) : 0 },
  ];

  /* --- Competitors --- */
  const competitors = competitorDatabase[businessData?.category] || competitorDatabase.restaurant;
  const userScore = digitalPresence.overall;
  const sortedCompetitors = [...competitors].sort((a, b) => b.score - a.score);
  const avgCompScore = Math.round(sortedCompetitors.slice(0, 10).reduce((a, c) => a + c.score, 0) / Math.min(10, sortedCompetitors.length));
  const userPosition = sortedCompetitors.filter(c => c.score > userScore).length + 1;

  /* --- Map --- */
  const bizLat = businessData?.lat || 12.9716;
  const bizLng = businessData?.lng || 77.5946;
  const competitorPositions = competitors.map((c, i) => ({
    ...c, lat: bizLat + (c.latOffset != null ? c.latOffset : (Math.sin(i * 2.4) * 0.015)), lng: bizLng + (c.lngOffset != null ? c.lngOffset : (Math.cos(i * 2.4) * 0.015))
  }));

  /* --- Market Opportunity Data (pre-signup) --- */
  const topCompetitor = sortedCompetitors[0] || { reviews: 300, monthlyVisits: 10000, score: 85 };
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
  const opportunityLeads = [
    { name: 'Rahul M. searched "best ' + (businessData?.category || 'restaurant') + ' near me" 2h ago', source: 'Google', intent: 'Hot', value: '₹12,000', pct: 96, avatar: '🔴', action: 'Show Ad Now' },
    { name: 'Priya S. visited competitor page, read reviews for 4 min', source: 'Competitor', intent: 'Hot', value: '₹8,400', pct: 91, avatar: '🔴', action: 'Retarget' },
    { name: 'Arun K. posted "looking for good ' + (businessData?.category || 'restaurant') + '" on Instagram', source: 'Social', intent: 'Hot', value: '₹6,200', pct: 88, avatar: '🟠', action: 'DM Offer' },
    { name: 'Meera J. — left 5★ at competitor, lives 1.2km from you', source: 'Reviews', intent: 'Warm', value: '₹5,800', pct: 82, avatar: '🟠', action: 'Invite' },
    { name: 'Vikram D. — booked competitor twice this month, avg spend ₹3,200', source: 'Intel', intent: 'Warm', value: '₹9,600', pct: 79, avatar: '🟡', action: 'Offer Deal' },
    { name: 'Deepa R. — engaged with your Google listing but didn\'t call', source: 'GMB', intent: 'Warm', value: '₹4,500', pct: 75, avatar: '🟡', action: 'Follow Up' },
    { name: 'Karthik N. — event planner, sourcing vendors this week', source: 'LinkedIn', intent: 'Hot', value: '₹28,000', pct: 94, avatar: '🔴', action: 'Pitch Now' },
    { name: 'Anitha B. — repeat customer gone silent for 45 days', source: 'CRM', intent: 'Medium', value: '₹3,800', pct: 62, avatar: '🟡', action: 'Win Back' },
  ];

  /* --- Score Color --- */
  const scoreColor = (s) => s >= 60 ? '#10b981' : s >= 30 ? '#f59e0b' : '#ef4444';
  const scoreLabel = (s) => s >= 60 ? 'Good' : s >= 30 ? 'Fair' : 'Needs Work';

  /* --- Tabs for navigation --- */
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue & Money', icon: Wallet },
    { id: 'traffic', label: 'Visitors & Leads', icon: Eye },
    { id: 'health', label: 'Health Scores', icon: Activity },
    { id: 'competitors', label: 'Competitors', icon: Trophy },
    { id: 'social', label: 'Social Media', icon: Share2 },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <SubscriptionPopup open={showPlans} onClose={() => setShowPlans(false)} language={language} selectSubscription={selectSubscription} />
      <DemoBookingModal open={showDemoModal} onClose={() => setShowDemoModal(false)} />

      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">{isAuthenticated ? 'Detailed Analytics' : t('analytics', language)}</h1>
          <p className="text-sm text-navy-400 mt-0.5">{isAuthenticated ? <>Deep dive into how <span className="font-semibold text-navy-600">{businessData?.businessName || 'your business'}</span> is performing</> : businessData?.businessName}</p>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button onClick={() => navigate('/dashboard')} className="px-3 py-2 text-xs font-medium text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100 flex items-center gap-1.5">
              <ArrowRight className="w-3 h-3 rotate-180" /> Back to Home
            </button>
          )}
          {!isAuthenticated && (
            <button onClick={() => setShowPlans(true)} className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center gap-1.5">
              {t('signUpToUnlock', language)} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* === TAB NAVIGATION (only for authenticated users) === */}
      {isAuthenticated && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-teal-600 text-white shadow-sm' : 'text-navy-500 hover:bg-navy-50 hover:text-navy-700'}`}>
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* === PRE-SIGNUP VIEW (Old-style analytics) === */}
      {!isAuthenticated && (
        <Commentable id="analytics-presignup" label="Analytics - Pre-Signup View">
        <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-5">
          <div className="space-y-4 sm:space-y-5">
            {/* Score Hero */}
            <Commentable id="analytics-score-hero" label="Digital Presence Score Card">
            <motion.div {...fade()} className="bg-navy-700 text-white rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(userScore)} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(userScore / 100) * 327} 327`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-bold">{userScore}</span>
                    <span className="text-[10px] text-navy-200 mt-0.5">{t('dlScoreOf', language)}</span>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <h2 className="text-base font-bold mb-4 text-center sm:text-left">{t('digitalPresence', language)}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { value: digitalPresence.website, label: t('websiteHealth', language), color: '#ffffff' },
                      { value: digitalPresence.socialMedia, label: t('socialMediaScore', language), color: '#5eead4' },
                      { value: digitalPresence.searchVisibility, label: t('searchVisibility', language), color: '#a5b4fc' },
                      { value: digitalPresence.onlineReviews, label: t('onlineReviews', language), color: '#fbbf24' },
                    ].map((g, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="relative w-20 h-20">
                          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="32" fill="none" stroke="#e8ecf3" strokeWidth="6" />
                            <circle cx="40" cy="40" r="32" fill="none" stroke={g.color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(g.value / 100) * 201} 201`} />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-navy-100">{g.value}</span>
                        </div>
                        <span className="text-[10px] text-navy-50 mt-1.5 text-center leading-tight font-medium">{g.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] mb-1.5">
                  <span className="text-navy-200">#{userPosition} {t('of', language)} {competitors.length + 1} — {t('yourBusiness', language)} vs {t('competitors', language)} avg</span>
                  <span className="font-bold">{userScore} <span className="text-navy-300 font-normal">vs</span> {avgCompScore}</span>
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
            </Commentable>

            {/* Leaderboard */}
            <Commentable id="analytics-leaderboard" label="Competitor Leaderboard Table">
            <motion.div {...fade()} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-navy-100">
                <h3 className="text-sm font-bold text-navy-800">{t('competitorLeaderboard', language)}</h3>
                <p className="text-[10px] text-navy-400 mt-0.5">Within 5km radius • Top 10 businesses</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-150">
                  <thead className="bg-navy-50">
                    <tr>
                      {['#', t('competitors', language), t('adScore', language), t('adWeb', language), t('adSocial', language), t('reviewCount', language), t('monthlyVisits', language)].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-navy-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {sortedCompetitors.slice(0, 10).map((c, i) => (
                      <tr key={i} className="hover:bg-navy-50/50">
                        <td className="px-4 py-2.5"><div className="flex items-center gap-1">{i < 3 && <Trophy className={`w-3 h-3 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-500'}`} />}<span className="text-[11px] font-bold text-navy-800">{i + 1}</span></div></td>
                        <td className="px-4 py-2.5 text-[11px] font-semibold text-navy-800">{c.name}</td>
                        <td className="px-4 py-2.5"><div className="flex items-center gap-1.5"><span className="text-[11px] font-bold">{c.score}</span><div className="w-16 bg-navy-100 rounded-full h-1.5"><div className="bg-navy-600 rounded-full h-1.5" style={{ width: `${c.score}%` }} /></div></div></td>
                        <td className="px-4 py-2.5"><span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.website ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'}`}>{c.website ? '✓' : '✗'}</span></td>
                        <td className="px-4 py-2.5"><div className="flex gap-0.5">{[...Array(4)].map((_, j) => <Star key={j} className={`w-2.5 h-2.5 ${j < c.socialMedia ? 'text-yellow-400 fill-yellow-400' : 'text-navy-200'}`} />)}</div></td>
                        <td className="px-4 py-2.5 text-[11px] font-medium text-navy-700">{c.reviews}</td>
                        <td className="px-4 py-2.5 text-[11px] font-medium text-navy-700">{c.monthlyVisits?.toLocaleString()}</td>
                      </tr>
                    ))}
                    {/* User row */}
                    <tr className="bg-teal-50/50">
                      <td className="px-4 py-2.5"><span className="text-[11px] font-bold text-teal-700">{userPosition}</span></td>
                      <td className="px-4 py-2.5"><div className="flex items-center gap-1.5"><span className="text-[11px] font-bold text-teal-700">{businessData?.businessName || 'You'}</span><span className="text-[9px] font-bold bg-teal-100 text-teal-700 px-1 py-0.5 rounded">{t('adYouBadge', language)}</span></div></td>
                      <td className="px-4 py-2.5"><div className="flex items-center gap-1.5"><span className="text-[11px] font-bold text-teal-700">{userScore}</span><div className="w-16 bg-teal-100 rounded-full h-1.5"><div className="bg-teal-500 rounded-full h-1.5" style={{ width: `${userScore}%` }} /></div></div></td>
                      <td className="px-4 py-2.5"><span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700">✓</span></td>
                      <td className="px-4 py-2.5"><div className="flex gap-0.5">{[...Array(4)].map((_, j) => <Star key={j} className={`w-2.5 h-2.5 ${j < 2 ? 'text-yellow-400 fill-yellow-400' : 'text-navy-200'}`} />)}</div></td>
                      <td className="px-4 py-2.5 text-[11px] font-bold text-teal-700">{Math.round(userScore * 3)}</td>
                      <td className="px-4 py-2.5 text-[11px] font-bold text-teal-700">{monthlyVisits.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
            </Commentable>

            {/* Traffic & Leads + Sources */}
            <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">
              <Commentable id="analytics-traffic-chart" label="Traffic & Leads Area Chart">
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
              </Commentable>
              <Commentable id="analytics-traffic-sources" label="Traffic Sources Pie Chart">
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
              </Commentable>
            </div>

            {/* Social Media + Geographic */}
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
              <Commentable id="analytics-social-media" label="Social Media Platforms Card">
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
              </Commentable>
              <Commentable id="analytics-geo-insights" label="Geographic Insights Bar Chart">
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
              </Commentable>
            </div>

            {/* Market Map */}
            <Commentable id="analytics-market-map" label="Competitor Map with Locations">
            <motion.div {...fade(2)} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-navy-100">
                <h3 className="text-sm font-bold text-navy-800">{t('competitorMap', language)}</h3>
                <p className="text-[10px] text-navy-400">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" /> {t('yourBusiness', language)}
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-3 mr-1" /> {t('competitorPin', language)}
                </p>
              </div>
              <div className="relative" style={{ height: '320px' }}>
                <MapContainer center={[bizLat, bizLng]} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false} attributionControl={false}>
                  {mapType === 'hybrid' ? (<><TileLayer attribution={mapLayers.hybrid.attribution} url={mapLayers.hybrid.url[0]} /><TileLayer attribution={mapLayers.hybrid.attribution} url={mapLayers.hybrid.url[1]} /></>) : (<TileLayer attribution={mapLayers[mapType].attribution} url={mapLayers[mapType].url} />)}
                  <Marker position={[bizLat, bizLng]} icon={redIcon}><Popup><strong>{businessData?.businessName || t('yourBusiness', language)}</strong><br />{t('adScore', language)} {userScore}</Popup></Marker>
                  {competitorPositions.map((c, i) => (<Marker key={i} position={[c.lat, c.lng]} icon={blueIcon}><Popup><strong>{c.name}</strong><br />{t('adScore', language)} {c.score}<br />{t('adReviews', language)} {c.reviews}</Popup></Marker>))}
                </MapContainer>
                <div ref={mapMenuRef} className="absolute top-3 right-3 z-1000">
                  <button type="button" onClick={() => setShowMapMenu(!showMapMenu)} className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-navy-200/50 hover:bg-white">
                    {(() => { const Icon = mapLayers[mapType].icon; return <Icon className="w-4 h-4 text-navy-700" />; })()}
                  </button>
                  {showMapMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-navy-200/50 overflow-hidden min-w-35">
                      {Object.entries(mapLayers).map(([key, layer]) => { const Icon = layer.icon; return (
                        <button key={key} type="button" onClick={() => { setMapType(key); setShowMapMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium ${mapType === key ? 'bg-navy-700 text-white' : 'text-navy-600 hover:bg-navy-50'}`}><Icon className="w-3.5 h-3.5" /><span>{layer.name}</span></button>
                      ); })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            </Commentable>

            {/* KPI Cards */}
            <Commentable id="analytics-kpi-cards" label="KPI Stats Cards (Visits, Leads, Conversion, Followers)">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: Eye, label: t('monthlyVisits', language), value: last?.visits?.toLocaleString(), delta: `${visitDelta > 0 ? '+' : ''}${visitDelta}%`, up: visitDelta >= 0, accent: 'bg-navy-700' },
                { icon: MousePointer, label: t('leadsGenerated', language), value: last?.leads, delta: `${leadDelta > 0 ? '+' : ''}${leadDelta}%`, up: leadDelta >= 0, accent: 'bg-teal-600' },
                { icon: Activity, label: t('adConversionRate', language), value: `${convRate}%`, delta: '', up: true, accent: 'bg-indigo-600' },
                { icon: Users, label: t('totalFollowers', language), value: totalFollowers.toLocaleString(), delta: '+16%', up: true, accent: 'bg-amber-500' },
              ].map((s, i) => (
                <motion.div key={i} {...fade(i)} className="bg-white rounded-2xl border border-navy-100 p-3 sm:p-4 flex flex-col justify-between" style={{ minHeight: '120px' }}>
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
            </Commentable>

            {/* ═══ MARKET OPPORTUNITY SECTION ═══ */}
            <Commentable id="analytics-market-opportunity" label="Market Opportunity Section">
            <motion.div {...fade(3)} className="bg-linear-to-br from-navy-800 via-navy-900 to-navy-950 rounded-2xl p-5 sm:p-6 text-white overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/4" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-teal-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">{t('adMktOppTitle', language)}</h3>
                </div>
                <p className="text-[11px] text-navy-300 mb-5 max-w-lg">{t('adMktOppDesc', language)}</p>

                {/* Opportunity Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                  {mktOpportunities.map((opp, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${opp.color} ${opp.border}`}>
                      <opp.icon className="w-4 h-4 mb-1.5" />
                      <p className="text-lg font-black">{opp.value}</p>
                      <p className="text-[10px] font-semibold mt-0.5">{t(opp.key, language)}</p>
                      <p className="text-[9px] opacity-70 mt-0.5 leading-tight">{t(opp.descKey, language)}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue Potential */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-navy-300 uppercase tracking-wider font-medium">{t('adMktOppRevenue', language)}</p>
                      <p className="text-2xl sm:text-3xl font-black text-teal-400 mt-1">₹{revenuePotential.toLocaleString()}<span className="text-sm font-normal text-navy-300">/mo</span></p>
                      <p className="text-[10px] text-navy-400 mt-1">{t('adMktOppRevenueTime', language)}</p>
                    </div>
                    <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-teal-400" />
                    </div>
                  </div>
                </div>

                {/* Prospect Intel — Live Leads */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      Prospect Intel — Live Leads Near You
                    </h4>
                    <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-navy-300">Updated 3 min ago</span>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="bg-white/5">
                          <th className="px-3 py-2 text-left text-navy-300 font-medium">Prospect Signal</th>
                          <th className="px-3 py-2 text-left text-navy-300 font-medium">Source</th>
                          <th className="px-3 py-2 text-left text-navy-300 font-medium">Intent</th>
                          <th className="px-3 py-2 text-left text-navy-300 font-medium">Est. Value</th>
                          <th className="px-3 py-2 text-left text-navy-300 font-medium">Match</th>
                          <th className="px-3 py-2 text-left text-navy-300 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {opportunityLeads.map((lead, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="px-3 py-2 text-white/90 max-w-50 truncate"><span className="mr-1.5">{lead.avatar}</span>{lead.name}</td>
                            <td className="px-3 py-2"><span className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-medium">{lead.source}</span></td>
                            <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${lead.intent === 'Hot' ? 'bg-red-500/20 text-red-300' : lead.intent === 'Warm' ? 'bg-amber-500/20 text-amber-300' : 'bg-navy-500/30 text-navy-200'}`}>{lead.intent}</span></td>
                            <td className="px-3 py-2 font-semibold text-teal-300">{lead.value}</td>
                            <td className="px-3 py-2"><div className="flex items-center gap-1.5"><div className="w-12 bg-white/10 rounded-full h-1.5"><div className="bg-teal-400 rounded-full h-1.5" style={{ width: `${lead.pct}%` }} /></div><span className="text-[9px] text-navy-300">{lead.pct}%</span></div></td>
                            <td className="px-3 py-2"><button className="px-2 py-0.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded text-[9px] font-semibold transition-colors cursor-not-allowed opacity-70" title="Subscribe to unlock">{lead.action} 🔒</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[9px] text-navy-400 mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> These are real-time signals from your area. Subscribe to act on them instantly.
                  </p>
                </div>

                {/* Automation Workflows */}
                <div className="mb-5">
                  <p className="text-[11px] text-navy-300 mb-3">{t('adMktOppAutomate', language)}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {mktWorkflows.map((wf, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-lg">
                        <wf.icon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="text-[10px] text-navy-100 leading-tight">{t(wf.key, language)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-teal-400 mt-2 flex items-center gap-1"><Zap className="w-3 h-3" /> {t('adMktOppReady', language)}</p>
                </div>

                {/* CTA */}
                <button onClick={() => setShowPlans(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20">
                  {t('adMktOppGrabIt', language)} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            </Commentable>
          </div>

          {/* Right Sidebar (Pre-signup) */}
          <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-5 lg:self-start">
            {/* Improve Your Presence */}
            <Commentable id="analytics-gaps-card" label="Digital Presence Gaps & Recommendations">
            <motion.div {...fade()} className="bg-white rounded-2xl border border-navy-100 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h3 className="text-sm font-bold text-navy-800">{t('gapTitle', language)}</h3>
              </div>
              <p className="text-[11px] text-navy-400 mb-4 leading-relaxed">{t('gapDesc', language)}</p>
              <div className="space-y-2.5">
                {[
                  { cond: digitalPresence.website < 30, icon: Globe, key: 'noWebsite', score: digitalPresence.website },
                  { cond: digitalPresence.socialMedia < 30, icon: Share2, key: 'noSocial', score: digitalPresence.socialMedia },
                  { cond: digitalPresence.onlineReviews < 20, icon: Star, key: 'noReviews', score: digitalPresence.onlineReviews },
                  { cond: digitalPresence.searchVisibility < 25, icon: Eye, key: 'noSEO', score: digitalPresence.searchVisibility },
                ].filter(g => g.cond).map((gap, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-red-50/60 rounded-lg border border-red-100">
                    <gap.icon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-navy-700">{t(gap.key, language)}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex-1 bg-red-100 rounded-full h-1"><div className="bg-red-400 rounded-full h-1" style={{ width: `${gap.score}%` }} /></div>
                        <span className="text-[9px] font-bold text-red-500">{gap.score}/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button onClick={() => setShowPlans(true)} className="w-full py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1.5">
                  {t('letsHelp', language)} <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setShowDemoModal(true)} className="w-full py-2.5 bg-navy-800 text-white text-xs font-semibold rounded-lg hover:bg-navy-900 flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Contact Growth Expert · ₹499 Demo
                </button>
              </div>
            </motion.div>
            </Commentable>

            {/* Smart Recommendations */}
            {recommendations?.length > 0 && (
              <Commentable id="analytics-recommendations" label="Smart Recommendations List">
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
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colors[rec.priority]}`} />
                        <div>
                          <p className="text-[11px] font-semibold text-navy-700">{getLocalizedText(rec.title, language)}</p>
                          <p className="text-[9px] text-navy-400 mt-0.5">{rec.impact} • {rec.timeline}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
              </Commentable>
            )}
          </div>
        </div>
        </Commentable>
      )}

      {/* === POST-SIGNUP VIEW (Tabbed Detailed Analytics) === */}
      {isAuthenticated && (
      <Commentable id="analytics-postsignup" label="Analytics - Detailed Tabbed View">
      <div className="grid lg:grid-cols-[1fr_300px] gap-4 sm:gap-5">
        <div className="space-y-4 sm:space-y-5">

          {/* ============ OVERVIEW TAB ============ */}
          {activeTab === 'overview' && (
            <>
              {/* Overall Score Hero */}
              <Commentable id="post-score-hero" label="Overall Score Hero">
              <motion.div {...fade(0)} className="bg-linear-to-br from-navy-700 to-navy-800 rounded-2xl p-5 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(userScore)} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(userScore / 100) * 327} 327`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black">{userScore}</span>
                      <span className="text-[10px] text-navy-200">out of 100</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg font-bold mb-1">Your Overall Business Score</h2>
                    <p className="text-sm text-navy-200 leading-relaxed mb-3">
                      This number shows how visible your business is online. The higher it is, the more customers can find you on Google, social media, and review sites.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Website', score: digitalPresence.website },
                        { label: 'Social Media', score: digitalPresence.socialMedia },
                        { label: 'Google Search', score: digitalPresence.searchVisibility },
                        { label: 'Reviews', score: digitalPresence.onlineReviews },
                      ].map((item, i) => (
                        <div key={i} className="text-center">
                          <p className="text-xl font-black" style={{ color: scoreColor(item.score) }}>{item.score}</p>
                          <p className="text-[10px] text-navy-300">{item.label}</p>
                          <p className="text-[9px] mt-0.5" style={{ color: scoreColor(item.score) }}>{scoreLabel(item.score)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              </Commentable>

              {/* Quick KPI Cards */}
              <Commentable id="post-kpi-cards" label="Quick KPI Cards">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: Eye, label: 'People who visited', value: monthlyVisits.toLocaleString(), delta: `${visitDelta > 0 ? '+' : ''}${visitDelta}%`, up: visitDelta >= 0, color: 'bg-indigo-100 text-indigo-600', explain: 'vs last month' },
                  { icon: Users, label: 'People who contacted you', value: monthlyLeads, delta: `${leadDelta > 0 ? '+' : ''}${leadDelta}%`, up: leadDelta >= 0, color: 'bg-teal-100 text-teal-600', explain: 'new leads' },
                  { icon: Target, label: 'Became customers', value: `${convRate}%`, delta: '', up: true, color: 'bg-amber-100 text-amber-600', explain: 'conversion rate' },
                  { icon: Banknote, label: 'Money earned', value: `₹${(estimatedRevenue/1000).toFixed(0)}K`, delta: `${roi}% ROI`, up: roi >= 0, color: 'bg-emerald-100 text-emerald-600', explain: 'this month' },
                ].map((s, i) => (
                  <motion.div key={i} {...fade(i + 1)} className="bg-white rounded-2xl border border-navy-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div>
                      {s.delta && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${s.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>{s.delta}</span>}
                    </div>
                    <p className="text-2xl font-black text-navy-900">{s.value}</p>
                    <p className="text-xs text-navy-600 mt-0.5 font-medium">{s.label}</p>
                    <p className="text-[10px] text-navy-400">{s.explain}</p>
                  </motion.div>
                ))}
              </div>
              </Commentable>

              {/* Revenue vs Cost Chart */}
              <Commentable id="post-revenue-chart" label="Revenue vs Cost Chart">
              <motion.div {...fade(2)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-navy-800">Revenue vs Cost (Last 6 Months)</h3>
                  <button onClick={() => setActiveTab('revenue')} className="text-[11px] text-teal-600 font-medium flex items-center gap-1">More details <ChevronRight className="w-3 h-3" /></button>
                </div>
                <p className="text-[11px] text-navy-400 mb-4">Green = money coming in, Red dashed = money going out for marketing</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<SimpleTooltip prefix={'₹'} />} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
                    <Area type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Cost" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 text-[10px]">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 bg-emerald-500 rounded-full" />Revenue (money in)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 rounded-full" />Cost (money out)</span>
                </div>
              </motion.div>
              </Commentable>

              {/* Traffic + Conversion Split */}
              <div className="grid lg:grid-cols-2 gap-4">
                <Commentable id="post-visitors-chart" label="Visitors This Month">
                <motion.div {...fade(3)} className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="text-sm font-bold text-navy-800 mb-1">Visitors This Month</h3>
                  <p className="text-[11px] text-navy-400 mb-3">{monthlyVisits.toLocaleString()} people visited your business online</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={traffic.monthly} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                      <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<SimpleTooltip suffix=" people" />} />
                      <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
                        {traffic.monthly.map((_, i) => <Cell key={i} fill={i === traffic.monthly.length - 1 ? '#0d9488' : '#e2e8f0'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
                </Commentable>
                <Commentable id="post-traffic-sources-chart" label="Traffic Sources Chart">
                <motion.div {...fade(4)} className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="text-sm font-bold text-navy-800 mb-1">Where People Find You</h3>
                  <p className="text-[11px] text-navy-400 mb-3">Traffic sources breakdown</p>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={traffic.sources} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
                          {traffic.sources.map((s, i) => <Cell key={i} fill={s.color} />)}
                        </Pie></PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      {traffic.sources.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="text-[11px] text-navy-600 flex-1">{s.name}</span>
                          <span className="text-[11px] font-bold text-navy-800">{s.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                </Commentable>
              </div>
            </>
          )}

          {/* ============ REVENUE TAB ============ */}
          {activeTab === 'revenue' && (
            <>
              {/* Financial Summary Banner */}
              <Commentable id="post-financial-banner" label="Financial Summary Banner">
              <motion.div {...fade(0)} className={`rounded-2xl p-5 border ${profit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${profit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    {profit >= 0 ? <TrendingUp className="w-6 h-6 text-emerald-600" /> : <TrendingDown className="w-6 h-6 text-red-500" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">{profit >= 0 ? 'You are making money!' : 'You are spending more than earning'}</h2>
                    <p className="text-sm text-navy-500">Here is a complete breakdown of your money this month</p>
                  </div>
                </div>
              </motion.div>
              </Commentable>

              {/* Money Cards */}
              <Commentable id="post-money-cards" label="Money Cards">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: Banknote, label: 'Total Revenue', value: `₹${(estimatedRevenue/1000).toFixed(0)}K`, sub: `from ${monthlyLeads} leads`, color: 'bg-emerald-100 text-emerald-600' },
                  { icon: Receipt, label: 'Marketing Spend', value: `₹${(subscriptionCost/1000).toFixed(0)}K`, sub: 'your LeadFlexUp plan', color: 'bg-red-100 text-red-500' },
                  { icon: CircleDollarSign, label: 'Net Profit', value: `${profit >= 0 ? '+' : ''}₹${(profit/1000).toFixed(0)}K`, sub: 'revenue minus cost', color: profit >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500' },
                  { icon: UserPlus, label: 'Cost per Customer', value: `₹${costPerCustomer.toLocaleString()}`, sub: `${estimatedCustomers} customers`, color: 'bg-amber-100 text-amber-600' },
                ].map((card, i) => (
                  <motion.div key={i} {...fade(i + 1)} className="bg-white rounded-2xl border border-navy-100 p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}><card.icon className="w-5 h-5" /></div>
                    <p className="text-2xl font-black text-navy-900">{card.value}</p>
                    <p className="text-xs font-medium text-navy-700 mt-1">{card.label}</p>
                    <p className="text-[10px] text-navy-400">{card.sub}</p>
                  </motion.div>
                ))}
              </div>
              </Commentable>

              {/* Revenue Trend (Detailed) */}
              <Commentable id="post-revenue-trend" label="Revenue Trend">
              <motion.div {...fade(2)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-800 mb-1">Monthly Revenue Trend</h3>
                <p className="text-[11px] text-navy-400 mb-4">How much money your business has been making each month</p>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueChartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<SimpleTooltip prefix={'₹'} />} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad2)" name="Revenue" />
                    <Area type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} fill="none" strokeDasharray="5 5" name="Cost" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-6 mt-3 text-[11px]">
                  <span className="flex items-center gap-2"><span className="w-4 h-2 bg-emerald-500 rounded-full" /> Money Earned (Revenue)</span>
                  <span className="flex items-center gap-2"><span className="w-4 h-0.5 bg-red-400 rounded-full border-dashed" /> Money Spent (Cost)</span>
                </div>
              </motion.div>
              </Commentable>

              {/* Where Money Goes + ROI Explanation */}
              <div className="grid lg:grid-cols-2 gap-4">
                <Commentable id="post-cost-breakdown" label="Cost Breakdown">
                <motion.div {...fade(3)} className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="text-sm font-bold text-navy-800 mb-1">Where Your Marketing Money Goes</h3>
                  <p className="text-[11px] text-navy-400 mb-4">Breaking down ₹{subscriptionCost.toLocaleString()} monthly spend</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Getting people to notice you (Ads & SEO)', pct: 35, color: '#6366f1' },
                      { label: 'Turning visitors into leads (Forms & Chat)', pct: 30, color: '#0d9488' },
                      { label: 'Social media & content creation', pct: 20, color: '#f59e0b' },
                      { label: 'Website hosting & tools', pct: 15, color: '#8b5cf6' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-navy-600">{item.label}</span>
                          <span className="font-bold text-navy-800">₹{Math.round(subscriptionCost * item.pct / 100).toLocaleString()}</span>
                        </div>
                        <div className="h-2.5 bg-navy-50 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
                </Commentable>

                <Commentable id="post-roi-explanation" label="ROI Explanation">
                <motion.div {...fade(4)} className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="text-sm font-bold text-navy-800 mb-1">Is Your Investment Worth It?</h3>
                  <p className="text-[11px] text-navy-400 mb-4">Simple explanation of your return on investment</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
                      <div className="text-center"><p className="text-lg font-black text-navy-900">₹1</p><p className="text-[9px] text-navy-400">spent</p></div>
                      <ArrowRight className="w-4 h-4 text-navy-300" />
                      <div className="text-center"><p className="text-lg font-black text-emerald-600">₹{(estimatedRevenue / subscriptionCost).toFixed(1)}</p><p className="text-[9px] text-navy-400">earned back</p></div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                        <span className="text-navy-600">Cost to get 1 lead</span>
                        <span className="font-bold text-navy-800">₹{costPerLead.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                        <span className="text-navy-600">Cost to get 1 customer</span>
                        <span className="font-bold text-navy-800">₹{costPerCustomer.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                        <span className="text-navy-600">Each customer is worth</span>
                        <span className="font-bold text-emerald-700">₹{(estimatedRevenue / Math.max(estimatedCustomers, 1)).toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-center text-navy-400 pt-2 border-t border-navy-100">
                      {roi > 0 ? `Great! You are earning ${roi}% more than you spend.` : 'Your marketing is building awareness. Results improve over time.'}
                    </p>
                  </div>
                </motion.div>
                </Commentable>
              </div>
            </>
          )}

          {/* ============ TRAFFIC TAB ============ */}
          {activeTab === 'traffic' && (
            <>
              {/* Traffic Overview */}
              <Commentable id="post-traffic-overview" label="Traffic Overview">
              <motion.div {...fade(0)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-800 mb-1">Monthly Visitors & Leads</h3>
                <p className="text-[11px] text-navy-400 mb-4">Blue = people who visited, Green = people who contacted you</p>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={traffic.monthly} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                      <linearGradient id="tL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14a88a" stopOpacity={0.15} /><stop offset="100%" stopColor="#14a88a" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }} />
                    <Area type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={2} fill="url(#tV)" name="Visitors" />
                    <Area type="monotone" dataKey="leads" stroke="#14a88a" strokeWidth={2} fill="url(#tL)" name="Leads" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-6 mt-3 text-[11px]">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-500 rounded-full" /> Visitors (people who saw you)</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 bg-teal-500 rounded-full" /> Leads (people who contacted)</span>
                </div>
              </motion.div>
              </Commentable>

              {/* Weekly Pattern + Sources */}
              <div className="grid lg:grid-cols-2 gap-4">
                <Commentable id="post-weekly-pattern" label="Weekly Pattern">
                <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="text-sm font-bold text-navy-800 mb-1">Best Days of the Week</h3>
                  <p className="text-[11px] text-navy-400 mb-3">Which days get the most visitors</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<SimpleTooltip suffix=" people" />} />
                      <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
                      <Bar dataKey="leads" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
                </Commentable>

                <Commentable id="post-traffic-sources-detail" label="Traffic Sources Detail">
                <motion.div {...fade(2)} className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="text-sm font-bold text-navy-800 mb-1">Where People Find You</h3>
                  <p className="text-[11px] text-navy-400 mb-3">How visitors discover your business</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-28 h-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={traffic.sources} cx="50%" cy="50%" innerRadius={32} outerRadius={50} dataKey="value" strokeWidth={0}>
                          {traffic.sources.map((s, i) => <Cell key={i} fill={s.color} />)}
                        </Pie></PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      {traffic.sources.map((s, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-[11px] mb-0.5">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />{s.name}</span>
                            <span className="font-bold text-navy-800">{s.value}%</span>
                          </div>
                          <div className="h-1.5 bg-navy-50 rounded-full"><div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                </Commentable>
              </div>

              {/* Conversion Funnel (Detailed) */}
              <Commentable id="post-conversion-funnel" label="Conversion Funnel">
              <motion.div {...fade(3)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-800 mb-1">How People Become Your Customers</h3>
                <p className="text-[11px] text-navy-400 mb-4">The journey from seeing your business to buying from you</p>
                <div className="space-y-3">
                  {conversionFunnel.map((stage, i) => {
                    const colors = ['#1e3a5f', '#2a5a8f', '#3b7abf', '#0d9488', '#059669'];
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-navy-700 font-medium">{stage.stage}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-navy-900">{stage.value.toLocaleString()}</span>
                            <span className="text-[10px] text-navy-400">({stage.pct}%)</span>
                          </div>
                        </div>
                        <div className="h-7 bg-navy-50 rounded-lg overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(stage.pct, 3)}%` }} transition={{ delay: 0.2 + i * 0.12, duration: 0.7 }}
                            className="h-full rounded-lg flex items-center justify-end pr-2" style={{ backgroundColor: colors[i] }}>
                            {stage.pct > 15 && <span className="text-[9px] font-bold text-white">{stage.pct}%</span>}
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-navy-100 bg-teal-50 rounded-lg p-3">
                  <p className="text-[11px] text-teal-800"><strong>What this means:</strong> Out of every 100 people who see your business online, about {convRate} contact you. Industry average is 2-5%. {parseFloat(convRate) >= 5 ? 'You are doing great!' : 'There is room to improve.'}</p>
                </div>
              </motion.div>
              </Commentable>

              {/* Geographic Insights */}
              <Commentable id="post-geo-visitors" label="Geographic Visitors">
              <motion.div {...fade(4)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-800 mb-1">Where Your Visitors Are From</h3>
                <p className="text-[11px] text-navy-400 mb-3">Top cities sending traffic to your business</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={geoInsights.topCities} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                    <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={80} axisLine={false} tickLine={false} />
                    <Tooltip content={<SimpleTooltip suffix="% of visitors" />} />
                    <Bar dataKey="percentage" fill="#6366f1" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
              </Commentable>
            </>
          )}

          {/* ============ HEALTH TAB ============ */}
          {activeTab === 'health' && (
            <>
              {/* Health Score Breakdown */}
              <Commentable id="post-health-report" label="Business Health Report">
              <motion.div {...fade(0)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-800 mb-1">Your Business Health Report</h3>
                <p className="text-[11px] text-navy-400 mb-4">A complete checkup of how your business appears online</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Website Health', score: digitalPresence.website, icon: Globe, desc: 'How good your website looks and works', tips: ['Add more photos of your work', 'Make sure it loads fast on phones', 'Add customer testimonials'] },
                    { label: 'Social Media', score: digitalPresence.socialMedia, icon: Share2, desc: 'How active and engaging your social profiles are', tips: ['Post at least 3 times per week', 'Reply to all comments within 2 hours', 'Use local hashtags'] },
                    { label: 'Google Search Visibility', score: digitalPresence.searchVisibility, icon: Search, desc: 'How easily people can find you on Google', tips: ['Complete your Google Business profile', 'Add your business to local directories', 'Use "near me" keywords on website'] },
                    { label: 'Customer Reviews', score: digitalPresence.onlineReviews, icon: Star, desc: 'What customers say about you online', tips: ['Ask every happy customer for a review', 'Reply to all reviews (good and bad)', 'Share positive reviews on social media'] },
                  ].map((item, i) => (
                    <motion.div key={i} {...fade(i + 1)} className="p-4 border border-navy-100 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-16 h-16 shrink-0">
                          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                            <circle cx="32" cy="32" r="26" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                            <circle cx="32" cy="32" r="26" fill="none" stroke={scoreColor(item.score)} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(item.score / 100) * 163} 163`} />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-navy-800">{item.score}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <item.icon className="w-4 h-4 text-navy-500" />
                            <h4 className="text-sm font-bold text-navy-800">{item.label}</h4>
                          </div>
                          <p className="text-[10px] mt-0.5 font-semibold" style={{ color: scoreColor(item.score) }}>{scoreLabel(item.score)}</p>
                          <p className="text-[11px] text-navy-400 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 ml-1">
                        <p className="text-[10px] font-bold text-navy-600 uppercase tracking-wider">How to improve:</p>
                        {item.tips.map((tip, j) => (
                          <div key={j} className="flex items-start gap-2 text-[11px] text-navy-500">
                            <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              </Commentable>

              {/* Comparison with Competitors */}
              <Commentable id="post-competitor-comparison" label="Competitor Comparison">
              <motion.div {...fade(2)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-800 mb-1">How You Compare to Top Competitors</h3>
                <p className="text-[11px] text-navy-400 mb-4">Your scores vs the average of top 10 competitors in your area</p>
                <div className="space-y-3">
                  {[
                    { label: 'Website', yours: digitalPresence.website, avg: Math.round(sortedCompetitors.slice(0, 5).reduce((a, c) => a + (c.website ? 70 : 30), 0) / 5) },
                    { label: 'Social Media', yours: digitalPresence.socialMedia, avg: Math.round(sortedCompetitors.slice(0, 5).reduce((a, c) => a + c.socialMedia * 20, 0) / 5) },
                    { label: 'Search', yours: digitalPresence.searchVisibility, avg: avgCompScore },
                    { label: 'Reviews', yours: digitalPresence.onlineReviews, avg: Math.round(sortedCompetitors.slice(0, 5).reduce((a, c) => a + Math.min(c.reviews / 5, 90), 0) / 5) },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-medium text-navy-700">{item.label}</span>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className="text-teal-600 font-bold">You: {item.yours}</span>
                          <span className="text-navy-400">Avg: {item.avg}</span>
                        </div>
                      </div>
                      <div className="relative h-3 bg-navy-50 rounded-full overflow-hidden">
                        <div className="absolute h-full bg-navy-200 rounded-full" style={{ width: `${item.avg}%` }} />
                        <div className="absolute h-full bg-teal-500 rounded-full" style={{ width: `${item.yours}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px]">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-teal-500 rounded-sm" /> Your score</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-navy-200 rounded-sm" /> Competitor average</span>
                </div>
              </motion.div>
              </Commentable>
            </>
          )}

          {/* ============ COMPETITORS TAB ============ */}
          {activeTab === 'competitors' && (
            <>
              {/* Your Position */}
              <motion.div {...fade(0)} className="bg-linear-to-r from-navy-700 to-navy-800 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-black">#{userPosition}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">You are ranked #{userPosition} in your area</h3>
                    <p className="text-sm text-navy-200">Out of {competitors.length + 1} businesses in a 5km radius</p>
                    <p className="text-[11px] text-teal-300 mt-1">Your score: {userScore} | Top competitor: {sortedCompetitors[0]?.score || 0} | Average: {avgCompScore}</p>
                  </div>
                </div>
              </motion.div>

              {/* Leaderboard */}
              <Commentable id="post-competitor-leaderboard" label="Competitor Leaderboard">
              <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-navy-100">
                  <h3 className="text-sm font-bold text-navy-800">Top Competitors in Your Area</h3>
                  <p className="text-[10px] text-navy-400">These businesses compete with you for the same customers</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-150">
                    <thead className="bg-navy-50">
                      <tr>
                        {['Rank', 'Business Name', 'Score', 'Website', 'Social', 'Reviews', 'Visitors/mo'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-navy-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100">
                      {sortedCompetitors.slice(0, 10).map((c, i) => (
                        <tr key={i} className="hover:bg-navy-50/50">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1">
                              {i < 3 && <Trophy className={`w-3 h-3 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-500'}`} />}
                              <span className="text-[11px] font-bold text-navy-800">{i + 1}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-[11px] font-semibold text-navy-800">{c.name}</td>
                          <td className="px-4 py-2.5"><div className="flex items-center gap-1.5"><span className="text-[11px] font-bold">{c.score}</span><div className="w-16 bg-navy-100 rounded-full h-1.5"><div className="bg-navy-600 rounded-full h-1.5" style={{ width: `${c.score}%` }} /></div></div></td>
                          <td className="px-4 py-2.5"><span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.website ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'}`}>{c.website ? '\u2713 Yes' : '\u2717 No'}</span></td>
                          <td className="px-4 py-2.5"><div className="flex gap-0.5">{[...Array(4)].map((_, j) => <Star key={j} className={`w-2.5 h-2.5 ${j < c.socialMedia ? 'text-yellow-400 fill-yellow-400' : 'text-navy-200'}`} />)}</div></td>
                          <td className="px-4 py-2.5 text-[11px] font-medium text-navy-700">{c.reviews}</td>
                          <td className="px-4 py-2.5 text-[11px] font-medium text-navy-700">{c.monthlyVisits?.toLocaleString()}</td>
                        </tr>
                      ))}
                      {/* Your row */}
                      <tr className="bg-teal-50/60 border-t-2 border-teal-200">
                        <td className="px-4 py-2.5"><span className="text-[11px] font-bold text-teal-700">{userPosition}</span></td>
                        <td className="px-4 py-2.5"><span className="text-[11px] font-bold text-teal-700">{businessData?.businessName || 'You'} <span className="text-[9px] bg-teal-100 text-teal-700 px-1 py-0.5 rounded">YOU</span></span></td>
                        <td className="px-4 py-2.5"><div className="flex items-center gap-1.5"><span className="text-[11px] font-bold text-teal-700">{userScore}</span><div className="w-16 bg-teal-100 rounded-full h-1.5"><div className="bg-teal-500 rounded-full h-1.5" style={{ width: `${userScore}%` }} /></div></div></td>
                        <td className="px-4 py-2.5"><span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700">\u2713 Yes</span></td>
                        <td className="px-4 py-2.5"><div className="flex gap-0.5">{[...Array(4)].map((_, j) => <Star key={j} className={`w-2.5 h-2.5 ${j < 2 ? 'text-yellow-400 fill-yellow-400' : 'text-navy-200'}`} />)}</div></td>
                        <td className="px-4 py-2.5 text-[11px] font-bold text-teal-700">{Math.round(userScore * 3)}</td>
                        <td className="px-4 py-2.5 text-[11px] font-bold text-teal-700">{monthlyVisits.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
              </Commentable>

              {/* Competitor Map */}
              <Commentable id="post-competitor-map" label="Competitor Map">
              <motion.div {...fade(2)} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-navy-100">
                  <h3 className="text-sm font-bold text-navy-800">Competitor Map</h3>
                  <p className="text-[10px] text-navy-400">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" /> Your business
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-3 mr-1" /> Competitors
                  </p>
                </div>
                <div className="relative" style={{ height: '320px' }}>
                  <MapContainer center={[bizLat, bizLng]} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false} attributionControl={false}>
                    {mapType === 'hybrid' ? (<><TileLayer attribution={mapLayers.hybrid.attribution} url={mapLayers.hybrid.url[0]} /><TileLayer attribution={mapLayers.hybrid.attribution} url={mapLayers.hybrid.url[1]} /></>) : (<TileLayer attribution={mapLayers[mapType].attribution} url={mapLayers[mapType].url} />)}
                    <Marker position={[bizLat, bizLng]} icon={redIcon}><Popup><strong>{businessData?.businessName || 'Your Business'}</strong><br />Score: {userScore}</Popup></Marker>
                    {competitorPositions.map((c, i) => (<Marker key={i} position={[c.lat, c.lng]} icon={blueIcon}><Popup><strong>{c.name}</strong><br />Score: {c.score}<br />Reviews: {c.reviews}</Popup></Marker>))}
                  </MapContainer>
                  <div ref={mapMenuRef} className="absolute top-3 right-3 z-1000">
                    <button type="button" onClick={() => setShowMapMenu(!showMapMenu)} className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-navy-200/50 hover:bg-white">
                      {(() => { const Icon = mapLayers[mapType].icon; return <Icon className="w-4 h-4 text-navy-700" />; })()}
                    </button>
                    {showMapMenu && (
                      <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-navy-200/50 overflow-hidden min-w-35">
                        {Object.entries(mapLayers).map(([key, layer]) => { const Icon = layer.icon; return (
                          <button key={key} type="button" onClick={() => { setMapType(key); setShowMapMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium ${mapType === key ? 'bg-navy-700 text-white' : 'text-navy-600 hover:bg-navy-50'}`}><Icon className="w-3.5 h-3.5" /><span>{layer.name}</span></button>
                        ); })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              </Commentable>
            </>
          )}

          {/* ============ SOCIAL TAB ============ */}
          {activeTab === 'social' && (
            <>
              {/* Social Overview */}
              <Commentable id="post-social-overview" label="Social Media Overview">
              <motion.div {...fade(0)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-800 mb-1">Your Social Media Presence</h3>
                <p className="text-[11px] text-navy-400 mb-4">How your business is doing across social platforms</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-3 bg-navy-50 rounded-xl">
                    <p className="text-2xl font-black text-navy-900">{totalFollowers.toLocaleString()}</p>
                    <p className="text-[10px] text-navy-400">Total Followers</p>
                  </div>
                  <div className="text-center p-3 bg-navy-50 rounded-xl">
                    <p className="text-2xl font-black text-navy-900">{socialMedia.platforms.length}</p>
                    <p className="text-[10px] text-navy-400">Active Platforms</p>
                  </div>
                  <div className="text-center p-3 bg-navy-50 rounded-xl">
                    <p className="text-2xl font-black text-teal-600">{(socialMedia.platforms.reduce((a, p) => a + p.engagement, 0) / socialMedia.platforms.length).toFixed(1)}%</p>
                    <p className="text-[10px] text-navy-400">Avg Engagement</p>
                  </div>
                  <div className="text-center p-3 bg-navy-50 rounded-xl">
                    <p className="text-2xl font-black text-navy-900">{digitalPresence.socialMedia}</p>
                    <p className="text-[10px] text-navy-400">Social Score</p>
                  </div>
                </div>
              </motion.div>
              </Commentable>

              {/* Platform Breakdown */}
              <Commentable id="post-social-platforms" label="Social Platforms Breakdown">
              <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="text-sm font-bold text-navy-800 mb-4">Platform by Platform</h3>
                <div className="space-y-3">
                  {socialMedia.platforms.map((p, i) => {
                    const maxF = Math.max(...socialMedia.platforms.map(pl => pl.followers));
                    return (
                      <div key={i} className="p-4 border border-navy-100 rounded-xl hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-navy-700 rounded-lg flex items-center justify-center"><Share2 className="w-4 h-4 text-white" /></div>
                            <div>
                              <span className="text-sm font-bold text-navy-800">{p.name}</span>
                              <p className="text-[10px] text-navy-400">{p.followers.toLocaleString()} followers</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-teal-600">{p.engagement}%</span>
                            <p className="text-[10px] text-navy-400">engagement</p>
                          </div>
                        </div>
                        <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(p.followers / maxF) * 100}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }} className="h-full bg-navy-600 rounded-full" />
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-navy-400">
                          <span>Reach: ~{Math.round(p.followers * p.engagement / 100 * 3).toLocaleString()} people/post</span>
                          <span>\u2022</span>
                          <span>{p.engagement >= 3 ? '\u2705 Good engagement' : '\u26a0\ufe0f Needs more interaction'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
              </Commentable>

              {/* Social Tips */}
              <motion.div {...fade(2)} className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Tips to Grow Your Social Media</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    'Post at least 3 times per week consistently',
                    'Use local hashtags like #YourCityBusiness',
                    'Share behind-the-scenes content (people love it)',
                    'Reply to every comment within 2 hours',
                    'Ask questions in your posts to boost engagement',
                    'Share customer reviews as posts',
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-amber-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* ========== RIGHT SIDEBAR ========== */}
        <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-5 lg:self-start">
          {isAuthenticated && subscription ? (
            <>
              {/* Copilot Card */}
              <Commentable id="post-sidebar-actions" label="Copilot Actions">
              <motion.div {...fade()} className="bg-linear-to-br from-navy-800 to-navy-900 rounded-2xl border border-navy-700 p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
                  <div><h3 className="text-sm font-bold">LeadFlexUp Copilot</h3><p className="text-[9px] text-navy-300">AI growth assistant</p></div>
                </div>
                <p className="text-[11px] text-navy-300 leading-relaxed mb-4">Ask me anything about your analytics, leads, or marketing strategies.</p>
                <button onClick={() => setShowCopilot(true)} className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Ask Copilot</button>
              </motion.div>
              </Commentable>

              {/* Quick Insights */}
              <Commentable id="post-sidebar-whatnext" label="Copilot Insights">
              <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 p-4">
                <div className="flex items-center gap-1.5 mb-3"><Lightbulb className="w-4 h-4 text-teal-600" /><h3 className="text-sm font-bold text-navy-800">Copilot Insights</h3></div>
                <div className="space-y-2">
                  {[
                    { text: 'Your traffic is up this week \u2014 keep posting!', priority: 'high' },
                    { text: '3 hot leads need follow-up today.', priority: 'critical' },
                    { text: 'Competitor updated their listing. Update yours too.', priority: 'medium' },
                    { text: 'Add business hours to your website footer.', priority: 'low' },
                  ].map((insight, i) => {
                    const colors = { critical: 'bg-red-500', high: 'bg-amber-500', medium: 'bg-navy-400', low: 'bg-teal-500' };
                    return (<div key={i} className="flex items-start gap-2 p-2.5 bg-navy-50/50 rounded-lg"><div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colors[insight.priority]}`} /><p className="text-[11px] text-navy-600 leading-relaxed">{insight.text}</p></div>);
                  })}
                </div>
                <button onClick={() => setShowCopilot(true)} className="w-full mt-3 py-2 text-[10px] font-semibold text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 flex items-center justify-center gap-1"><Sparkles className="w-3 h-3" /> Ask Copilot for more</button>
              </motion.div>
              </Commentable>
            </>
          ) : (
            <>
              {/* Gaps + CTA for non-subscribed */}
              <motion.div {...fade()} className="bg-white rounded-2xl border border-navy-100 p-4">
                <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-yellow-500" /><h3 className="text-sm font-bold text-navy-800">{t('gapTitle', language)}</h3></div>
                <p className="text-[11px] text-navy-400 mb-3">{t('gapDesc', language)}</p>
                <div className="space-y-2">
                  {[
                    { cond: digitalPresence.website < 30, icon: Globe, label: 'Website needs work', score: digitalPresence.website },
                    { cond: digitalPresence.socialMedia < 30, icon: Share2, label: 'Low social media presence', score: digitalPresence.socialMedia },
                    { cond: digitalPresence.onlineReviews < 20, icon: Star, label: 'Too few reviews', score: digitalPresence.onlineReviews },
                    { cond: digitalPresence.searchVisibility < 25, icon: Eye, label: 'Hard to find on Google', score: digitalPresence.searchVisibility },
                  ].filter(g => g.cond).map((gap, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 bg-red-50 rounded-lg border border-red-100">
                      <gap.icon className="w-4 h-4 text-red-500 shrink-0" />
                      <div className="flex-1"><p className="text-[11px] font-semibold text-navy-700">{gap.label}</p><div className="flex items-center gap-1.5 mt-1"><div className="flex-1 bg-red-100 rounded-full h-1"><div className="bg-red-400 rounded-full h-1" style={{ width: `${gap.score}%` }} /></div><span className="text-[9px] font-bold text-red-500">{gap.score}/100</span></div></div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <button onClick={() => setShowPlans(true)} className="w-full py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1.5">{t('letsHelp', language)} <ArrowRight className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setShowDemoModal(true)} className="w-full py-2.5 bg-navy-800 text-white text-xs font-semibold rounded-lg hover:bg-navy-900 flex items-center justify-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Contact Growth Expert · ₹499</button>
                </div>
              </motion.div>

              {/* Recommendations */}
              {recommendations?.length > 0 && (
                <motion.div {...fade(1)} className="bg-white rounded-2xl border border-navy-100 p-4">
                  <div className="flex items-center gap-1.5 mb-3"><Lightbulb className="w-4 h-4 text-teal-600" /><h3 className="text-sm font-bold text-navy-800">{t('recommendationsTitle', language)}</h3></div>
                  <div className="space-y-2">
                    {recommendations.slice(0, 5).map((rec, i) => {
                      const colors = { critical: 'bg-red-500', high: 'bg-yellow-500', medium: 'bg-navy-400', low: 'bg-teal-500' };
                      return (<div key={i} className="flex items-start gap-2.5 p-2.5 bg-navy-50/50 rounded-lg"><div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colors[rec.priority]}`} /><div><p className="text-[11px] font-semibold text-navy-700">{getLocalizedText(rec.title, language)}</p><p className="text-[9px] text-navy-400 mt-0.5">{rec.impact} \u2022 {rec.timeline}</p></div></div>);
                    })}
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl border border-navy-100 p-4">
            <h3 className="text-xs font-bold text-navy-800 mb-2">Quick Navigation</h3>
            <div className="space-y-1">
              {[
                { label: 'Home Dashboard', path: '/dashboard', icon: BarChart3 },
                { label: 'Manage Leads', path: '/dashboard/leads', icon: Users },
                { label: 'Content Studio', path: '/dashboard/content', icon: Camera },
                { label: 'Automation Hub', path: '/dashboard/automation', icon: Zap },
              ].map((link, i) => (
                <button key={i} onClick={() => navigate(link.path)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-navy-600 hover:bg-teal-50 hover:text-teal-700 transition-colors text-left">
                  <link.icon className="w-3.5 h-3.5" /><span className="flex-1">{link.label}</span><ChevronRight className="w-3 h-3 text-navy-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </Commentable>
      )}

      {/* === Copilot Chat Popup === */}
      <AnimatePresence>
        {showCopilot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4" onClick={() => setShowCopilot(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg h-[70vh] flex flex-col shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-navy-100 flex items-center justify-between bg-linear-to-r from-navy-800 to-navy-900">
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div><div><h3 className="text-sm font-bold text-white">LeadFlexUp Copilot</h3><p className="text-[9px] text-navy-300">Ask anything</p></div></div>
                <button onClick={() => setShowCopilot(false)} className="p-1.5 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-white" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {copilotMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="w-10 h-10 text-teal-500 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-semibold text-navy-700">How can I help?</p>
                    <p className="text-[11px] text-navy-400 mt-1">Ask about analytics, leads, or marketing.</p>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                      {['How to improve my score?', 'Which leads to focus on?', 'Marketing ideas', 'Why is traffic low?'].map((q, i) => (
                        <button key={i} onClick={() => { setCopilotMessages([{ role: 'user', text: q }]); setCopilotThinking(true); setTimeout(() => { setCopilotMessages(prev => [...prev, { role: 'ai', text: getCopilotResponse(q, businessData) }]); setCopilotThinking(false); }, 1200); }}
                          className="text-[10px] px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200 hover:bg-teal-100">{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {copilotMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-teal-100' : 'bg-navy-700'}`}>
                      {msg.role === 'ai' ? <Sparkles className="w-3 h-3 text-teal-600" /> : <Eye className="w-3 h-3 text-white" />}
                    </div>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-navy-700 text-white rounded-2xl rounded-tr-sm px-3 py-2' : 'bg-navy-50 text-navy-700 rounded-2xl rounded-tl-sm px-3 py-2'}`}>
                      <p className="text-[11px] leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {copilotThinking && (<div className="flex gap-2"><div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"><Sparkles className="w-3 h-3 text-teal-600" /></div><div className="bg-navy-50 rounded-2xl rounded-tl-sm px-3 py-2"><div className="flex gap-1"><div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></div></div>)}
                <div ref={copilotEndRef} />
              </div>
              <div className="p-3 border-t border-navy-100">
                <div className="flex items-center gap-2">
                  <input value={copilotInput} onChange={e => setCopilotInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && copilotInput.trim()) { const q = copilotInput.trim(); setCopilotMessages(prev => [...prev, { role: 'user', text: q }]); setCopilotInput(''); setCopilotThinking(true); setTimeout(() => { setCopilotMessages(prev => [...prev, { role: 'ai', text: getCopilotResponse(q, businessData) }]); setCopilotThinking(false); }, 1200); } }}
                    placeholder="Ask Copilot anything..." className="flex-1 px-3 py-2.5 bg-navy-50 border border-navy-100 rounded-xl text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                  <button onClick={() => { if (!copilotInput.trim()) return; const q = copilotInput.trim(); setCopilotMessages(prev => [...prev, { role: 'user', text: q }]); setCopilotInput(''); setCopilotThinking(true); setTimeout(() => { setCopilotMessages(prev => [...prev, { role: 'ai', text: getCopilotResponse(q, businessData) }]); setCopilotThinking(false); }, 1200); }}
                    className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700"><ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


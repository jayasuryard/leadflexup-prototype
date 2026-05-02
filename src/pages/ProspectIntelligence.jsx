import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Building2, MapPin, Users, Globe, Zap,
  RefreshCw, Download, X, Target, Sparkles, BarChart3,
  ChevronDown, Mail, ExternalLink, CheckCircle2,
  ArrowUpRight, SlidersHorizontal, TrendingUp, Filter,
  Database, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateLeadData } from '../data/mockDatabase';

/* ─────────────── Hotel SMB — Data Generation ─────────────── */

// Prospect types relevant to a local hotel
const PROSPECT_TYPES = [
  { label: 'Corporate Account',   icon: '🏢', color: 'bg-blue-100 text-blue-700'    },
  { label: 'MICE Organizer',      icon: '🎤', color: 'bg-purple-100 text-purple-700' },
  { label: 'Travel Agency',       icon: '✈️', color: 'bg-sky-100 text-sky-700'      },
  { label: 'Wedding Planner',     icon: '💍', color: 'bg-pink-100 text-pink-700'    },
  { label: 'Tour Operator',       icon: '🗺️', color: 'bg-teal-100 text-teal-700'   },
  { label: 'Govt / PSU',          icon: '🏛️', color: 'bg-indigo-100 text-indigo-700' },
  { label: 'Training Institute',  icon: '📚', color: 'bg-amber-100 text-amber-700'  },
  { label: 'Sports & Clubs',      icon: '⚽', color: 'bg-orange-100 text-orange-700' },
];

// Industries these prospects come from
const INDUSTRIES = [
  'Information Technology', 'Banking & Finance', 'Pharmaceuticals',
  'Manufacturing', 'Consulting & Advisory', 'Telecommunications',
  'Government & PSU', 'Event Management', 'Travel & Tourism',
  'Education & Training', 'Media & Entertainment', 'Healthcare',
];

const ALL_GROWTH_SIGNALS = [
  { label: 'Annual Conference Planned', icon: '🎤', color: 'bg-purple-100 text-purple-700' },
  { label: 'New Office Opening',        icon: '🏢', color: 'bg-blue-100 text-blue-700'    },
  { label: 'Team Hiring Surge',         icon: '👥', color: 'bg-green-100 text-green-700'  },
  { label: 'Client Visit Program',      icon: '🤝', color: 'bg-orange-100 text-orange-700' },
  { label: 'Wedding Season Booking',    icon: '💍', color: 'bg-pink-100 text-pink-700'    },
  { label: 'Training Batch Scheduled',  icon: '📚', color: 'bg-amber-100 text-amber-700' },
  { label: 'Govt Tender Approved',      icon: '🏛️', color: 'bg-indigo-100 text-indigo-700' },
  { label: 'Relocating to City',        icon: '📦', color: 'bg-teal-100 text-teal-700'   },
];

// Tools/platforms these B2B buyers use
const TECH_STACKS = [
  'MakeMyTrip for Business', 'Cleartrip Corporate', 'SAP Concur',
  'Zoho Expense', 'Google Workspace', 'WhatsApp Business',
  'Tally ERP', 'Microsoft Teams', 'Salesforce', 'HubSpot',
  'Eventbrite', 'Townscript', 'Mailchimp', 'Slack', 'Notion',
  'Facebook Events', 'Instagram Ads', 'Google Ads', 'JustDial',
];

// Pain points these buyers face when looking for hotel partners
const ALL_PAIN_POINTS = [
  'No dedicated hotel tie-up for business travel',
  'High & uncontrolled travel reimbursement costs',
  'Inconsistent accommodation quality for guests',
  'Event venue availability & last-minute cancellations',
  'No corporate rate / bulk discount with any hotel',
  'Manual booking process with no central tracking',
  'Poor vendor relationships with local hospitality',
  'Long check-in delays for VIP client visits',
  'No preferred catering partner for office events',
  'Seasonal room unavailability during peak projects',
  'Lack of transparent billing for travel expenses',
  'No loyalty or points program for repeat bookings',
];

const COMPANY_SIZES = [
  { label: '1–10',    tag: 'Micro',      color: 'bg-gray-100 text-gray-600'     },
  { label: '11–50',   tag: 'Small',      color: 'bg-blue-100 text-blue-700'     },
  { label: '51–200',  tag: 'Medium',     color: 'bg-purple-100 text-purple-700' },
  { label: '201–500', tag: 'Large',      color: 'bg-orange-100 text-orange-700' },
  { label: '500+',    tag: 'Enterprise', color: 'bg-red-100 text-red-700'       },
];

// What each prospect primarily needs from a hotel
const BOOKING_NEEDS = [
  'Room Block (Business Travel)', 'Banquet Hall (Wedding)',
  'Conference Room (MICE)', 'Long-Stay Accommodation',
  'Group Room Package', 'Corporate Rate Agreement',
  'Day-Use Rooms (Meetings)', 'Full-Hotel Buyout (Event)',
  'Airport Pickup + Room Package', 'F&B + Accommodation Combo',
];

// Estimated annual booking value
const EST_VALUES = [
  '₹2L–5L/yr', '₹5L–10L/yr', '₹10L–25L/yr', '₹25L–50L/yr', '₹50L+/yr'
];

// Procurement cycles
const CYCLES = ['Monthly', 'Quarterly', 'Per-Event', 'Annual Contract', 'Ad-hoc'];

// Decision-maker titles in these prospect orgs
const TITLES = [
  'Admin & HR Manager', 'Travel Desk Manager', 'Operations Head',
  'Event Coordinator', 'Wedding Planner', 'Tour Operations Manager',
  'Procurement Manager', 'General Manager', 'Co-Founder & COO',
  'Executive Assistant to MD', 'Corporate Travel Administrator',
];

const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/* ── Map raw lead data fields → ProspectIntelligence fields ── */
const industryToProspectType = (industry = '') => {
  const i = industry.toLowerCase();
  if (i.includes('wedding') || i.includes('celebration'))        return PROSPECT_TYPES[3]; // Wedding Planner
  if (i.includes('ota') || i.includes('online travel'))          return PROSPECT_TYPES[2]; // Travel Agency
  if (i.includes('travel agency'))                               return PROSPECT_TYPES[2];
  if (i.includes('experience') || i.includes('tour'))            return PROSPECT_TYPES[4]; // Tour Operator
  if (i.includes('government') || i.includes('psu'))             return PROSPECT_TYPES[5]; // Govt / PSU
  if (i.includes('training') || i.includes('education'))         return PROSPECT_TYPES[6]; // Training
  if (i.includes('event') || i.includes('conference') || i.includes('mice')) return PROSPECT_TYPES[1]; // MICE
  if (i.includes('hostel') || i.includes('hotel') || i.includes('aggregator')) return PROSPECT_TYPES[0];
  return PROSPECT_TYPES[0]; // Corporate Account
};

const employeesToSize = (n = 0) => {
  if (n <= 10)  return COMPANY_SIZES[0];
  if (n <= 50)  return COMPANY_SIZES[1];
  if (n <= 200) return COMPANY_SIZES[2];
  if (n <= 500) return COMPANY_SIZES[3];
  return COMPANY_SIZES[4];
};

const dealValueToEstValue = (v = 0) => {
  if (v < 200000)  return '₹2L–5L/yr';
  if (v < 500000)  return '₹5L–10L/yr';
  if (v < 1000000) return '₹10L–25L/yr';
  if (v < 2500000) return '₹25L–50L/yr';
  return '₹50L+/yr';
};

const bookingNeedForType = (typeLabel) => {
  const map = {
    'Corporate Account':  ['Room Block (Business Travel)', 'Corporate Rate Agreement', 'Day-Use Rooms (Meetings)'],
    'MICE Organizer':     ['Conference Room (MICE)', 'Full-Hotel Buyout (Event)', 'F&B + Accommodation Combo'],
    'Travel Agency':      ['Group Room Package', 'Airport Pickup + Room Package', 'Long-Stay Accommodation'],
    'Wedding Planner':    ['Banquet Hall (Wedding)', 'Full-Hotel Buyout (Event)', 'F&B + Accommodation Combo'],
    'Tour Operator':      ['Group Room Package', 'Long-Stay Accommodation', 'Airport Pickup + Room Package'],
    'Govt / PSU':         ['Room Block (Business Travel)', 'Corporate Rate Agreement', 'Conference Room (MICE)'],
    'Training Institute': ['Long-Stay Accommodation', 'Conference Room (MICE)', 'F&B + Accommodation Combo'],
    'Sports & Clubs':     ['Group Room Package', 'Long-Stay Accommodation', 'Room Block (Business Travel)'],
  };
  return pick(map[typeLabel] || BOOKING_NEEDS);
};

const cycleForType = (typeLabel, employees = 0) => {
  if (typeLabel === 'Wedding Planner' || typeLabel === 'MICE Organizer') return 'Per-Event';
  if (employees > 500) return 'Annual Contract';
  if (employees > 100) return 'Quarterly';
  if (typeLabel === 'Govt / PSU') return 'Annual Contract';
  return pick(CYCLES);
};

const signalToGrowthSignal = (signalText = '') => {
  const s = signalText.toLowerCase();
  if (s.includes('conference') || s.includes('event') || s.includes('batch'))  return ALL_GROWTH_SIGNALS[0];
  if (s.includes('office') || s.includes('branch') || s.includes('expanding')) return ALL_GROWTH_SIGNALS[1];
  if (s.includes('hiring') || s.includes('team'))                              return ALL_GROWTH_SIGNALS[2];
  if (s.includes('visit') || s.includes('client'))                             return ALL_GROWTH_SIGNALS[3];
  if (s.includes('wedding') || s.includes('bridal'))                          return ALL_GROWTH_SIGNALS[4];
  if (s.includes('training') || s.includes('batch'))                          return ALL_GROWTH_SIGNALS[5];
  if (s.includes('tender') || s.includes('budget') || s.includes('approved')) return ALL_GROWTH_SIGNALS[6];
  if (s.includes('relocat') || s.includes('moving'))                          return ALL_GROWTH_SIGNALS[7];
  return ALL_GROWTH_SIGNALS[rand(0, ALL_GROWTH_SIGNALS.length - 1)];
};

const generateProspects = () => {
  const rawLeads = generateLeadData('hotel');

  return rawLeads.map((lead, i) => {
    const { company, contact, combinedScore, lastActivityDaysAgo, signals = [], dealValue } = lead;
    const prospectType = industryToProspectType(company.industry);
    const slug = company.domain?.split('.')[0] || 'company';

    const growthSignals = signals.length
      ? [...new Map(signals.map(s => {
          const g = signalToGrowthSignal(s);
          return [g.label, g];
        })).values()].slice(0, 3)
      : pickN(ALL_GROWTH_SIGNALS, rand(1, 2));

    const lastSignal =
      lastActivityDaysAgo === 0 ? 'Today' :
      lastActivityDaysAgo === 1 ? 'Yesterday' :
      `${lastActivityDaysAgo}d ago`;

    return {
      id: i + 1,
      name: contact.name,
      title: contact.title,
      company: company.name,
      prospectType,
      industry: company.industry,
      location: `${company.city}, India`,
      companySize: employeesToSize(company.employees),
      bookingNeed: bookingNeedForType(prospectType.label),
      estValue: dealValueToEstValue(dealValue),
      procurementCycle: cycleForType(prospectType.label, company.employees),
      email: contact.email,
      website: `www.${company.domain}`,
      linkedIn: `linkedin.com/in/${contact.name.split(' ')[0].toLowerCase()}-${contact.name.split(' ').pop()?.toLowerCase()}-${rand(100, 999)}`,
      techStack: company.tech?.length ? company.tech : pickN(TECH_STACKS, rand(2, 4)),
      growthSignals,
      painPoints: pickN(ALL_PAIN_POINTS, rand(2, 4)),
      matchScore: Math.min(combinedScore || rand(48, 92), 99),
      employees: company.employees,
      revenue: company.revenue,
      lastSignal,
      saved: Math.random() > 0.78,
      contacted: lead.stage !== 'new',
      verified: company.employees > 100,
    };
  });
};

/* ─────────────── Helpers ─────────────── */
const getMatchStyle = (score) => {
  if (score >= 80) return { ring: 'border-emerald-300 bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500', label: 'High Fit' };
  if (score >= 65) return { ring: 'border-amber-300 bg-amber-50 text-amber-700',   bar: 'bg-amber-400',   label: 'Medium Fit' };
  return              { ring: 'border-red-300 bg-red-50 text-red-600',             bar: 'bg-red-400',     label: 'Low Fit' };
};

const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const AVATAR_COLORS = [
  'bg-navy-700', 'bg-purple-600', 'bg-teal-600', 'bg-orange-500',
  'bg-pink-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600',
];

const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const generateAIAnalysis = (prospect, businessData) => {
  const hotel = businessData?.name || 'your hotel';
  const { matchScore, company, prospectType, growthSignals, painPoints, bookingNeed, estValue, procurementCycle } = prospect;
  const signal = growthSignals[0]?.label || '';
  const pain = painPoints[0] || '';
  const fitWord = matchScore >= 80 ? 'strong' : matchScore >= 65 ? 'promising' : 'potential';
  const typeLabel = prospectType?.label || 'Prospect';

  return `${company} is a ${fitWord} fit for ${hotel} with a ${matchScore}% AI match score based on booking type alignment, budget signals, and hospitality demand indicators.\n\n🏨 Booking Need: They are looking for "${bookingNeed}" — a service your hotel is equipped to provide.\n\n${signal ? `🔔 Active Signal: "${signal}" — this creates an immediate hospitality need. Reach out before a competitor hotel closes the deal.\n\n` : ''}⚠️ Key Pain Point: "${pain}" — presenting a pre-negotiated corporate rate or event package directly addresses this.\n\n💰 Estimated Value: ${estValue} with a ${procurementCycle.toLowerCase()} procurement cycle. ${procurementCycle === 'Annual Contract' ? 'An annual corporate agreement could secure long-term revenue.' : procurementCycle === 'Per-Event' ? 'Focus on a single high-quality event experience to build the relationship.' : 'Regular bookings can be locked in with a rate card and MOU.'}\n\n💡 Recommended Action: Offer a complimentary site visit or send a tailored ${typeLabel.toLowerCase()} package within 48 hours.`;
};

/* ─────────────── Filter Pill ─────────────── */
const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
      active
        ? 'bg-navy-700 text-white border-navy-700'
        : 'bg-white text-navy-500 border-navy-200 hover:border-navy-400'
    }`}
  >
    {label}
  </button>
);

/* ─────────────── Stat Card ─────────────── */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-navy-100 p-4 flex items-center gap-4 shadow-sm"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} bg-opacity-10`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-navy-800">{value}</p>
      <p className="text-xs text-navy-400 mt-0.5">{label}</p>
    </div>
  </motion.div>
);

/* ─────────────── Detail Panel ─────────────── */
const DetailPanel = ({ prospect, onClose, onToggleSave, businessData }) => {
  const ms = getMatchStyle(prospect.matchScore);
  const [copied, setCopied] = useState('');

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="fixed top-0 right-0 h-full w-105 bg-white shadow-2xl border-l border-navy-100 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-navy-100 bg-linear-to-r from-navy-50 to-white">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(prospect.id)}`}>
            {initials(prospect.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-navy-800 text-[15px]">{prospect.name}</h3>
              {prospect.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
            </div>
            <p className="text-xs text-navy-500">{prospect.title}</p>
            <p className="text-xs font-medium text-navy-700 mt-0.5">{prospect.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(prospect.id)}
            className={`p-1.5 rounded-lg transition-all ${prospect.saved ? 'text-amber-500 bg-amber-50' : 'text-navy-300 hover:text-amber-400 hover:bg-amber-50'}`}
          >
            <Star className="w-4 h-4" fill={prospect.saved ? 'currentColor' : 'none'} />
          </button>
          <button onClick={onClose} className="p-1.5 text-navy-400 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Match Score */}
        <div className={`rounded-xl border p-4 ${ms.ring}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">AI Match Score</span>
            <span className="text-lg font-bold">{prospect.matchScore}%</span>
          </div>
          <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${ms.bar}`} style={{ width: `${prospect.matchScore}%` }} />
          </div>
          <p className="text-xs mt-1.5 opacity-80">{ms.label} · Based on industry, growth signals & behavior</p>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Contact Info</h4>
          <div className="space-y-2">
            {[
              { icon: Mail,         label: prospect.email,   key: 'email',   href: `mailto:${prospect.email}` },
              { icon: Globe,        label: prospect.website, key: 'web',     href: `https://${prospect.website}` },
              { icon: ExternalLink, label: prospect.linkedIn,key: 'li',      href: `https://${prospect.linkedIn}` },
              { icon: MapPin,       label: prospect.location,key: null,      href: null },
            ].map(({ icon: Icon, label, key, href }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-navy-600">
                <Icon className="w-4 h-4 text-navy-400 shrink-0" />
                {href ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="truncate hover:text-navy-900 hover:underline transition-colors">
                      {label}
                    </a>
                    {key && (
                      <button onClick={() => copy(label, key)}
                        className="text-[10px] text-navy-400 hover:text-navy-700 px-1.5 py-0.5 bg-navy-50 rounded transition-all shrink-0">
                        {copied === key ? '✓' : 'Copy'}
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="truncate">{label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prospect Type */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${prospect.prospectType.color}`}>
            <span>{prospect.prospectType.icon}</span>
            {prospect.prospectType.label}
          </span>
        </div>

        {/* Company Details */}
        <div>
          <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Company Details</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Industry',      value: prospect.industry },
              { label: 'Team Size',     value: `${prospect.companySize.label} (${prospect.employees?.toLocaleString() || prospect.companySize.tag} employees)` },
              { label: 'Annual Revenue',value: prospect.revenue || prospect.estValue },
              { label: 'Booking Cycle', value: prospect.procurementCycle },
            ].map(({ label, value }) => (
              <div key={label} className="bg-navy-50 rounded-lg p-2.5">
                <p className="text-[10px] text-navy-400 font-medium">{label}</p>
                <p className="text-xs text-navy-700 font-semibold mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Need */}
        <div>
          <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Primary Booking Need</h4>
          <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🏨</span>
            <span className="text-sm font-semibold text-teal-800">{prospect.bookingNeed}</span>
          </div>
        </div>

        {/* Growth Signals */}
        <div>
          <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Growth Signals</h4>
          <div className="flex flex-wrap gap-2">
            {prospect.growthSignals.map((s) => (
              <span key={s.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${s.color}`}>
                <span>{s.icon}</span> {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Technology Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {prospect.techStack.map((t) => (
              <span key={t} className="px-2.5 py-1 bg-navy-50 border border-navy-100 text-navy-600 text-xs rounded-md font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Identified Pain Points</h4>
          <ul className="space-y-1.5">
            {prospect.painPoints.map((pp) => (
              <li key={pp} className="flex items-start gap-2 text-xs text-navy-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                {pp}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Analysis */}
        <div className="bg-linear-to-br from-navy-50 to-purple-50 border border-navy-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-semibold text-navy-700">AI Prospect Analysis</h4>
          </div>
          <p className="text-xs text-navy-600 whitespace-pre-line leading-relaxed">
            {generateAIAnalysis(prospect, businessData)}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-navy-100 bg-white space-y-2">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-700 text-white rounded-xl text-sm font-medium hover:bg-navy-800 transition-all">
          <Mail className="w-4 h-4" /> Draft Outreach Email
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium hover:bg-emerald-100 transition-all">
            <ArrowUpRight className="w-3.5 h-3.5" /> View on LinkedIn
          </button>
          <button
            onClick={() => onToggleSave(prospect.id)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              prospect.saved
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-navy-50 text-navy-600 border-navy-200 hover:bg-navy-100'
            }`}
          >
            <Star className="w-3.5 h-3.5" fill={prospect.saved ? 'currentColor' : 'none'} />
            {prospect.saved ? 'Saved' : 'Save Prospect'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────── Main Page ─────────────── */
export const ProspectIntelligence = () => {
  const { businessData } = useApp();
  const city = businessData?.businessCity || 'Bangalore';

  const [prospects, setProspects] = useState(() => generateProspects());
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [industryFilters, setIndustryFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [minMatch, setMinMatch] = useState(0);
  const [growthFilter, setGrowthFilter] = useState('');
  const [sortBy, setSortBy] = useState('matchScore');
  const [refreshing, setRefreshing] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const toggleFilter = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const toggleSave = (id) =>
    setProspects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p);
      if (selected?.id === id) setSelected(updated.find(p => p.id === id) || null);
      return updated;
    });

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1400));
    setProspects(generateProspects());
    setSelected(null);
    setRefreshing(false);
  };

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 2500);
  };

  const filtered = useMemo(() => {
    let list = [...prospects];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.company.toLowerCase().includes(s) ||
        p.prospectType.label.toLowerCase().includes(s) ||
        p.bookingNeed.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s)
      );
    }
    if (industryFilters.length) list = list.filter(p => industryFilters.includes(p.prospectType.label));
    if (sizeFilters.length)     list = list.filter(p => sizeFilters.includes(p.companySize.label));
    if (minMatch > 0)           list = list.filter(p => p.matchScore >= minMatch);
    if (growthFilter)           list = list.filter(p => p.growthSignals.some(g => g.label === growthFilter));

    list.sort((a, b) => {
      if (sortBy === 'matchScore') return b.matchScore - a.matchScore;
      if (sortBy === 'company')    return a.company.localeCompare(b.company);
      if (sortBy === 'lastSignal') return a.lastSignal.localeCompare(b.lastSignal);
      return 0;
    });
    return list;
  }, [prospects, search, industryFilters, sizeFilters, minMatch, growthFilter, sortBy]);

  const stats = [
    { icon: Database,   label: 'Total Prospects',  value: prospects.length,                                    color: 'text-navy-700'    },
    { icon: Target,     label: 'High Fit (80%+)',   value: prospects.filter(p => p.matchScore >= 80).length,    color: 'text-emerald-600' },
    { icon: Zap,        label: 'New This Week',      value: prospects.filter(p => parseInt(p.lastSignal) <= 7 || ['Today','Yesterday'].includes(p.lastSignal)).length, color: 'text-amber-500' },
    { icon: Star,       label: 'Saved',              value: prospects.filter(p => p.saved).length,              color: 'text-purple-600'  },
  ];

  const clearFilters = () => {
    setIndustryFilters([]);
    setSizeFilters([]);
    setMinMatch(0);
    setGrowthFilter('');
    setSearch('');
  };

  const hasActiveFilters = industryFilters.length || sizeFilters.length || minMatch > 0 || growthFilter || search;

  return (
    <div className="flex h-full min-h-screen bg-gray-50">

      {/* ── Filter Sidebar ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0 bg-white border-r border-navy-100 overflow-y-auto overflow-x-hidden"
            style={{ minHeight: '100vh' }}
          >
            <div className="w-60 p-4 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-navy-800">Filters</span>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-[11px] text-red-500 hover:text-red-700 font-medium">
                    Clear all
                  </button>
                )}
              </div>

              {/* Min Match Score */}
              <div>
                <p className="text-[11px] font-semibold text-navy-500 uppercase tracking-wide mb-2">Min Match Score</p>
                <div className="flex flex-wrap gap-1.5">
                  {[0, 50, 65, 80].map(v => (
                    <FilterPill key={v} label={v === 0 ? 'Any' : `${v}%+`} active={minMatch === v} onClick={() => setMinMatch(v)} />
                  ))}
                </div>
              </div>

              {/* Prospect Type */}
              <div>
                <p className="text-[11px] font-semibold text-navy-500 uppercase tracking-wide mb-2">Prospect Type</p>
                <div className="space-y-1">
                  {PROSPECT_TYPES.map(pt => (
                    <label key={pt.label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={industryFilters.includes(pt.label)}
                        onChange={() => toggleFilter(industryFilters, setIndustryFilters, pt.label)}
                        className="w-3.5 h-3.5 accent-navy-700 rounded"
                      />
                      <span className={`text-xs transition-colors ${industryFilters.includes(pt.label) ? 'text-navy-800 font-medium' : 'text-navy-500 group-hover:text-navy-700'}`}>
                        {pt.icon} {pt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div>
                <p className="text-[11px] font-semibold text-navy-500 uppercase tracking-wide mb-2">Company Size</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMPANY_SIZES.map(s => (
                    <FilterPill key={s.label} label={s.label} active={sizeFilters.includes(s.label)} onClick={() => toggleFilter(sizeFilters, setSizeFilters, s.label)} />
                  ))}
                </div>
              </div>

              {/* Growth Signals */}
              <div>
                <p className="text-[11px] font-semibold text-navy-500 uppercase tracking-wide mb-2">Growth Signal</p>
                <div className="space-y-1">
                  {ALL_GROWTH_SIGNALS.map(s => (
                    <label key={s.label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="growth"
                        checked={growthFilter === s.label}
                        onChange={() => setGrowthFilter(growthFilter === s.label ? '' : s.label)}
                        className="w-3.5 h-3.5 accent-navy-700"
                      />
                      <span className={`text-xs transition-colors ${growthFilter === s.label ? 'text-navy-800 font-medium' : 'text-navy-500 group-hover:text-navy-700'}`}>
                        {s.icon} {s.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Page Header */}
        <div className="bg-white border-b border-navy-100 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg border transition-all ${showFilters ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-navy-500 border-navy-200 hover:border-navy-400'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-navy-800 flex items-center gap-2">
                  <Database className="w-5 h-5 text-navy-700" />
                  Prospect Intelligence
                </h1>
                <p className="text-xs text-navy-400">AI-curated prospects matched to your business profile</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search prospects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-300 w-52"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="pl-3 pr-7 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-600 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="matchScore">Sort: Best Match</option>
                  <option value="company">Sort: Company A–Z</option>
                  <option value="lastSignal">Sort: Latest Signal</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-navy-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-600 hover:bg-navy-100 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 bg-navy-700 text-white rounded-lg text-xs font-medium hover:bg-navy-800 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-5 overflow-y-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-xl border border-navy-100 p-4 flex items-center gap-3 shadow-sm"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-opacity-10 ${
                  s.color === 'text-navy-700' ? 'bg-navy-100' :
                  s.color === 'text-emerald-600' ? 'bg-emerald-100' :
                  s.color === 'text-amber-500' ? 'bg-amber-100' : 'bg-purple-100'
                }`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-navy-800">{s.value}</p>
                  <p className="text-[11px] text-navy-400">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-navy-500">
              Showing <span className="font-semibold text-navy-700">{filtered.length}</span> prospects
              {hasActiveFilters && <span className="text-navy-400"> (filtered)</span>}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-50 border-b border-navy-100">
                    {['Prospect', 'Company', 'Prospect Type', 'Booking Need', 'Est. Value', 'Growth Signal', 'Match Score', 'Last Signal', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-navy-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-16 text-navy-400">
                        <Database className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No prospects match your filters.</p>
                        <button onClick={clearFilters} className="text-xs text-navy-600 underline mt-1">Clear filters</button>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p, i) => {
                      const ms = getMatchStyle(p.matchScore);
                      const isSelected = selected?.id === p.id;
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => setSelected(isSelected ? null : p)}
                          className={`border-b border-navy-50 cursor-pointer transition-colors hover:bg-navy-50/50 ${isSelected ? 'bg-navy-50' : ''}`}
                        >
                          {/* Prospect */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 ${getAvatarColor(p.id)}`}>
                                {initials(p.name)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <p className="text-sm font-semibold text-navy-800 truncate">{p.name}</p>
                                  {p.verified && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                                </div>
                                <p className="text-[11px] text-navy-400 truncate">{p.title}</p>
                              </div>
                            </div>
                          </td>

                          {/* Company */}
                          <td className="px-4 py-3">
                            <p className="text-sm text-navy-700 font-medium truncate max-w-35">{p.company}</p>
                            <p className="text-[11px] text-navy-400 truncate">{p.location.split(',').pop()?.trim()}</p>
                          </td>

                          {/* Prospect Type */}
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${p.prospectType.color}`}>
                              <span>{p.prospectType.icon}</span> {p.prospectType.label}
                            </span>
                          </td>

                          {/* Booking Need */}
                          <td className="px-4 py-3">
                            <span className="text-xs text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md whitespace-nowrap font-medium">
                              {p.bookingNeed}
                            </span>
                          </td>

                          {/* Est. Value */}
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold text-navy-700">{p.estValue}</span>
                            <p className="text-[10px] text-navy-400">{p.procurementCycle}</p>
                          </td>

                          {/* Growth Signal */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 flex-wrap">
                              {p.growthSignals.slice(0, 1).map(s => (
                                <span key={s.label} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${s.color}`}>
                                  {s.icon} {s.label}
                                </span>
                              ))}
                              {p.growthSignals.length > 1 && (
                                <span className="text-[11px] text-navy-400">+{p.growthSignals.length - 1}</span>
                              )}
                            </div>
                          </td>

                          {/* Match Score */}
                          <td className="px-4 py-3">
                            <div className={`inline-flex flex-col items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${ms.ring}`}>
                              <span>{p.matchScore}%</span>
                              <span className="text-[10px] font-normal opacity-70">{ms.label}</span>
                            </div>
                          </td>

                          {/* Last Signal */}
                          <td className="px-4 py-3">
                            <span className="text-xs text-navy-500 whitespace-nowrap">{p.lastSignal}</span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }}
                                className={`p-1.5 rounded-lg transition-all ${p.saved ? 'text-amber-500 bg-amber-50' : 'text-navy-300 hover:text-amber-400 hover:bg-amber-50'}`}
                                title={p.saved ? 'Unsave' : 'Save'}
                              >
                                <Star className="w-3.5 h-3.5" fill={p.saved ? 'currentColor' : 'none'} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                                className="p-1.5 text-navy-400 hover:text-navy-700 hover:bg-navy-100 rounded-lg transition-all"
                                title="View details"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail Panel ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelected(null)}
            />
            <DetailPanel
              prospect={selected}
              onClose={() => setSelected(null)}
              onToggleSave={toggleSave}
              businessData={businessData}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Export Toast ── */}
      <AnimatePresence>
        {showExportToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy-800 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Exporting {filtered.length} prospects to CSV…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

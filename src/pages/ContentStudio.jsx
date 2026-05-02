import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Layout, Download, Eye, Search, Sparkles, Plus, X, Check,
  ChevronDown, Share2, Clock, CheckCircle2, XCircle, RefreshCw,
  MessageCircle, Send, Calendar, Filter, MoreHorizontal, Bell,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { Commentable } from '../components/CommentBox';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

/* ─── Mock AI-generated content queue ─── */
const generateMockContent = () => [
  {
    id: 1, type: 'post', platform: 'instagram', status: 'pending_approval',
    title: 'Weekend Special Offer 🎉',
    caption: 'This weekend only! Get 20% off on all services. Book now and save big! #WeekendDeal #LocalBusiness',
    image: null, scheduledAt: 'Today, 6:00 PM',
    whatsappNotified: true, generatedAt: '2 hours ago',
  },
  {
    id: 2, type: 'post', platform: 'facebook', status: 'approved',
    title: 'Customer Testimonial',
    caption: '"Best service in town!" — Priya S. ⭐⭐⭐⭐⭐ Thank you for the love! We strive to give our best every day.',
    image: null, scheduledAt: 'Tomorrow, 10:00 AM',
    whatsappNotified: true, generatedAt: '5 hours ago',
  },
  {
    id: 3, type: 'story', platform: 'instagram', status: 'posted',
    title: 'Behind the Scenes',
    caption: 'A sneak peek into our workspace! See how the magic happens 🔧✨',
    image: null, scheduledAt: 'Yesterday, 4:00 PM',
    whatsappNotified: true, generatedAt: '1 day ago', postedAt: 'Yesterday, 4:02 PM',
  },
  {
    id: 4, type: 'post', platform: 'linkedin', status: 'rejected',
    title: 'Business Growth Tips',
    caption: 'Top 5 ways to grow your local business in 2026...',
    image: null, scheduledAt: 'Tomorrow, 2:00 PM',
    whatsappNotified: true, generatedAt: '3 hours ago',
    rejectionReason: 'Tone too formal, make it casual',
  },
  {
    id: 5, type: 'post', platform: 'x', status: 'regenerating',
    title: 'Industry Trend Alert',
    caption: 'The future of local businesses is digital. Are you ready? 🚀',
    image: null, scheduledAt: 'Tomorrow, 11:00 AM',
    whatsappNotified: true, generatedAt: '1 hour ago',
  },
  {
    id: 6, type: 'reel', platform: 'instagram', status: 'pending_approval',
    title: 'Quick Service Demo',
    caption: 'Watch how we deliver perfection in 60 seconds! 🎬',
    image: null, scheduledAt: 'Today, 8:00 PM',
    whatsappNotified: false, generatedAt: '30 min ago',
  },
  {
    id: 7, type: 'post', platform: 'youtube', status: 'approved',
    title: 'Monthly Recap Video',
    caption: 'Our best moments from this month! Thanks for being part of our journey.',
    image: null, scheduledAt: 'Friday, 12:00 PM',
    whatsappNotified: true, generatedAt: '6 hours ago',
  },
  {
    id: 8, type: 'post', platform: 'facebook', status: 'posted',
    title: 'New Arrival Announcement',
    caption: 'Something exciting is here! Check out our latest addition. 🆕',
    image: null, scheduledAt: '2 days ago',
    whatsappNotified: true, generatedAt: '2 days ago', postedAt: '2 days ago, 5:01 PM',
  },
];

const platformIcons = {
  instagram: { icon: '📸', color: 'bg-teal-600', text: 'text-teal-700', light: 'bg-teal-50', label: 'Instagram' },
  facebook: { icon: '📘', color: 'bg-blue-600', text: 'text-blue-700', light: 'bg-blue-50', label: 'Facebook' },
  x: { icon: '🐦', color: 'bg-gray-800', text: 'text-gray-700', light: 'bg-gray-50', label: 'X (Twitter)' },
  linkedin: { icon: '💼', color: 'bg-sky-700', text: 'text-sky-700', light: 'bg-sky-50', label: 'LinkedIn' },
  youtube: { icon: '🎬', color: 'bg-red-600', text: 'text-red-700', light: 'bg-red-50', label: 'YouTube' },
};

const statusConfig = {
  pending_approval: { label: 'Awaiting Approval', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-teal-100 text-teal-700', icon: CheckCircle2 },
  posted: { label: 'Posted', color: 'bg-green-100 text-green-700', icon: Check },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  regenerating: { label: 'Regenerating', color: 'bg-navy-100 text-navy-700', icon: RefreshCw },
};

const filters = ['all', 'pending_approval', 'approved', 'posted', 'rejected', 'regenerating'];
const platformFilters = ['all', 'instagram', 'facebook', 'x', 'linkedin', 'youtube'];

export const ContentStudio = () => {
  const { language, businessData } = useApp();
  const [content, setContent] = useState(generateMockContent);
  const [activeFilter, setActiveFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rejectionModal, setRejectionModal] = useState(null);
  const [rejectionText, setRejectionText] = useState('');

  const filtered = content.filter(c => {
    if (activeFilter !== 'all' && c.status !== activeFilter) return false;
    if (platformFilter !== 'all' && c.platform !== platformFilter) return false;
    return true;
  });

  const statusCounts = {
    all: content.length,
    pending_approval: content.filter(c => c.status === 'pending_approval').length,
    approved: content.filter(c => c.status === 'approved').length,
    posted: content.filter(c => c.status === 'posted').length,
    rejected: content.filter(c => c.status === 'rejected').length,
    regenerating: content.filter(c => c.status === 'regenerating').length,
  };

  const handleApprove = (id) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const handleReject = (id) => {
    setRejectionModal(id);
  };

  const submitRejection = () => {
    setContent(prev => prev.map(c => c.id === rejectionModal ? { ...c, status: 'rejected', rejectionReason: rejectionText || 'Not suitable' } : c));
    setRejectionModal(null);
    setRejectionText('');
  };

  const handleRegenerate = (id) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: 'regenerating' } : c));
    setTimeout(() => {
      setContent(prev => prev.map(c => c.id === id ? { ...c, status: 'pending_approval', generatedAt: 'Just now', rejectionReason: undefined } : c));
    }, 3000);
  };

  const handleGenerateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const platforms = ['instagram', 'facebook', 'x', 'linkedin', 'youtube'];
      const types = ['post', 'story', 'reel'];
      const newPost = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        status: 'pending_approval',
        title: 'AI-Generated Fresh Content',
        caption: 'This content was just created by AI based on trending topics in your business area! 🤖✨',
        image: null,
        scheduledAt: 'Tomorrow, 9:00 AM',
        whatsappNotified: false,
        generatedAt: 'Just now',
      };
      setContent(prev => [newPost, ...prev]);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <Commentable id="content-studio" label="Content Studio">
    <div className="space-y-5">
      {/* Header */}
      <Commentable id="content-studio-header" label="Content Studio Header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('contentStudio', language)}</h1>
          <p className="text-sm text-navy-400 mt-0.5">AI generates content → You approve on WhatsApp → Auto-posted</p>
        </div>
        <button onClick={handleGenerateNew} disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            isGenerating ? 'bg-navy-200 text-navy-500 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}>
          {isGenerating ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...</> : <><Sparkles className="w-3.5 h-3.5" /> Generate New Content</>}
        </button>
      </div>
      </Commentable>

      {/* Flow Summary Banner */}
      <Commentable id="content-studio-pipeline-banner" label="Content Pipeline Banner">
      <motion.div {...fade(0)} className="bg-navy-700 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <p className="text-sm font-bold">Content Auto-Pipeline Active</p>
              <p className="text-[10px] text-white/70">AI creates → WhatsApp notifies → You approve → Auto-posted</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="bg-white/20 px-3 py-1 rounded-lg">{statusCounts.pending_approval} Pending</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg">{statusCounts.posted} Posted</span>
          </div>
        </div>
      </motion.div>
      </Commentable>

      {/* Status Filter Tabs */}
      <Commentable id="content-studio-status-filters" label="Content Status Filter Tabs">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map(f => {
          const cfg = f === 'all' ? null : statusConfig[f];
          return (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                activeFilter === f ? 'bg-navy-700 text-white' : 'bg-white text-navy-500 border border-navy-100 hover:bg-navy-50'
              }`}>
              {f === 'all' ? 'All' : cfg?.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeFilter === f ? 'bg-white/20' : 'bg-navy-100'}`}>
                {statusCounts[f]}
              </span>
            </button>
          );
        })}
      </div>
      </Commentable>

      {/* Platform Filter */}
      <Commentable id="content-studio-platform-filters" label="Platform Filter Tabs">
      <div className="flex items-center gap-2">
        {platformFilters.map(p => {
          const cfg = p === 'all' ? null : platformIcons[p];
          return (
            <button key={p} onClick={() => setPlatformFilter(p)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                platformFilter === p ? 'bg-navy-700 text-white' : 'bg-white text-navy-500 border border-navy-100 hover:bg-navy-50'
              }`}>
              {p === 'all' ? '🌐 All' : `${cfg?.icon} ${cfg?.label}`}
            </button>
          );
        })}
      </div>
      </Commentable>

      {/* Content Grid */}
      <Commentable id="content-studio-content-grid" label="Content Cards Grid">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item, i) => {
          const plat = platformIcons[item.platform];
          const stat = statusConfig[item.status];
          const StatIcon = stat.icon;

          return (
            <motion.div key={item.id} {...fade(i)}
              className="bg-white rounded-xl border border-navy-100 overflow-hidden hover:shadow-md transition-all">
              {/* Content Preview */}
              <div className="h-36 bg-navy-100 relative flex items-center justify-center">
                <div className="text-center px-4">
                  <span className="text-3xl mb-2 block">{plat.icon}</span>
                  <p className="text-xs font-semibold text-navy-600">{item.title}</p>
                </div>
                {/* Platform badge */}
                <div className={`absolute top-2 left-2 ${plat.color} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}>
                  {plat.label}
                </div>
                {/* Type badge */}
                <div className="absolute top-2 right-2 bg-white/90 text-navy-600 text-[9px] font-bold px-2 py-0.5 rounded-full capitalize">
                  {item.type}
                </div>
              </div>

              {/* Content Info */}
              <div className="p-3 space-y-2">
                <p className="text-[11px] text-navy-500 line-clamp-2">{item.caption}</p>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${stat.color}`}>
                    <StatIcon className="w-3 h-3" /> {stat.label}
                  </span>
                  <span className="text-[9px] text-navy-400">{item.generatedAt}</span>
                </div>

                {/* WhatsApp notification status */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <MessageCircle className="w-3 h-3 text-green-600" />
                  <span className={item.whatsappNotified ? 'text-green-600 font-semibold' : 'text-navy-400'}>
                    {item.whatsappNotified ? 'WhatsApp notified' : 'Notification pending'}
                  </span>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-1.5 text-[10px] text-navy-400">
                  <Calendar className="w-3 h-3" /> {item.status === 'posted' ? `Posted: ${item.postedAt}` : `Scheduled: ${item.scheduledAt}`}
                </div>

                {/* Rejection reason */}
                {item.status === 'rejected' && item.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-[10px] text-red-600 font-semibold">Reason: {item.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-1">
                  {item.status === 'pending_approval' && (
                    <>
                      <button onClick={() => handleApprove(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-teal-600 text-white text-[10px] font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                        <ThumbsUp className="w-3 h-3" /> Approve
                      </button>
                      <button onClick={() => handleReject(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded-lg hover:bg-red-200 transition-colors">
                        <ThumbsDown className="w-3 h-3" /> Reject
                      </button>
                    </>
                  )}
                  {item.status === 'rejected' && (
                    <button onClick={() => handleRegenerate(item.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-navy-100 text-navy-700 text-[10px] font-semibold rounded-lg hover:bg-navy-200 transition-colors">
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </button>
                  )}
                  {item.status === 'regenerating' && (
                    <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-navy-50 text-navy-600 text-[10px] font-semibold rounded-lg">
                      <RefreshCw className="w-3 h-3 animate-spin" /> AI Regenerating...
                    </div>
                  )}
                  {item.status === 'approved' && (
                    <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-teal-50 text-teal-600 text-[10px] font-semibold rounded-lg">
                      <Clock className="w-3 h-3" /> Will post at {item.scheduledAt}
                    </div>
                  )}
                  {item.status === 'posted' && (
                    <div className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-green-50 text-green-600 text-[10px] font-semibold rounded-lg">
                      <Check className="w-3 h-3" /> Published successfully
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-10 h-10 text-navy-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-navy-500">No content matches your filter</p>
          <p className="text-xs text-navy-400 mt-1">Try a different filter or generate new content</p>
        </div>
      )}
      </Commentable>

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejectionModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4"
            onClick={() => setRejectionModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
              <h3 className="text-sm font-bold text-navy-900 mb-1">Reject Content</h3>
              <p className="text-[11px] text-navy-400 mb-3">Tell us why so AI can regenerate better content</p>
              <textarea value={rejectionText} onChange={e => setRejectionText(e.target.value)}
                placeholder="e.g., Too formal, make it casual and fun..."
                rows={3} className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none mb-3" />
              <div className="flex gap-2">
                <button onClick={() => { setRejectionModal(null); setRejectionText(''); }}
                  className="flex-1 px-3 py-2 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50">Cancel</button>
                <button onClick={submitRejection}
                  className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700">Reject & Regenerate</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </Commentable>
  );
};

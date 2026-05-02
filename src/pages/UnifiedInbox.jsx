import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox, Mail, MessageCircle, Phone, Globe, BookOpen, Briefcase,
  Search, Filter, Star, Archive, Trash2, Reply, Forward, MoreHorizontal,
  CheckCircle2, Clock, AlertCircle, Paperclip, Send, ChevronDown, X,
  RefreshCw, Tag, Pin, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { Commentable } from '../components/CommentBox';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05, duration: 0.3 } });

// Channel config
const channels = [
  { id: 'all', label: 'All', icon: Inbox, color: 'text-navy-600', bg: 'bg-navy-100' },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'instagram', label: 'Instagram', icon: Globe, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'facebook', label: 'Facebook', icon: BookOpen, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: 'text-sky-700', bg: 'bg-sky-50' },
  { id: 'phone', label: 'Calls/SMS', icon: Phone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

// Sample messages
const sampleMessages = [
  { id: 1, channel: 'whatsapp', from: 'Rahul Sharma', avatar: 'RS', subject: 'Booking inquiry for Saturday', preview: 'Hi, I wanted to book a table for 6 people this Saturday evening. Do you have availability around 8pm?', time: '2 min ago', unread: true, starred: true, label: 'Lead', priority: 'high' },
  { id: 2, channel: 'email', from: 'Google Business', avatar: 'G', subject: 'Your monthly performance report', preview: 'Your business received 342 views and 28 direction requests this month. See how you compare to similar businesses...', time: '15 min ago', unread: true, starred: false, label: 'Report', priority: 'low' },
  { id: 3, channel: 'instagram', from: 'priya_foodie', avatar: 'PF', subject: 'DM: Loved your new menu!', preview: 'Hey! Just saw your story about the new thali. What\'s the price? Can I order for delivery?', time: '32 min ago', unread: true, starred: false, label: 'Lead', priority: 'medium' },
  { id: 4, channel: 'facebook', from: 'Meera Joshi', avatar: 'MJ', subject: 'Review Response Needed', preview: 'Great ambience but the wait time was too long. Would appreciate if you could improve on that.', time: '1h ago', unread: true, starred: false, label: 'Review', priority: 'high' },
  { id: 5, channel: 'email', from: 'Swiggy Partner Support', avatar: 'SW', subject: 'Menu update confirmation', preview: 'Your menu changes have been approved and are now live. 3 new items added successfully.', time: '2h ago', unread: false, starred: false, label: 'Platform', priority: 'low' },
  { id: 6, channel: 'whatsapp', from: 'Vikram (Supplier)', avatar: 'VS', subject: 'Tomorrow\'s delivery update', preview: 'Boss, tomorrow vegetables will be 30 min late. Traffic issues on ring road. Fresh stock guaranteed though.', time: '3h ago', unread: false, starred: true, label: 'Supplier', priority: 'medium' },
  { id: 7, channel: 'linkedin', from: 'Anitha Bhat', avatar: 'AB', subject: 'Corporate event inquiry', preview: 'Hi, we\'re looking for a venue for our team outing (25 pax). Do you do corporate packages? Budget: ₹50k', time: '4h ago', unread: true, starred: true, label: 'Lead', priority: 'high' },
  { id: 8, channel: 'phone', from: '+91 98765 43210', avatar: '📞', subject: 'Missed Call', preview: 'Missed call at 2:34 PM. No voicemail left. Number matches: Karthik N. (past customer, last visit 20 days ago)', time: '5h ago', unread: true, starred: false, label: 'Follow-up', priority: 'medium' },
  { id: 9, channel: 'instagram', from: 'foodie_bengaluru', avatar: 'FB', subject: 'Collaboration request', preview: 'Hey! I\'m a food blogger with 45K followers. Would love to do a reel at your place. Interested in a collab?', time: '6h ago', unread: false, starred: false, label: 'Collab', priority: 'medium' },
  { id: 10, channel: 'email', from: 'Zomato Business', avatar: 'Z', subject: 'New review: 4.5★ from Deepak K.', preview: '"Amazing biryani! Best I\'ve had in this area. The portion size is generous and value for money." — Reply to thank them?', time: '7h ago', unread: false, starred: false, label: 'Review', priority: 'low' },
  { id: 11, channel: 'whatsapp', from: 'Catering Lead - Wedding', avatar: 'WD', subject: 'Wedding catering for 200 guests', preview: 'Namaste, we need catering for a wedding on June 15. 200 guests, veg + non-veg. Can you share your package rates?', time: '8h ago', unread: true, starred: true, label: 'Lead', priority: 'high' },
  { id: 12, channel: 'facebook', from: 'Local Food Group', avatar: 'LF', subject: 'Someone mentioned your business', preview: '"Can anyone recommend a good place for family dinner near Koramangala?" — 3 people tagged your page in comments', time: '9h ago', unread: false, starred: false, label: 'Mention', priority: 'medium' },
];

export const UnifiedInbox = () => {
  const { language, businessData } = useApp();
  const [activeChannel, setActiveChannel] = useState('all');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState('all');

  const filteredMessages = useMemo(() => {
    let msgs = sampleMessages;
    if (activeChannel !== 'all') msgs = msgs.filter(m => m.channel === activeChannel);
    if (filterLabel !== 'all') msgs = msgs.filter(m => m.label === filterLabel);
    if (searchQuery) msgs = msgs.filter(m =>
      m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return msgs;
  }, [activeChannel, filterLabel, searchQuery]);

  const unreadCount = sampleMessages.filter(m => m.unread).length;
  const channelCounts = useMemo(() => {
    const counts = {};
    channels.forEach(ch => {
      counts[ch.id] = ch.id === 'all' ? sampleMessages.filter(m => m.unread).length : sampleMessages.filter(m => m.channel === ch.id && m.unread).length;
    });
    return counts;
  }, []);

  const labels = ['all', 'Lead', 'Review', 'Report', 'Supplier', 'Platform', 'Collab', 'Follow-up', 'Mention'];
  const priorityColor = { high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-navy-100 text-navy-500' };
  const channelIcon = (ch) => channels.find(c => c.id === ch) || channels[0];

  return (
    <Commentable id="unified-inbox" label="Unified Inbox">
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <Commentable id="unified-inbox-header" label="Inbox Header">
      <motion.div {...fade(0)} className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-navy-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-navy-800 rounded-xl flex items-center justify-center">
            <Inbox className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-navy-900">Inbox</h1>
            <p className="text-[11px] text-navy-400">{unreadCount} unread across all channels</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-navy-50 rounded-lg transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-navy-500" />
          </button>
        </div>
      </motion.div>
      </Commentable>

      <div className="flex flex-1 overflow-hidden">
        {/* Channel Tabs - Left Rail */}
        <Commentable id="unified-inbox-channel-sidebar" label="Channel Tabs Sidebar">
        <motion.div {...fade(1)} className="hidden sm:flex flex-col w-[72px] border-r border-navy-100 bg-navy-25 py-3 gap-1 items-center overflow-y-auto">
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${activeChannel === ch.id ? 'bg-white shadow-sm border border-navy-100' : 'hover:bg-white/60'}`}
            >
              <ch.icon className={`w-4 h-4 ${activeChannel === ch.id ? ch.color : 'text-navy-400'}`} />
              <span className={`text-[8px] font-medium ${activeChannel === ch.id ? 'text-navy-700' : 'text-navy-400'}`}>{ch.label}</span>
              {channelCounts[ch.id] > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{channelCounts[ch.id]}</span>
              )}
            </button>
          ))}
        </motion.div>
        </Commentable>

        {/* Message List */}
        <Commentable id="unified-inbox-message-list" label="Message List Panel">
        <motion.div {...fade(2)} className={`flex flex-col border-r border-navy-100 bg-white overflow-hidden ${selectedMsg ? 'hidden sm:flex sm:w-[340px]' : 'flex-1 sm:w-[340px]'}`}>
          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-navy-50 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-navy-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-navy-50 border border-navy-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
              />
            </div>
            {/* Mobile channel tabs */}
            <div className="flex sm:hidden gap-1 overflow-x-auto pb-1">
              {channels.map(ch => (
                <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium ${activeChannel === ch.id ? 'bg-navy-800 text-white' : 'bg-navy-50 text-navy-500'}`}>
                  {ch.label} {channelCounts[ch.id] > 0 && `(${channelCounts[ch.id]})`}
                </button>
              ))}
            </div>
            {/* Label filter */}
            <div className="flex gap-1 overflow-x-auto">
              {labels.map(l => (
                <button key={l} onClick={() => setFilterLabel(l)}
                  className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${filterLabel === l ? 'bg-teal-500 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}`}>
                  {l === 'all' ? 'All' : l}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto divide-y divide-navy-50">
            {filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-navy-300">
                <Inbox className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-xs">No messages found</p>
              </div>
            )}
            {filteredMessages.map(msg => {
              const ch = channelIcon(msg.channel);
              return (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`w-full text-left px-3 py-3 hover:bg-navy-25 transition-colors ${selectedMsg?.id === msg.id ? 'bg-teal-50/50 border-l-2 border-teal-500' : ''} ${msg.unread ? 'bg-white' : 'bg-navy-25/50'}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${ch.bg} flex items-center justify-center shrink-0 text-[10px] font-bold ${ch.color}`}>
                      {msg.avatar.length <= 2 ? msg.avatar : <ch.icon className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[11px] truncate ${msg.unread ? 'font-bold text-navy-900' : 'font-medium text-navy-600'}`}>{msg.from}</span>
                        <span className="text-[9px] text-navy-400 shrink-0">{msg.time}</span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${msg.unread ? 'font-semibold text-navy-800' : 'text-navy-600'}`}>{msg.subject}</p>
                      <p className="text-[10px] text-navy-400 truncate mt-0.5">{msg.preview}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${priorityColor[msg.priority]}`}>{msg.priority}</span>
                        <span className="px-1.5 py-0.5 bg-navy-50 rounded text-[8px] font-medium text-navy-500">{msg.label}</span>
                        {msg.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                    </div>
                    {msg.unread && <span className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-2" />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
        </Commentable>

        {/* Message Detail / Empty State */}
        <Commentable id="unified-inbox-message-detail" label="Message Detail Panel">
        <motion.div {...fade(3)} className={`flex-1 flex flex-col bg-white ${selectedMsg ? 'flex' : 'hidden sm:flex'}`}>
          {!selectedMsg ? (
            <div className="flex-1 flex flex-col items-center justify-center text-navy-300">
              <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mb-3">
                <Mail className="w-7 h-7 text-navy-300" />
              </div>
              <p className="text-sm font-medium text-navy-500">Select a message</p>
              <p className="text-[11px] text-navy-400 mt-1">Choose a conversation to view details</p>
            </div>
          ) : (
            <>
              {/* Detail Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100">
                <button onClick={() => setSelectedMsg(null)} className="sm:hidden p-1.5 hover:bg-navy-50 rounded-lg">
                  <X className="w-4 h-4 text-navy-500" />
                </button>
                <div className="flex items-center gap-2">
                  <Reply className="w-4 h-4 text-navy-400 cursor-pointer hover:text-navy-600" />
                  <Forward className="w-4 h-4 text-navy-400 cursor-pointer hover:text-navy-600" />
                  <Archive className="w-4 h-4 text-navy-400 cursor-pointer hover:text-navy-600" />
                  <Star className={`w-4 h-4 cursor-pointer ${selectedMsg.starred ? 'text-amber-400 fill-amber-400' : 'text-navy-400 hover:text-amber-400'}`} />
                  <Trash2 className="w-4 h-4 text-navy-400 cursor-pointer hover:text-red-500" />
                </div>
                <button className="p-1.5 hover:bg-navy-50 rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-navy-400" />
                </button>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-2xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full ${channelIcon(selectedMsg.channel).bg} flex items-center justify-center text-sm font-bold ${channelIcon(selectedMsg.channel).color}`}>
                      {selectedMsg.avatar.length <= 2 ? selectedMsg.avatar : selectedMsg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-navy-900">{selectedMsg.from}</h3>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${channelIcon(selectedMsg.channel).bg} ${channelIcon(selectedMsg.channel).color}`}>
                          {channels.find(c => c.id === selectedMsg.channel)?.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-navy-400">{selectedMsg.time}</p>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-navy-900 mb-3">{selectedMsg.subject}</h2>
                  <div className="text-sm text-navy-700 leading-relaxed bg-navy-25 rounded-xl p-4 border border-navy-100">
                    <p>{selectedMsg.preview}</p>
                  </div>

                  {/* Labels & Info */}
                  <div className="flex items-center gap-2 mt-4">
                    <Tag className="w-3.5 h-3.5 text-navy-400" />
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${priorityColor[selectedMsg.priority]}`}>{selectedMsg.priority} priority</span>
                    <span className="px-2 py-0.5 bg-navy-50 rounded text-[9px] font-medium text-navy-500">{selectedMsg.label}</span>
                  </div>

                  {/* AI Suggestion */}
                  <div className="mt-5 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[10px] font-bold text-teal-700">AI Suggested Reply</span>
                    </div>
                    <p className="text-[11px] text-teal-800 leading-relaxed">
                      {selectedMsg.label === 'Lead'
                        ? `"Thank you for reaching out! We'd love to help. Let me check availability and get back to you shortly with options. 😊"`
                        : selectedMsg.label === 'Review'
                        ? `"Thank you for your feedback! We appreciate you taking the time to share your experience. We're working on improving wait times and hope to welcome you back soon."`
                        : `"Thanks for the update. Noted and acknowledged. Let me know if there's anything else needed."`
                      }
                    </p>
                    <button className="mt-2 px-3 py-1.5 bg-teal-600 text-white text-[10px] font-semibold rounded-lg hover:bg-teal-500 transition-colors flex items-center gap-1.5">
                      <Send className="w-3 h-3" /> Send Suggested Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Reply */}
              <div className="border-t border-navy-100 p-3 bg-navy-25">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a quick reply..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-navy-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  <button className="p-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
        </Commentable>
      </div>
    </div>
    </Commentable>
  );
};

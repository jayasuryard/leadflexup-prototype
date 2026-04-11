import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Share2, MapPin, ArrowRight, SkipForward,
  Check, TrendingUp, X, ChevronRight, Eye,
  Layout, Upload, ShoppingCart,
  Phone, Clock, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ══════════════════════════════════════════════════════════
   WEBSITE TEMPLATES
   ══════════════════════════════════════════════════════════ */
const websiteTemplates = [
  { id: 1, name: 'Modern Starter', category: 'General', color: '#0d886f', desc: 'Clean minimal layout' },
  { id: 2, name: 'Restaurant Pro', category: 'Food', color: '#b45309', desc: 'Menu + reservation ready' },
  { id: 3, name: 'Salon Elegance', category: 'Beauty', color: '#9333ea', desc: 'Booking-focused design' },
  { id: 4, name: 'Retail Express', category: 'Retail', color: '#dc2626', desc: 'Product showcase grid' },
  { id: 5, name: 'Service Hub', category: 'Services', color: '#1e2f52', desc: 'Service listing layout' },
  { id: 6, name: 'Portfolio Studio', category: 'Creative', color: '#0369a1', desc: 'Visual portfolio style' },
  { id: 7, name: 'Healthcare Plus', category: 'Health', color: '#059669', desc: 'Appointment booking' },
  { id: 8, name: 'Education First', category: 'Education', color: '#7c3aed', desc: 'Course catalog layout' },
  { id: 9, name: 'Local Market', category: 'Retail', color: '#ea580c', desc: 'Multi-vendor layout' },
  { id: 10, name: 'Fitness Zone', category: 'Health', color: '#0f172a', desc: 'Class schedule + plans' },
  { id: 11, name: 'Hotel Grand', category: 'Hospitality', color: '#854d0e', desc: 'Room booking system' },
  { id: 12, name: 'Auto Works', category: 'Services', color: '#374151', desc: 'Service request forms' },
  { id: 13, name: 'Tech Solutions', category: 'Tech', color: '#1d4ed8', desc: 'SaaS landing page' },
  { id: 14, name: 'Wedding Bliss', category: 'Events', color: '#be185d', desc: 'Event gallery layout' },
  { id: 15, name: 'Grocery Fresh', category: 'Food', color: '#16a34a', desc: 'Product + delivery' },
];

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { id: 'youtube', name: 'YouTube', icon: '🎬', color: 'bg-red-50 border-red-200 text-red-700' },
  { id: 'whatsapp', name: 'WhatsApp Business', icon: '💬', color: 'bg-green-50 border-green-200 text-green-700' },
];

/* ══════════════════════════════════════════════════════════
   TEMPLATE PICKER POPUP
   ══════════════════════════════════════════════════════════ */
const TemplatePickerPopup = ({ open, onClose, onSelect }) => {
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-5 border-b border-navy-100">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Choose a Template</h2>
              <p className="text-xs text-navy-400 mt-0.5">Pick from 15 industry-specific designs</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
          </div>

          {preview ? (
            <div className="flex-1 overflow-y-auto p-5">
              <button onClick={() => setPreview(null)} className="text-xs text-navy-500 hover:text-navy-700 mb-4 flex items-center gap-1">
                ← Back to templates
              </button>
              <div className="bg-navy-50 rounded-xl overflow-hidden border border-navy-100">
                <div className="h-8 bg-white border-b border-navy-100 flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="flex-1 mx-8 h-4 bg-navy-50 rounded text-[9px] text-navy-400 flex items-center justify-center">yourbusiness.com</div>
                </div>
                <div className="p-6">
                  <div className="rounded-xl p-8 mb-4 text-center" style={{ backgroundColor: preview.color + '15' }}>
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: preview.color }}>
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 mb-1">Your Business Name</h3>
                    <p className="text-xs text-navy-500">Welcome to our {preview.category.toLowerCase()} business</p>
                    <button className="mt-3 px-4 py-1.5 text-xs font-semibold text-white rounded-lg" style={{ backgroundColor: preview.color }}>Contact Us</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Our Services', 'About Us', 'Contact'].map((s, i) => (
                      <div key={i} className="bg-white rounded-lg border border-navy-100 p-4 text-center">
                        <div className="w-8 h-8 rounded-lg mx-auto mb-2" style={{ backgroundColor: preview.color + '20' }} />
                        <p className="text-xs font-semibold text-navy-700">{s}</p>
                        <p className="text-[10px] text-navy-400 mt-1">Sample content here</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-3 gap-3">
                {websiteTemplates.map(t => (
                  <button key={t.id} onClick={() => setSelected(t.id)}
                    className={`relative text-left rounded-xl border-2 p-4 transition-all ${
                      selected === t.id ? 'border-teal-500 bg-teal-50/50' : 'border-navy-100 hover:border-navy-200'
                    }`}>
                    {selected === t.id && (
                      <div className="absolute top-2 right-2"><Check className="w-4 h-4 text-teal-600" /></div>
                    )}
                    <div className="w-full h-20 rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: t.color + '15' }}>
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: t.color }}>
                        <Layout className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-navy-800">{t.name}</p>
                    <p className="text-[10px] text-navy-400">{t.desc}</p>
                    <span className="inline-block mt-1.5 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-navy-100 text-navy-500">{t.category}</span>
                    <button onClick={(e) => { e.stopPropagation(); setPreview(t); }}
                      className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] text-navy-500 hover:text-teal-600 py-1">
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 border-t border-navy-100 bg-navy-50/50">
            <p className="text-xs text-navy-400">{selected ? `Selected: ${websiteTemplates.find(t => t.id === selected)?.name}` : 'Select a template'}</p>
            <button onClick={() => selected && onSelect(websiteTemplates.find(t => t.id === selected))}
              disabled={!selected}
              className={`px-6 py-2 text-xs font-semibold rounded-lg transition-colors ${
                selected ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-200 text-navy-400 cursor-not-allowed'
              }`}>
              Confirm Template
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   BUSINESS INFO POPUP
   ══════════════════════════════════════════════════════════ */
const BusinessInfoPopup = ({ open, onClose, onSave, businessData }) => {
  const [info, setInfo] = useState({
    description: businessData?.businessName ? `Welcome to ${businessData.businessName}` : '',
    tagline: '',
    address: businessData?.businessAddress || '',
    phone: businessData?.phone || '',
    email: '',
    hours: 'Mon-Sat: 9:00 AM - 8:00 PM',
  });
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-5 border-b border-navy-100">
            <div>
              <h2 className="text-base font-bold text-navy-900">Add Your Business Info</h2>
              <p className="text-xs text-navy-400 mt-0.5">This will appear on your website</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
          </div>

          <form onSubmit={e => { e.preventDefault(); onSave(info); }} className="p-5 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Business Description</label>
              <textarea value={info.description} onChange={e => setInfo({ ...info, description: e.target.value })}
                rows={3} placeholder="Tell customers about your business..."
                className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Tagline</label>
              <input value={info.tagline} onChange={e => setInfo({ ...info, tagline: e.target.value })}
                placeholder="e.g., Best quality at best prices"
                className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Phone</label>
                <input value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })}
                  placeholder="Contact number" className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Email</label>
                <input value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} type="email"
                  placeholder="business@email.com" className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Address</label>
              <input value={info.address} onChange={e => setInfo({ ...info, address: e.target.value })}
                placeholder="Full business address" className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Business Hours</label>
              <input value={info.hours} onChange={e => setInfo({ ...info, hours: e.target.value })}
                placeholder="e.g., Mon-Sat: 9 AM - 8 PM" className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">Logo Upload</label>
              <div className="border-2 border-dashed border-navy-200 rounded-lg p-4 text-center hover:border-teal-400 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-navy-300 mx-auto mb-1" />
                <p className="text-[11px] text-navy-400">Click to upload logo (optional)</p>
              </div>
            </div>
            <button type="submit"
              className="w-full py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors mt-2">
              Save Business Info
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   DOMAIN PURCHASE POPUP
   ══════════════════════════════════════════════════════════ */
const DomainPurchasePopup = ({ open, onClose, onPurchase, businessName }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const slug = (businessName || 'mybusiness').toLowerCase().replace(/[^a-z0-9]/g, '');
  const suggestedDomains = [
    { domain: `${slug}.com`, price: 899, recommended: true },
    { domain: `${slug}.in`, price: 499, recommended: false },
    { domain: `${slug}.co.in`, price: 349, recommended: false },
    { domain: `${slug}.shop`, price: 199, recommended: false },
  ];
  const [selectedDomain, setSelectedDomain] = useState(suggestedDomains[0].domain);
  if (!open) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    setIsProcessing(false);
    setPurchased(true);
    setTimeout(() => onPurchase(selectedDomain), 1500);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>

          <div className="p-5 border-b border-navy-100">
            <h2 className="text-base font-bold text-navy-900">Publish Your Website</h2>
            <p className="text-xs text-navy-400 mt-0.5">Choose a domain for your business website</p>
          </div>

          <div className="p-5">
            {purchased ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm font-bold text-navy-900 mb-1">Domain Purchased!</p>
                <p className="text-xs text-navy-400">{selectedDomain} is now yours. Setting up your website...</p>
              </motion.div>
            ) : (
              <>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-teal-800 font-semibold">Hey! This domain suits your business perfectly 👇</p>
                  <p className="text-sm font-bold text-teal-900 mt-1">{suggestedDomains[0].domain}</p>
                </div>

                <div className="space-y-2 mb-4">
                  {suggestedDomains.map(d => (
                    <button key={d.domain} onClick={() => setSelectedDomain(d.domain)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left ${
                        selectedDomain === d.domain ? 'border-teal-500 bg-teal-50/50' : 'border-navy-100 hover:border-navy-200'
                      }`}>
                      <div className="flex items-center gap-2">
                        {selectedDomain === d.domain && <Check className="w-4 h-4 text-teal-600" />}
                        <div>
                          <p className="text-sm font-semibold text-navy-800">{d.domain}</p>
                          {d.recommended && <span className="text-[9px] font-bold text-teal-600">RECOMMENDED</span>}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-navy-900">₹{d.price}<span className="text-[10px] text-navy-400 font-normal">/yr</span></p>
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-navy-400 mb-3">
                  We'll purchase the domain and set up everything for you. Your website will be live within minutes!
                </p>

                <div className="flex gap-2">
                  <button onClick={onClose}
                    className="px-4 py-2.5 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handlePurchase} disabled={isProcessing}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg text-white transition-colors ${
                      isProcessing ? 'bg-navy-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                    }`}>
                    {isProcessing ? (
                      <><span className="onboard-spinner" /> Processing...</>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Purchase & Publish — ₹{suggestedDomains.find(d => d.domain === selectedDomain)?.price}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   SOCIAL MEDIA CONNECT POPUP
   ══════════════════════════════════════════════════════════ */
const SocialMediaPopup = ({ open, onClose, onDone }) => {
  const [connections, setConnections] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(null);
  const [formData, setFormData] = useState({ pageName: '', email: '', phone: '' });
  const [connecting, setConnecting] = useState(null);
  const [requestSent, setRequestSent] = useState({});
  if (!open) return null;

  const handleConnect = async (platformId) => {
    setConnecting(platformId);
    await new Promise(r => setTimeout(r, 1500));
    setConnections(prev => ({ ...prev, [platformId]: true }));
    setConnecting(null);
  };

  const handleCreateRequest = (platformId) => {
    setRequestSent(prev => ({ ...prev, [platformId]: true }));
    setShowCreateForm(null);
    setFormData({ pageName: '', email: '', phone: '' });
  };

  const allDone = Object.keys(connections).length > 0 || Object.keys(requestSent).length > 0;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-5 border-b border-navy-100">
            <div>
              <h2 className="text-base font-bold text-navy-900">Connect Social Media</h2>
              <p className="text-xs text-navy-400 mt-0.5">Link existing accounts or create new ones</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
          </div>

          <div className="p-5 space-y-3">
            {socialPlatforms.map(p => (
              <div key={p.id} className={`rounded-xl border p-4 ${p.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <p className="text-sm font-bold">{p.name}</p>
                      {connections[p.id] && <p className="text-[10px] font-semibold text-teal-600">✓ Connected</p>}
                      {requestSent[p.id] && <p className="text-[10px] font-semibold text-amber-600">Executive will contact you</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!connections[p.id] && !requestSent[p.id] && (
                      <>
                        <button onClick={() => handleConnect(p.id)}
                          disabled={connecting === p.id}
                          className="px-3 py-1.5 bg-white text-navy-700 text-[11px] font-semibold rounded-lg border border-navy-200 hover:bg-navy-50 transition-colors">
                          {connecting === p.id ? 'Connecting...' : 'I Have One'}
                        </button>
                        <button onClick={() => setShowCreateForm(p.id)}
                          className="px-3 py-1.5 bg-navy-700 text-white text-[11px] font-semibold rounded-lg hover:bg-navy-800 transition-colors">
                          Create New
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {showCreateForm === p.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-navy-200/50 space-y-2">
                    <p className="text-[11px] text-navy-600 font-semibold">
                      Fill form below. Our customer engagement executive will reach out for OTP verification and set it up.
                    </p>
                    <input value={formData.pageName} onChange={e => setFormData({ ...formData, pageName: e.target.value })}
                      placeholder={`${p.name} page/account name`}
                      className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email for account" type="email"
                        className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500" />
                      <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone for OTP" type="tel"
                        className="w-full px-3 py-2 bg-white border border-navy-200 rounded-lg text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowCreateForm(null)}
                        className="px-3 py-1.5 border border-navy-200 text-navy-600 text-[11px] font-semibold rounded-lg hover:bg-navy-50">Cancel</button>
                      <button onClick={() => handleCreateRequest(p.id)}
                        className="px-3 py-1.5 bg-teal-600 text-white text-[11px] font-semibold rounded-lg hover:bg-teal-700">
                        Submit Request
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-navy-100">
            <button onClick={() => onDone(connections, requestSent)} disabled={!allDone}
              className={`w-full py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                allDone ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-200 text-navy-400 cursor-not-allowed'
              }`}>
              {allDone ? 'Continue' : 'Connect at least one platform'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   GOOGLE BUSINESS PROFILE POPUP
   ══════════════════════════════════════════════════════════ */
const GoogleProfilePopup = ({ open, onClose, onDone, businessData }) => {
  const [phase, setPhase] = useState('setting_up');
  const [progress, setProgress] = useState(0);
  const bName = businessData?.businessName || 'Your Business';
  const bCity = businessData?.businessCity || 'Your City';

  const setupSteps = [
    'Verifying business information...',
    'Adding business photos...',
    'Setting up categories...',
    'Configuring business hours...',
    'Enabling messaging...',
    'Optimizing for local search...',
    'Finalizing profile...',
  ];
  if (!open) return null;

  if (phase === 'setting_up' && progress < setupSteps.length) {
    setTimeout(() => {
      if (progress < setupSteps.length - 1) {
        setProgress(prev => prev + 1);
      } else {
        setPhase('preview');
      }
    }, 800);
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-5 border-b border-navy-100">
            <div>
              <h2 className="text-base font-bold text-navy-900">Google Business Profile</h2>
              <p className="text-xs text-navy-400 mt-0.5">
                {phase === 'setting_up' ? 'Setting up automatically...' : 'Preview your profile'}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-navy-50 rounded-lg"><X className="w-5 h-5 text-navy-400" /></button>
          </div>

          <div className="p-5">
            {phase === 'setting_up' ? (
              <div className="space-y-3">
                {setupSteps.map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= progress ? 1 : 0.3, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      i < progress ? 'bg-teal-100' : i === progress ? 'bg-teal-600' : 'bg-navy-100'
                    }`}>
                      {i < progress ? (
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      ) : i === progress ? (
                        <span className="onboard-spinner-sm" />
                      ) : (
                        <span className="text-[10px] font-bold text-navy-400">{i + 1}</span>
                      )}
                    </div>
                    <p className={`text-xs ${i <= progress ? 'text-navy-700 font-semibold' : 'text-navy-400'}`}>{s}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-navy-50 rounded-xl border border-navy-100 overflow-hidden">
                  <div className="h-32 bg-navy-200 relative flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-navy-400" />
                    <div className="absolute bottom-2 right-2 bg-white rounded px-2 py-1 text-[9px] text-navy-500">Map Preview</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-navy-900">{bName}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-[10px] text-navy-400 ml-1">5.0 (New)</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-navy-500"><MapPin className="w-3 h-3" /> {bCity}</div>
                      <div className="flex items-center gap-2 text-[11px] text-navy-500"><Clock className="w-3 h-3" /> Open now</div>
                      <div className="flex items-center gap-2 text-[11px] text-navy-500"><Phone className="w-3 h-3" /> {businessData?.phone || '+91 XXXXX XXXXX'}</div>
                      <div className="flex items-center gap-2 text-[11px] text-navy-500"><Globe className="w-3 h-3" /> {bName.toLowerCase().replace(/\s+/g, '')}.com</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="text-[9px] bg-navy-100 text-navy-600 rounded-full px-2 py-0.5 font-semibold">{businessData?.category || 'Local Business'}</span>
                      <span className="text-[9px] bg-teal-100 text-teal-700 rounded-full px-2 py-0.5 font-semibold">Verified</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <p className="text-xs text-teal-800 font-semibold">✨ Profile set up successfully!</p>
                  <p className="text-[10px] text-teal-600 mt-0.5">Your business will now appear in Google Maps and local search results.</p>
                </div>

                <button onClick={onDone}
                  className="w-full mt-4 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                  Looks Great! Continue
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN ONBOARDING PAGE
   ══════════════════════════════════════════════════════════ */
export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser, businessData, updateOnboardingTasks } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [allDone, setAllDone] = useState(false);

  // Website sub-step state
  const [websiteSubSteps, setWebsiteSubSteps] = useState({ template: null, info: false, domain: null });
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [showDomain, setShowDomain] = useState(false);
  const [aiStyling, setAiStyling] = useState(false);

  // Social media state
  const [showSocialPopup, setShowSocialPopup] = useState(false);

  // Google profile state
  const [showGooglePopup, setShowGooglePopup] = useState(false);

  const totalSteps = 3;
  const stepIds = ['website', 'social_media', 'google_business'];
  const stepTitles = ['Set Up Your Website', 'Connect Social Media', 'Google Business Profile'];
  const stepDescs = [
    'Create a professional web presence for your business.',
    'Boost your online visibility by connecting your social media profiles.',
    'Get found on Google Maps and Search.'
  ];
  const stepIcons = [Globe, Share2, MapPin];
  const stepColors = ['bg-navy-700', 'bg-teal-600', 'bg-navy-700'];

  const websiteItems = [
    { key: 'template', label: 'Choose a template', desc: 'Pick from 15 industry-specific designs', done: !!websiteSubSteps.template },
    { key: 'info', label: 'Add your business info', desc: 'Logo, description, contact details', done: websiteSubSteps.info },
    { key: 'ai', label: 'AI styles your website', desc: 'Colors & fonts are auto-matched to your brand', done: aiStyling === 'done' },
    { key: 'domain', label: 'Publish your website', desc: 'Choose domain & go live', done: !!websiteSubSteps.domain },
  ];

  const isWebsiteDone = websiteItems.every(i => i.done);

  const handleAiStyling = async () => {
    setAiStyling('working');
    await new Promise(r => setTimeout(r, 2000));
    setAiStyling('done');
  };

  const markStepComplete = (stepId) => {
    setCompletedSteps(prev => [...prev, stepId]);
    goNext();
  };

  const handleSkip = () => setShowSkipConfirm(true);

  const confirmSkip = () => {
    setSkippedSteps(prev => [...prev, stepIds[currentStep]]);
    setShowSkipConfirm(false);
    goNext();
  };

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    const tasks = stepIds.map((id, i) => ({
      id,
      title: stepTitles[i],
      completed: completedSteps.includes(id),
      skipped: skippedSteps.includes(id) || !completedSteps.includes(id)
    }));
    if (typeof updateOnboardingTasks === 'function') updateOnboardingTasks(tasks);
    setAllDone(true);
  };

  /* ─── All Done Screen ─── */
  if (allDone) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <TrendingUp className="w-12 h-12 text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-2xl font-bold text-navy-900 mb-3">You're All Set!</h1>
            <p className="text-sm text-navy-400 mb-6">Your online presence journey has begun. Head to your dashboard to track your growth.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-navy-100 p-5 mb-8 text-left">
            <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">Setup Summary</h3>
            <div className="space-y-2.5">
              {stepIds.map((id, i) => {
                const done = completedSteps.includes(id);
                return (
                  <div key={id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${done ? 'bg-teal-100' : 'bg-amber-100'}`}>
                      {done ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <SkipForward className="w-3 h-3 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-navy-800">{stepTitles[i]}</p>
                      <p className="text-[10px] text-navy-400">{done ? 'Completed' : 'Skipped - available in your TODO list'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const StepIcon = stepIcons[currentStep];

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <div className="bg-white border-b border-navy-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
          </div>
          <span className="text-xs font-medium text-navy-400">Step {currentStep + 1} of {totalSteps}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-8">
          {stepIds.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
              completedSteps.includes(stepIds[i]) || skippedSteps.includes(stepIds[i])
                ? 'bg-teal-500'
                : i === currentStep ? 'bg-teal-300' : 'bg-navy-200'
            }`} />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}>

            {/* Step Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 ${stepColors[currentStep]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <StepIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900">{stepTitles[currentStep]}</h2>
                <p className="text-sm text-navy-400 mt-1">{stepDescs[currentStep]}</p>
              </div>
            </div>

            {/* ═══ Step 1: WEBSITE ═══ */}
            {currentStep === 0 && (
              <>
                <div className="bg-white rounded-xl border border-navy-100 p-5 mb-6">
                  <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-4">Setup Steps</h3>
                  <div className="space-y-2">
                    {websiteItems.map((item, i) => (
                      <div key={item.key}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          item.done ? 'bg-teal-50 border-teal-200' : 'bg-white border-navy-100 hover:border-navy-200'
                        }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            item.done ? 'bg-teal-600' : 'bg-navy-100'
                          }`}>
                            {item.done ? <Check className="w-4 h-4 text-white" /> : <span className="text-[10px] font-bold text-navy-400">{i + 1}</span>}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${item.done ? 'text-teal-800' : 'text-navy-800'}`}>{item.label}</p>
                            <p className="text-[11px] text-navy-400">{item.desc}</p>
                          </div>
                        </div>
                        {!item.done && (
                          <button onClick={() => {
                            if (item.key === 'template') setShowTemplates(true);
                            else if (item.key === 'info') setShowBusinessInfo(true);
                            else if (item.key === 'ai') handleAiStyling();
                            else if (item.key === 'domain') setShowDomain(true);
                          }}
                          disabled={item.key === 'ai' && aiStyling === 'working'}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            item.key === 'ai' && aiStyling === 'working'
                              ? 'bg-navy-100 text-navy-400 cursor-not-allowed'
                              : 'bg-navy-700 text-white hover:bg-navy-800'
                          }`}>
                            {item.key === 'ai' && aiStyling === 'working' ? (
                              <><span className="onboard-spinner-sm" /> Working...</>
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isWebsiteDone ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-teal-50 rounded-xl border border-teal-200 p-5 text-center">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-teal-800 mb-1">Website Setup Complete!</p>
                    <p className="text-xs text-teal-600 mb-4">Your website is live at {websiteSubSteps.domain}</p>
                    <button onClick={() => markStepComplete('website')}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="flex-1 text-xs text-navy-400">Complete all steps above or skip for now</p>
                    <button onClick={handleSkip}
                      className="flex items-center gap-1.5 px-4 py-2.5 border border-navy-200 text-navy-500 text-sm font-medium rounded-xl hover:bg-navy-50 transition-colors">
                      <SkipForward className="w-4 h-4" /> Skip
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ═══ Step 2: SOCIAL MEDIA ═══ */}
            {currentStep === 1 && (
              <>
                <div className="bg-white rounded-xl border border-navy-100 p-5 mb-6">
                  <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-4">Connect Your Accounts</h3>
                  <p className="text-sm text-navy-500 mb-4">
                    Connect existing social media accounts or let our team create new ones for you.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {socialPlatforms.map(p => (
                      <div key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border ${p.color}`}>
                        <span className="text-xl">{p.icon}</span>
                        <p className="text-xs font-semibold">{p.name}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowSocialPopup(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
                    Connect Social Media <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <p className="flex-1 text-xs text-navy-400">Social media drives 30% of local business discovery</p>
                  <button onClick={handleSkip}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-navy-200 text-navy-500 text-sm font-medium rounded-xl hover:bg-navy-50 transition-colors">
                    <SkipForward className="w-4 h-4" /> Skip
                  </button>
                </div>
              </>
            )}

            {/* ═══ Step 3: GOOGLE BUSINESS ═══ */}
            {currentStep === 2 && (
              <>
                <div className="bg-white rounded-xl border border-navy-100 p-5 mb-6">
                  <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-4">Auto-Setup Google Profile</h3>
                  <p className="text-sm text-navy-500 mb-4">
                    We'll automatically set up your Google Business Profile using the information you've already provided.
                    Everything happens in one click!
                  </p>
                  <div className="space-y-2 mb-4">
                    {['Verify your business location', 'Add photos & business hours', 'Set up categories for local search', 'Enable customer messaging'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-navy-600">
                        <div className="w-5 h-5 bg-navy-100 rounded-full flex items-center justify-center">
                          <span className="text-[9px] font-bold text-navy-400">{i + 1}</span>
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowGooglePopup(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors">
                    Set Up Google Profile <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <p className="flex-1 text-xs text-navy-400">Businesses with Google profiles get 5x more views</p>
                  <button onClick={handleSkip}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-navy-200 text-navy-500 text-sm font-medium rounded-xl hover:bg-navy-50 transition-colors">
                    <SkipForward className="w-4 h-4" /> Skip
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── POPUPS ─── */}
      <TemplatePickerPopup open={showTemplates} onClose={() => setShowTemplates(false)}
        onSelect={(t) => { setWebsiteSubSteps(prev => ({ ...prev, template: t })); setShowTemplates(false); }} />

      <BusinessInfoPopup open={showBusinessInfo} onClose={() => setShowBusinessInfo(false)}
        onSave={(info) => { setWebsiteSubSteps(prev => ({ ...prev, info: true })); setShowBusinessInfo(false); }}
        businessData={businessData} />

      <DomainPurchasePopup open={showDomain} onClose={() => setShowDomain(false)}
        onPurchase={(domain) => { setWebsiteSubSteps(prev => ({ ...prev, domain })); setShowDomain(false); }}
        businessName={businessData?.businessName} />

      <SocialMediaPopup open={showSocialPopup} onClose={() => setShowSocialPopup(false)}
        onDone={(connections, requests) => { markStepComplete('social_media'); setShowSocialPopup(false); }} />

      <GoogleProfilePopup open={showGooglePopup} onClose={() => setShowGooglePopup(false)}
        onDone={() => { markStepComplete('google_business'); setShowGooglePopup(false); }}
        businessData={businessData} />

      {/* Skip Confirmation */}
      <AnimatePresence>
        {showSkipConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4"
            onClick={() => setShowSkipConfirm(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-navy-900">Skip this step?</h3>
                <button onClick={() => setShowSkipConfirm(false)} className="p-1 hover:bg-navy-50 rounded-lg">
                  <X className="w-4 h-4 text-navy-400" />
                </button>
              </div>
              <p className="text-xs text-navy-500 mb-4">
                This step will be permanently available in your TODO section. You can complete it later from your profile.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowSkipConfirm(false)}
                  className="flex-1 px-4 py-2 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors">
                  Go Back
                </button>
                <button onClick={confirmSkip}
                  className="flex-1 px-4 py-2 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors">
                  Skip Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spinner CSS */}
      <style>{`
        .onboard-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: obspin 0.6s linear infinite;
          display: inline-block;
        }
        .onboard-spinner-sm {
          width: 10px;
          height: 10px;
          border: 2px solid rgba(13,136,111,0.2);
          border-top-color: #0d886f;
          border-radius: 50%;
          animation: obspin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes obspin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

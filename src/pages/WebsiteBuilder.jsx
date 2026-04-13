import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, ExternalLink, Monitor, Smartphone,
  MessageSquareMore, X, CheckCircle2, Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

export const WebsiteBuilder = () => {
  const { language, businessData, currentUser } = useApp();
  const category = businessData?.category || 'professional';
  const bName = businessData?.businessName || 'Your Business';
  const siteUrl = businessData?.websiteUrl || `${bName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  const [viewMode, setViewMode] = useState('desktop');
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [changeNote, setChangeNote] = useState('');

  const handleRequestChanges = () => {
    setRequestSent(true);
    setTimeout(() => {
      setShowRequestPopup(false);
      setTimeout(() => setRequestSent(false), 300);
    }, 2500);
  };

  const siteColors = { primary: '#0d886f', secondary: '#1e2f52' };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('yourWebsite', language)}</h1>
          <p className="text-xs text-navy-400 mt-0.5">View your live website &middot; Request changes anytime</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-navy-50 rounded-lg p-0.5">
            <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-white shadow-sm text-navy-700' : 'text-navy-400'}`}>
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-white shadow-sm text-navy-700' : 'text-navy-400'}`}>
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Request Changes Button */}
          <button
            onClick={() => setShowRequestPopup(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            <MessageSquareMore className="w-3.5 h-3.5" /> Request Changes
          </button>

          {/* Visit Site */}
          <a href={`https://${siteUrl}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Visit Site
          </a>
        </div>
      </div>

      {/* Browser Window */}
      <div className="flex-1 bg-white rounded-xl border border-navy-100 overflow-hidden flex flex-col min-h-0">
        {/* Browser Chrome */}
        <div className="px-4 py-2.5 border-b border-navy-100 flex items-center bg-navy-50/80">
          <div className="flex items-center gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white border border-navy-200 rounded-lg px-4 py-1.5 max-w-md w-full">
              <Globe className="w-3 h-3 text-navy-400" />
              <span className="text-[11px] text-navy-500 font-medium">{'\u{1F512}'} https://{siteUrl}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            <span className="text-[10px] text-teal-600 font-semibold">Live</span>
          </div>
        </div>

        {/* Website Content */}
        <div className={`flex-1 overflow-y-auto ${viewMode === 'mobile' ? 'flex justify-center p-6 bg-navy-100' : ''}`}>
          <div className={viewMode === 'mobile' ? 'w-[375px] bg-white rounded-2xl overflow-hidden shadow-xl border border-navy-200' : 'w-full'}>
            {/* Navbar */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-navy-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: siteColors.primary }}>
                  <Globe className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold text-navy-800">{bName}</span>
              </div>
              <div className="flex gap-4 text-[10px] text-navy-500 font-medium">
                <span>Home</span><span>Services</span><span>About</span><span>Gallery</span><span>Contact</span>
              </div>
            </div>

            {/* Hero */}
            <div className="relative py-16 px-6 text-center" style={{ background: `linear-gradient(135deg, ${siteColors.primary}, ${siteColors.secondary})` }}>
              <h1 className="text-2xl font-bold text-white mb-2">{bName}</h1>
              <p className="text-xs text-white/80 mb-5 max-w-md mx-auto">
                Welcome to {bName} — Quality you can trust
              </p>
              <button className="px-5 py-2 bg-white text-xs font-bold rounded-lg" style={{ color: siteColors.primary }}>
                Get Started
              </button>
            </div>

            {/* Services */}
            <div className="py-10 px-6">
              <h2 className="text-sm font-bold text-navy-800 mb-5 text-center">Our Services</h2>
              <div className="grid grid-cols-3 gap-3">
                {['Service 1', 'Service 2', 'Service 3'].map((s, i) => (
                  <div key={i} className="text-center p-4 bg-navy-50 rounded-xl">
                    <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: siteColors.primary + '20' }}>
                      <Globe className="w-5 h-5" style={{ color: siteColors.primary }} />
                    </div>
                    <p className="text-[11px] font-semibold text-navy-700">{s}</p>
                    <p className="text-[9px] text-navy-400 mt-1">Professional quality service</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="py-10 px-6 bg-navy-50">
              <h2 className="text-sm font-bold text-navy-800 mb-3 text-center">About Us</h2>
              <p className="text-[11px] text-navy-500 text-center max-w-lg mx-auto">
                We are dedicated to providing the best {category} experience. With years of expertise and a passion
                for excellence, we serve our customers with pride.
              </p>
            </div>

            {/* Gallery */}
            <div className="py-10 px-6">
              <h2 className="text-sm font-bold text-navy-800 mb-4 text-center">Gallery</h2>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-navy-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-navy-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="py-10 px-6 bg-navy-50">
              <h2 className="text-sm font-bold text-navy-800 mb-4 text-center">Contact Us</h2>
              <div className="max-w-sm mx-auto space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-navy-500">
                  {'\u{1F4DE}'} {businessData?.phone || '+91 XXXXX XXXXX'}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-navy-500">
                  {'\u{1F4CD}'} {businessData?.businessAddress || businessData?.businessCity || 'Your Address'}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-navy-500">
                  {'\u{1F4E7}'} {currentUser?.email || 'contact@business.com'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="py-4 px-6 text-center border-t border-navy-100" style={{ backgroundColor: siteColors.secondary }}>
              <p className="text-[9px] text-white/60">&copy; 2026 {bName}. All rights reserved. Powered by LeadFlexUp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Changes Popup */}
      <AnimatePresence>
        {showRequestPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4"
            onClick={() => !requestSent && setShowRequestPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              {requestSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-base font-bold text-navy-900 mb-2">Request Submitted!</h3>
                  <p className="text-xs text-navy-500 leading-relaxed">
                    Our team will review your request and reach out to you shortly to discuss the changes.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-navy-900">Request Website Changes</h3>
                      <p className="text-xs text-navy-400 mt-0.5">Our team will reach out to you on this</p>
                    </div>
                    <button onClick={() => setShowRequestPopup(false)} className="p-1.5 hover:bg-navy-50 rounded-lg">
                      <X className="w-5 h-5 text-navy-400" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-navy-700 mb-1.5">
                      What changes do you need?
                    </label>
                    <textarea
                      value={changeNote}
                      onChange={e => setChangeNote(e.target.value)}
                      placeholder="e.g., Change the hero image, update the phone number, add a new section..."
                      rows={4}
                      className="w-full px-3 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                    />
                  </div>

                  <div className="bg-navy-50 rounded-lg p-3 mb-4">
                    <p className="text-[10px] text-navy-500 leading-relaxed">
                      {'\u{1F4A1}'} You can describe changes in simple words. Our team will understand and implement them for you.
                      You'll be contacted via your registered phone number.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setShowRequestPopup(false)}
                      className="px-4 py-2.5 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50 transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={handleRequestChanges}
                      disabled={!changeNote.trim()}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                        changeNote.trim()
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-navy-200 text-navy-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Request
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

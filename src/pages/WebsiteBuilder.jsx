import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Send, Sparkles, Check, ExternalLink, Eye,
  Smartphone, Monitor, Loader2, Bot, User, Save,
  Palette, Layout, Type, Image, Phone, MapPin, Star,
  Undo2, Redo2, RefreshCw, Mic, MicOff, ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

const sttLangMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN', te: 'te-IN', ml: 'ml-IN' };

const suggestions = [
  'Change the hero background color to blue',
  'Add a photo gallery section',
  'Update the tagline text',
  'Make the contact form bigger',
  'Change font to something modern',
  'Add customer testimonials section',
  'Add a WhatsApp chat button',
  'Show business hours in the footer',
];

const aiAutoUpdates = [
  { id: 1, text: 'Add a festive banner \u2014 trending in your area', type: 'trend', priority: 'high' },
  { id: 2, text: 'Update product images \u2014 they are 30+ days old', type: 'freshness', priority: 'medium' },
  { id: 3, text: 'Add a Google Reviews widget \u2014 builds trust', type: 'conversion', priority: 'high' },
  { id: 4, text: 'Speed optimization \u2014 compress hero image', type: 'performance', priority: 'low' },
];

export const WebsiteBuilder = () => {
  const { language, businessData, analyticsData } = useApp();
  const category = businessData?.category || 'professional';
  const bName = businessData?.businessName || 'Your Business';

  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'ai', text: `Welcome! Your ${category} website is live and looking great. You can ask me to make any changes \u2014 just type what you want, like "Change the hero color to purple" or "Add a testimonials section".` },
    { id: 2, role: 'ai', text: 'I also monitor trends and can auto-update your site. Below are my current suggestions.', suggestions: true },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [viewMode, setViewMode] = useState('desktop');
  const [sections, setSections] = useState([
    { id: 'hero', name: 'Hero', visible: true },
    { id: 'services', name: 'Services', visible: true },
    { id: 'about', name: 'About Us', visible: true },
    { id: 'gallery', name: 'Gallery', visible: true },
    { id: 'testimonials', name: 'Testimonials', visible: true },
    { id: 'contact', name: 'Contact', visible: true },
    { id: 'footer', name: 'Footer', visible: true },
  ]);
  const [siteColors, setSiteColors] = useState({ primary: '#0d886f', secondary: '#1e2f52', accent: '#f59e0b' });
  const [heroText, setHeroText] = useState(bName);
  const [tagline, setTagline] = useState(`Welcome to ${bName} \u2014 Quality you can trust`);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [autoUpdates, setAutoUpdates] = useState(aiAutoUpdates);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const toggleVoice = () => {
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false;
    rec.lang = sttLangMap[language] || 'en-IN';
    rec.onresult = (e) => { setInputText(prev => prev + ' ' + e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec; rec.start(); setListening(true);
  };

  const processCommand = (text) => {
    const lower = text.toLowerCase();
    let response = '';
    if (/color|colour|blue|purple|red|green|orange|pink/i.test(lower)) {
      const colorMap = { blue: '#2563eb', purple: '#7c3aed', red: '#dc2626', green: '#16a34a', orange: '#ea580c', pink: '#ec4899' };
      const found = Object.keys(colorMap).find(c => lower.includes(c));
      if (found) {
        setSiteColors(prev => ({ ...prev, primary: colorMap[found] }));
        response = `Done! I've updated the primary color to ${found}. The change is reflected in the preview.`;
      } else {
        response = 'I can change colors! Try saying "Change color to blue" or "Make it purple".';
      }
    } else if (/gallery|photo|image/i.test(lower)) {
      setSections(prev => prev.map(s => s.id === 'gallery' ? { ...s, visible: true } : s));
      response = 'Gallery section is now visible on your site!';
    } else if (/testimonial|review/i.test(lower)) {
      setSections(prev => prev.map(s => s.id === 'testimonials' ? { ...s, visible: true } : s));
      response = 'Testimonials section activated! It will auto-pull your Google reviews.';
    } else if (/remove|hide|delete/i.test(lower)) {
      const found = sections.map(s => s.name.toLowerCase()).find(n => lower.includes(n));
      if (found) {
        setSections(prev => prev.map(s => s.name.toLowerCase() === found ? { ...s, visible: false } : s));
        response = `${found.charAt(0).toUpperCase() + found.slice(1)} section hidden. You can bring it back anytime.`;
      } else {
        response = 'Which section to hide? Try "Remove gallery" or "Hide testimonials".';
      }
    } else if (/tagline|subtitle|slogan/i.test(lower)) {
      const newTl = text.replace(/change|update|set|tagline|subtitle|slogan|to|the|my/gi, '').trim();
      if (newTl.length > 3) { setTagline(newTl); response = `Tagline updated to "${newTl}"!`; }
      else response = 'What should the new tagline be?';
    } else if (/font|typography/i.test(lower)) {
      response = 'Typography updated \u2014 DM Sans for headings and Inter for body text.';
    } else if (/whatsapp|chat button/i.test(lower)) {
      response = 'WhatsApp chat button added as a floating button on bottom-right!';
    } else if (/hour|timing|schedule/i.test(lower)) {
      response = 'Business hours added to the footer.';
    } else if (/contact form|form bigger/i.test(lower)) {
      response = 'Contact form enlarged with name, email, phone, and message fields.';
    } else {
      response = `Change applied: "${text}". Preview updated!`;
    }
    setHasUnsaved(true);
    return response;
  };

  const handleSend = () => {
    if (!inputText.trim() || isThinking) return;
    setChatMessages(prev => [...prev, { id: Date.now(), role: 'user', text: inputText.trim() }]);
    const cmd = inputText.trim();
    setInputText('');
    setIsThinking(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: processCommand(cmd) }]);
      setIsThinking(false);
    }, 1200);
  };

  const handleSaveChanges = () => {
    setSaveStatus('saving');
    setTimeout(() => { setSaveStatus('saved'); setHasUnsaved(false); setTimeout(() => setSaveStatus(null), 2000); }, 1500);
  };

  const handleAutoUpdate = (update) => {
    setChatMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: `Applying: "${update.text}"...` }]);
    setAutoUpdates(prev => prev.filter(u => u.id !== update.id));
    setHasUnsaved(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: 'Done! Update applied. Check the preview.' }]);
    }, 1500);
  };

  const handleSuggestionClick = (s) => {
    setChatMessages(prev => [...prev, { id: Date.now(), role: 'user', text: s }]);
    setIsThinking(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: processCommand(s) }]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('websiteBuilder', language)}</h1>
          <p className="text-xs text-navy-400 mt-0.5">Chat to edit your website &middot; AI auto-updates enabled</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-navy-50 rounded-lg p-0.5">
            <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-white shadow-sm text-navy-700' : 'text-navy-400'}`}>
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-white shadow-sm text-navy-700' : 'text-navy-400'}`}>
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={handleSaveChanges} disabled={!hasUnsaved || saveStatus === 'saving'}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              saveStatus === 'saved' ? 'bg-teal-100 text-teal-700' :
              hasUnsaved ? 'bg-teal-600 text-white hover:bg-teal-700 animate-pulse' :
              'bg-navy-100 text-navy-400 cursor-not-allowed'
            }`}>
            {saveStatus === 'saving' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...</> :
             saveStatus === 'saved' ? <><Check className="w-3.5 h-3.5" /> Published!</> :
             <><Save className="w-3.5 h-3.5" /> Save Changes</>}
          </button>
          <a href="#" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100">
            <ExternalLink className="w-3.5 h-3.5" /> Visit Site
          </a>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-[380px_1fr] gap-4 min-h-0">
        <div className="bg-white rounded-xl border border-navy-100 flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-navy-100 flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-teal-600" /></div>
            <div><p className="text-xs font-bold text-navy-800">Website AI Editor</p><p className="text-[10px] text-navy-400">Describe changes in plain text</p></div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.map(msg => (
              <div key={msg.id}>
                <div className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-teal-100' : 'bg-navy-700'}`}>
                    {msg.role === 'ai' ? <Bot className="w-3.5 h-3.5 text-teal-600" /> : <User className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-navy-700 text-white rounded-2xl rounded-tr-sm px-3 py-2' : 'bg-navy-50 text-navy-700 rounded-2xl rounded-tl-sm px-3 py-2'}`}>
                    <p className="text-[11px] leading-relaxed">{msg.text}</p>
                  </div>
                </div>
                {msg.suggestions && (
                  <div className="ml-8 mt-2 space-y-1.5">
                    <p className="text-[10px] font-semibold text-navy-500">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.slice(0, 4).map((s, i) => (
                        <button key={i} onClick={() => handleSuggestionClick(s)}
                          className="text-[10px] px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200 hover:bg-teal-100 transition-colors">{s}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isThinking && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-teal-600" /></div>
                <div className="bg-navy-50 rounded-2xl rounded-tl-sm px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {autoUpdates.length > 0 && (
            <div className="px-3 py-2 border-t border-navy-100 bg-amber-50/50">
              <p className="text-[10px] font-bold text-amber-700 mb-1.5 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Recommendations</p>
              <div className="space-y-1">
                {autoUpdates.slice(0, 2).map(u => (
                  <div key={u.id} className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-amber-200">
                    <p className="text-[10px] text-navy-600 flex-1">{u.text}</p>
                    <button onClick={() => handleAutoUpdate(u)} className="px-2 py-0.5 text-[9px] font-bold bg-teal-600 text-white rounded hover:bg-teal-700">Apply</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 border-t border-navy-100">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Describe what to change..." className="w-full px-3 py-2.5 pr-9 bg-navy-50 border border-navy-100 rounded-xl text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                <button onClick={toggleVoice} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all ${listening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-navy-400 hover:text-teal-600'}`}>
                  {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button onClick={handleSend} disabled={!inputText.trim() || isThinking}
                className={`p-2.5 rounded-xl transition-colors ${inputText.trim() && !isThinking ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-navy-100 text-navy-400'}`}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-navy-100 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 py-2.5 border-b border-navy-100 flex items-center justify-between bg-navy-50/50">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-navy-500" />
              <span className="text-[11px] text-navy-500 font-medium">{bName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
            </div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal-500" /><span className="text-[10px] text-teal-600 font-semibold">Live</span></div>
          </div>

          <div className={`flex-1 overflow-y-auto ${viewMode === 'mobile' ? 'flex justify-center p-4 bg-navy-100' : ''}`}>
            <div className={viewMode === 'mobile' ? 'w-[375px] bg-white rounded-2xl overflow-hidden shadow-xl border border-navy-200' : 'w-full'}>
              <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-navy-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: siteColors.primary }}><Globe className="w-3.5 h-3.5 text-white" /></div>
                  <span className="text-xs font-bold text-navy-800">{bName}</span>
                </div>
                <div className="flex gap-4 text-[10px] text-navy-500 font-medium">
                  {sections.filter(s => s.visible && s.id !== 'footer').map(s => <span key={s.id}>{s.name}</span>)}
                </div>
              </div>

              {sections.find(s => s.id === 'hero')?.visible && (
                <div className="relative py-14 px-6 text-center" style={{ background: `linear-gradient(135deg, ${siteColors.primary}, ${siteColors.secondary})` }}>
                  <h1 className="text-2xl font-bold text-white mb-2">{heroText}</h1>
                  <p className="text-xs text-white/80 mb-4 max-w-md mx-auto">{tagline}</p>
                  <button className="px-5 py-2 bg-white text-xs font-bold rounded-lg" style={{ color: siteColors.primary }}>Get Started</button>
                </div>
              )}

              {sections.find(s => s.id === 'services')?.visible && (
                <div className="py-8 px-6">
                  <h2 className="text-sm font-bold text-navy-800 mb-4 text-center">Our Services</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {['Service 1', 'Service 2', 'Service 3'].map((s, i) => (
                      <div key={i} className="text-center p-4 bg-navy-50 rounded-xl">
                        <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: siteColors.primary + '20' }}>
                          <Star className="w-5 h-5" style={{ color: siteColors.primary }} />
                        </div>
                        <p className="text-[11px] font-semibold text-navy-700">{s}</p>
                        <p className="text-[9px] text-navy-400 mt-1">Professional quality service</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sections.find(s => s.id === 'about')?.visible && (
                <div className="py-8 px-6 bg-navy-50">
                  <h2 className="text-sm font-bold text-navy-800 mb-3 text-center">About Us</h2>
                  <p className="text-[11px] text-navy-500 text-center max-w-lg mx-auto">
                    We are dedicated to providing the best {category} experience. With years of expertise and a passion for excellence, we serve our customers with pride.
                  </p>
                </div>
              )}

              {sections.find(s => s.id === 'gallery')?.visible && (
                <div className="py-8 px-6">
                  <h2 className="text-sm font-bold text-navy-800 mb-4 text-center">Gallery</h2>
                  <div className="grid grid-cols-4 gap-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="aspect-square bg-navy-100 rounded-lg flex items-center justify-center"><Image className="w-5 h-5 text-navy-300" /></div>
                    ))}
                  </div>
                </div>
              )}

              {sections.find(s => s.id === 'testimonials')?.visible && (
                <div className="py-8 px-6 bg-navy-50">
                  <h2 className="text-sm font-bold text-navy-800 mb-4 text-center">What Our Customers Say</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[{name:'Priya S.',text:'Excellent service! Highly recommend.'},{name:'Rahul M.',text:'Best experience ever. Will visit again.'}].map((r,i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-navy-100">
                        <div className="flex items-center gap-1 mb-2">{[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                        <p className="text-[10px] text-navy-600 italic mb-2">&ldquo;{r.text}&rdquo;</p>
                        <p className="text-[10px] font-semibold text-navy-700">&mdash; {r.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sections.find(s => s.id === 'contact')?.visible && (
                <div className="py-8 px-6">
                  <h2 className="text-sm font-bold text-navy-800 mb-4 text-center">Contact Us</h2>
                  <div className="max-w-sm mx-auto space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-navy-500"><Phone className="w-4 h-4" style={{ color: siteColors.primary }} /> {businessData?.phone || '+91 XXXXX XXXXX'}</div>
                    <div className="flex items-center gap-3 text-[11px] text-navy-500"><MapPin className="w-4 h-4" style={{ color: siteColors.primary }} /> {businessData?.businessAddress || businessData?.businessCity || 'Your Address'}</div>
                  </div>
                </div>
              )}

              {sections.find(s => s.id === 'footer')?.visible && (
                <div className="py-4 px-6 text-center border-t border-navy-100" style={{ backgroundColor: siteColors.secondary }}>
                  <p className="text-[9px] text-white/60">&copy; 2026 {bName}. All rights reserved. Powered by LeadFlexUp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Palette, Layout, Rocket, Check, ExternalLink, ChevronRight,
  ArrowRight, Loader2, Eye, Smartphone, Monitor, Sparkles, ShoppingCart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { websiteTemplates } from '../data/mockDatabase';
import { sendGroqMessage } from '../config/groq';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

/* ─── Live preview of website being built ─── */
const WebsitePreview = ({ template, businessData, sections, viewMode }) => {
  if (!template) return null;
  const [pri, sec, bg] = template.colors;
  const name = businessData?.businessName || 'Your Business';
  return (
    <div className={`bg-white rounded-xl border border-navy-100 overflow-hidden transition-all ${viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : 'w-full'}`}>
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-navy-50 border-b border-navy-100">
        <div className="flex gap-1">{['bg-red-400','bg-yellow-400','bg-green-400'].map((c,i) => <div key={i} className={`w-2 h-2 rounded-full ${c}`} />)}</div>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded px-3 py-0.5 text-[9px] text-navy-400 border border-navy-100 w-48 text-center truncate">
            {name.toLowerCase().replace(/\s+/g, '')}.leadflexup.com
          </div>
        </div>
      </div>
      {/* Hero */}
      <div className="relative" style={{ background: `linear-gradient(135deg, ${pri}, ${sec || pri}dd)` }}>
        <div className="px-6 py-10 text-white text-center">
          <h1 className="text-xl font-bold mb-2">{name}</h1>
          <p className="text-[11px] opacity-80 mb-4">Welcome to the best experience in town</p>
          <button className="px-4 py-1.5 bg-white text-[10px] font-bold rounded-lg" style={{ color: pri }}>Get Started</button>
        </div>
        <img src={template.preview} alt="" className="w-full h-32 object-cover opacity-30 absolute inset-0" />
      </div>
      {/* Section previews */}
      <div className="p-4 space-y-3">
        {sections.map((sec, i) => (
          <div key={i} className="bg-navy-50/50 rounded-lg p-3 border border-navy-100/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: pri + '33' }} />
              <span className="text-[10px] font-semibold text-navy-700 capitalize">{sec}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[1,2,3].map(j => <div key={j} className="h-6 bg-navy-100/50 rounded" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const WebsiteBuilder = () => {
  const { language, businessData, analyticsData, isAuthenticated } = useApp();
  const category = businessData?.category || 'restaurant';
  const templates = websiteTemplates[category] || websiteTemplates.restaurant;

  const [step, setStep] = useState(0); // 0=select template, 1=customize, 2=domain, 3=building, 4=live
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewMode, setViewMode] = useState('desktop');
  const [domain, setDomain] = useState('');
  const [domainSuffix, setDomainSuffix] = useState('.leadflexup.com');
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState([]);
  const [isLive, setIsLive] = useState(false);

  const suggestedDomain = (businessData?.businessName || 'mybusiness').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Simulated build process
  useEffect(() => {
    if (step !== 3) return;
    const logs = [
      '🔧 Initializing project scaffold...',
      '📦 Installing dependencies...',
      '🎨 Applying ' + (selectedTemplate?.name || '') + ' template...',
      '📝 Generating content with GROQ AI...',
      '🖼️ Optimizing images and assets...',
      '🔍 Running SEO optimization...',
      '📱 Making responsive for mobile...',
      '🚀 Deploying to ' + (domain || suggestedDomain) + domainSuffix + '...',
      '✅ Website is LIVE!',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < logs.length) {
        setBuildLogs(prev => [...prev, logs[idx]]);
        setBuildProgress(Math.round(((idx + 1) / logs.length) * 100));
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => { setStep(4); setIsLive(true); }, 800);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('websiteBuilder', language)}</h1>
          <p className="text-sm text-navy-400 mt-0.5">{t('websiteBuilderDesc', language)}</p>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {['Template', 'Customize', 'Domain', 'Build', 'Live'].map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${
                i < step ? 'bg-teal-600 text-white' : i === step ? 'bg-navy-700 text-white' : 'bg-navy-100 text-navy-400'
              }`}>{i < step ? <Check className="w-3 h-3" /> : i + 1}</div>
              {i < 4 && <ChevronRight className="w-3 h-3 text-navy-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 0: Select Template */}
      {step === 0 && (
        <motion.div {...fade(0)} className="space-y-4">
          <h2 className="text-sm font-bold text-navy-800">Choose a template for your {category} business</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {templates.map((tmpl) => (
              <motion.div key={tmpl.id} whileHover={{ y: -4 }}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-colors ${
                  selectedTemplate?.id === tmpl.id ? 'border-teal-500 shadow-lg' : 'border-navy-100 hover:border-navy-200'
                }`}>
                <img src={tmpl.preview} alt={tmpl.name} className="w-full h-36 object-cover" />
                <div className="p-3">
                  <h3 className="text-sm font-bold text-navy-800">{tmpl.name}</h3>
                  <div className="flex items-center gap-1 mt-1.5">
                    {tmpl.colors.map((c, i) => <div key={i} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />)}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tmpl.sections.slice(0, 4).map((s, i) => (
                      <span key={i} className="text-[8px] bg-navy-50 text-navy-500 px-1.5 py-0.5 rounded capitalize">{s}</span>
                    ))}
                    {tmpl.sections.length > 4 && <span className="text-[8px] text-navy-400">+{tmpl.sections.length - 4}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {selectedTemplate && (
            <button onClick={() => setStep(1)} className="px-6 py-2.5 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 flex items-center gap-2">
              Continue with {selectedTemplate.name} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}

      {/* STEP 1: Customize / Preview */}
      {step === 1 && selectedTemplate && (
        <motion.div {...fade(0)} className="grid lg:grid-cols-[1fr_400px] gap-5">
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-navy-100 p-5">
              <h3 className="text-sm font-bold text-navy-800 mb-3">Sections</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedTemplate.sections.map((sec, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-navy-50 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-[11px] font-medium text-navy-700 capitalize">{sec}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-5">
              <h3 className="text-sm font-bold text-navy-800 mb-3">Color Scheme</h3>
              <div className="flex items-center gap-2">
                {selectedTemplate.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md" style={{ backgroundColor: c }} />
                    <span className="text-[10px] font-mono text-navy-500">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-navy-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-navy-800">AI-Generated Content</h3>
              </div>
              <p className="text-[11px] text-navy-400">GROQ AI will generate SEO-optimized content for your {category} business including headlines, descriptions, meta tags, and CTAs tailored to your audience.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-4 py-2 text-xs font-semibold text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100">Back</button>
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 flex items-center gap-2">
                Choose Domain <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {/* Preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded-lg ${viewMode === 'desktop' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-400'}`}>
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded-lg ${viewMode === 'mobile' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-400'}`}>
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-navy-400 ml-auto">Preview</span>
            </div>
            <WebsitePreview template={selectedTemplate} businessData={businessData} sections={selectedTemplate.sections} viewMode={viewMode} />
          </div>
        </motion.div>
      )}

      {/* STEP 2: Domain Selection */}
      {step === 2 && (
        <motion.div {...fade(0)} className="max-w-xl mx-auto space-y-5">
          <div className="bg-white rounded-xl border border-navy-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-navy-700" />
              <h3 className="text-sm font-bold text-navy-800">Choose Your Domain</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-navy-600 mb-1 block">Free Subdomain</label>
                <div className="flex items-center gap-0">
                  <input value={domain || suggestedDomain} onChange={e => setDomain(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-navy-50 border border-navy-100 rounded-l-lg text-[12px] text-navy-700 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                  <span className="px-3 py-2.5 bg-navy-100 text-navy-500 text-[12px] font-mono rounded-r-lg border border-l-0 border-navy-100">.leadflexup.com</span>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <Check className="w-3 h-3 text-teal-600" />
                  <span className="text-[10px] text-teal-600 font-medium">Available! Free with your plan</span>
                </div>
              </div>
              <div className="border-t border-navy-100 pt-3">
                <label className="text-[10px] font-semibold text-navy-600 mb-1 block">Custom Domain (Optional)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['.com', '.in', '.co.in'].map(ext => (
                    <button key={ext} onClick={() => setDomainSuffix(ext)}
                      className={`py-2 rounded-lg text-[11px] font-semibold border ${domainSuffix === ext ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-navy-100 bg-white text-navy-500 hover:bg-navy-50'}`}>
                      {(domain || suggestedDomain)}{ext}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-navy-400 mt-2 flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> Custom domains start at ₹799/year. You can purchase after build.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-4 py-2 text-xs font-semibold text-navy-600 bg-navy-50 rounded-lg hover:bg-navy-100">Back</button>
            <button onClick={() => { setBuildLogs([]); setBuildProgress(0); setStep(3); }}
              className="px-6 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5" /> Build My Website
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: Building */}
      {step === 3 && (
        <motion.div {...fade(0)} className="max-w-xl mx-auto">
          <div className="bg-navy-800 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
              <h3 className="text-sm font-bold">Building your website...</h3>
              <span className="ml-auto text-[11px] text-teal-300 font-bold">{buildProgress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div className="bg-teal-400 rounded-full h-2 transition-all duration-500" style={{ width: `${buildProgress}%` }} />
            </div>
            <div className="space-y-1.5 font-mono text-[10px]">
              {buildLogs.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`${i === buildLogs.length - 1 ? 'text-teal-300' : 'text-navy-300'}`}>{log}</motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Live */}
      {step === 4 && (
        <motion.div {...fade(0)} className="space-y-5">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-lg font-bold mb-1">Your Website is Live! 🎉</h2>
            <p className="text-[11px] text-teal-100 mb-3">
              {(domain || suggestedDomain)}{domainSuffix}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button className="px-4 py-2 bg-white text-teal-700 text-xs font-semibold rounded-lg hover:bg-teal-50 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Visit Website
              </button>
              <button className="px-4 py-2 bg-white/20 text-white text-xs font-semibold rounded-lg hover:bg-white/30 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>
          </div>
          <WebsitePreview template={selectedTemplate} businessData={businessData} sections={selectedTemplate?.sections || []} viewMode="desktop" />
        </motion.div>
      )}
    </div>
  );
};

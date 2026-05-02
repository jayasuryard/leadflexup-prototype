import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ChevronDown, BarChart3, Globe, Palette, Zap, Users, Inbox, Telescope, Mic, Trophy, ArrowRight, LayoutGrid } from 'lucide-react';
import { t } from '../../utils/i18n';

const products = [
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time digital presence scoring', href: '/products/analytics', color: 'bg-blue-50 text-blue-600' },
  { icon: Globe, title: 'Website Builder', desc: 'Build your online presence instantly', href: '/products/website-builder', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Palette, title: 'Content Studio', desc: 'AI-powered content creation', href: '/products/content-studio', color: 'bg-purple-50 text-purple-600' },
  { icon: Zap, title: 'Marketing Automation', desc: 'Workflows & campaign engine', href: '/products/automation', color: 'bg-amber-50 text-amber-600' },
  { icon: Users, title: 'Lead Manager', desc: 'Capture & nurture leads', href: '/products/lead-manager', color: 'bg-teal-50 text-teal-600' },
  { icon: Inbox, title: 'Unified Inbox', desc: 'All messages in one place', href: '/products/inbox', color: 'bg-indigo-50 text-indigo-600' },
  { icon: Telescope, title: 'Prospect Intelligence', desc: 'Find new customers with AI', href: '/products/prospect-intel', color: 'bg-rose-50 text-rose-600' },
  { icon: Mic, title: 'AI Voice Agent', desc: 'Voice-powered business assistant', href: '/products/voice-agent', color: 'bg-sky-50 text-sky-600' },
  { icon: Trophy, title: 'Competitor Intelligence', desc: 'Track & outperform your market', href: '/products/competitor-intel', color: 'bg-orange-50 text-orange-600' },
];

export const Navbar = ({ language, onGetStartedClick, onLoginClick, hasSubscription }) => {
  const [showProducts, setShowProducts] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleEnter = () => { clearTimeout(timeoutRef.current); setShowProducts(true); };
  const handleLeave = () => { timeoutRef.current = setTimeout(() => setShowProducts(false), 200); };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-4 z-50 mx-auto max-w-6xl px-4 relative"
    >
      <div className="bg-white/60 backdrop-blur-xl rounded-full shadow-lg border border-white/50 px-6 py-3 mt-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-800 hidden sm:inline">LeadFlexUp</span>
          </motion.div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <motion.a href="#" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-900 rounded-full hover:bg-white/40 transition-all">
              {t('lpNavHome', language)}
            </motion.a>

            {/* Products Dropdown */}
            <div ref={dropdownRef} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
              <button
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-all ${showProducts ? 'text-navy-900 bg-white/60' : 'text-navy-600 hover:text-navy-900 hover:bg-white/40'}`}
              >
                Products <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showProducts ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProducts && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-2xl shadow-2xl border border-navy-100/60 overflow-hidden z-50"
                  >
                    <div className="flex">
                      {/* Products Grid */}
                      <div className="flex-1 p-5">
                        <div className="grid grid-cols-3 gap-1">
                          {products.map((p, i) => (
                            <a key={i} href={p.href}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-navy-50 transition-colors group"
                            >
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${p.color}`}>
                                <p.icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-navy-800 group-hover:text-navy-900">{p.title}</p>
                                <p className="text-[11px] text-navy-400 leading-tight mt-0.5">{p.desc}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Right CTA Panel */}
                      <div className="w-[200px] bg-navy-50 border-l border-navy-100 p-5 flex flex-col justify-center">
                        <div className="w-10 h-10 bg-navy-700 rounded-xl flex items-center justify-center mb-3">
                          <LayoutGrid className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-sm font-bold text-navy-800 mb-1">See it in action</h4>
                        <p className="text-[11px] text-navy-500 leading-relaxed mb-4">Get a personalized walkthrough of LeadFlexUp with your business data.</p>
                        <button onClick={onGetStartedClick}
                          className="flex items-center gap-1.5 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold rounded-full transition-colors w-fit">
                          Book a Demo <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.a href="#pricing" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-900 rounded-full hover:bg-white/40 transition-all">
              Buy Now
            </motion.a>
            <motion.a href="/blog" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-900 rounded-full hover:bg-white/40 transition-all">
              Blog
            </motion.a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {hasSubscription && (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 text-navy-700 text-sm font-semibold rounded-full hover:bg-white/40 transition-all"
              >
                Login
              </button>
            )}
            <button
              onClick={onGetStartedClick}
              className="px-4 py-2 bg-navy-900 text-white text-sm font-semibold rounded-full hover:bg-navy-800 transition-all shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

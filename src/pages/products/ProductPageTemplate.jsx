import { motion } from 'framer-motion';
import { ArrowRight, Check, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Commentable } from '../../components/CommentBox';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.1, duration: 0.5 } });

export const ProductPageTemplate = ({ icon: Icon, title, tagline, description, color, features, benefits, cta }) => {
  const navigate = useNavigate();

  return (
    <Commentable id={`product-${title.toLowerCase().replace(/\s+/g, '-')}`} label={`Product: ${title}`}>
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-navy-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
          </button>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-navy-900 text-white text-sm font-semibold rounded-full hover:bg-navy-800 transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-navy-50 via-white to-navy-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <motion.div {...fade(0)} className="text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${color}`}>
              <Icon className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">{tagline}</p>
            <h1 className="text-4xl sm:text-5xl font-black text-navy-900 mb-5 leading-tight">{title}</h1>
            <p className="text-lg text-navy-500 max-w-2xl mx-auto leading-relaxed">{description}</p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <button onClick={() => navigate('/')} className="px-6 py-3 bg-navy-900 text-white font-semibold rounded-full hover:bg-navy-800 transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/')} className="px-6 py-3 border border-navy-200 text-navy-700 font-semibold rounded-full hover:bg-navy-50 transition-all">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 bg-navy-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fade(1)} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">Key Features</h2>
            <p className="text-navy-500 mt-2">Everything you need, built right in.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} {...fade(i + 2)}
                className="bg-white rounded-2xl p-6 border border-navy-100 hover:shadow-lg transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-navy-800 mb-1">{f.title}</h3>
                <p className="text-[12px] text-navy-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fade(0)} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">Why businesses love it</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div key={i} {...fade(i)}
                className="flex items-start gap-3 p-4 rounded-xl bg-navy-25 border border-navy-50"
              >
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <p className="text-sm text-navy-700 leading-relaxed">{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-navy-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{cta || 'Ready to grow your business?'}</h2>
          <p className="text-navy-300 mb-8">Join thousands of Indian businesses already using LeadFlexUp.</p>
          <button onClick={() => navigate('/')} className="px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full transition-colors inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-navy-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-navy-400">&copy; 2026 LeadFlexUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </Commentable>
  );
};

import { motion } from 'framer-motion';
import { ArrowRight, Clock, User, TrendingUp, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.08, duration: 0.5 } });

const blogPosts = [
  { id: 1, title: 'How Small Businesses in India Can 4x Their Leads Using Digital Marketing', category: 'Growth', readTime: '6 min', date: 'Apr 28, 2026', excerpt: 'Discover proven strategies that helped 500+ Indian SMBs multiply their lead flow without spending lakhs on ads.', image: 'bg-linear-to-br from-teal-400 to-teal-600' },
  { id: 2, title: 'The Complete Guide to Google My Business for Local Shops', category: 'Local SEO', readTime: '8 min', date: 'Apr 22, 2026', excerpt: 'Step-by-step setup guide to get your business on Google Maps and start attracting nearby customers organically.', image: 'bg-linear-to-br from-blue-400 to-blue-600' },
  { id: 3, title: 'WhatsApp Marketing: 10 Automation Ideas for Restaurants & Cafes', category: 'Automation', readTime: '5 min', date: 'Apr 18, 2026', excerpt: 'From booking confirmations to loyalty rewards — automate your WhatsApp and save 2 hours daily.', image: 'bg-linear-to-br from-green-400 to-green-600' },
  { id: 4, title: 'Instagram Reels Strategy for Service Businesses in 2026', category: 'Social Media', readTime: '7 min', date: 'Apr 14, 2026', excerpt: 'How salons, clinics, and coaching centers are using short-form video to get 10x more walk-ins.', image: 'bg-linear-to-br from-pink-400 to-pink-600' },
  { id: 5, title: 'Website vs Social Media Page: Why You Need Both in 2026', category: 'Strategy', readTime: '4 min', date: 'Apr 10, 2026', excerpt: 'Social media alone isn\'t enough. Here\'s why a website is your most important digital asset.', image: 'bg-linear-to-br from-indigo-400 to-indigo-600' },
  { id: 6, title: 'Understanding Digital Presence Scores: What They Mean for Your Business', category: 'Analytics', readTime: '5 min', date: 'Apr 6, 2026', excerpt: 'Decode your digital presence score and learn which metrics matter most for local business growth.', image: 'bg-linear-to-br from-amber-400 to-amber-600' },
  { id: 7, title: 'How to Beat Your Competitors Online (Without a Big Budget)', category: 'Competition', readTime: '6 min', date: 'Apr 2, 2026', excerpt: 'Smart tactics to outrank and outperform competitors even if they\'re spending 10x more on marketing.', image: 'bg-linear-to-br from-orange-400 to-orange-600' },
  { id: 8, title: 'AI for Small Business: A Non-Technical Owner\'s Guide', category: 'AI', readTime: '7 min', date: 'Mar 28, 2026', excerpt: 'Plain-language explanation of how AI tools can save you time and money — no engineering degree needed.', image: 'bg-linear-to-br from-purple-400 to-purple-600' },
  { id: 9, title: 'Email Marketing Isn\'t Dead: How to Get 40% Open Rates in India', category: 'Email', readTime: '5 min', date: 'Mar 24, 2026', excerpt: 'Proven subject lines, send times, and content formats that work for Indian business audiences.', image: 'bg-linear-to-br from-rose-400 to-rose-600' },
];

const categories = ['All', 'Growth', 'Local SEO', 'Automation', 'Social Media', 'Strategy', 'Analytics', 'Competition', 'AI', 'Email'];

export const BlogPage = () => {
  const navigate = useNavigate();

  return (
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
      <section className="py-16 sm:py-20 bg-navy-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fade(0)}>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">LeadFlexUp Blog</p>
            <h1 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Insights for Growing Indian Businesses</h1>
            <p className="text-navy-500 max-w-xl mx-auto">Actionable tips, strategies, and guides to help you master digital marketing and grow your local business.</p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <div className="border-b border-navy-100 sticky top-[57px] bg-white z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
          {categories.map((cat, i) => (
            <button key={i} className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${i === 0 ? 'bg-navy-800 text-white' : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <motion.div {...fade(1)} className="grid md:grid-cols-2 gap-8 items-center bg-navy-800 rounded-2xl p-6 sm:p-8 text-white">
          <div className={`h-48 sm:h-64 rounded-xl ${blogPosts[0].image} flex items-center justify-center`}>
            <span className="text-5xl font-black text-white/20">LFU</span>
          </div>
          <div>
            <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 text-[10px] font-bold rounded-full">{blogPosts[0].category}</span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-3 leading-tight">{blogPosts[0].title}</h2>
            <p className="text-navy-300 text-sm leading-relaxed mb-4">{blogPosts[0].excerpt}</p>
            <div className="flex items-center gap-4 text-[11px] text-navy-400">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blogPosts[0].readTime}</span>
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> LeadFlexUp Team</span>
              <span>{blogPosts[0].date}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post, i) => (
            <motion.article key={post.id} {...fade(i + 2)}
              className="bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <div className={`h-36 ${post.image} flex items-center justify-center`}>
                <span className="text-3xl font-black text-white/20">LFU</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-navy-50 text-navy-600 text-[9px] font-semibold rounded-full">{post.category}</span>
                  <span className="text-[10px] text-navy-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {post.readTime}</span>
                </div>
                <h3 className="text-sm font-bold text-navy-800 leading-snug mb-2 group-hover:text-teal-700 transition-colors">{post.title}</h3>
                <p className="text-[11px] text-navy-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-navy-400">{post.date}</span>
                  <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all">Read <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-14 bg-navy-800">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Get growth tips in your inbox</h2>
          <p className="text-navy-300 text-sm mb-6">Weekly insights for Indian business owners. No spam, just actionable strategies.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-full text-sm bg-white/10 border border-white/20 text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
            <button className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold rounded-full transition-colors">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-navy-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-navy-400">&copy; 2026 LeadFlexUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp,
  Rocket, Settings, LogOut, Menu, X, Bell, Search, ChevronDown,
  BarChart3, CreditCard, Globe, Palette, Zap, Users, UserPlus, Terminal,
  MessageCircle, Plus, Clock, ChevronRight, Workflow
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage, businessData, logout, currentUser, analyticsData, isAuthenticated, signup,
    chatHistory, workflows } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { key: 'overview', icon: LayoutDashboard, path: '/dashboard', label: t('dashboard', language) },
    { key: 'analytics', icon: BarChart3, path: '/dashboard/analytics', label: t('analytics', language) },
    ...(isAuthenticated ? [
      { key: 'website', icon: Globe, path: '/dashboard/website', label: t('websiteBuilder', language) },
      { key: 'content', icon: Palette, path: '/dashboard/content', label: t('contentStudio', language) },
      { key: 'automation', icon: Zap, path: '/dashboard/automation', label: t('automationHub', language) },
      { key: 'leads', icon: Users, path: '/dashboard/leads', label: t('leadManager', language) },
      { key: 'subscription', icon: CreditCard, path: '/dashboard/subscription', label: t('subscription', language) },
      { key: 'growthJourney', icon: Rocket, path: '/dashboard/journey', label: t('growthJourney', language) },
      { key: 'settings', icon: Settings, path: '/dashboard/settings', label: t('settings', language) },
    ] : [])
  ];

  const collapsedW = 'w-[60px]';
  const expandedW = 'w-[220px]';
  const sideW = sidebarExpanded ? expandedW : collapsedW;
  const mlVal = sidebarExpanded ? 'lg:ml-[220px]' : 'lg:ml-[60px]';

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white rounded-lg shadow-md border border-navy-100">
          {sidebarOpen ? <X className="w-5 h-5 text-navy-700" /> : <Menu className="w-5 h-5 text-navy-700" />}
        </button>
      </div>

      {/* ─── Main Sidebar ─── */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-navy-100 z-40
          transition-all duration-200 overflow-hidden
          ${sidebarOpen ? 'w-[220px] translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:${sideW}
        `}
        style={{ width: sidebarOpen ? 220 : undefined }}
      >
        <div className="flex flex-col h-full" style={{ width: sidebarExpanded || sidebarOpen ? 220 : 60 }}>
          {/* Logo */}
          <div className={`flex items-center gap-2.5 py-5 ${sidebarExpanded || sidebarOpen ? 'px-5' : 'px-0 justify-center'}`}>
            <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            {(sidebarExpanded || sidebarOpen) && <span className="text-lg font-bold text-navy-800 whitespace-nowrap">LeadFlexUp</span>}
          </div>

          {/* Nav */}
          <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg text-[13px] font-medium transition-colors ${
                    sidebarExpanded || sidebarOpen ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'
                  } ${isActive ? 'bg-navy-700 text-white' : 'text-navy-500 hover:bg-navy-50 hover:text-navy-700'}`
                }
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                {(sidebarExpanded || sidebarOpen) && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            ))}

            {/* Chat History toggle for authenticated users */}
            {isAuthenticated && (sidebarExpanded || sidebarOpen) && chatHistory.length > 0 && (
              <button onClick={() => setChatSidebarOpen(!chatSidebarOpen)}
                className="mx-1 mt-3 flex items-center gap-2 px-3 py-2 text-navy-500 hover:bg-navy-50 rounded-lg text-[12px] font-medium w-full transition-colors">
                <Clock className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="whitespace-nowrap flex-1 text-left">Chat History</span>
                <span className="text-[9px] bg-navy-100 text-navy-500 px-1.5 py-0.5 rounded-full">{chatHistory.length}</span>
              </button>
            )}

            {/* Workflows count for authenticated users */}
            {isAuthenticated && (sidebarExpanded || sidebarOpen) && workflows.length > 0 && (
              <NavLink to="/dashboard/automation"
                className="mx-1 flex items-center gap-2 px-3 py-2 text-navy-500 hover:bg-navy-50 rounded-lg text-[12px] font-medium transition-colors">
                <Workflow className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="whitespace-nowrap flex-1">Workflows</span>
                <span className="flex items-center gap-1 text-[9px] bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" />
                  {workflows.filter(w => w.status === 'running').length}
                </span>
              </NavLink>
            )}

            {/* Signup button for guests */}
            {!isAuthenticated && (sidebarExpanded || sidebarOpen) && (
              <button onClick={() => {
                const email = prompt('Enter email to sign up:');
                if (email) signup({ email, password: 'demo' });
              }}
                className="mx-1 mt-2 flex items-center gap-2 px-3 py-2.5 bg-teal-600 text-white rounded-lg text-[12px] font-semibold hover:bg-teal-700 transition-colors">
                <UserPlus className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="whitespace-nowrap">{t('signUpFree', language)}</span>
              </button>
            )}
            {!isAuthenticated && !(sidebarExpanded || sidebarOpen) && (
              <button onClick={() => setSidebarExpanded(true)}
                className="mx-auto mt-2 w-9 h-9 flex items-center justify-center bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                <UserPlus className="w-4 h-4" />
              </button>
            )}
          </nav>

          {/* Score card */}
          {(sidebarExpanded || sidebarOpen) && analyticsData && (
            <div className="mx-2 mb-2 p-3 bg-navy-700 rounded-xl text-white">
              <p className="text-[10px] font-medium text-navy-200 mb-0.5">Digital Score</p>
              <div className="flex items-end gap-1.5">
                <span className="text-xl font-bold">{analyticsData.digitalPresence.overall}</span>
                <span className="text-[10px] text-teal-300 mb-0.5">/ 100</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1 mt-1.5">
                <div className="bg-teal-400 rounded-full h-1" style={{ width: `${analyticsData.digitalPresence.overall}%` }} />
              </div>
            </div>
          )}

          {/* Language + Logout */}
          <div className={`p-2 border-t border-navy-100 space-y-1.5 ${!(sidebarExpanded || sidebarOpen) && 'flex flex-col items-center'}`}>
            {(sidebarExpanded || sidebarOpen) ? (
              <>
                <select
                  value={language} onChange={(e) => changeLanguage(e.target.value)}
                  className="w-full px-2 py-1.5 bg-navy-50 border border-navy-100 rounded-lg text-[11px] font-medium text-navy-600"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 हिंदी</option>
                  <option value="ta">🇮🇳 தமிழ்</option>
                  <option value="kn">🇮🇳 ಕನ್ನಡ</option>
                  <option value="te">🇮🇳 తెలుగు</option>
                  <option value="ml">🇮🇳 മലയാളം</option>
                </select>
                {isAuthenticated && (
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-[11px] font-medium">
                    <LogOut className="w-3.5 h-3.5" /> {t('logout', language)}
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setSidebarExpanded(true)}
                  className="p-1.5 rounded-lg hover:bg-navy-50 text-navy-400 text-[10px] font-bold"
                  title="Language"
                >
                  {language.toUpperCase()}
                </button>
                {isAuthenticated && (
                  <button onClick={handleLogout} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title={t('logout', language)}>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ─── Chat History Sub-Sidebar (post-signup) ─── */}
      <AnimatePresence>
        {chatSidebarOpen && isAuthenticated && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 h-full w-[280px] bg-white border-r border-navy-100 z-[45] shadow-xl"
            style={{ left: sidebarExpanded ? 220 : 60 }}
          >
            <div className="flex flex-col h-full">
              <div className="px-4 py-4 border-b border-navy-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-teal-600" /> Chat History
                </h3>
                <button onClick={() => setChatSidebarOpen(false)} className="p-1 rounded-lg hover:bg-navy-50">
                  <X className="w-4 h-4 text-navy-400" />
                </button>
              </div>

              <button onClick={() => { setChatSidebarOpen(false); navigate('/dashboard'); }}
                className="mx-3 mt-3 flex items-center gap-2 px-3 py-2.5 bg-teal-600 text-white rounded-lg text-[12px] font-semibold hover:bg-teal-700">
                <Plus className="w-4 h-4" /> New Chat
              </button>

              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-8 h-8 text-navy-200 mx-auto mb-2" />
                    <p className="text-[11px] text-navy-400">No conversations yet</p>
                  </div>
                ) : (
                  chatHistory.map(chat => (
                    <button key={chat.id}
                      onClick={() => { setChatSidebarOpen(false); navigate('/dashboard'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-navy-50 text-left transition-colors group">
                      <div className="w-7 h-7 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-navy-100">
                        <MessageCircle className="w-3.5 h-3.5 text-navy-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-navy-700 truncate">{chat.title}</p>
                        <p className="text-[9px] text-navy-300">{new Date(chat.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Active Workflows section in sub-sidebar */}
              {workflows.length > 0 && (
                <div className="border-t border-navy-100 p-3">
                  <p className="text-[9px] font-bold text-navy-400 uppercase tracking-wider mb-2">Active Workflows</p>
                  <div className="space-y-1.5">
                    {workflows.filter(w => w.status === 'running').slice(0, 3).map(wf => (
                      <div key={wf.id} className="flex items-center gap-2 px-2 py-1.5 bg-teal-50 rounded-lg">
                        <span className="text-sm">{wf.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-navy-700 truncate">{wf.name}</p>
                        </div>
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── Top bar ─── */}
      <div className={`transition-all duration-200 ${mlVal}`}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-navy-100">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-3 pl-10 lg:pl-0">
              {isAuthenticated && chatHistory.length > 0 && (
                <button onClick={() => setChatSidebarOpen(!chatSidebarOpen)}
                  className="p-1.5 rounded-lg hover:bg-navy-50 mr-1" title="Chat History">
                  <Clock className="w-4 h-4 text-navy-500" />
                </button>
              )}
              <h1 className="text-sm font-bold text-navy-800">{t('dashboard', language)}</h1>
              <ChevronDown className="w-4 h-4 text-navy-400" />
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-50 rounded-lg border border-navy-100 w-56">
                <Search className="w-4 h-4 text-navy-400" />
                <input placeholder="Search..." className="bg-transparent text-xs outline-none w-full text-navy-700 placeholder:text-navy-300" />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-navy-50">
                <Bell className="w-4 h-4 text-navy-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-navy-100">
                <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {(currentUser?.email || businessData?.businessName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-navy-800 leading-none">{businessData?.businessName || 'User'}</p>
                  <p className="text-[11px] text-navy-400 mt-0.5">{currentUser?.email || (isAuthenticated ? 'owner' : 'Guest')}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6"><Outlet /></main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-navy-950/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {chatSidebarOpen && <div className="fixed inset-0 bg-navy-950/20 z-[44]" onClick={() => setChatSidebarOpen(false)} />}
    </div>
  );
};

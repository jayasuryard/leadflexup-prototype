import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Lightbulb,
  Rocket, Settings, LogOut, Menu, X, Bell, Search, ChevronDown,
  BarChart3, CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage, businessData, logout, currentUser, analyticsData, isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  // Build nav items dynamically based on auth state
  const navItems = [
    { key: 'overview', icon: LayoutDashboard, path: '/dashboard', label: t('dashboard', language) },
    { key: 'analytics', icon: BarChart3, path: '/dashboard/analytics', label: t('analytics', language) },
    { key: 'recommendations', icon: Lightbulb, path: '/dashboard/recommendations', label: t('recommendations', language) },
    ...(isAuthenticated ? [
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

      {/* ─── Sidebar ─── */}
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
          </nav>

          {/* Score card — only when expanded */}
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

      {/* ─── Top bar ─── */}
      <div className={`transition-all duration-200 ${mlVal}`}>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-navy-100">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-3 pl-10 lg:pl-0">
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
    </div>
  );
};

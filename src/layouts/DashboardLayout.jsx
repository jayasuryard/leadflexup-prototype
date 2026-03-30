import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Target, Lightbulb, CreditCard,
  Rocket, Settings, LogOut, Menu, X, Bell, Search, ChevronDown,
  BarChart3, Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

const navItems = [
  { key: 'overview', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { key: 'competitors', icon: Target, path: '/dashboard/competitors' },
  { key: 'recommendations', icon: Lightbulb, path: '/dashboard/recommendations' },
  { key: 'subscription', icon: CreditCard, path: '/dashboard/subscription' },
  { key: 'growthJourney', icon: Rocket, path: '/dashboard/journey' },
  { key: 'settings', icon: Settings, path: '/dashboard/settings' }
];

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, businessData, logout, currentUser, analyticsData } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md border border-navy-100"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-navy-700" /> : <Menu className="w-5 h-5 text-navy-700" />}
        </button>
      </div>

      {/* ─── Sidebar ─── */}
      <aside className={`
        fixed top-0 left-0 h-full w-[220px] bg-white border-r border-navy-100 z-40
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-5 py-5 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-800">LeadFlexUp</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-navy-700 text-white'
                      : 'text-navy-500 hover:bg-navy-50 hover:text-navy-700'
                  }`
                }
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{t(item.key === 'overview' ? 'dashboard' : item.key, language)}</span>
              </NavLink>
            ))}
          </nav>

          {/* Score card */}
          {analyticsData && (
            <div className="mx-3 mb-3 p-4 bg-navy-700 rounded-xl text-white">
              <p className="text-[11px] font-medium text-navy-200 mb-1">Digital Score</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{analyticsData.digitalPresence.overall}</span>
                <span className="text-[11px] text-teal-300 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                <div className="bg-teal-400 rounded-full h-1.5" style={{ width: `${analyticsData.digitalPresence.overall}%` }} />
              </div>
            </div>
          )}

          {/* Language + Logout */}
          <div className="p-3 border-t border-navy-100 space-y-2">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs font-medium text-navy-600"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="ta">🇮🇳 தமிழ்</option>
            </select>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout', language)}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Top bar ─── */}
      <div className="lg:ml-[220px]">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-navy-100">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-3 pl-10 lg:pl-0">
              <h1 className="text-sm font-bold text-navy-800">
                {t('dashboard', language)}
              </h1>
              <ChevronDown className="w-4 h-4 text-navy-400" />
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-navy-50 rounded-lg border border-navy-100 w-56">
                <Search className="w-4 h-4 text-navy-400" />
                <input placeholder="Search..." className="bg-transparent text-xs outline-none w-full text-navy-700 placeholder:text-navy-300" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-navy-50">
                <Bell className="w-4.5 h-4.5 text-navy-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
              </button>

              {/* User */}
              <div className="flex items-center gap-2 pl-2 border-l border-navy-100">
                <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {(currentUser?.email || businessData?.businessName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-navy-800 leading-none">
                    {businessData?.businessName || 'User'}
                  </p>
                  <p className="text-[11px] text-navy-400 mt-0.5">
                    {currentUser?.email || 'owner'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-navy-950/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

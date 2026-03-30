import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, TrendingUp, Target, Lightbulb, CreditCard, 
  Rocket, Settings, LogOut, Menu, X, Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, businessData, resetApp, analyticsData } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'analytics', icon: TrendingUp, path: '/dashboard/analytics' },
    { name: 'competitors', icon: Target, path: '/dashboard/competitors' },
    { name: 'recommendations', icon: Lightbulb, path: '/dashboard/recommendations' },
    { name: 'subscription', icon: CreditCard, path: '/dashboard/subscription' },
    { name: 'growthJourney', icon: Rocket, path: '/dashboard/journey' },
    { name: 'settings', icon: Settings, path: '/dashboard/settings' }
  ];

  const handleLogout = () => {
    resetApp();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-900" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-40
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LeadFlexUp
                </h1>
                {businessData && (
                  <p className="text-xs text-gray-600 truncate max-w-[180px]">
                    {businessData.businessName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Score Card */}
          {analyticsData && (
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white m-4 rounded-xl">
              <p className="text-indigo-100 text-sm mb-1">Digital Presence</p>
              <p className="text-3xl font-bold mb-2">{analyticsData.digitalPresence.overall}</p>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2"
                  style={{ width: `${analyticsData.digitalPresence.overall}%` }}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{t(item.name, language)}</span>
              </NavLink>
            ))}
          </nav>

          {/* Language Selector & Logout */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="ta">🇮🇳 தமிழ்</option>
            </select>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('logout', language)}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="p-8 pt-20 lg:pt-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

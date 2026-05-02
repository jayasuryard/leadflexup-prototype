import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Moon, Sun, Bell, Mail, Shield, User, Phone, MapPin,
  Globe, Lock, Eye, EyeOff, AlertTriangle, Check, ChevronRight,
  Palette, Monitor, Smartphone, Key, LogOut, Trash2, Download,
  MessageCircle, Volume2, VolumeX, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { Commentable } from '../components/CommentBox';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

/* ─── Toggle Switch ─── */
const Toggle = ({ enabled, onChange, size = 'md' }) => (
  <button onClick={() => onChange(!enabled)}
    className={`relative inline-flex items-center rounded-full transition-colors ${
      size === 'md' ? 'h-6 w-11' : 'h-5 w-9'
    } ${enabled ? 'bg-teal-600' : 'bg-navy-200'}`}>
    <span className={`inline-block rounded-full bg-white shadow-sm transition-transform ${
      size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'
    } ${enabled ? (size === 'md' ? 'translate-x-6' : 'translate-x-5') : 'translate-x-1'}`} />
  </button>
);

/* ─── Section Card ─── */
const SettingSection = ({ title, desc, icon: Icon, iconColor, children, index = 0 }) => (
  <motion.div {...fade(index)} className="bg-white rounded-xl border border-navy-100 overflow-hidden">
    <div className="px-5 py-4 border-b border-navy-50 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColor || 'bg-navy-100'}`}>
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-navy-800">{title}</h3>
        {desc && <p className="text-[10px] text-navy-400 mt-0.5">{desc}</p>}
      </div>
    </div>
    <div className="px-5 py-4 space-y-4">{children}</div>
  </motion.div>
);

/* ─── Row ─── */
const SettingRow = ({ label, desc, children }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-semibold text-navy-700">{label}</p>
      {desc && <p className="text-[10px] text-navy-400 mt-0.5">{desc}</p>}
    </div>
    {children}
  </div>
);

export const SettingsPage = () => {
  const { language, changeLanguage, currentUser, businessData, logout, darkMode, toggleDarkMode } = useApp();

  // Appearance
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [emailLeadAlerts, setEmailLeadAlerts] = useState(true);
  const [emailWeeklyReport, setEmailWeeklyReport] = useState(true);
  const [emailContentApproval, setEmailContentApproval] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Account
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [deactivateStep, setDeactivateStep] = useState(0);
  const [deactivateReason, setDeactivateReason] = useState('');

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || currentUser?.phone || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || businessData?.phone || '',
  });

  const [saved, setSaved] = useState(null);

  const showSaved = (section) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleDarkMode = (val) => {
    toggleDarkMode(val);
    showSaved('appearance');
  };

  return (
    <Commentable id="settings-page" label="Settings Page">
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <Commentable id="settings-header" label="Settings Page Header">
      <div>
        <h1 className="text-xl font-bold text-navy-900">{t('settings', language)}</h1>
        <p className="text-sm text-navy-400 mt-0.5">Manage your account, preferences, and notifications</p>
      </div>
      </Commentable>

      {/* ═══ Appearance ═══ */}
      <Commentable id="settings-appearance" label="Appearance Settings">
      <SettingSection title="Appearance" desc="Customize how LeadFlexUp looks" icon={Palette} iconColor="bg-purple-600" index={0}>
        <SettingRow label="Dark Mode" desc="Switch to a dark color theme for reduced eye strain">
          <Toggle enabled={darkMode} onChange={handleDarkMode} />
        </SettingRow>
        <SettingRow label="Compact Mode" desc="Reduce spacing for more content on screen">
          <Toggle enabled={compactMode} onChange={(v) => { setCompactMode(v); showSaved('appearance'); }} />
        </SettingRow>
        <SettingRow label="Language" desc="Choose your preferred language">
          <select value={language} onChange={e => changeLanguage(e.target.value)}
            className="px-3 py-1.5 bg-navy-50 border border-navy-100 rounded-lg text-[11px] font-medium text-navy-600 focus:outline-none focus:border-teal-500">
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="ta">🇮🇳 தமிழ்</option>
            <option value="kn">🇮🇳 ಕನ್ನಡ</option>
            <option value="te">🇮🇳 తెలుగు</option>
            <option value="ml">🇮🇳 മലയാളം</option>
          </select>
        </SettingRow>
        {saved === 'appearance' && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-[10px] text-teal-600 font-semibold">
            <Check className="w-3 h-3" /> Settings saved
          </motion.div>
        )}
      </SettingSection>
      </Commentable>

      {/* ═══ Email Notifications ═══ */}
      <Commentable id="settings-notifications" label="Notification Settings">
      <SettingSection title="Email Notifications" desc="Control what emails you receive" icon={Mail} iconColor="bg-blue-600" index={1}>
        <SettingRow label="Email Notifications" desc="Master toggle for all email notifications">
          <Toggle enabled={emailNotifications} onChange={(v) => { setEmailNotifications(v); showSaved('email'); }} />
        </SettingRow>
        {emailNotifications && (
          <>
            <div className="pl-4 border-l-2 border-navy-100 space-y-3">
              <SettingRow label="New Lead Alerts" desc="Get notified when a new lead comes in">
                <Toggle enabled={emailLeadAlerts} onChange={setEmailLeadAlerts} size="sm" />
              </SettingRow>
              <SettingRow label="Weekly Performance Report" desc="Summary of your business metrics every Monday">
                <Toggle enabled={emailWeeklyReport} onChange={setEmailWeeklyReport} size="sm" />
              </SettingRow>
              <SettingRow label="Content Approval Requests" desc="When AI generates content that needs approval">
                <Toggle enabled={emailContentApproval} onChange={setEmailContentApproval} size="sm" />
              </SettingRow>
            </div>
          </>
        )}
        <SettingRow label="WhatsApp Notifications" desc="Receive alerts and approvals on WhatsApp">
          <Toggle enabled={whatsappNotifications} onChange={(v) => { setWhatsappNotifications(v); showSaved('email'); }} />
        </SettingRow>
        <SettingRow label="Push Notifications" desc="Browser/device push notifications">
          <Toggle enabled={pushNotifications} onChange={(v) => { setPushNotifications(v); showSaved('email'); }} />
        </SettingRow>
        <SettingRow label="Sound Effects" desc="Play sounds for notifications">
          <Toggle enabled={soundEnabled} onChange={(v) => { setSoundEnabled(v); showSaved('email'); }} />
        </SettingRow>
        {saved === 'email' && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-[10px] text-teal-600 font-semibold">
            <Check className="w-3 h-3" /> Notification preferences saved
          </motion.div>
        )}
      </SettingSection>
      </Commentable>

      {/* ═══ Profile & Account ═══ */}
      <Commentable id="settings-profile-section" label="Profile & Account Settings">
      <SettingSection title="Profile & Account" desc="Your personal information" icon={User} iconColor="bg-teal-600" index={2}>
        {editingProfile ? (
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-navy-600 mb-1">Full Name</label>
              <input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-navy-600 mb-1">Email</label>
              <input value={profileData.email} onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))} type="email"
                className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-navy-600 mb-1">Phone</label>
              <input value={profileData.phone} onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))} type="tel"
                className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingProfile(false)}
                className="px-4 py-2 text-xs font-semibold text-navy-600 border border-navy-200 rounded-lg hover:bg-navy-50">Cancel</button>
              <button onClick={() => { setEditingProfile(false); showSaved('profile'); }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Save Changes</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 bg-navy-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-800">{profileData.name || 'User'}</p>
                  <p className="text-[10px] text-navy-400">{profileData.phone}</p>
                </div>
              </div>
              <button onClick={() => setEditingProfile(true)}
                className="px-3 py-1.5 text-[11px] font-semibold text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50">Edit</button>
            </div>
            <SettingRow label="Business" desc={businessData?.businessName || 'Not set'}>
              <span className="text-[10px] font-semibold text-navy-500 capitalize">{businessData?.category || 'N/A'}</span>
            </SettingRow>
            <SettingRow label="Location" desc={businessData?.businessCity || 'Not set'}>
              <MapPin className="w-4 h-4 text-navy-300" />
            </SettingRow>
          </>
        )}
        {saved === 'profile' && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-[10px] text-teal-600 font-semibold">
            <Check className="w-3 h-3" /> Profile updated
          </motion.div>
        )}
      </SettingSection>
      </Commentable>

      {/* ═══ Security ═══ */}
      <Commentable id="settings-security" label="Security Settings">
      <SettingSection title="Security" desc="Password and login settings" icon={Shield} iconColor="bg-amber-600" index={3}>
        <SettingRow label="Change Password" desc="Update your account password">
          <button className="px-3 py-1.5 text-[11px] font-semibold text-navy-600 border border-navy-200 rounded-lg hover:bg-navy-50 flex items-center gap-1">
            <Key className="w-3 h-3" /> Change
          </button>
        </SettingRow>
        <SettingRow label="Two-Factor Auth" desc="Add extra security to your account">
          <button className="px-3 py-1.5 text-[11px] font-semibold text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50">Enable</button>
        </SettingRow>
        <SettingRow label="Active Sessions" desc="Manage logged-in devices">
          <span className="text-[10px] font-semibold text-navy-500">1 device</span>
        </SettingRow>
      </SettingSection>
      </Commentable>

      {/* ═══ Data & Export ═══ */}
      <Commentable id="settings-data-export" label="Data & Export Settings">
      <SettingSection title="Data & Export" desc="Download your data" icon={Download} iconColor="bg-indigo-600" index={4}>
        <SettingRow label="Export All Data" desc="Download all your business data, leads, and analytics">
          <button className="px-3 py-1.5 text-[11px] font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 flex items-center gap-1">
            <Download className="w-3 h-3" /> Export
          </button>
        </SettingRow>
        <SettingRow label="Export Leads" desc="Download leads as CSV">
          <button className="px-3 py-1.5 text-[11px] font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 flex items-center gap-1">
            <Download className="w-3 h-3" /> CSV
          </button>
        </SettingRow>
      </SettingSection>
      </Commentable>

      {/* ═══ Account Maintenance ═══ */}
      <Commentable id="settings-account-maintenance" label="Account Maintenance & Deactivation">
      <SettingSection title="Account Maintenance" desc="Manage your account status" icon={AlertTriangle} iconColor="bg-red-600" index={5}>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
          <p className="text-[11px] text-amber-800 font-semibold">⚠️ Important Notice</p>
          <p className="text-[10px] text-amber-600 mt-0.5">
            For security and data integrity, accounts cannot be directly deleted. You can deactivate your account, and our team will assist with any data-related requests.
          </p>
        </div>

        <SettingRow label="Deactivate Account" desc="Temporarily disable your account. You can reactivate anytime.">
          <button onClick={() => setShowDeactivateConfirm(true)}
            className="px-3 py-1.5 text-[11px] font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
            Deactivate
          </button>
        </SettingRow>

        <SettingRow label="Request Data Deletion" desc="Submit a request to our team to review and process">
          <button className="px-3 py-1.5 text-[11px] font-semibold text-navy-600 border border-navy-200 rounded-lg hover:bg-navy-50">
            Submit Request
          </button>
        </SettingRow>

        <div className="bg-navy-50 rounded-lg p-3">
          <p className="text-[10px] text-navy-500">
            <strong>Need help?</strong> Contact our support team at support@leadflexup.com for account-related assistance.
            Data deletion requests are processed within 30 days as per our privacy policy.
          </p>
        </div>
      </SettingSection>
      </Commentable>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4"
          onClick={() => { setShowDeactivateConfirm(false); setDeactivateStep(0); }}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>

            {deactivateStep === 0 && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">Deactivate Account?</h3>
                    <p className="text-[10px] text-navy-400">This will pause all automations</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-navy-600">When you deactivate:</p>
                  <ul className="space-y-1.5">
                    {[
                      'Your website will go offline',
                      'All automations will pause',
                      'Leads will stop being collected',
                      'You can reactivate anytime by logging back in',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-navy-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-navy-600 mb-1">Reason for deactivation (optional)</label>
                  <textarea value={deactivateReason} onChange={e => setDeactivateReason(e.target.value)}
                    placeholder="Help us improve..."
                    rows={2} className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs text-navy-800 placeholder-navy-400 focus:outline-none focus:border-red-400 resize-none mb-3" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setShowDeactivateConfirm(false); setDeactivateStep(0); }}
                    className="flex-1 px-3 py-2 border border-navy-200 text-navy-600 text-xs font-semibold rounded-lg hover:bg-navy-50">
                    Keep Account
                  </button>
                  <button onClick={() => setDeactivateStep(1)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700">
                    Continue
                  </button>
                </div>
              </>
            )}

            {deactivateStep === 1 && (
              <>
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-900 mb-1">Are you absolutely sure?</h3>
                  <p className="text-xs text-navy-400 mb-4">
                    Type <strong>DEACTIVATE</strong> below to confirm
                  </p>
                  <input placeholder="Type DEACTIVATE"
                    className="w-full px-3 py-2 bg-navy-50 border border-navy-100 rounded-lg text-xs text-center text-navy-800 placeholder-navy-400 focus:outline-none focus:border-red-400 mb-3"
                    onChange={e => {
                      if (e.target.value === 'DEACTIVATE') setDeactivateStep(2);
                    }} />
                  <button onClick={() => { setShowDeactivateConfirm(false); setDeactivateStep(0); }}
                    className="text-xs text-navy-500 hover:text-navy-700">Cancel</button>
                </div>
              </>
            )}

            {deactivateStep === 2 && (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-navy-900 mb-1">Account Deactivation Requested</h3>
                <p className="text-xs text-navy-400 mb-4">
                  Your request has been submitted. Our team will process it within 24 hours.
                  You can still use your account until then. To reactivate, simply log in.
                </p>
                <button onClick={() => { setShowDeactivateConfirm(false); setDeactivateStep(0); }}
                  className="px-6 py-2 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800">
                  Got it
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
    </Commentable>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { saveSupabaseCredentials, clearSupabaseCredentials, isSupabaseConfigured } from '../lib/supabase';
import { Toast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { Settings as SettingsIcon, User, Lock, Bell, Moon, Sun, Database, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Satyajit Rout',
    email: user?.email || 'admin@college.edu',
    phone: user?.phone || '+1 555-0100',
    avatarUrl: user?.avatarUrl || '/satyajit.jpg',
  });

  // Password form
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  // Notification states
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    attendanceWarning: true,
    examReminders: true,
    assignmentNotices: true,
  });

  // Supabase Live Config Form
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(localStorage.getItem('sms_supabase_url') || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(localStorage.getItem('sms_supabase_key') || '');
  const isConnectedToSupabase = isSupabaseConfigured();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Profile settings updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      setToastMessage('New password and confirmation do not match!');
      return;
    }
    setToastMessage('Password updated successfully!');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput || !supabaseKeyInput) {
      setToastMessage('Please provide both Supabase URL and Anon Key.');
      return;
    }
    saveSupabaseCredentials(supabaseUrlInput, supabaseKeyInput);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10 max-w-5xl">
      <Toast message={toastMessage || ''} isOpen={Boolean(toastMessage)} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Account & System Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, security options, theme display, and live Supabase database connection
        </p>
      </div>

      {/* Section 1: Profile Info */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <User className="w-5 h-5 text-brand-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={profileData.avatarUrl}
                onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Info</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Password Change */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Lock className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Security & Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Section 3: Appearance Theme Settings */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Theme & Display</h3>
          </div>
          <Badge variant="brand">{theme.toUpperCase()} MODE</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Interface Theme Mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between clean light and sleek dark SaaS mode</p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>

      {/* Section 4: Live Supabase Database Connection */}
      <div className="glass-card p-6 space-y-4 border-2 border-emerald-500/20">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Live Supabase Database Connection</h3>
          </div>
          <Badge variant={isConnectedToSupabase ? 'success' : 'neutral'}>
            {isConnectedToSupabase ? 'LIVE SUPABASE CONNECTED' : 'MOCK STATE ENGINE ACTIVE'}
          </Badge>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The application comes out-of-the-box with a local mock state engine (25 students, 10 faculty, attendance, marks, courses). If you wish to connect your own live Supabase project database, enter your project URL and Public Anon Key below.
        </p>

        <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={supabaseUrlInput}
              onChange={(e) => setSupabaseUrlInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono"
              placeholder="https://your-project.supabase.co"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supabase Anon Key
            </label>
            <input
              type="password"
              value={supabaseKeyInput}
              onChange={(e) => setSupabaseKeyInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
            >
              Connect Live Supabase DB
            </button>
            {isConnectedToSupabase && (
              <button
                type="button"
                onClick={clearSupabaseCredentials}
                className="px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                Reset to Demo State
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

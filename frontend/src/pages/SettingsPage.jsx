import { Settings, Bell, Lock, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const SettingRow = ({ icon: Icon, title, description, children }) => (
  <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="font-black text-slate-900 text-sm">{title}</p>
        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
    {children || <ChevronRight className="h-4 w-4 text-slate-300" />}
  </div>
);

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Account */}
      <div className="space-y-3 mb-8">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">Account</h2>
        <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary-900 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-black text-base">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div>
              <p className="font-black text-slate-900">{user?.name}</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{user?.email}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
            Verified
          </span>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-3 mb-8">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">Preferences</h2>
        <SettingRow icon={Bell} title="Notifications" description="Match alerts, welcome messages, and updates">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Enabled</span>
            <div className="h-5 w-9 bg-emerald-500 rounded-full flex items-center px-0.5 cursor-pointer">
              <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm" />
            </div>
          </div>
        </SettingRow>
      </div>

      {/* Security */}
      <div className="space-y-3 mb-8">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">Security</h2>
        <SettingRow icon={Lock} title="Change Password" description="Update your login credentials" />
        <SettingRow icon={Shield} title="Account Security" description={`Account role: ${user?.role || 'Employee'}`} />
      </div>

      {/* Info box */}
      <div className="bg-primary-50 border border-primary-100 rounded-[1.5rem] p-6">
        <p className="text-sm text-primary-800 font-medium leading-relaxed">
          <span className="font-black">Note:</span> Full settings management (password change, notification preferences) will be available in the next update. Contact support if you need immediate assistance.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;

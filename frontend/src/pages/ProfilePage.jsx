import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, Clock, ShieldCheck, Building, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="h-9 w-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 text-slate-400">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-slate-900 font-bold text-sm mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently Joined';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage your account and personal details.</p>
        </div>
        <Link
          to="/transfers/create"
          className="flex items-center gap-2 bg-primary-900 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-primary-900/20 transition-all active:scale-95"
        >
          <Edit3 className="h-4 w-4" />
          New Request
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-36 bg-primary-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)'}} />
        </div>

        {/* Avatar & Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex items-end justify-between -mt-10 mb-6">
            <div className="p-1 bg-white rounded-2xl shadow-lg border-4 border-white">
              <div className="h-20 w-20 bg-primary-900 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-black text-white">{initials}</span>
              </div>
            </div>
            <span className="mb-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200">
              ✓ Verified
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {user?.name}
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">Railway Employee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-7">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" /> Contact Information
          </h3>
          <div className="space-y-5">
            <InfoRow icon={Mail} label="Email Address" value={user?.email} />
            <InfoRow icon={Phone} label="Mobile Number" value={user?.mobile} />
          </div>
        </div>

        <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-7">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Building className="h-3.5 w-3.5" /> Account Details
          </h3>
          <div className="space-y-5">
            <InfoRow icon={User} label="Account Role" value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Employee'} />
            <InfoRow icon={Clock} label="Member Since" value={memberSince} />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-primary-50 border border-primary-100 rounded-[1.5rem] p-6">
        <p className="text-sm text-primary-800 font-medium leading-relaxed">
          <span className="font-black">Note:</span> Job details like Designation, Zone, and Station are provided when creating a Transfer Request. This keeps your profile flexible and accurate per request.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;

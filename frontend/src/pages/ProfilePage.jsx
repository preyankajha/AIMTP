import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in relative">
      
      {/* Background Decorative blob */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-primary-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none"></div>

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your account and personal details.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative z-10 p-1">
        
        {/* Profile Header Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-700 to-primary-900 rounded-t-xl relative">
          <div className="absolute -bottom-12 left-8 p-1.5 bg-white rounded-full shadow-lg">
            <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center border-4 border-white">
              <span className="text-4xl font-extrabold text-primary-700">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {user?.name}
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </h2>
              <p className="text-slate-500 font-medium mt-1 uppercase tracking-wider text-sm">
                Railway Employee
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-200 shadow-sm">
              Verified User
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Email Address</span>
                  </div>
                  <p className="text-slate-900 font-medium pl-6">{user?.email}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Mobile Number</span>
                  </div>
                  <p className="text-slate-900 font-medium pl-6">{user?.mobile}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">
                Account Security
              </h3>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Role</span>
                  </div>
                  <p className="text-slate-900 font-medium pl-6 capitalize">{user?.role || 'Employee'}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Member Since</span>
                  </div>
                  <p className="text-slate-900 font-medium pl-6">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }) : 'Recently Joined'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center">
              Note: Job details like Designation, Zone, and Station are now provided directly when creating a Transfer Request. 
              This keeps your profile simple and allows you to submit accurate details per request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

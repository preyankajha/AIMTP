import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Train, ArrowRight, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)'}} />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl text-primary-950">
            <Train className="h-6 w-6" />
          </div>
          <span className="text-white font-black text-lg tracking-tight">All India Mutual Transfer Portal</span>
        </div>

        <div className="relative z-10">
          <blockquote className="text-white/80 text-xl font-medium leading-relaxed mb-6">
            "Connect with railway employees across all zones and divisions for a seamless mutual transfer experience."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-primary-950 font-black text-sm">RT</div>
            <div>
              <p className="text-white font-bold text-sm">RailTransfer Portal</p>
              <p className="text-white/40 text-xs font-medium">Official Platform</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            {[{ val: '500+', label: 'Transfers' }, { val: '18', label: 'Railway Zones' }, { val: '24/7', label: 'Active Matching' }].map(s => (
              <div key={s.label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-2xl font-black text-white">{s.val}</p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-100 rounded-full blur-[120px] opacity-40 pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-100 rounded-full blur-[100px] opacity-30 pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="bg-primary-900 p-2 rounded-xl text-white">
              <Train className="h-5 w-5" />
            </div>
            <span className="font-black text-primary-900 text-base">All India Mutual Transfer Portal</span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Welcome back</h1>
          <p className="text-slate-500 font-medium mb-8">Sign in to manage your transfer requests.</p>

          <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                <span className="shrink-0 text-red-500">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 placeholder-slate-400 transition-all"
                  placeholder="name@railnet.gov.in"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 placeholder-slate-400 transition-all pr-11"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary-900 hover:bg-slate-900 text-white font-black rounded-xl shadow-lg shadow-primary-900/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-black text-primary-700 hover:text-primary-900 hover:underline transition-all">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

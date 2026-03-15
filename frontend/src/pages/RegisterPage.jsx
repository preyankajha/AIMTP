import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Repeat, ArrowRight, ShieldCheck, UserCheck, Mail, Lock, User, Phone, Eye, EyeOff, Briefcase, MapPin, Building, Globe, ChevronRight } from 'lucide-react';

const InputField = ({ name, label, value, onChange, type = 'text', placeholder = '', icon: Icon }) => (
  <div>
    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2" htmlFor={name}>
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <input
        id={name}
        name={name}
        type={type}
        required
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 placeholder-slate-400 transition-all"
        style={Icon ? { paddingLeft: '2.5rem' } : {}}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)'}} />
        
        <Link to="/" className="relative z-10 flex items-center gap-3 group/logo">
          <div className="bg-[#05D38A] p-2.5 rounded-xl text-white shadow-lg shadow-[#05D38A]/20 transition-transform group-hover/logo:scale-105">
            <Repeat className="h-6 w-6" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">All India Mutual Transfer Portal</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white leading-tight mb-4">Join thousands of employees finding their ideal transfer partner.</h2>
          <p className="text-white/50 font-medium leading-relaxed">Create an account to post your transfer request and instantly get matched with compatible employees across India.</p>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            {[{ val: '500+', label: 'Transfers' }, { val: '18+', label: 'Regions' }, { val: '24/7', label: 'Matching' }].map(s => (
              <div key={s.label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-2xl font-black text-white">{s.val}</p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-100 rounded-full blur-[120px] opacity-40 pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-100 rounded-full blur-[100px] opacity-30 pointer-events-none -translate-x-1/2 translate-y-1/2" />

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <Link to="/" className="mb-8 lg:hidden flex items-center gap-3 group/logo">
            <div className="bg-primary-900 p-2 rounded-xl text-white transition-transform group-hover/logo:scale-105">
              <Repeat className="h-5 w-5" />
            </div>
            <span className="font-black text-primary-900 text-base">All India Mutual Transfer Portal</span>
          </Link>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Create an account</h1>
          <p className="text-slate-500 font-medium mb-8">Join the All India Mutual Transfer Portal to get started.</p>

          <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 mb-6">
                <span className="shrink-0 text-red-500">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField name="name" label="Full Name" value={formData.name} onChange={handleChange} placeholder="John Doe" icon={User} />
                <InputField name="mobile" label="Mobile Number" value={formData.mobile} onChange={handleChange} type="tel" placeholder="9876543210" icon={Phone} />
                <div className="md:col-span-2">
                  <InputField name="email" label="Email Address" value={formData.email} onChange={handleChange} type="email" placeholder="name@railnet.gov.in" icon={Mail} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      name="password" type={showPassword ? 'text' : 'password'} required
                      className="w-full px-4 py-3 pl-10 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 placeholder-slate-400 transition-all"
                      placeholder="••••••••" value={formData.password} onChange={handleChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary-900 hover:bg-slate-900 text-white font-black rounded-xl shadow-lg shadow-primary-900/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Create Account</>}
              </button>

              <p className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="font-black text-primary-700 hover:text-primary-900 hover:underline">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

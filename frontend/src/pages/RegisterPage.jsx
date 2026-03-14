import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
  });
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
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render inputs cleanly
  const renderInput = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-1.5" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none placeholder-slate-400"
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Decorative backgrounds */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 relative z-10 animate-fade-in border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
            <UserPlus className="h-7 w-7" />
          </div>
          <h2 className="mt-8 text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join the Railway Mutual Transfer Platform
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm animate-fade-in">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="md:col-span-2 border-b border-slate-100 pb-2 mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Details</h3>
            </div>
            {renderInput('name', 'Full Name', 'text', 'John Doe')}
            {renderInput('email', 'Email Address', 'email', 'name@example.com')}
            {renderInput('mobile', 'Mobile Number', 'tel', '9876543210')}
            {renderInput('password', 'Password', 'password', '••••••••')}
          </div>

          <div className="pt-4">
             <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </div>
          
          <p className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-all">
              Sign in instead
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

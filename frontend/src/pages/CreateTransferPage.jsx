import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransfer } from '../services/transferService';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, MapPin, Send } from 'lucide-react';

const CreateTransferPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Pre-fill current location from user profile (removed as they are no longer in user model)
  const [formData, setFormData] = useState({
    designation: '',
    currentZone: '',
    currentDivision: '',
    currentStation: '',
    desiredZone: '',
    desiredDivision: '',
    desiredStation: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await createTransfer(formData);
      setSuccess(`Request created successfully! ${result.matchesFound > 0 ? `Good news: ${result.matchesFound} matches found instantly!` : 'We will notify you when a match is found.'}`);
      setTimeout(() => navigate('/transfers/my'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transfer request.');
      setLoading(false);
    }
  };

  const LocationInput = ({ label, name, value, type }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        required
        className={`appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition-shadow
          ${type === 'current' ? 'bg-slate-50 text-slate-700 focus:ring-slate-500 focus:border-slate-500' : 'bg-white focus:ring-primary-500 focus:border-primary-500'}`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">New Transfer Request</h1>
        <p className="text-slate-600 mt-2">Submit your desired posting location to find a mutual transfer partner.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 mb-0 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6 mb-0 rounded-md">
            <p className="text-sm text-green-700 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div className="max-w-md mx-auto">
            <LocationInput label="Your Designation" name="designation" value={formData.designation} type="current" />
            <p className="text-xs text-slate-500 mt-1 italic pl-1">e.g. Station Master, Loco Pilot, ASM, etc.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative">
            
            {/* Current Location */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
                <MapPin className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-bold text-slate-800">Current Posting</h2>
              </div>
              <div className="space-y-4">
                <LocationInput label="Current Station code" name="currentStation" value={formData.currentStation} type="current" />
                <LocationInput label="Current Division" name="currentDivision" value={formData.currentDivision} type="current" />
                <LocationInput label="Current Railway Zone" name="currentZone" value={formData.currentZone} type="current" />
              </div>
            </div>

            {/* Visual Arrow (Hidden on mobile) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-sm border border-slate-100">
              <ArrowRight className="h-6 w-6 text-primary-400" />
            </div>

            {/* Desired Location */}
            <div className="bg-blue-50/30 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-6 border-b border-blue-100 pb-3">
                <MapPin className="h-5 w-5 text-primary-500" />
                <h2 className="text-lg font-bold text-slate-800">Desired Posting</h2>
              </div>
              <div className="space-y-4">
                <LocationInput label="Desired Station code" name="desiredStation" value={formData.desiredStation} type="desired" />
                <LocationInput label="Desired Division" name="desiredDivision" value={formData.desiredDivision} type="desired" />
                <LocationInput label="Desired Railway Zone" name="desiredZone" value={formData.desiredZone} type="desired" />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/transfers/my')}
              className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransferPage;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTransfer, getTransferById, updateTransfer } from '../services/transferService';
import { useAuth } from '../hooks/useAuth';
import { ArrowRight, MapPin, Send, Building2, Briefcase } from 'lucide-react';

// Data imports
import { railwayData } from '../data/zonesData';
import { railwayDepartments } from '../data/railwayDepartments';
import { modeOfSelection } from '../data/modeOfSelection';
import { categories } from '../data/categories';

const SelectInput = ({ label, name, value, options, placeholder, icon: Icon, onChange, otherValue, onOtherChange }) => {
  const isOtherSelected = value === 'Other' || value === 'OTHER';
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-700">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />}
        <select
          name={name}
          value={value}
          onChange={onChange}
          required
          className={`block w-full ${Icon ? 'pl-10' : 'px-4'} pr-10 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm appearance-none transition-all`}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
          {!options.includes('Other') && !options.includes('OTHER') && name !== 'modeOfSelection' && (
             <option value="Other">Other</option>
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
        </div>
      </div>
      
      {isOtherSelected && (
        <div className="animate-slide-down">
          <input
            type="text"
            name={name}
            value={otherValue}
            onChange={onOtherChange}
            required
            placeholder={`Enter specific ${label.toLowerCase()}`}
            className="mt-2 block w-full px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      )}
    </div>
  );
};

const CreateTransferPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    department: '',
    subDepartment: '',
    designation: '',
    modeOfSelection: '',
    currentZone: '',
    currentDivision: '',
    currentStation: '',
    desiredZone: '',
    desiredDivision: '',
    desiredStation: '',
    basicPay: '',
    category: '',
  });

  // States for "Other" custom inputs
  const [otherInputs, setOtherInputs] = useState({
    department: '',
    subDepartment: '',
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
  const [fetching, setFetching] = useState(isEditMode);

  // Derived options for cascading dropdowns
  const deptList = Object.keys(railwayDepartments);
  const subDeptList = formData.department && railwayDepartments[formData.department] 
    ? Object.keys(railwayDepartments[formData.department].subDepartments) 
    : [];
  const designationList = formData.department && formData.subDepartment && railwayDepartments[formData.department]?.subDepartments[formData.subDepartment]
    ? railwayDepartments[formData.department].subDepartments[formData.subDepartment]
    : [];

  const zoneList = Object.keys(railwayData);
  const currentDivList = formData.currentZone && railwayData[formData.currentZone]
    ? Object.keys(railwayData[formData.currentZone].divisions)
    : [];
  const currentStationList = formData.currentZone && formData.currentDivision && railwayData[formData.currentZone]?.divisions[formData.currentDivision]
    ? railwayData[formData.currentZone].divisions[formData.currentDivision]
    : [];

  const desiredDivList = formData.desiredZone && railwayData[formData.desiredZone]
    ? Object.keys(railwayData[formData.desiredZone].divisions)
    : [];
  const desiredStationList = formData.desiredZone && formData.desiredDivision && railwayData[formData.desiredZone]?.divisions[formData.desiredDivision]
    ? railwayData[formData.desiredZone].divisions[formData.desiredDivision]
    : [];

  useEffect(() => {
    if (isEditMode) {
      const fetchTransfer = async () => {
        try {
          const data = await getTransferById(id);
          
          // Reconstruct form state and handle "Other" logic
          const newFormData = { ...formData };
          const newOtherInputs = { ...otherInputs };
          
          const deptOptions = Object.keys(railwayDepartments);
          if (deptOptions.includes(data.department)) {
            newFormData.department = data.department;
          } else {
            newFormData.department = 'Other';
            newOtherInputs.department = data.department;
          }

          // Trigger logic for sub-department
          const subDepts = newFormData.department !== 'Other' 
            ? Object.keys(railwayDepartments[newFormData.department].subDepartments)
            : [];
          if (subDepts.includes(data.subDepartment)) {
            newFormData.subDepartment = data.subDepartment;
          } else {
            newFormData.subDepartment = 'Other';
            newOtherInputs.subDepartment = data.subDepartment;
          }

          // Trigger logic for designation
          const desigs = (newFormData.department !== 'Other' && newFormData.subDepartment !== 'Other')
            ? railwayDepartments[newFormData.department].subDepartments[newFormData.subDepartment]
            : [];
          if (desigs.includes(data.designation)) {
            newFormData.designation = data.designation;
          } else {
            newFormData.designation = 'Other';
            newOtherInputs.designation = data.designation;
          }

          // Handle Locations in similar way
          const zoneOptions = Object.keys(railwayData);
          
          // Current
          if (zoneOptions.includes(data.currentZone)) {
            newFormData.currentZone = data.currentZone;
            const divs = Object.keys(railwayData[data.currentZone].divisions);
            if (divs.includes(data.currentDivision)) {
              newFormData.currentDivision = data.currentDivision;
              const stations = railwayData[data.currentZone].divisions[data.currentDivision];
              if (stations.includes(data.currentStation)) {
                newFormData.currentStation = data.currentStation;
              } else {
                newFormData.currentStation = 'Other';
                newOtherInputs.currentStation = data.currentStation;
              }
            } else {
              newFormData.currentDivision = 'Other';
              newOtherInputs.currentDivision = data.currentDivision;
              newFormData.currentStation = 'Other';
              newOtherInputs.currentStation = data.currentStation;
            }
          } else {
            newFormData.currentZone = 'Other';
            newOtherInputs.currentZone = data.currentZone;
            newFormData.currentDivision = 'Other';
            newOtherInputs.currentDivision = data.currentDivision;
            newFormData.currentStation = 'Other';
            newOtherInputs.currentStation = data.currentStation;
          }

          // Desired
          if (zoneOptions.includes(data.desiredZone)) {
            newFormData.desiredZone = data.desiredZone;
            const divs = Object.keys(railwayData[data.desiredZone].divisions);
            if (divs.includes(data.desiredDivision)) {
              newFormData.desiredDivision = data.desiredDivision;
              const stations = railwayData[data.desiredZone].divisions[data.desiredDivision];
              if (stations.includes(data.desiredStation)) {
                newFormData.desiredStation = data.desiredStation;
              } else {
                newFormData.desiredStation = 'Other';
                newOtherInputs.desiredStation = data.desiredStation;
              }
            } else {
              newFormData.desiredDivision = 'Other';
              newOtherInputs.desiredDivision = data.desiredDivision;
              newFormData.desiredStation = 'Other';
              newOtherInputs.desiredStation = data.desiredStation;
            }
          } else {
            newFormData.desiredZone = 'Other';
            newOtherInputs.desiredZone = data.desiredZone;
            newFormData.desiredDivision = 'Other';
            newOtherInputs.desiredDivision = data.desiredDivision;
            newFormData.desiredStation = 'Other';
            newOtherInputs.desiredStation = data.desiredStation;
          }

          newFormData.modeOfSelection = data.modeOfSelection;
          newFormData.basicPay = data.basicPay || '';
          newFormData.category = data.category || '';

          setFormData(newFormData);
          setOtherInputs(newOtherInputs);
          setFetching(false);
        } catch (err) {
          setError('Failed to load transfer request details.');
          setFetching(false);
        }
      };
      fetchTransfer();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset child dropdowns when parent changes
    if (name === 'department') setFormData(prev => ({ ...prev, subDepartment: '', designation: '' }));
    if (name === 'subDepartment') setFormData(prev => ({ ...prev, designation: '' }));
    
    if (name === 'currentZone') setFormData(prev => ({ ...prev, currentDivision: '', currentStation: '' }));
    if (name === 'currentDivision') setFormData(prev => ({ ...prev, currentStation: '' }));
    
    if (name === 'desiredZone') setFormData(prev => ({ ...prev, desiredDivision: '', desiredStation: '' }));
    if (name === 'desiredDivision') setFormData(prev => ({ ...prev, desiredStation: '' }));
  };

  const handleOtherChange = (e) => {
    setOtherInputs({ ...otherInputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Prepare final data by checking for "Other" values
    const finalData = { ...formData };
    Object.keys(finalData).forEach(key => {
      if (finalData[key] === 'Other' || finalData[key] === 'OTHER') {
        finalData[key] = otherInputs[key];
      }
    });

    try {
      let result;
      if (isEditMode) {
        result = await updateTransfer(id, finalData);
        setSuccess(`Request updated successfully!`);
      } else {
        result = await createTransfer(finalData);
        setSuccess(`Request created successfully! ${result.matchesFound > 0 ? `Good news: ${result.matchesFound} matches found instantly!` : 'We will notify you when a match is found.'}`);
      }
      setTimeout(() => navigate('/transfers/my'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} transfer request.`);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isEditMode ? 'Edit Transfer Request' : 'New Transfer Request'}
        </h1>
        <p className="text-slate-600 mt-2">
          {isEditMode ? 'Update your preferences to find the best match.' : 'Provide your details to find your ideal mutual transfer partner.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 mb-0 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6 mb-0 rounded-lg">
            <p className="text-sm text-green-700 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-12">
          
          {/* Section 1: Professional Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Briefcase className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Professional Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SelectInput 
                label="Department" 
                name="department" 
                value={formData.department} 
                options={deptList} 
                onChange={handleChange}
                otherValue={otherInputs.department}
                onOtherChange={handleOtherChange}
              />
              <SelectInput 
                label="Sub-Department" 
                name="subDepartment" 
                value={formData.subDepartment} 
                options={subDeptList} 
                onChange={handleChange}
                otherValue={otherInputs.subDepartment}
                onOtherChange={handleOtherChange}
              />
              <SelectInput 
                label="Designation" 
                name="designation" 
                value={formData.designation} 
                options={designationList} 
                onChange={handleChange}
                otherValue={otherInputs.designation}
                onOtherChange={handleOtherChange}
              />
              <SelectInput 
                label="Mode of Selection" 
                name="modeOfSelection" 
                value={formData.modeOfSelection} 
                options={modeOfSelection} 
                onChange={handleChange}
                otherValue={otherInputs.modeOfSelection}
                onOtherChange={handleOtherChange}
              />
              <div className="space-y-2">
                <label className="block text-sm font-black text-slate-700">Basic Pay (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    name="basicPay"
                    value={formData.basicPay}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 45000"
                    className="block w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all font-medium"
                  />
                </div>
              </div>
              <SelectInput 
                label="Category" 
                name="category" 
                value={formData.category} 
                options={categories} 
                onChange={handleChange}
                placeholder="Select Category"
              />
            </div>
          </div>

          {/* Section 2: Location Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
            
            {/* Current Posting */}
            <div className="space-y-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-800">Current Posting</h3>
              </div>
              
              <div className="space-y-4">
                <SelectInput 
                  label="Railway Zone" 
                  name="currentZone" 
                  value={formData.currentZone} 
                  options={zoneList} 
                  onChange={handleChange}
                  otherValue={otherInputs.currentZone}
                  onOtherChange={handleOtherChange}
                />
                <SelectInput 
                  label="Division" 
                  name="currentDivision" 
                  value={formData.currentDivision} 
                  options={currentDivList} 
                  onChange={handleChange}
                  otherValue={otherInputs.currentDivision}
                  onOtherChange={handleOtherChange}
                />
                <SelectInput 
                  label="Station Code" 
                  name="currentStation" 
                  value={formData.currentStation} 
                  options={currentStationList} 
                  onChange={handleChange}
                  otherValue={otherInputs.currentStation}
                  onOtherChange={handleOtherChange}
                />
              </div>
            </div>

            {/* Visual Arrow */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-white p-3 rounded-full shadow-lg border border-slate-100 transform hover:scale-110 transition-transform">
                <ArrowRight className="h-6 w-6 text-primary-600" />
              </div>
            </div>

            {/* Desired Posting */}
            <div className="space-y-6 p-6 bg-primary-50/30 rounded-2xl border border-primary-100">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-bold text-slate-800">Desired Posting</h3>
              </div>
              
              <div className="space-y-4">
                <SelectInput 
                  label="Railway Zone" 
                  name="desiredZone" 
                  value={formData.desiredZone} 
                  options={zoneList} 
                  onChange={handleChange}
                  otherValue={otherInputs.desiredZone}
                  onOtherChange={handleOtherChange}
                />
                <SelectInput 
                  label="Division" 
                  name="desiredDivision" 
                  value={formData.desiredDivision} 
                  options={desiredDivList} 
                  onChange={handleChange}
                  otherValue={otherInputs.desiredDivision}
                  onOtherChange={handleOtherChange}
                />
                <SelectInput 
                  label="Station Code" 
                  name="desiredStation" 
                  value={formData.desiredStation} 
                  options={desiredStationList} 
                  onChange={handleChange}
                  otherValue={otherInputs.desiredStation}
                  onOtherChange={handleOtherChange}
                />
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/transfers/my')}
              className="w-full sm:w-auto px-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-xl shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {isEditMode ? 'Save Changes' : 'Submit Request'}
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

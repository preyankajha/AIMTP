import { MapPin, Building, ArrowRight, Activity, CalendarDays, Trash2, Briefcase, Info, PencilLine, Phone, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const TransferCard = ({ transfer, onDelete, isOwnRequest = false, isPublic = false }) => {
  const navigate = useNavigate();
  const isMatched = transfer.status === 'matched';
  const statusColor = isMatched ? 'bg-green-100 text-green-800 border-green-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
  
  const getCategoryColor = (cat) => {
    switch (cat?.toUpperCase()) {
      case 'GENERAL': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'SC': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'ST': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OBC': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'EWS': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };
  
  // Public-specific layout
  if (isPublic) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
        <div className="p-5 flex-1">
          {/* Header: Name and Status */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                {transfer.userId?.name?.split(' ')[0]} {transfer.userId?.name?.split(' ')[1]?.charAt(0)}.
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold uppercase">{transfer.designation}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                Active
              </span>
              {transfer.category && (
                <span className={`px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-tighter ${getCategoryColor(transfer.category)}`}>
                  {transfer.category}
                </span>
              )}
            </div>
          </div>

          {/* Route: FROM -> TO */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative mb-4">
            <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3">
              {/* From */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">From</span>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{transfer.currentStation}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{transfer.currentZone}</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="relative">
                <div className="bg-white p-1.5 rounded-full shadow-sm border border-slate-100">
                  <ArrowRight className="h-4 w-4 text-primary-500" />
                </div>
              </div>

              {/* To */}
              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">To</span>
                <div className="flex items-start justify-end gap-2">
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{transfer.desiredStation}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{transfer.desiredZone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New: Basic Pay and Dept Info for Public View */}
          <div className="flex flex-wrap gap-3 mb-4 mt-2">
            {transfer.department && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-primary-100/50">
                <Briefcase className="h-3 w-3" />
                {transfer.department}
              </div>
            )}
            {transfer.basicPay && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black tracking-wider border border-slate-100">
                <span>₹ {Number(transfer.basicPay).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Blurred Contact */}
          <div className="flex items-center gap-3 py-2 px-1">
            <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="h-2 w-24 bg-slate-200 rounded-full blur-[3px] opacity-40 mb-1"></div>
              <div className="h-2 w-16 bg-slate-200 rounded-full blur-[3px] opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 pt-0 mt-auto">
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            <Lock className="h-4 w-4 opacity-70" />
            Login to Contact
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-shadow duration-300 hover:shadow-md`}>
      {/* Header section */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor} uppercase tracking-wider`}>
              {transfer.status}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {format(new Date(transfer.createdAt), 'MMM dd, yyyy')}
            </span>
            {transfer.category && (
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${getCategoryColor(transfer.category)}`}>
                {transfer.category}
              </span>
            )}
          </div>
          
          {!isOwnRequest && transfer.userId && (
            <div className="mt-2 text-sm font-medium text-slate-900 flex flex-col">
              <span className="text-base">{transfer.userId.name}</span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                <span className="text-xs text-primary-600 font-bold px-1.5 py-0.5 bg-primary-50 rounded">
                  {transfer.department}
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  {transfer.designation}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {isOwnRequest && !isMatched && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => navigate(`/transfers/edit/${transfer._id}`)}
              className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors"
              title="Edit Request"
            >
              <PencilLine className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(transfer._id)}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              title="Cancel Request"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Body section */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative">
          
          {/* Current Location */}
          <div className="flex-1 w-full p-4 rounded-lg bg-slate-50 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Posting</h4>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 text-lg">
                  {transfer.currentStation}
                </p>
                <div className="flex flex-col text-xs text-slate-500 mt-1 gap-0.5">
                  {isOwnRequest && (
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-primary-600 font-bold px-2 py-0.5 bg-primary-50 rounded border border-primary-100">{transfer.department}</span>
                      <span className="text-slate-700 font-semibold">{transfer.designation}</span>
                    </div>
                  )}
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" /> {transfer.currentDivision + ' Div'}
                  </span>
                  <span>{transfer.currentZone + ' Zone'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center justify-center shrink-0">
            <div className="h-0.5 w-12 bg-slate-200"></div>
            <ArrowRight className="h-6 w-6 text-slate-400 bg-white absolute z-10" />
          </div>

          <div className="flex md:hidden flex-col items-center justify-center h-8 w-full">
            <div className="w-0.5 h-full bg-slate-200"></div>
          </div>

          {/* Desired Location */}
          <div className="flex-1 w-full p-4 rounded-lg bg-blue-50/50 border border-blue-100/50">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Desired Posting</h4>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900 text-lg">
                  {transfer.desiredStation}
                </p>
                <div className="flex flex-col text-xs text-slate-500 mt-1 gap-0.5">
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" /> {transfer.desiredDivision + ' Div'}
                  </span>
                  <span>{transfer.desiredZone + ' Zone'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Additional Details Footer */}
        {(transfer.modeOfSelection || transfer.subDepartment) && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4">
            {transfer.subDepartment && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{transfer.subDepartment}</span>
              </div>
            )}
            {transfer.modeOfSelection && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Info className="h-3.5 w-3.5 text-slate-400" />
                <span>Selected via: </span>
                <span className="font-bold text-slate-700">{transfer.modeOfSelection}</span>
              </div>
            )}
            {transfer.basicPay && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
                <span className="font-black text-slate-400 uppercase tracking-widest text-[9px]">Basic Pay</span>
                <span className="font-extrabold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-lg border border-primary-100">₹ {Number(transfer.basicPay).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferCard;

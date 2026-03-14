import { MapPin, Building, ArrowRight, Activity, CalendarDays, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const TransferCard = ({ transfer, onDelete, isOwnRequest = false }) => {
  const isMatched = transfer.status === 'matched';
  const statusColor = isMatched ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
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
          </div>
          
          {!isOwnRequest && transfer.userId && (
            <div className="mt-2 text-sm font-medium text-slate-900 flex flex-col">
              <span className="text-base">{transfer.userId.name}</span>
              <span className="text-xs text-slate-500 font-normal">{transfer.designation}</span>
            </div>
          )}
        </div>
        
        {isOwnRequest && !isMatched && (
          <button 
            onClick={() => onDelete(transfer._id)}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            title="Cancel Request"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
                <p className="font-semibold text-slate-900 text-lg">{transfer.currentStation}</p>
                <div className="flex flex-col text-xs text-slate-500 mt-1 gap-0.5">
                  {isOwnRequest && <span className="text-primary-600 font-bold mb-1">{transfer.designation}</span>}
                  <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {transfer.currentDivision} Div</span>
                  <span>{transfer.currentZone} Zone</span>
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
                <p className="font-semibold text-slate-900 text-lg">{transfer.desiredStation}</p>
                <div className="flex flex-col text-xs text-slate-500 mt-1 gap-0.5">
                  <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {transfer.desiredDivision} Div</span>
                  <span>{transfer.desiredZone} Zone</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TransferCard;

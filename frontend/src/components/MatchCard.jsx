import { useState } from 'react';
import { Phone, MapPin, User, ArrowRightLeft, Eye } from 'lucide-react';
import { revealContact } from '../services/matchService';

const MatchCard = ({ match, onContactRevealed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleReveal = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await revealContact(match.matchId);
      if (onContactRevealed) {
        onContactRevealed(match.matchId, result.partnerMobile);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reveal contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden relative group">
      {/* Top Banner indicating match */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 font-medium">
          <ArrowRightLeft className="h-4 w-4" />
          <span>Perfect Match Found</span>
        </div>
      </div>

      <div className="p-6">
        {/* Partner Info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">{match.partner.name}</h3>
            <p className="text-sm font-medium text-primary-600">{match.partner.designation}</p>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <span>{match.partner.division} Div</span>
              <span>•</span>
              <span>{match.partner.railwayZone} Zone</span>
            </div>
          </div>
        </div>

        {/* Swap Visualization */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-center w-5/12">
              <span className="text-xs text-slate-400 block mb-1">They are at</span>
              <div className="font-semibold text-slate-800 flex items-center justify-center gap-1">
                <MapPin className="h-4 w-4 text-red-500" />
                {match.partnerRequest.currentStation}
              </div>
            </div>
            
            <div className="w-2/12 flex justify-center text-primary-400 opacity-60">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            
            <div className="text-center w-5/12">
              <span className="text-xs text-green-600/80 block mb-1">You want to go</span>
              <div className="font-semibold text-slate-800 flex items-center justify-center gap-1">
                <MapPin className="h-4 w-4 text-green-500" />
                {match.myRequest.desiredStation}
              </div>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-4 border-t border-slate-100 pt-4 pb-2">
          {error && <p className="text-sm text-red-500 mb-3 text-center">{error}</p>}
          
          {match.contactRevealed && match.partner.mobile ? (
            <div className="flex items-center justify-center gap-3 bg-green-50 text-green-800 py-3 rounded-lg border border-green-200">
              <Phone className="h-5 w-5 text-green-600 drop-shadow-sm" />
              <a href={`tel:${match.partner.mobile}`} className="font-bold text-lg tracking-wide hover:underline cursor-pointer">
                {match.partner.mobile}
              </a>
            </div>
          ) : (
            <button
              onClick={handleReveal}
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group/btn"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
              ) : (
                <>
                  <Eye className="h-4 w-4 text-slate-300 group-hover/btn:text-white transition-colors" />
                  Reveal Contact Number
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;

import { useState, useEffect } from 'react';
import { searchTransfers } from '../services/transferService';
import TransferCard from '../components/TransferCard';
import { Search, MapPin, Building, Filter, X, Building2 } from 'lucide-react';

const SearchTransfersPage = () => {
  const [params, setParams] = useState({ sector: 'Railway', zone: '', division: '', station: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { handleSearch(null, true); }, []);

  const handleChange = (e) => setParams({ ...params, [e.target.name]: e.target.value });

  const handleSearch = async (e, initial = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchTransfers(params);
      setResults(data.transfers || data);
      if (!initial) setHasSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transfer requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setParams({ sector: 'Railway', zone: '', division: '', station: '' });
    setHasSearched(false);
    handleSearch(null, true);
  };

  const hasActiveFilters = params.sector !== 'Railway' || params.zone || params.division || params.station;

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 placeholder-slate-400 transition-all appearance-none";

  return (
    <div className="animate-fade-in pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Search Directory</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Browse active transfer requests across India</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Panel */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-primary-50 text-primary-700 p-1.5 rounded-lg">
                  <Filter className="h-4 w-4" />
                </div>
                <h2 className="text-base font-black text-slate-900">Filters</h2>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1 transition-colors">
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  <Building2 className="h-3 w-3" /> Working Sector
                </label>
                <div className="relative">
                  <select name="sector" value={params.sector} onChange={handleChange} className={inputClass} style={{ paddingRight: '2.5rem' }}>
                    <option value="">All Sectors</option>
                    <option value="Railway">Indian Railways</option>
                    <option value="Medical">Medical Providers</option>
                    <option value="Education">Education / Teachers</option>
                    <option value="Defense">Defense / Paramilitary</option>
                    <option value="Banking">Banking Sector</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  <MapPin className="h-3 w-3" /> Region/Zone
                </label>
                <input type="text" name="zone" value={params.zone} onChange={handleChange} placeholder="e.g. Northern Region" className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  <Building className="h-3 w-3" /> Division
                </label>
                <input type="text" name="division" value={params.division} onChange={handleChange} placeholder="e.g. Delhi" className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  <MapPin className="h-3 w-3" /> Station Code
                </label>
                <input type="text" name="station" value={params.station} onChange={handleChange} placeholder="e.g. NDLS" className={inputClass} />
              </div>

              <div className="pt-2">
                <button
                  type="submit" disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-primary-900 hover:bg-slate-900 text-white font-black rounded-xl shadow-lg shadow-primary-900/20 transition-all active:scale-95 text-sm"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <><Search className="h-4 w-4" /> Search</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-6">{error}</div>
          )}

          {!loading && results.length > 0 && (
            <div className="mb-6 bg-white border border-slate-100 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
              <span className="text-sm font-bold text-slate-700">
                {results.length} active request{results.length !== 1 && 's'}
                {hasSearched && ' matching your filters'}
              </span>
              {hasSearched && (
                <button onClick={clearFilters} className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors">
                  Show all
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-20 text-center">
              <div className="animate-spin h-10 w-10 border-2 border-primary-100 border-t-primary-600 rounded-full mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-sm">Fetching transfer requests...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-16 text-center">
              <div className="h-20 w-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-9 w-9 text-slate-200" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">No Requests Found</h2>
              <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                {hasSearched
                  ? "No transfer requests match your filters. Try adjusting your search criteria."
                  : "There are currently no active transfer requests in the system."}
              </p>
              {hasSearched && (
                <button onClick={clearFilters} className="mt-8 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm rounded-xl transition-colors">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {results.map((req) => (
                <TransferCard key={req._id} transfer={req} isOwnRequest={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTransfersPage;

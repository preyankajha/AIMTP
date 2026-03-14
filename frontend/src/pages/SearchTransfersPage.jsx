import { useState, useEffect } from 'react';
import { searchTransfers } from '../services/transferService';
import TransferCard from '../components/TransferCard';
import { Search, MapPin, Building, Filter, Loader2, Info } from 'lucide-react';

const SearchTransfersPage = () => {
  const [params, setParams] = useState({
    zone: '',
    division: '',
    station: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    handleSearch(new Event('submit'), true);
  }, []);

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e, initial = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchTransfers(params);
      setResults(data.transfers || data);
      setHasSearched(!initial);
    } catch (err) {
      setError('Failed to fetch transfer requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setParams({ zone: '', division: '', station: '' });
    handleSearch(null, true);
    setHasSearched(false);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12 relative">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Search Directory</h1>
        <p className="text-slate-500 mt-2 text-lg">Browse active transfer requests across Indian Railways.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Filter className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-bold text-slate-800">Filters</h2>
            </div>
            
            <form onSubmit={handleSearch} className="space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> Zone
                </label>
                <input
                  type="text"
                  name="zone"
                  value={params.zone}
                  onChange={handleChange}
                  placeholder="e.g. Northern Railway"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Building className="h-3.5 w-3.5" /> Division
                </label>
                <input
                  type="text"
                  name="division"
                  value={params.division}
                  onChange={handleChange}
                  placeholder="e.g. Delhi"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> Station/Lobby
                </label>
                <input
                  type="text"
                  name="station"
                  value={params.station}
                  onChange={handleChange}
                  placeholder="e.g. NDLS"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search Requests
                </button>
                
                {(params.zone || params.division || params.station) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1">
          {error && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
               <p className="text-sm text-red-700 font-medium">{error}</p>
             </div>
          )}

          {!loading && results.length > 0 && (
            <div className="mb-4 flex justify-between items-center text-sm font-medium text-slate-500 bg-slate-100 py-2 px-4 rounded-lg inline-block w-full">
              Showing {results.length} active request{results.length !== 1 && 's'}
              {hasSearched && ' matching your filters'}
            </div>
          )}

          {loading ? (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center h-64 flex flex-col items-center justify-center">
               <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
               <p className="text-slate-500 font-medium">Fetching transfer requests...</p>
             </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
              <div className="h-20 w-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Requests Found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                {hasSearched 
                  ? "We couldn't find any transfer requests matching your filters. Try adjusting your search criteria."
                  : "There are currently no active transfer requests in the system."}
              </p>
              {hasSearched && (
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
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

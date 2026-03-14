import { useState, useEffect } from 'react';
import { getMyMatches } from '../services/matchService';
import MatchCard from '../components/MatchCard';
import { Users, Link as LinkIcon } from 'lucide-react';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMyMatches();
      setMatches(data.matches);
    } catch (err) {
      setError('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleContactRevealed = (matchId, mobile) => {
    setMatches((prevMatches) => 
      prevMatches.map((m) => {
        if (m.matchId === matchId) {
          return {
            ...m,
            contactRevealed: true,
            partner: { ...m.partner, mobile }
          };
        }
        return m;
      })
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
      
      {/* Decorative Blur */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-green-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none z-[-1]"></div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-green-500" />
          Mutual Matches
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          These employees have transfer requests that perfectly match yours.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center flex flex-col items-center justify-center mx-auto max-w-2xl">
          <div className="relative mb-6">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm relative z-10">
              <LinkIcon className="h-10 w-10 text-slate-300" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-slate-100 rounded-full animate-ping opacity-50 z-0"></div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Matches Yet</h3>
          <p className="text-slate-500 max-w-md text-center">
            We haven't found anyone looking for your specific route yet. The matching engine watches 24/7—you'll be matched instantly when a compatible request is submitted.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {matches.map((match) => (
            <MatchCard
              key={match.matchId}
              match={match}
              onContactRevealed={handleContactRevealed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;

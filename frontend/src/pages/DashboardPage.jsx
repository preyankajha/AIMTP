import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyMatches } from '../services/matchService';
import { getMyTransfers } from '../services/transferService';
import { RefreshCw, FileText, CheckCircle2, UserCircle, Plus } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import TransferCard from '../components/TransferCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchData, transferData] = await Promise.all([
          getMyMatches(),
          getMyTransfers()
        ]);
        setMatches(matchData.matches);
        setTransfers(transferData.transfers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Handle contact reveal locally to update UI
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

  const activeTransfers = transfers.filter(t => t.status === 'active').length;
  const matchedTransfers = transfers.filter(t => t.status === 'matched').length;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8 animate-fade-in relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 glass hover:shadow-md transition-shadow">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 heading">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-lg text-slate-600 mt-2 flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary-500" />
              Railway Employee
            </p>
          </div>
          <Link
            to="/transfers/create"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            New Transfer Request
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-500 font-medium">Active Requests</h3>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 mt-4">{activeTransfers}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:border-green-300 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-500 font-medium">Successful Matches</h3>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 mt-4">{matches.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-500 font-medium">Matched Requests</h3>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <RefreshCw className="h-6 w-6" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 mt-4">{matchedTransfers}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Matches Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Your Matches
              </h2>
              {matches.length > 0 && (
                <Link to="/matches/my" className="text-primary-600 font-medium hover:underline text-sm">View All</Link>
              )}
            </div>

            {matches.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                <RefreshCw className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                <p>No matches found yet.</p>
                <p className="text-sm mt-1">Our engine is constantly searching for reverse requests.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {matches.slice(0, 3).map((match) => (
                  <MatchCard key={match.matchId} match={match} onContactRevealed={handleContactRevealed} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Transfers Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-500" />
                Recent Requests
              </h2>
              {transfers.length > 0 && (
                <Link to="/transfers/my" className="text-primary-600 font-medium hover:underline text-sm">View All</Link>
              )}
            </div>

            {transfers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                <FileText className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                <p>You haven't created any transfer requests.</p>
                <Link to="/transfers/create" className="text-primary-600 font-medium hover:underline text-sm mt-2 inline-block">Create one now</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {transfers.slice(0, 3).map((transfer) => (
                  <TransferCard key={transfer._id} transfer={transfer} isOwnRequest={true} rounded />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

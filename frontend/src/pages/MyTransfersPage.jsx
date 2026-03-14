import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyTransfers, deleteTransfer } from '../services/transferService';
import TransferCard from '../components/TransferCard';
import { FileText, Plus } from 'lucide-react';

const MyTransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const data = await getMyTransfers();
      setTransfers(data.transfers);
    } catch (err) {
      setError('Failed to fetch transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this transfer request?')) {
      try {
        await deleteTransfer(id);
        setTransfers(transfers.filter((t) => t._id !== id));
      } catch (err) {
        alert('Failed to delete transfer request');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Transfer Requests</h1>
          <p className="text-slate-600 mt-2">Manage your active and matched transfer applications.</p>
        </div>
        <Link
          to="/transfers/create"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md shadow-primary-500/20 transition-all"
        >
          <Plus className="h-5 w-5" />
          New Request
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      {transfers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Requests Found</h3>
          <p className="text-slate-500 mb-6 max-w-sm">
            You haven't submitted any transfer requests yet. Create one to start finding matches.
          </p>
          <Link
            to="/transfers/create"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Your First Request
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transfers.map((transfer) => (
            <TransferCard
              key={transfer._id}
              transfer={transfer}
              onDelete={handleDelete}
              isOwnRequest={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTransfersPage;

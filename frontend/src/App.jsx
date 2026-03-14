import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateTransferPage from './pages/CreateTransferPage';
import MyTransfersPage from './pages/MyTransfersPage';
import MatchesPage from './pages/MatchesPage';

import DashboardLayout from './components/DashboardLayout';
import ProfilePage from './pages/ProfilePage';
import SearchTransfersPage from './pages/SearchTransfersPage';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes inside DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transfers/create" element={<CreateTransferPage />} />
            <Route path="/transfers/my" element={<MyTransfersPage />} />
            <Route path="/transfers/search" element={<SearchTransfersPage />} />
            <Route path="/matches/my" element={<MatchesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateTransferPage from './pages/CreateTransferPage';
import MyTransfersPage from './pages/MyTransfersPage';
import MatchesPage from './pages/MatchesPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

import DashboardLayout from './components/DashboardLayout';
import ProfilePage from './pages/ProfilePage';
import SearchTransfersPage from './pages/SearchTransfersPage';
import LandingPage from './pages/LandingPage';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transfers/create" element={<CreateTransferPage />} />
            <Route path="/transfers/edit/:id" element={<CreateTransferPage />} />
            <Route path="/transfers/my" element={<MyTransfersPage />} />
            <Route path="/transfers/search" element={<SearchTransfersPage />} />
            <Route path="/matches/my" element={<MatchesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

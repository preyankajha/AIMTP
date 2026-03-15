import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  List,
  Users,
  Bell,
  Settings,
  HelpCircle,
  Plus,
  Train,
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Search Transfers', path: '/transfers/search', icon: Search },
    { name: 'My Requests', path: '/transfers/my', icon: List },
    { name: 'My Matches', path: '/matches/my', icon: Users },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const bottomItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help & Support', path: '/help', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col w-64 bg-primary-950 text-white h-screen sticky top-0 overflow-hidden border-r border-white/5">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-2.5">
        <div className="bg-emerald-500 p-2 rounded-xl text-primary-950">
          <Train className="h-6 w-6" />
        </div>
        <span className="text-xl font-black tracking-tight">All India Mututal Transfer Portal</span>
      </div>

      {/* Action Button */}
      <div className="px-4 mb-8">
        <button
          onClick={() => navigate('/transfers/create')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-500/10 transition-all active:scale-95 text-sm"
        >
          <Plus className="h-5 w-5" />
          New Transfer Request
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="mb-4 px-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Main Menu</h3>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-white/10 text-white font-bold border border-white/5'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0 opacity-80" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 mt-auto border-t border-white/5 bg-primary-900/20">
        <nav className="space-y-1 mb-6">
          {bottomItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5 shrink-0 opacity-80" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card */}
        <div className="bg-primary-900/40 rounded-[1.25rem] p-3 border border-white/5 flex items-center gap-3 group relative">
          <div className="h-10 w-10 rounded-full bg-emerald-500 text-primary-950 flex items-center justify-center font-black text-sm border-2 border-white/10 shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate leading-tight">{user?.name}</p>
            <p className="text-[10px] font-medium text-white/40 truncate mt-0.5">Station Master</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

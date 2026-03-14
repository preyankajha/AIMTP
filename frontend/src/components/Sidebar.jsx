import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  PlusSquare, 
  List, 
  Users, 
  Search, 
  UserCircle, 
  LogOut,
  Train
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Create Transfer Request', path: '/transfers/create', icon: PlusSquare },
    { name: 'My Transfer Requests', path: '/transfers/my', icon: List },
    { name: 'Matches', path: '/matches/my', icon: Users },
    { name: 'Search Transfers', path: '/transfers/search', icon: Search },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="flex items-center gap-3 p-6 border-b border-slate-100">
        <div className="bg-primary-900 p-2 rounded-lg text-white shadow-md">
          <Train className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">Railway Mutual</h1>
          <p className="text-xs text-primary-600 font-semibold tracking-wide uppercase">Transfer Platform</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-900 font-semibold shadow-sm border border-primary-100/50'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 opacity-80 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-5 w-5 opacity-80" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Calendar, Bell, MapPin, Bus, Compass, 
  Building2, HelpCircle, BarChart3, Globe, Settings, LogOut, Menu, X 
} from 'lucide-react';

const AdminSidebar = () => {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin/overview' },
    { label: 'Daily Information', icon: Calendar, path: '/admin/daily-info' },
    { label: 'Announcements & Push', icon: Bell, path: '/admin/announcements' },
    { label: 'Map & Locations', icon: MapPin, path: '/admin/locations' },
    { label: 'Travel & Parking', icon: Bus, path: '/admin/travel' },
    { label: 'Pilgrim Guide', icon: Compass, path: '/admin/guide' },
    { label: 'Facilities', icon: Building2, path: '/admin/facilities' },
    { label: 'Help & Assistance', icon: HelpCircle, path: '/admin/assistance' },
    { label: 'Languages & i18n', icon: Globe, path: '/admin/languages' },
    { label: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden bg-slate-900 text-white p-3 flex justify-between items-center border-b border-slate-800">
        <span className="font-bold text-sm text-amber-400">Admin Control Panel</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-800 text-amber-400"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform transform
        lg:static lg:translate-x-0 border-r border-slate-800 shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-lg">
            🛕
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Kumbh Admin</h2>
            <p className="text-[11px] text-amber-400 font-mono">Nashik Control Hub</p>
          </div>
        </div>

        {/* User Info Card */}
        {adminUser && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs">
            <div className="font-semibold text-white truncate">{adminUser.name}</div>
            <div className="text-slate-400 text-[10px] truncate">{adminUser.email}</div>
            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono">
              {adminUser.role}
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors
                  ${isActive 
                    ? 'bg-amber-600 text-white font-semibold shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-amber-200'}
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-all text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

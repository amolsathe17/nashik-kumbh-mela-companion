import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Calendar, Bell, MapPin, Bus, Compass, 
  Building2, HelpCircle, BarChart3, Globe, Settings, LogOut, X 
} from 'lucide-react';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin/overview' },
    { label: 'Daily Information', icon: Calendar, path: '/admin/daily-info' },
    { label: 'Announcements & Push', icon: Bell, path: '/admin/announcements' },
    { label: 'Map & Locations', icon: MapPin, path: '/admin/locations' },
    { label: 'Travel & Parking', icon: Bus, path: '/admin/travel' },
    { label: 'Help & Assistance', icon: HelpCircle, path: '/admin/assistance' },
    { label: 'Languages & i18n', icon: Globe, path: '/admin/languages' },
    { label: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (visible when mobile sidebar is open) */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md transition-opacity animate-fade-in"
        />
      )}

        {/* Sidebar Container */}
        <aside className={`
          fixed inset-y-0 right-0 lg:right-auto lg:left-0 z-50 w-64 bg-[#0a0f1d] text-slate-100 flex flex-col transition-transform duration-300 transform
          border-l lg:border-l-0 lg:border-r border-slate-800/80 shadow-2xl h-screen
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile Close Button Header */}
          <div className="lg:hidden p-3 bg-slate-950 border-b border-slate-800 flex justify-end">
            <button
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-amber-200 hover:bg-slate-700 transition-colors"
              aria-label="Close Navigation Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center space-x-3.5 px-4 py-3 rounded-xl text-[14.5px] tracking-tight transition-all
                    ${isActive 
                      ? 'bg-[#d97706] text-white font-bold shadow-md shadow-amber-950/40' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white font-semibold'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-all text-xs font-bold"
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

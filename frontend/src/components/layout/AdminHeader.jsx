import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Settings, X, ChevronRight, Menu } from 'lucide-react';

const AdminHeader = ({ isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine active tab from URL path
  const currentPath = location.pathname;
  let activeTab = 'Overview';
  if (currentPath.includes('/locations')) activeTab = 'Locations';
  else if (currentPath.includes('/facilities')) activeTab = 'Facilities';
  else if (currentPath.includes('/assistance')) activeTab = 'Assistance';
  else if (currentPath.includes('/reports')) activeTab = 'Analytics';
  else if (currentPath.includes('/guide')) activeTab = 'Guide';
  else if (currentPath.includes('/daily-info')) activeTab = 'Daily Info';
  else if (currentPath.includes('/announcements')) activeTab = 'Alerts';

  const searchResults = [
    { title: 'Ramkund Main Bathing Ghat', type: 'Location Pin', path: '/admin/locations' },
    { title: 'Trimbakeshwar Temple Darshan', type: 'Location Pin', path: '/admin/locations' },
    { title: 'Panchavati Medical Assistance Camp', type: 'Facility', path: '/admin/facilities' },
    { title: 'Emergency Medical Inquiry Request', type: 'Pilgrim Assistance', path: '/admin/assistance' },
    { title: 'Shahi Snan Official Schedule Release', type: 'Daily Info', path: '/admin/daily-info' },
    { title: 'Pilgrim Guide Category Cards', type: 'Pilgrim Guide', path: '/admin/guide' },
    { title: 'Reports & Language Demographics', type: 'Analytics', path: '/admin/reports' },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {/* FIXED STICKY TOP CONTROL BAR FLUSH AT TOP FOR ADMIN PAGES */}
      <header className="sticky top-0 z-30 w-full shadow-md bg-gradient-to-r from-amber-800 via-orange-900 to-amber-900 border-b border-amber-500/40 px-3 sm:px-6 py-3 text-white flex items-center justify-between gap-3">
        {/* Left Branding Section (Icon + Title + Subtitle) */}
        <div 
          onClick={() => navigate('/admin/overview')}
          className="flex items-center space-x-2.5 sm:space-x-3 rtl:space-x-reverse cursor-pointer group min-w-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/90 text-amber-950 flex items-center justify-center text-xl font-bold shadow-md group-hover:scale-105 transition-transform flex-shrink-0 border border-amber-300/40">
            🛕
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base lg:text-lg text-amber-50 leading-tight truncate tracking-tight">
              Nashik Kumbh Mela
            </h1>
            <p className="text-[10px] sm:text-[11px] text-amber-200/90 font-mono font-medium truncate">
              Simhastha 2026
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse flex-shrink-0">
          {/* Quick Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-amber-200 transition-all shadow-sm flex items-center justify-center" 
            title="Quick Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Admin Avatar */}
          <div 
            onClick={() => navigate('/admin/settings')}
            className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-amber-300/40 flex-shrink-0">
              KA
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-tight">Kumbh Admin</p>
              <p className="text-[10px] text-amber-200 font-bold">HQ Panchavati Desk</p>
            </div>
          </div>

          {/* Mobile Hamburger Toggle Menu Button (Visible on < lg screens) */}
          <button
            onClick={() => setIsMobileOpen && setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 sm:p-2.5 rounded-full bg-amber-950/60 hover:bg-amber-950/80 border border-amber-400/50 text-amber-100 shadow-md transition-all active:scale-95 flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? (
              <X className="w-5 h-5 text-amber-200" />
            ) : (
              <Menu className="w-5 h-5 text-amber-100" />
            )}
          </button>
        </div>
      </header>

      {/* QUICK SEARCH INTERACTIVE MODAL OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 border border-slate-200 z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900">Kumbh Control Search</h3>
              </div>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ramkund, Medical, Facilities, Notices..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:border-amber-500"
              autoFocus
            />

            <div className="max-h-60 overflow-y-auto space-y-1 text-xs">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(item.path);
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[10px] text-slate-500">{item.type}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-600" />
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 font-medium">No results found for "{searchQuery}"</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;

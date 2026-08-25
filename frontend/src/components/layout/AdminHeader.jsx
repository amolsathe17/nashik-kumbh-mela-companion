import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Settings, X, ChevronRight } from 'lucide-react';

const AdminHeader = () => {
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

  const navTabs = [
    { label: 'Overview', path: '/admin/overview' },
    { label: 'Locations', path: '/admin/locations' },
    { label: 'Facilities', path: '/admin/facilities' },
    { label: 'Assistance', path: '/admin/assistance' },
    { label: 'Guide', path: '/admin/guide' },
    { label: 'Daily Info', path: '/admin/daily-info' },
    { label: 'Alerts', path: '/admin/announcements' },
    { label: 'Analytics', path: '/admin/reports' },
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

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
      {/* FIXED STICKY TOP CONTROL BAR ACROSS ALL ADMIN PAGES */}
      <header className="sticky top-0 z-30 bg-[#f8fafc]/95 backdrop-blur-md pt-3 pb-3 px-4 sm:px-6 shadow-xs border-b border-amber-200/40">
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 rounded-3xl p-4 shadow-sm border border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left Branding */}
          <div 
            onClick={() => navigate('/admin/overview')}
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
              🛕
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">Nashik Kumbh Companion</h1>
              <p className="text-[11px] text-slate-500 font-medium">SuperAdmin Overview & Control Desk • 2026 Simhastha</p>
            </div>
          </div>



          {/* Right Search, Settings & Profile */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm" 
              title="Quick Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button 
              onClick={() => navigate('/admin/settings')}
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm" 
              title="System Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <div 
              onClick={() => navigate('/admin/settings')}
              className="flex items-center space-x-2.5 rtl:space-x-reverse pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                KA
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">Kumbh Admin</p>
                <p className="text-[10px] text-amber-700 font-bold">HQ Panchavati Desk</p>
              </div>
            </div>
          </div>
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
                <div className="p-4 text-center text-slate-400 text-xs font-medium">
                  No matching results found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;

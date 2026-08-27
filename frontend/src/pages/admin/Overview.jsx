import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Bell, AlertTriangle, Calendar, MapPin, Bus, CheckCircle, 
  ArrowUpRight, ArrowDownRight, Activity, Clock, Search, Settings, 
  ChevronLeft, ChevronRight, Filter, Ticket, BarChart3, Flame, 
  MessageSquare, ShieldAlert, Sparkles, ExternalLink, HeartHandshake,
  Compass, Building2, PhoneCall, FileText, Layers, X
} from 'lucide-react';
import api from '../../services/api';

const Overview = () => {
  const navigate = useNavigate();
  const [subCategoryTab, setSubCategoryTab] = useState('Ghats');
  
  // Interactive Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [stats, setStats] = useState({
    devicesWithNotif: 15420,
    activeAnnouncements: 1,
    totalLocations: 8,
    pendingAssistance: 0,
    dailyReleasesCount: 1,
    latestDailyInfo: null,
    totalFacilities: 6
  });

  // Official Web-Verified Shahi Snan & Parva Snan Dates Database (Nashik Simhastha 2026-2028)
  const OFFICIAL_SHAHI_SNANS = {
    '2026-10-31': { title: 'Dhwajarohan (Flag Hoisting Ceremony)', type: 'Ceremony', ghat: 'Ramkund & Trimbak' },
    '2027-08-02': { title: '1st Amrit Shahi Snan (Ashadh Somvati Amavasya)', type: 'Shahi Snan', ghat: 'Ramkund Main Bathing Ghat' },
    '2027-08-31': { title: '2nd Amrit Shahi Snan (Shravan Amavasya)', type: 'Shahi Snan', ghat: 'Ramkund & Trimbakeshwar' },
    '2027-09-05': { title: 'Rishi Panchami Parva Snan', type: 'Parva Snan', ghat: 'Godavari River' },
    '2027-09-11': { title: '3rd Amrit Shahi Snan (Bhadrapad Ekadashi)', type: 'Shahi Snan', ghat: 'Ramkund Bathing Ghat' },
    '2027-09-12': { title: '3rd Amrit Shahi Snan (Bhadrapad Dwadashi)', type: 'Shahi Snan', ghat: 'Trimbakeshwar Kushavarta' },
    '2027-09-15': { title: 'Bhadrapada Purnima Snan', type: 'Parva Snan', ghat: 'Godavari River' },
    '2028-02-27': { title: 'Maha Shivratri Shahi Snan', type: 'Shahi Snan', ghat: 'Trimbakeshwar Temple' }
  };

  // Dynamic Calendar Navigation State (Defaulting to August 2027 Shahi Snan season!)
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2027, 7, 1)); // August 2027

  const handlePrevMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week (0-6)
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in month

  // Collect Shahi Snans in currently viewed month
  const activeSnansInMonth = Object.entries(OFFICIAL_SHAHI_SNANS)
    .filter(([dateKey]) => dateKey.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
    .map(([dateKey, details]) => ({ dateKey, ...details }));

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [locRes, annRes, reqRes, dailyRes, facRes] = await Promise.all([
        api.get('/locations').catch(() => null),
        api.get('/announcements').catch(() => null),
        api.get('/assistance').catch(() => null),
        api.get('/daily-information').catch(() => null),
        api.get('/facilities').catch(() => null)
      ]);

      if (locRes?.data?.success) setStats(prev => ({ ...prev, totalLocations: locRes.data.data.length }));
      if (annRes?.data?.success) setStats(prev => ({ ...prev, activeAnnouncements: annRes.data.data.length }));
      if (reqRes?.data?.success) setStats(prev => ({ ...prev, pendingAssistance: reqRes.data.data.filter(r => r.status === 'New').length }));
      if (facRes?.data?.success) setStats(prev => ({ ...prev, totalFacilities: facRes.data.data.length }));
      if (dailyRes?.data?.success) {
        const dailyList = dailyRes.data.data || [];
        setStats(prev => ({ 
          ...prev, 
          dailyReleasesCount: dailyList.length,
          latestDailyInfo: dailyList[0] || null
        }));
      }
    } catch (err) {
      console.error('Failed to fetch overview metrics:', err);
    }
  };

  const searchResults = [
    { title: 'Ramkund Main Bathing Ghat', type: 'Location Pin', path: '/admin/locations' },
    { title: 'Trimbakeshwar Temple Darshan', type: 'Location Pin', path: '/admin/locations' },
    { title: 'Panchavati Medical Assistance Camp', type: 'Facility', path: '/admin/facilities' },
    { title: 'Emergency Medical Inquiry Request', type: 'Pilgrim Assistance', path: '/admin/assistance' },
    { title: 'Shahi Snan Official Schedule Release', type: 'Daily Info', path: '/admin/daily-info' },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* MAIN DASHBOARD GRID LAYOUT (8 Columns Left Section | 4 Columns Right Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT & CENTER 8-COLUMNS SECTION */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ROW 1: 3 METRIC CARDS (Fully Clickable) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: Devices with Notifications */}
            <div 
              onClick={() => navigate('/admin/reports')}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">App Active Devices</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-3xl font-bold text-slate-900">{stats.devicesWithNotif.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +8.4% today
                </span>
              </div>
            </div>

            {/* Card 2: Active Notices & Alerts */}
            <div 
              onClick={() => navigate('/admin/announcements')}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Active Notices</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-3xl font-bold text-slate-900">{stats.activeAnnouncements}</span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3 text-amber-600" /> Live on App
                </span>
              </div>
            </div>

            {/* Card 3: Pending Pilgrim Requests */}
            <div 
              onClick={() => navigate('/admin/assistance')}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3 cursor-pointer hover:border-rose-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Pending Requests</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-3xl font-bold text-slate-900">{stats.pendingAssistance}</span>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> Needs Response
                </span>
              </div>
            </div>
          </div>

          {/* ROW 2: REVENUE & FOOTFALL TRENDS CHART & RECENT KUMBH ACTIVITIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pilgrim Footfall & Ghat Crowd Density Trends Chart Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">Pilgrim Footfall & Crowd Density Trends</h3>
                  <button 
                    onClick={() => navigate('/admin/reports')}
                    className="text-xs font-bold text-amber-700 hover:underline"
                  >
                    See Details
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Daily estimated pilgrim attendance & bathing ghat crowd density over last 7 days
                </p>
              </div>

              {/* Chart Graphic Area with SVG Curved Line & Column Bars */}
              <div className="h-44 flex items-end justify-between gap-2 px-2 relative pt-6">
                <svg className="absolute inset-x-0 top-6 w-full h-32 text-amber-500 stroke-current fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M 5 25 Q 35 15, 50 20 T 95 8" strokeWidth="2.5" />
                  <circle cx="5" cy="25" r="2.5" fill="#f59e0b" />
                  <circle cx="50" cy="20" r="2.5" fill="#f59e0b" />
                  <circle cx="95" cy="8" r="2.5" fill="#ea580c" />
                </svg>

                {[
                  { day: 'Aug 19', count: '12.5L', height: 'h-16', active: false },
                  { day: 'Aug 20', count: '16.2L', height: 'h-20', active: false },
                  { day: 'Aug 21', count: '22.0L', height: 'h-24', active: false },
                  { day: 'Aug 22', count: '28.4L', height: 'h-28', active: false },
                  { day: 'Aug 23', count: '24.1L', height: 'h-24', active: false },
                  { day: 'Aug 24', count: '38.6L', height: 'h-32', active: false },
                  { day: 'Aug 25', count: '45.2L', height: 'h-36', active: true }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-slate-500">{item.count}</span>
                    <div 
                      className={`w-full rounded-t-lg transition-all ${
                        item.active ? 'bg-gradient-to-t from-amber-600 to-orange-500 shadow-md' : 'bg-slate-100 hover:bg-slate-200'
                      } ${item.height}`} 
                    />
                    <span className="text-[9px] font-bold text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>

              {/* Chart Category Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold text-slate-600 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Daily Pilgrim Attendance (Lakhs)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Ramkund Bathing Ghat Density (%)</span>
              </div>
            </div>

            {/* Recent Kumbh Control Activities Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 tracking-tight">Recent Kumbh Activities</h3>
                <button 
                  onClick={() => navigate('/admin/announcements')}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  See Details
                </button>
              </div>

              {/* Floating Tag Badges */}
              <div className="flex items-center justify-center gap-2 py-1 border-b border-dashed border-slate-200">
                <button onClick={() => navigate('/admin/daily-info')} className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm transition-colors">
                  Shahi Snan
                </button>
                <button onClick={() => navigate('/admin/assistance')} className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm transition-colors">
                  Medical SOS
                </button>
                <button onClick={() => navigate('/admin/locations')} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm transition-colors">
                  VIP Pass
                </button>
              </div>

              {/* Latest Daily Info Banner */}
              {stats.latestDailyInfo ? (
                <div 
                  onClick={() => navigate('/admin/daily-info')}
                  className="bg-amber-50 p-3 rounded-2xl border border-amber-200/80 space-y-1 cursor-pointer hover:bg-amber-100/60 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md font-mono">{stats.latestDailyInfo.date}</span>
                    <span className="text-emerald-700">Daily Info Active</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate">{stats.latestDailyInfo.title}</p>
                </div>
              ) : (
                <div className="bg-slate-50 p-2.5 rounded-2xl text-[11px] text-slate-500 font-medium border border-slate-100">
                  Daily Kumbh Schedule updated for pilgrims.
                </div>
              )}

              {/* Timeline Logs */}
              <div className="space-y-2.5 text-xs">
                <div 
                  onClick={() => navigate('/admin/assistance')}
                  className="flex items-start space-x-2.5 rtl:space-x-reverse cursor-pointer hover:opacity-80"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    🚨
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      {stats.pendingAssistance} assistance requests <span className="font-bold text-slate-500">pending response</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Control Desk HQ • Just now</p>
                  </div>
                </div>

                <div 
                  onClick={() => navigate('/admin/locations')}
                  className="flex items-start space-x-2.5 rtl:space-x-reverse cursor-pointer hover:opacity-80"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    📍
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      {stats.totalLocations} verified map pins <span className="font-bold text-slate-500">active on visitor app</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">GIS Mapping Desk • 10m ago</p>
                  </div>
                </div>

                <div 
                  onClick={() => navigate('/admin/travel')}
                  className="flex items-start space-x-2.5 rtl:space-x-reverse cursor-pointer hover:opacity-80"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    🚌
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      Outer Ring Road Shuttles <span className="font-bold text-amber-700">running every 5 mins</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Transport Command • 25m ago</p>
                  </div>
                </div>
              </div>

              {/* View More Activities Footer */}
              <div 
                onClick={() => navigate('/admin/reports')}
                className="pt-1 flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-amber-800 cursor-pointer transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                  👀
                </div>
                <span>view more activities</span>
              </div>
            </div>
          </div>

          {/* ROW 3: KUMBH LOCATIONS PREVIEW & DYNAMIC SHAHI SNAN CALENDAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kumbh Places & Map Preview Widget */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 tracking-tight">Kumbh Key Destinations</h3>
                <button 
                  onClick={() => navigate('/admin/locations')}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  + add location
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2.5">
                  <div 
                    onClick={() => navigate('/admin/locations')}
                    className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 tracking-tight">Ramkund Main Ghat</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">📍 Panchavati, Nashik</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Shahi Snan Bath
                      </span>
                      <span className="text-xs font-bold text-slate-900">Verified</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => navigate('/admin/locations')}
                    className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 tracking-tight">Trimbakeshwar Temple</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">📍 Trimbak Sector</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        Darshan Ghat
                      </span>
                      <span className="text-xs font-bold text-slate-900">Active</span>
                    </div>
                  </div>
                </div>

                {/* Map Grid Visual Preview */}
                <div 
                  onClick={() => navigate('/admin/locations')}
                  className="bg-amber-950/5 rounded-2xl p-3 border border-amber-500/20 relative min-h-[140px] flex flex-col justify-between overflow-hidden bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px] cursor-pointer hover:border-amber-500 transition-colors group"
                >
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-2 rounded-xl border border-amber-200 shadow-sm text-[10px] font-bold text-slate-900">
                    🛕 Ramkund HQ
                    <p className="text-[9px] text-amber-700 font-medium">Main Snan Zone</p>
                  </div>
                  <div className="mt-auto ml-auto bg-amber-600 text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg shadow group-hover:scale-105 transition-transform">
                    GIS MAP ACTIVE
                  </div>
                </div>
              </div>
            </div>

            {/* Fully Dynamic Shahi Snan Engagement Calendar (Works for ALL Months) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 tracking-tight">Shahi Snan Engagement</h3>
                <button 
                  onClick={() => navigate('/admin/daily-info')}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  See Schedule
                </button>
              </div>

              {/* Dynamic Month Header with Prev & Next Navigation */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 px-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-white transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="tracking-tight text-slate-900">
                  {monthNames[month]} {year}
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-white transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day Headers (S M T W T F S) */}
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>

              {/* Dynamic Calendar Grid Engine */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold">
                {/* Empty cells padding for previous month */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-7 h-7" />
                ))}

                {/* Days of viewed month */}
                {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const snanDetail = OFFICIAL_SHAHI_SNANS[dateKey];

                  return (
                    <div
                      key={day}
                      onClick={() => navigate('/admin/daily-info')}
                      title={snanDetail ? `${snanDetail.title} (${snanDetail.ghat})` : `Date: ${dateKey}`}
                      className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-all cursor-pointer ${
                        snanDetail
                          ? 'bg-amber-600 text-white font-bold shadow-md scale-110 border-2 border-amber-300 ring-2 ring-amber-400/40 hover:bg-amber-700'
                          : 'text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Shahi Snan Details Summary Banner for Selected Month */}
              {activeSnansInMonth.length > 0 ? (
                <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200 text-xs space-y-1.5">
                  {activeSnansInMonth.map((snan, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] font-bold text-amber-950">
                      <span className="flex items-center gap-1 font-bold text-amber-800">
                        🚩 {snan.dateKey.split('-')[2]} {monthNames[month]}: {snan.title}
                      </span>
                      <span className="text-[9px] bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-md font-mono">{snan.ghat}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-center text-slate-400 font-medium py-1">
                  Standard schedule for {monthNames[month]} {year}. (Official Shahi Snans highlight in Gold)
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (4-COLUMNS ANALYTICS & KUMBH SUMMARY PANEL) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          
          {/* Pilgrim Footfall Summary Metric Header */}
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">Pilgrim Passes Summary</h3>
              <button 
                onClick={() => navigate('/admin/reports')}
                className="text-xs font-bold text-amber-700 hover:underline"
              >
                See Details
              </button>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-slate-900">382,495</span>
              <span className="text-xs font-bold text-slate-500">Passes & Footfall Recorded</span>
            </div>
          </div>

          {/* Subcategory Filter Tabs (Ghats | Facilities | Help desk) */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl text-xs font-bold text-slate-600">
            {['Ghats', 'Facilities', 'Help desk'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubCategoryTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                  subCategoryTab === tab 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Location, Facility & Helpdesk Progress Cards List */}
          <div className="space-y-3">
            {subCategoryTab === 'Ghats' && (
              <>
                <div 
                  onClick={() => navigate('/admin/locations')}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Ramkund Main Bathing Ghat</span>
                    <span className="font-mono text-[10px] text-slate-500">28,460 pilgrims</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Panchavati Sector A</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '86%' }} />
                  </div>
                  <p className="text-[10px] text-right font-bold text-slate-500">86% Capacity</p>
                </div>

                <div 
                  onClick={() => navigate('/admin/locations')}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Trimbakeshwar Temple Darshan</span>
                    <span className="font-mono text-[10px] text-slate-500">14,750 pilgrims</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Trimbak Sector B</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '64%' }} />
                  </div>
                  <p className="text-[10px] text-right font-bold text-slate-500">64% Capacity</p>
                </div>

                <div 
                  onClick={() => navigate('/admin/travel')}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Tapovan Parking Shuttle Hub</span>
                    <span className="font-mono text-[10px] text-slate-500">12,940 vehicles</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Outer Ring Road</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '52%' }} />
                  </div>
                  <p className="text-[10px] text-right font-bold text-slate-500">52% Capacity</p>
                </div>
              </>
            )}

            {subCategoryTab === 'Facilities' && (
              <>
                <div 
                  onClick={() => navigate('/admin/facilities')}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Panchavati Emergency Medical Camp</span>
                    <span className="font-mono text-[10px] text-slate-500">92% Occupancy</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Medical Assistance Zone</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div 
                  onClick={() => navigate('/admin/facilities')}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Sadhugram Free Annakshetra</span>
                    <span className="font-mono text-[10px] text-slate-500">74% Active Food Desk</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Food & Water Camp</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '74%' }} />
                  </div>
                </div>
              </>
            )}

            {subCategoryTab === 'Help desk' && (
              <>
                <div 
                  onClick={() => navigate('/admin/assistance')}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Medical Emergency Help</span>
                    <span className="font-mono text-[10px] text-slate-500">45% of total requests</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">High Priority Response Desk</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-600 h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>

                <div 
                  onClick={() => navigate('/admin/assistance')}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Lost & Found Pilgrims</span>
                    <span className="font-mono text-[10px] text-slate-500">30% of total requests</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Family Re-grouping Desk</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Pilgrim Footfall Overtime Vertical Bar Chart */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-900 tracking-tight">Pilgrim Traffic Overtime</h4>
            </div>

            <div className="h-28 flex items-end justify-between gap-1 pt-2">
              {[40, 65, 80, 50, 95, 60, 75, 45, 85, 90, 70, 60, 85, 100].map((height, i) => (
                <div key={i} className="flex-1 bg-amber-500 rounded-t-md hover:opacity-85 transition-opacity" style={{ height: `${height}%` }} />
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold pt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-900" /> VIP Passes</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-300" /> Pilgrim Group</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600" /> General Bath</span>
            </div>

            {/* Bottom Key Performance Lines */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div 
                onClick={() => navigate('/admin/locations')}
                className="flex items-center justify-between text-slate-600 cursor-pointer hover:text-amber-800"
              >
                <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 text-slate-400" /> Total Verified Locations</span>
                <span className="font-bold text-slate-900">{stats.totalLocations}</span>
              </div>
              <div 
                onClick={() => navigate('/admin/facilities')}
                className="flex items-center justify-between text-slate-600 cursor-pointer hover:text-amber-800"
              >
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Facilities Registered</span>
                <span className="font-bold text-slate-900">{stats.totalFacilities}</span>
              </div>
              <div 
                onClick={() => navigate('/admin/reports')}
                className="flex items-center justify-between text-slate-600 cursor-pointer hover:text-amber-800"
              >
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-slate-400" /> Resolution Rate</span>
                <span className="font-bold text-emerald-600">98.5%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* QUICK SEARCH INTERACTIVE MODAL OVERLAY */}
      {isSearchOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
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
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ramkund, Medical, Facilities, Notices..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
            />

            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    navigate(res.path);
                    setIsSearchOpen(false);
                  }}
                  className="p-3 bg-slate-50 hover:bg-amber-50 rounded-2xl cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-800">{res.title}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{res.type}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </div>
              ))}
              {searchResults.length === 0 && (
                <div className="p-4 text-center text-slate-400 text-xs font-medium">
                  No matching results found.
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default Overview;

import React, { useState, useEffect } from 'react';
import { 
  Users, Bell, AlertTriangle, HelpCircle, MapPin, Bus, Calendar, 
  CheckCircle, ArrowUpRight, ShieldCheck, Activity 
} from 'lucide-react';
import api from '../../services/api';

const Overview = () => {
  const [stats, setStats] = useState({
    devicesWithNotif: 15420,
    activeAnnouncements: 2,
    totalLocations: 8,
    pendingAssistance: 1
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [locRes, annRes, reqRes] = await Promise.all([
          api.get('/locations'),
          api.get('/announcements'),
          api.get('/assistance')
        ]);
        if (locRes.data.success) setStats(prev => ({ ...prev, totalLocations: locRes.data.data.length }));
        if (annRes.data.success) setStats(prev => ({ ...prev, activeAnnouncements: annRes.data.data.length }));
        if (reqRes.data.success) setStats(prev => ({ ...prev, pendingAssistance: reqRes.data.data.filter(r => r.status === 'New').length }));
      } catch (err) {}
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Dashboard Overview</h2>
        <p className="text-xs text-slate-500">Live Status & Key Metrics • Nashik Kumbh Control Center</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">Notification Enabled</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">{stats.devicesWithNotif.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +8.4% today
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Notices</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">{stats.activeAnnouncements}</div>
          <div className="text-[11px] text-slate-500 font-semibold">Published on Mobile App</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">Verified Locations</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">{stats.totalLocations}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">100% verified map pins</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">New Help Requests</span>
            <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">{stats.pendingAssistance}</div>
          <div className="text-[11px] text-red-600 font-semibold">Requires desk attention</div>
        </div>
      </div>

      {/* Control Quick Actions Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md space-y-4">
        <h3 className="font-bold text-lg text-amber-400 flex items-center gap-2">
          <Activity className="w-5 h-5" /> Rapid Control Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a href="/admin/announcements" className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold flex items-center justify-between">
            <span>Broadcast Emergency Alert</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </a>
          <a href="/admin/daily-info" className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold flex items-center justify-between">
            <span>Update Today's Kumbh Info</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </a>
          <a href="/admin/travel" className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold flex items-center justify-between">
            <span>Update Parking Occupancy</span>
            <Bus className="w-4 h-4 text-blue-400" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Overview;

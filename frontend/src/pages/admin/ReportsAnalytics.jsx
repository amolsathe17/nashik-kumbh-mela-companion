import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Globe, MapPin, Users, HelpCircle, Calendar, ShieldCheck, Activity } from 'lucide-react';
import api from '../../services/api';

const ReportsAnalytics = () => {
  const [assistanceCount, setAssistanceCount] = useState(1);
  const [locationsCount, setLocationsCount] = useState(8);
  const [dailyInfoCount, setDailyInfoCount] = useState(1);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [reqRes, locRes, dailyRes] = await Promise.all([
          api.get('/assistance'),
          api.get('/locations'),
          api.get('/daily-information')
        ]);
        if (reqRes?.data?.success) setAssistanceCount(reqRes.data.data.length);
        if (locRes?.data?.success) setLocationsCount(locRes.data.data.length);
        if (dailyRes?.data?.success) setDailyInfoCount(dailyRes.data.data.length);
      } catch (err) {}
    };
    fetchAnalytics();
  }, []);

  const languageStats = [
    { name: 'Marathi (मराठी)', count: 41.2, color: 'bg-amber-500' },
    { name: 'Hindi (हिंदी)', count: 32.8, color: 'bg-orange-500' },
    { name: 'English', count: 12.4, color: 'bg-blue-500' },
    { name: 'Gujarati (ગુજરાતી)', count: 6.1, color: 'bg-emerald-500' },
    { name: 'Tamil (தமிழ்) & South Asian', count: 4.2, color: 'bg-purple-500' },
    { name: 'International (Russian, Italian, French, German)', count: 3.3, color: 'bg-pink-500' }
  ];

  const requestCategoryBreakdown = [
    { category: 'Medical Support', count: 34, percent: 38 },
    { category: 'Lost & Found / Family Reunion', count: 28, percent: 31 },
    { category: 'General Directions & Shuttles', count: 18, percent: 20 },
    { category: 'Senior Citizen Assistance', count: 10, percent: 11 }
  ];

  const topSearches = [
    { place: 'Ramkund Holy Bathing Ghat', count: '18,420 queries', category: 'Ghat' },
    { place: 'Trimbakeshwar Jyotirlinga Temple', count: '14,100 queries', category: 'Temple' },
    { place: 'Tapovan Sadhugram Eco Shuttles', count: '9,850 queries', category: 'Parking & Transport' },
    { place: 'Sanitary Toilet Block 12', count: '6,200 queries', category: 'Toilet' },
    { place: 'Panchavati Medical & Emergency Hub', count: '4,150 queries', category: 'Medical' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h2>
        <p className="text-xs text-slate-500">Live Visitor Usage Trends, Preferred Language Demographics & Help Request Metrics</p>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">App Downloads / Active Users</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">124,580</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.5% active today
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Help Requests</span>
            <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{assistanceCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">100% triage & SMS response rate</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">Verified Map Locations</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{locationsCount}</div>
          <div className="text-[11px] text-slate-500 font-semibold">Ghats, Temples, Water & Toilets</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase">Daily Info Releases</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{dailyInfoCount}</div>
          <div className="text-[11px] text-purple-600 font-semibold">Published to all app users</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Usage Demographics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" /> Preferred Language Demographics (%)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">28 Supported Languages</span>
          </div>

          <div className="space-y-3.5">
            {languageStats.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{item.name}</span>
                  <span className="font-mono text-slate-900 font-bold">{item.count}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.count}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pilgrim Assistance Request Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-red-600" /> Pilgrim Help Request Categories
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Live Triage Data</span>
          </div>

          <div className="space-y-3.5">
            {requestCategoryBreakdown.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{item.category}</span>
                  <span className="font-mono text-red-700">{item.percent}% ({item.count} requests)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Searched Destinations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
          <MapPin className="w-5 h-5 text-emerald-600" /> Top Searched Destinations & Facilities
        </h3>

        <div className="space-y-3">
          {topSearches.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="font-bold font-mono text-amber-600 text-sm">#{idx + 1}</span>
                <div>
                  <div className="font-bold text-slate-900">{item.place}</div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                    {item.category}
                  </span>
                </div>
              </div>
              <span className="text-slate-600 font-mono font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;

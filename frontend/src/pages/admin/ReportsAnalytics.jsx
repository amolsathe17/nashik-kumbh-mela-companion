import React from 'react';
import { BarChart3, TrendingUp, Globe, MapPin, Users } from 'lucide-react';

const ReportsAnalytics = () => {
  const languageStats = [
    { name: 'Hindi (हिंदी)', count: 42.5, color: 'bg-amber-500' },
    { name: 'Marathi (मराठी)', count: 28.0, color: 'bg-orange-500' },
    { name: 'English', count: 14.2, color: 'bg-blue-500' },
    { name: 'Gujarati (ગુજરાતી)', count: 8.3, color: 'bg-emerald-500' },
    { name: 'Russian (Русский)', count: 3.5, color: 'bg-purple-500' },
    { name: 'Other International', count: 3.5, color: 'bg-pink-500' }
  ];

  const topSearches = [
    { place: 'Ramkund Holy Bathing Ghat', count: '18,420 queries' },
    { place: 'Trimbakeshwar Jyotirlinga Temple', count: '14,100 queries' },
    { place: 'Tapovan Sadhugram Eco Shuttles', count: '9,850 queries' },
    { place: 'Sanitary Toilet Block 12', count: '6,200 queries' },
    { place: 'Central Pilgrim Medical Centre', count: '4,150 queries' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Reports & Analytics</h2>
        <p className="text-xs text-slate-500">Visitor Usage Trends, Language Demographics & Location Insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Usage Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-600" /> Preferred Language Demographics (%)
          </h3>

          <div className="space-y-3">
            {languageStats.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{item.name}</span>
                  <span className="font-mono">{item.count}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.count}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Searched Locations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" /> Top Searched Destinations
          </h3>

          <div className="space-y-3">
            {topSearches.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold font-mono text-amber-600 text-sm">#{idx + 1}</span>
                  <span className="font-bold text-slate-800">{item.place}</span>
                </div>
                <span className="text-slate-500 font-mono">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;

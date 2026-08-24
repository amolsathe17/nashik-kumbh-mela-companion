import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Clock, MapPin, AlertCircle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const TodaysKumbh = () => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await api.get('/daily-information/today');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.log('Error loading today info');
      } finally {
        setLoading(false);
      }
    };
    fetchToday();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Title Header */}
      <div className="flex items-center space-x-3 rtl:space-x-reverse bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          📅
        </div>
        <div>
          <h2 className="text-2xl font-black">{t('todaysKumbh')}</h2>
          <p className="text-xs text-emerald-100 font-medium">Daily Programmes, Snan Timings & Visitor Advisories</p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 font-medium animate-pulse">
          Loading today's Kumbh information...
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Date: {data.date}
              </span>
              <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Official Release
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900">{data.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{data.description}</p>
          </div>

          {/* Today's Programmes Timeline */}
          {data.programmes && data.programmes.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-md space-y-4">
              <h4 className="text-base font-bold text-amber-900 flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Today's Official Programmes / आज के कार्यक्रम</span>
              </h4>

              <div className="space-y-4">
                {data.programmes.map((prog, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <div className="w-24 flex-shrink-0 font-mono text-xs font-bold text-amber-800 bg-amber-200/80 px-2 py-1 rounded-lg text-center h-fit">
                      {prog.time}
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-sm text-gray-900">{prog.title}</h5>
                      <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {prog.location}
                      </p>
                      <p className="text-xs text-gray-600">{prog.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Advisories */}
          {data.travelAdvisories && data.travelAdvisories.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 space-y-3">
              <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" /> Travel & Transport Advisories
              </h4>
              <ul className="space-y-2 text-xs text-blue-950 font-medium">
                {data.travelAdvisories.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Advisories */}
          {data.safetyAdvisories && data.safetyAdvisories.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-5 space-y-3">
              <h4 className="font-bold text-red-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" /> Safety & Health Advisories
              </h4>
              <ul className="space-y-2 text-xs text-red-950 font-medium">
                {data.safetyAdvisories.map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">No data available for today.</div>
      )}
    </div>
  );
};

export default TodaysKumbh;

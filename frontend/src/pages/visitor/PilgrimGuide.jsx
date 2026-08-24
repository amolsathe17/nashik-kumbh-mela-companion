import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Compass, Calendar, BookOpen, Globe2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const PilgrimGuide = () => {
  const { t } = useLanguage();
  const [programs, setPrograms] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  const tabs = ['All', 'Shahi Snan', 'Ritual Guide', 'Temple Guide', 'International Visitor Guide'];

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get('/programmes');
        if (res.data.success) setPrograms(res.data.data);
      } catch (err) {
        console.log('Error loading guide programs');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(p => activeTab === 'All' || p.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-6 rounded-3xl shadow-lg flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          🛕
        </div>
        <div>
          <h2 className="text-2xl font-black">{t('pilgrimGuide')}</h2>
          <p className="text-xs text-rose-100 font-medium">Sacred Dates, Temple Etiquette & International Visitor Guidance</p>
        </div>
      </div>

      {/* Tabs Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm ${
              activeTab === tab
                ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                : 'bg-white text-gray-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Shahi Snan Highlights Box */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-900">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-base">Key Sacred Bathing Dates (शाही स्नान तिथियां)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-amber-200 text-center">
            <div className="font-bold text-amber-800 text-sm">1st Shahi Snan</div>
            <div className="text-gray-600 font-mono mt-0.5">14 Sept 2026</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-1">Ramkund & Kushavarta</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-amber-200 text-center">
            <div className="font-bold text-amber-800 text-sm">2nd Shahi Snan</div>
            <div className="text-gray-600 font-mono mt-0.5">25 Sept 2026</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-1">Ramkund Ghat</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-amber-200 text-center">
            <div className="font-bold text-amber-800 text-sm">3rd Shahi Snan</div>
            <div className="text-gray-600 font-mono mt-0.5">04 Oct 2026</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-1">Trimbakeshwar Kund</div>
          </div>
        </div>
      </div>

      {/* Guide Content Cards */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 font-medium">Loading guide information...</div>
      ) : filteredPrograms.length > 0 ? (
        <div className="space-y-4">
          {filteredPrograms.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-6 border border-rose-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                  {item.category}
                </span>
                {item.eventDate && (
                  <span className="text-xs font-mono text-gray-500 font-semibold">
                    {item.eventDate}
                  </span>
                )}
              </div>

              <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-700 leading-relaxed">{item.description}</p>

              {item.guidelines && item.guidelines.length > 0 && (
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <h5 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Visitor Guidelines & Etiquette:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    {item.guidelines.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed text-gray-500">
          No guide content available for this category.
        </div>
      )}
    </div>
  );
};

export default PilgrimGuide;

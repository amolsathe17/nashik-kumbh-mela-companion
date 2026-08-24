import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Building2, CheckCircle, MapPin, Phone, Search, Utensils, Home, HeartPulse, Droplets } from 'lucide-react';
import api from '../../services/api';

const NearbyFacilities = () => {
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Accommodation', 'Food Area', 'Drinking Water', 'Toilet', 'Medical', 'Pharmacy', 'Parking', 'Police Centre'];

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await api.get('/facilities');
        if (res.data.success) setFacilities(res.data.data);
      } catch (err) {
        console.log('Error fetching facilities');
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const filtered = facilities.filter(fac => {
    const matchesCat = selectedCat === 'All' || fac.category === selectedCat;
    const matchesSearch = fac.name.toLowerCase().includes(search.toLowerCase()) || 
                          fac.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          📍
        </div>
        <div>
          <h2 className="text-2xl font-black">{t('nearbyFacilities')}</h2>
          <p className="text-xs text-purple-100 font-medium">
            {t('nearbyFacilitiesSub') || 'Verified Pilgrim Camps, Food Counters & Aid Posts'}
          </p>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchFacilityPlaceholder') || "Search facility name or location..."}
            className="w-full pl-11 pr-4 py-3 bg-white border border-purple-200 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-purple-500 outline-none rtl:pr-11 rtl:pl-4"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCat === cat
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : 'bg-white text-gray-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              {cat === 'All' ? t('allCategories') : (t(cat) || cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Facility Grid */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 font-medium">{t('searchingFacilities') || 'Searching facilities...'}</div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-5 border border-purple-200 shadow-md space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-gray-900">{t(item.name)}</h4>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full mt-0.5">
                      {t(item.category) || item.category}
                    </span>
                  </div>

                  {item.verified && (
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> {t('verified')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-purple-900 font-semibold">
                  <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>{t(item.location)}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{t(item.description)}</p>
              </div>

              {item.contactNumber && (
                <div className="pt-2 border-t border-purple-50">
                  <a
                    href={`tel:${item.contactNumber}`}
                    className="inline-flex items-center gap-1 text-xs text-purple-700 font-bold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-600" />
                    <span>{t('call')} {item.contactNumber}</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-purple-200 text-center text-gray-500 text-xs font-medium">
          No facilities match your search filter.
        </div>
      )}
    </div>
  );
};

export default NearbyFacilities;

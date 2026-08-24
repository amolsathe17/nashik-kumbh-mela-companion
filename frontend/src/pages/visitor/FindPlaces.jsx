import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, Search, Navigation, Phone, CheckCircle, AlertTriangle, 
  Map as MapIcon, ListFilter, Compass 
} from 'lucide-react';
import api from '../../services/api';

const FindPlaces = () => {
  const { t } = useLanguage();
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);

  const categories = [
    'All', 'Ghat', 'Temple', 'Toilet', 'Drinking Water', 
    'Medical Centre', 'Police/Help Centre', 'Parking', 'Food Area', 'Camp/Accommodation'
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/locations');
        if (res.data.success) {
          setLocations(res.data.data);
        }
      } catch (err) {
        console.log('Error fetching locations');
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(loc => {
    const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory;
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          loc.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'Ghat': return '🌊';
      case 'Temple': return '🛕';
      case 'Toilet': return '🚻';
      case 'Drinking Water': return '💧';
      case 'Medical Centre': return '🏥';
      case 'Police/Help Centre': return '👮';
      case 'Parking': return '🅿️';
      case 'Food Area': return '🍽️';
      case 'Camp/Accommodation': return '🏕️';
      default: return '📍';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            🗺️
          </div>
          <div>
            <h2 className="text-2xl font-black">{t('findPlaces')}</h2>
            <p className="text-xs text-amber-100 font-medium">Smart Map & Essential Pilgrim Locations</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-amber-800/60 p-1 rounded-2xl border border-amber-400/30 text-xs">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${viewMode === 'list' ? 'bg-white text-amber-900 shadow' : 'text-amber-100'}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${viewMode === 'map' ? 'bg-white text-amber-900 shadow' : 'text-amber-100'}`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 bg-white border border-amber-200 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-amber-500 outline-none rtl:pr-11 rtl:pl-4"
          />
        </div>

        {/* Category Chips Scrollable Horizontal */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                  : 'bg-white text-gray-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <span>{getCategoryEmoji(cat)}</span>
              <span>{cat === 'All' ? t('allCategories') : cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map View Mode Simulation */}
      {viewMode === 'map' && (
        <div className="bg-amber-100 border-2 border-amber-300 rounded-3xl p-6 text-center shadow-inner relative overflow-hidden h-72 flex flex-col items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <MapIcon className="w-16 h-16 text-amber-600 mb-2 animate-pulse" />
          <h3 className="text-lg font-bold text-amber-900">Interactive Map View Active</h3>
          <p className="text-xs text-amber-800 max-w-sm mt-1">
            Displaying {filteredLocations.length} pin markers across Nashik & Trimbakeshwar. Tap any card below for instant turn-by-turn navigation.
          </p>
        </div>
      )}

      {/* Locations List */}
      {loading ? (
        <div className="p-8 text-center text-gray-500 font-medium">Searching locations...</div>
      ) : filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLocations.map((loc) => (
            <div 
              key={loc._id} 
              className="bg-white rounded-3xl p-5 border border-amber-200 shadow-md hover:shadow-lg transition-shadow space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-2xl">{getCategoryEmoji(loc.category)}</span>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 leading-snug">{loc.name}</h4>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full mt-0.5">
                        {loc.category}
                      </span>
                    </div>
                  </div>

                  {loc.verified && (
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> {t('verified')}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{loc.description}</p>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> {loc.address}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                {loc.contactNumber ? (
                  <a
                    href={`tel:${loc.contactNumber}`}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Center
                  </a>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-bold">Status: {loc.status}</span>
                )}

                {/* Take Me There Navigation Button */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.coordinates?.lat || 20.0063},${loc.coordinates?.lng || 73.7915}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-transform hover:scale-102"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{t('takeMeThere')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-300 text-gray-500">
          No locations match your current search or category filter.
        </div>
      )}
    </div>
  );
};

export default FindPlaces;

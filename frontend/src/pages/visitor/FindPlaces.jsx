import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, Search, Navigation, Phone, CheckCircle, AlertTriangle, 
  Map as MapIcon, Compass, Clock, ShieldCheck, Sparkles,
  Info, ExternalLink, X, Building2, Droplets, Utensils, HeartPulse, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

const FindPlaces = () => {
  const tabsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = tabsRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const { t } = useLanguage();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [locations]);
  const [selectedCategory, setSelectedCategory] = useState('Ghat');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Category tabs strictly for main place types (Ghats & Temples)
  const categories = ['Ghat', 'Temple'];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
        const customItems = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');

        const res = await api.get('/locations').catch(() => null);
        let apiItems = (res?.data?.success && Array.isArray(res.data.data)) ? res.data.data : [];

        // Display strictly admin-managed cards from customItems and API
        const allItems = [...customItems, ...apiItems];
        const filtered = allItems.filter(item => 
          item && 
          item.category !== 'Medical' && 
          item.category !== 'Medical Centre' && 
          !deletedIds.includes(item._id) &&
          !deletedIds.includes(item.id)
        );

        // Strict deduplication by normalized name and ID
        const seenNames = new Set();
        const seenIds = new Set();
        const uniqueLocations = [];

        for (const item of filtered) {
          const normName = String(item.name || '').trim().toLowerCase();
          const itemId = String(item._id || item.id || '').trim();

          if (seenNames.has(normName) || (itemId && seenIds.has(itemId))) {
            continue;
          }
          if (normName) seenNames.add(normName);
          if (itemId) seenIds.add(itemId);

          uniqueLocations.push({
            ...item,
            address: item.address || item.location || 'Panchavati, Nashik, Maharashtra 422003',
            description: item.description || item.capacityNotes || item.details || item.notes || 'Official Nashik Kumbh Mela facility and pilgrim service location.',
            image: item.image || item.imageUrl || '/shahi-snan.jpg',
            timings: item.timings || item.hours || 'Open 24 Hours',
            distance: item.distance || 'Central Kumbh Area',
            contactNumber: item.contactNumber || item.phone || '0253-2575555',
            facilities: (item.facilities && item.facilities.length > 0) ? item.facilities : ['24/7 Service', 'Verified Site', 'Helpdesk']
          });
        }

        // Apply custom sequence ordering set by Admin
        const orderIds = JSON.parse(localStorage.getItem('kumbh_order_locations') || '[]');
        if (orderIds && orderIds.length > 0) {
          const orderMap = new Map();
          orderIds.forEach((id, idx) => orderMap.set(String(id), idx));

          uniqueLocations.sort((a, b) => {
            const idA = String(a._id || a.id || '');
            const idB = String(b._id || b.id || '');
            const posA = orderMap.has(idA) ? orderMap.get(idA) : 99999;
            const posB = orderMap.has(idB) ? orderMap.get(idB) : 99999;
            return posA - posB;
          });
        }

        // Filter strictly to main place categories (Ghats & Temples)
        const placeLocations = uniqueLocations.filter(item => isPlaceCategory(item.category));
        setLocations(placeLocations);
      } catch (err) {
        setLocations(defaultLocations.filter(item => isPlaceCategory(item.category)));
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const isPlaceCategory = (catStr) => {
    if (!catStr) return false;
    const s = String(catStr).trim().toLowerCase();
    return s.includes('ghat') || s.includes('temple') || s.includes('mandir');
  };

  const matchCategory = (itemCat, targetCat) => {
    if (!itemCat || !isPlaceCategory(itemCat)) return false;
    if (!targetCat || targetCat === 'All') return true;

    const normalize = (catStr) => {
      const s = String(catStr || '').trim().toLowerCase();
      if (s.includes('ghat')) return 'ghat';
      if (s.includes('temple') || s.includes('mandir')) return 'temple';
      return s;
    };

    return normalize(itemCat) === normalize(targetCat);
  };

  const filteredLocations = locations.filter(loc => {
    const matchesCategory = matchCategory(loc.category, selectedCategory);
    const searchLow = searchTerm.toLowerCase();
    const nameStr = loc.name ? loc.name.toLowerCase() : '';
    const addrStr = (loc.address || loc.location || '').toLowerCase();
    const descStr = (loc.description || loc.capacityNotes || '').toLowerCase();

    const matchesSearch = searchLow === '' || nameStr.includes(searchLow) || addrStr.includes(searchLow) || descStr.includes(searchLow);
    return matchesCategory && matchesSearch;
  });

  const countForCategory = (cat) => {
    return locations.filter(loc => matchCategory(loc.category, cat)).length;
  };

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'All': return '📋';
      case 'Ghat': return '🌊';
      case 'Temple': return '🛕';
      case 'Police/Help Centre': return '👮';
      case 'Parking': return '🅿️';
      case 'Drinking Water': return '💧';
      case 'Toilet': return '🚻';
      case 'Food Area': return '🍛';
      case 'Camp/Accommodation': return '⛺';
      case 'Info / Help': return 'ℹ️';
      default: return '📍';
    }
  };

  const getGoogleMapsDirectionsUrl = (loc) => {
    const destinationQuery = loc.searchQuery || `${loc.name}, ${loc.address || loc.location || 'Nashik'}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md border border-white/20">
            🗺️
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight truncate">{t('findPlaces')}</h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium mt-0.5 truncate">
              {t('locatePlacesSub') || 'Official Directory for Ghats, Temples, Parking, Water & Pilgrim Services'}
            </p>
          </div>
        </div>

        {/* Header Right Action Group: List View Badge & Map View Toggle */}
        <div className="flex items-center gap-3 self-start sm:self-auto z-10 flex-shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-amber-950/60 text-amber-100 border border-amber-400/40 text-xs font-bold shadow-md">
            📋 List View ({locations.length})
          </span>
          <button
            onClick={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')}
            className="lg:hidden px-4 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900 text-amber-100 font-bold text-xs border border-amber-400/40 shadow-md transition-all"
          >
            {viewMode === 'map' ? '📋 List View' : '🗺️ Map View'}
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filter Bar Row: Search Left, Scrollable Tabs with Circular Arrow Buttons Right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Search Bar Input */}
        <div className="relative lg:w-72 xl:w-80 flex-shrink-0">
          <Search className="w-5 h-5 text-amber-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-amber-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Filter Chips Horizontal Scroll placed on the Right Side of Search with Circular Left/Right Arrow Buttons & Scrollbar */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-amber-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4 text-amber-700" />
            </button>
          )}

          <div
            ref={tabsRef}
            onScroll={checkScroll}
            className="flex-1 min-w-0 overflow-x-auto py-1 text-xs scrollbar-thin scrollbar-thumb-amber-300 scroll-smooth"
          >
            <div className="flex items-center gap-2 flex-nowrap min-w-max">
              {categories.map((cat) => {
                const count = countForCategory(cat);
                const categoryLabel = cat === 'All' ? t('allCategories') : (t(cat) || cat);
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border flex-shrink-0 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md scale-102'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    <span>{getCategoryEmoji(cat)}</span>
                    <span>{categoryLabel}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      isSelected ? 'bg-amber-950/40 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="w-8 h-8 rounded-full bg-white hover:bg-amber-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4 text-amber-700" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map View Simulation (Hidden on Desktop / Laptop) */}
      {viewMode === 'map' && (
        <div className="lg:hidden bg-[#fffbeb] border-2 border-amber-300/80 rounded-[28px] p-6 sm:p-8 text-center shadow-md relative overflow-hidden flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-200/60 flex items-center justify-center text-amber-900 shadow-sm border border-amber-300/60">
            <MapIcon className="w-8 h-8 text-amber-900" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-950 tracking-tight">Map View Active</h3>
          <p className="text-xs sm:text-sm text-slate-700 max-w-lg leading-relaxed font-medium">
            Displaying pin markers on map. Click 'Take Me There' to start live GPS navigation.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Ramkund+Holy+Ghat,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-cyan-100/90 hover:bg-cyan-200 text-cyan-950 border border-cyan-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🌊</span>
              <span>Ramkund Holy Ghat</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Trimbakeshwar+Temple,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🛕</span>
              <span>Trimbakeshwar Temple</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Tapovan+Parking,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-indigo-100/90 hover:bg-indigo-200 text-indigo-950 border border-indigo-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🅿️</span>
              <span>Tapovan Shuttle</span>
            </button>
          </div>
        </div>
      )}

      {/* Locations List Grid (Always Grid on Desktop) */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">
          Searching Nashik & Trimbakeshwar Kumbh locations...
        </div>
      ) : filteredLocations.length > 0 ? (
        <div className={`${viewMode === 'map' ? 'hidden lg:grid' : 'grid'} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`}>
          {filteredLocations.map((loc) => {
            const categoryLabel = t(loc.category) || loc.category;
            const displayAddress = loc.address || loc.location || 'Panchavati, Nashik, Maharashtra 422003';
            const displayDesc = loc.description || loc.capacityNotes || loc.details || loc.notes || 'Official Nashik Kumbh Mela facility and pilgrim service location.';
            const displayImage = loc.image || loc.imageUrl || '/shahi-snan.jpg';
            const displayTimings = loc.timings || loc.hours || 'Open 24 Hours';
            const displayDistance = loc.distance || 'Central Kumbh Area';

            return (
              <div 
                key={loc._id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col h-full"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Card Header Image / Video */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      {String(displayImage).includes('/video/') || String(displayImage).endsWith('.mp4') || String(displayImage).endsWith('.webm') || String(displayImage).endsWith('.mov') ? (
                        <video src={displayImage} controls className="w-full h-full object-cover" />
                      ) : (
                        <img 
                          src={displayImage} 
                          alt={t(loc.name)} 
                          onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-amber-400/40 flex items-center space-x-1">
                        <span>{getCategoryEmoji(loc.category)}</span>
                        <span>{categoryLabel}</span>
                      </div>
                    </div>

                    {/* Card Body Info */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{loc.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{displayDesc}</p>

                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="flex items-center space-x-2 text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span className="truncate">{displayAddress}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{displayTimings}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-amber-700 font-bold">
                          <Navigation className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>{displayDistance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perfectly Aligned Pill-Shaped Get Directions Button */}
                <div className="p-5 pt-0 mt-auto flex justify-start">
                  <a
                    href={getGoogleMapsDirectionsUrl(loc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md inline-flex items-center space-x-2 transition-all hover:scale-105 border border-amber-500 flex-shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Direction</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No places found in "{selectedCategory}"</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or select "All Categories".</p>
        </div>
      )}
    </div>
  );
};

export default FindPlaces;

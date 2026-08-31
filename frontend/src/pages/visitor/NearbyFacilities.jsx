import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Building2, CheckCircle, MapPin, Phone, Search, Utensils, Home as HomeIcon, 
  HeartPulse, Droplets, Navigation, Clock, Compass, Shield, Sparkles,
  Info, ExternalLink, X, Bus, HelpCircle, ChevronLeft, ChevronRight, Map as MapIcon
} from 'lucide-react';
import api from '../../services/api';
import { defaultLocations, getMergedLocations, matchCategory } from '../../data/initialLocations';

const NearbyFacilities = () => {
  const tabsRef = useRef(null);
  const [viewMode, setViewMode] = useState('list');
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
  const [selectedCat, setSelectedCat] = useState('Accommodation');
  const [search, setSearch] = useState('');
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [facilities]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Categories without All tab chip
  const categories = [
    'Accommodation', 'Food Area', 'Drinking Water', 'Toilet', 
    'Pharmacy', 'Parking', 'Police Centre', 'Transport'
  ];

  const getCatEmoji = (cat) => {
    switch (cat) {
      case 'All': return '📋';
      case 'Accommodation': return '🎪';
      case 'Food Area': return '🍛';
      case 'Drinking Water': return '🚰';
      case 'Toilet': return '🚻';
      case 'Pharmacy': return '💊';
      case 'Parking': return '🅿️';
      case 'Police Centre': return '👮';
      case 'Transport': return '🚌';
      default: return '✨';
    }
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const deletedIds = [
          ...JSON.parse(localStorage.getItem('kumbh_deleted_facilities') || '[]'),
          ...JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]')
        ];
        const customItems = [
          ...getMergedLocations(),
          ...JSON.parse(localStorage.getItem('kumbh_custom_facilities') || '[]')
        ];

        const res = await api.get('/facilities').catch(() => null);
        let apiItems = (res?.data?.success && Array.isArray(res.data.data)) ? res.data.data : [];

        // Display Admin created cards first, API items, then baseline initial locations
        const allItems = [...customItems, ...apiItems, ...defaultLocations];
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
        const uniqueFacilities = [];

        for (const item of filtered) {
          const normName = String(item.name || '').trim().toLowerCase();
          const itemId = String(item._id || item.id || '').trim();

          if (seenNames.has(normName) || (itemId && seenIds.has(itemId))) {
            continue;
          }
          if (normName) seenNames.add(normName);
          if (itemId) seenIds.add(itemId);

          uniqueFacilities.push({
            ...item,
            address: item.address || item.location || 'Panchavati, Nashik, Maharashtra 422003',
            description: item.description || item.capacityNotes || item.details || item.notes || 'Verified pilgrim assistance facility equipped with essential infrastructure for Simhastha Kumbh 2026-2027.',
            image: item.image || item.imageUrl || '/shahi-snan.jpg',
            timings: item.timings || item.hours || 'Open 24 Hours (Continuous Service)',
            distance: item.distance || 'Central Kumbh Corridor (5 mins walk)',
            contactNumber: item.contactNumber || item.contactInfo || item.phone || '0253-2575555',
            facilities: (item.facilities && item.facilities.length > 0) ? item.facilities : ['24/7 Operational', 'Verified Desk', 'Clean Amenities']
          });
        }

        // Apply custom sequence ordering set by Admin
        const orderIds = JSON.parse(localStorage.getItem('kumbh_order_facilities') || '[]');
        if (orderIds && orderIds.length > 0) {
          const orderMap = new Map();
          orderIds.forEach((id, idx) => orderMap.set(String(id), idx));

          uniqueFacilities.sort((a, b) => {
            const idA = String(a._id || a.id || '');
            const idB = String(b._id || b.id || '');
            const posA = orderMap.has(idA) ? orderMap.get(idA) : 99999;
            const posB = orderMap.has(idB) ? orderMap.get(idB) : 99999;
            return posA - posB;
          });
        }

        setFacilities(uniqueFacilities);
      } catch (err) {
        setFacilities(defaultLocations);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const filteredFacilities = facilities.filter(fac => {
    const matchesCategory = matchCategory(fac.category, selectedCat);
    const searchLow = search.toLowerCase();
    const nameStr = fac.name ? fac.name.toLowerCase() : '';
    const addrStr = (fac.address || fac.location || '').toLowerCase();
    const descStr = (fac.description || fac.capacityNotes || '').toLowerCase();

    const matchesSearch = searchLow === '' || nameStr.includes(searchLow) || addrStr.includes(searchLow) || descStr.includes(searchLow);
    return matchesCategory && matchesSearch;
  });

  const countForCategory = (cat) => {
    return facilities.filter(fac => matchCategory(fac.category, cat)).length;
  };

  const getCatIcon = (cat) => {
    switch (cat) {
      case 'All': return '📋';
      case 'Accommodation': return '⛺';
      case 'Food Area': return '🍛';
      case 'Drinking Water': return '💧';
      case 'Toilet': return '🚻';
      case 'Pharmacy': return '💊';
      case 'Parking': return '🅿️';
      case 'Police Centre': return '👮';
      case 'Transport': return '🚌';
      default: return '📍';
    }
  };

  const getGoogleMapsDirectionsUrl = (fac) => {
    const destinationQuery = fac.searchQuery || `${fac.name}, ${fac.address || fac.location || 'Nashik'}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md border border-white/20">
            📍
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight truncate">{t('nearbyFacilities')}</h2>
            <p className="text-xs sm:text-sm text-purple-100 font-medium mt-0.5 truncate">
              Verified Pilgrim Camps, Free Food Arenas, RO Water Stations & Emergency Posts
            </p>
          </div>
        </div>

        {/* Header Right Action Group: List View Badge & Map View Toggle */}
        <div className="flex items-center gap-3 self-start sm:self-auto z-10 flex-shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-purple-950/60 text-purple-100 border border-purple-400/40 text-xs font-bold shadow-md">
            📋 List View ({facilities.length})
          </span>
          <button
            onClick={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')}
            className="lg:hidden px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-purple-100 font-bold text-xs border border-purple-400/40 shadow-md transition-all"
          >
            {viewMode === 'map' ? '📋 List View' : '🗺️ Map View'}
          </button>
        </div>
      </div>

      {/* Interactive Map View Simulation (Hidden on Desktop / Laptop) */}
      {viewMode === 'map' && (
        <div className="lg:hidden bg-[#fffbeb] border-2 border-amber-300/80 rounded-[28px] p-6 sm:p-8 text-center shadow-md relative overflow-hidden flex flex-col items-center justify-center space-y-3 animate-fade-in">
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
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Tapovan+Sadhugram+Tent+City,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-cyan-100/90 hover:bg-cyan-200 text-cyan-950 border border-cyan-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>⛺</span>
              <span>Sadhugram Tents</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Ramkund+Water+Post,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🚰</span>
              <span>Ramkund Water Post</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Tapovan+Parking,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-indigo-100/90 hover:bg-indigo-200 text-indigo-950 border border-indigo-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🅿️</span>
              <span>Tapovan Parking</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Category Filter Chips Row: Search Left, Scrollable Tabs with Circular Arrow Buttons Right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Search Bar Input */}
        <div className="relative lg:w-72 xl:w-80 flex-shrink-0">
          <Search className="w-5 h-5 text-purple-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nearby camps..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-purple-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Horizontal Filter Chips placed on the Right Side of Search with Circular Left/Right Arrow Buttons & Scrollbar */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-purple-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4 text-purple-700" />
            </button>
          )}

          <div
            ref={tabsRef}
            onScroll={checkScroll}
            className="flex-1 min-w-0 overflow-x-auto py-1 text-xs scrollbar-thin scrollbar-thumb-purple-300 scroll-smooth"
          >
            <div className="flex items-center gap-2 flex-nowrap min-w-max">
              {categories.map((cat) => {
                const count = countForCategory(cat);
                const isSelected = selectedCat === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border flex-shrink-0 ${
                      isSelected
                        ? 'bg-purple-700 text-white border-purple-600 shadow-md scale-102'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                    }`}
                  >
                    <span>{getCatEmoji(cat)}</span>
                    <span>{cat === 'All' ? 'All Facilities' : cat}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      isSelected ? 'bg-purple-950/40 text-white' : 'bg-slate-100 text-slate-700'
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
              className="w-8 h-8 rounded-full bg-white hover:bg-purple-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4 text-purple-700" />
            </button>
          )}
        </div>
      </div>

      {/* Facilities Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">
          Loading nearby Kumbh facilities...
        </div>
      ) : filteredFacilities.length > 0 ? (
        <div className={`${viewMode === 'map' ? 'hidden lg:grid' : 'grid'} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`}>
          {filteredFacilities.map((fac) => {
            const displayAddress = fac.address || fac.location || 'Panchavati, Nashik, Maharashtra 422003';
            const displayDesc = fac.description || fac.capacityNotes || fac.details || fac.notes || 'Verified pilgrim assistance facility equipped with essential infrastructure for Simhastha Kumbh 2026-2027.';
            const displayImage = fac.image || fac.imageUrl || '/shahi-snan.jpg';
            const displayTimings = fac.timings || fac.hours || 'Open 24 Hours';
            const displayDistance = fac.distance || 'Central Kumbh Corridor';

            return (
              <div 
                key={fac._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col h-full"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      {String(displayImage).includes('/video/') || String(displayImage).endsWith('.mp4') || String(displayImage).endsWith('.webm') || String(displayImage).endsWith('.mov') ? (
                        <video src={displayImage} controls className="w-full h-full object-cover" />
                      ) : (
                        <img 
                          src={displayImage} 
                          alt={fac.name}
                          onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur-md text-purple-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-purple-400/40 flex items-center space-x-1">
                        <span>{getCatIcon(fac.category)}</span>
                        <span>{fac.category}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{fac.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{displayDesc}</p>

                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="flex items-center space-x-2 text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                          <span className="truncate">{displayAddress}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{displayTimings}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-purple-700 font-bold">
                          <Navigation className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                          <span>{displayDistance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perfectly Aligned Pill-Shaped Get Direction Button */}
                <div className="p-5 pt-0 mt-auto flex justify-start">
                  <a
                    href={getGoogleMapsDirectionsUrl(fac)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md inline-flex items-center space-x-2 transition-all hover:scale-105 border border-purple-500 flex-shrink-0"
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
          <Building2 className="w-10 h-10 text-purple-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No facilities found in "{selectedCat}"</h3>
          <p className="text-xs text-slate-500">Select "All" to view all available nearby facilities.</p>
        </div>
      )}
    </div>
  );
};

export default NearbyFacilities;

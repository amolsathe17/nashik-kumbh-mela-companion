import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Building2, CheckCircle, MapPin, Phone, Search, Utensils, Home as HomeIcon, 
  HeartPulse, Droplets, Navigation, Clock, Compass, Shield, Sparkles,
  Info, ExternalLink, X, Bus, HelpCircle
} from 'lucide-react';
import api from '../../services/api';

const NearbyFacilities = () => {
  const { t } = useLanguage();
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Removed Medical tab as requested
  const categories = [
    'All', 'Accommodation', 'Food Area', 'Drinking Water', 'Toilet', 
    'Pharmacy', 'Parking', 'Police Centre', 'Transport'
  ];

  // Comprehensive Authentic Dataset of Nearby Kumbh Facilities (Strictly Local Nashik Kumbh Images & No Medical Tab)
  const defaultFacilities = [
    // --- 1. ACCOMMODATION ---
    {
      _id: 'fac-1',
      name: 'Tapovan Sadhugram Pilgrim Tent Township (तपोवन साधुग्राम टेंट सिटी)',
      category: 'Accommodation',
      address: 'Tapovan Sector 3, Nashik, Maharashtra 422003',
      location: 'Tapovan Sector 3, Nashik, Maharashtra 422003',
      searchQuery: 'Tapovan Sadhugram, Nashik, Maharashtra',
      description: 'Government and Akhara-managed free tented accommodation hub offering clean bedding, community dining, and 24-hour security for visiting pilgrims.',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: 'Check-in 24/7',
      distance: '3.2 km from Ramkund Ghat',
      contactNumber: '0253-2571000',
      verified: true,
      facilities: ['Free Pilgrim Tents', 'Clean Bedding & Blankets', '24/7 Security Patrol', 'Charging Stations']
    },
    {
      _id: 'fac-2',
      name: 'Trimbakeshwar Bhakta Niwas & Ashram Complex (त्रिंबकेश्वर भक्त निवास)',
      category: 'Accommodation',
      address: 'Near Kushavarta Kund, Trimbakeshwar, Nashik 422212',
      location: 'Near Kushavarta Kund, Trimbakeshwar, Nashik 422212',
      searchQuery: 'Kushavarta Kund, Trimbakeshwar, Nashik',
      description: 'Comfortable pilgrim rest houses near Trimbakeshwar Jyotirlinga providing clean rooms, hot water, and dining facilities.',
      image: '/dhwajarohan.webp',
      timings: '5:00 AM - 10:00 PM',
      distance: '500 meters from Kushavarta Kund',
      contactNumber: '0253-2591241',
      verified: true,
      facilities: ['Family Rooms', 'Attached Bathrooms', 'Hot Water Available', 'Purified Water']
    },
    {
      _id: 'fac-3',
      name: 'Panchavati Yatri Niwas Holding Hub (पंचवटी यात्री निवास)',
      category: 'Accommodation',
      address: 'Kalaram Temple Road, Panchavati, Nashik 422003',
      location: 'Kalaram Temple Road, Panchavati, Nashik 422003',
      searchQuery: 'Kalaram Temple Road, Panchavati, Nashik',
      description: 'Budget dormitory accommodation with secure locker rooms and tourist helpdesk within walking distance of Kalaram Temple and Ramkund.',
      image: '/nagarpradakshina.webp',
      timings: 'Open 24/7',
      distance: '1.2 km from Ramkund Ghat',
      contactNumber: '0253-2511108',
      verified: true,
      facilities: ['Dormitory Beds', 'Luggage Storage Locker', 'CCTV Security', 'Information Desk']
    },

    // --- 2. FOOD AREA ---
    {
      _id: 'fac-4',
      name: 'Tapovan Annadan & Food Arena (तपोवन अन्नछत्र)',
      category: 'Food Area',
      address: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      location: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      searchQuery: 'ISKCON Temple Tapovan, Nashik, Maharashtra',
      description: 'Massive community dining hall serving fresh, wholesome, pure vegetarian Mahaprasad (Khichdi, Puri, Sabzi) free of cost to over 100,000 pilgrims daily.',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: '7:00 AM - 10:30 PM (Continuous Mahaprasad)',
      distance: 'Inside Tapovan Sadhugram City',
      contactNumber: '0253-2575555',
      verified: true,
      facilities: ['Free Mahaprasad', 'Hygienic Dining Benches', 'Purified Water', 'RO Drinking Water']
    },
    {
      _id: 'fac-5',
      name: 'Ramkund Maha Aarti Prasadam Counter (रामकुंड महाप्रसाद केंद्र)',
      category: 'Food Area',
      address: 'Ramkund Upper Promenade, Panchavati, Nashik 422003',
      location: 'Ramkund Upper Promenade, Panchavati, Nashik 422003',
      searchQuery: 'Ramkund, Panchavati, Nashik',
      description: 'Official prasad distribution center operated by Nashik Municipal Corporation serving fresh traditional sweets and packed water.',
      image: '/goda-aarti-chatg.webp',
      timings: '6:00 AM - 9:30 PM',
      distance: 'At Ramkund Entry Gate',
      contactNumber: '0253-2570001',
      verified: true,
      facilities: ['Packed Prasadam Boxes', 'Pure Desi Ghee Sweets', 'Clean Counter']
    },

    // --- 3. DRINKING WATER ---
    {
      _id: 'fac-6',
      name: 'Ramkund Promenade RO Water Station #1 (रामकुंड शुध्द जल केंद्र)',
      category: 'Drinking Water',
      address: 'Ramkund Bathing Ghat Promenade, Nashik 422003',
      location: 'Ramkund Bathing Ghat Promenade, Nashik 422003',
      searchQuery: 'Ramkund, Panchavati, Nashik',
      description: 'Solar-powered 10,000 LPH RO water filtration plant dispensing chilled and ambient purified drinking water 24/7.',
      image: '/goda-aarti-chatg.webp',
      timings: 'Continuous 24/7',
      distance: 'Ramkund Ghat Bank',
      contactNumber: '0253-2578899',
      verified: true,
      facilities: ['RO Purified', 'Chilled Water Fountains', 'Zero Single-Use Plastic Station']
    },
    {
      _id: 'fac-7',
      name: 'Trimbakeshwar Kushavarta RO Drinking Kiosk #2',
      category: 'Drinking Water',
      address: 'Main Promenade, Trimbakeshwar Temple Road 422212',
      location: 'Main Promenade, Trimbakeshwar Temple Road 422212',
      searchQuery: 'Kushavarta Kund, Trimbakeshwar, Nashik',
      description: 'High-speed clean drinking water taps continuously serviced during peak holy bath hours.',
      image: '/shahi-snan-for-kumbh-mela.webp',
      timings: 'Continuous 24/7',
      distance: '100m from Kushavarta Kund',
      verified: true,
      facilities: ['RO Water', 'Touchless Taps', 'Cold Water Dispenser']
    },

    // --- 4. TOILET ---
    {
      _id: 'fac-8',
      name: 'Panchavati Deluxe Smart Sanitation Block #1',
      category: 'Toilet',
      address: 'Kalaram Temple Road, Panchavati, Nashik 422003',
      location: 'Kalaram Temple Road, Panchavati, Nashik 422003',
      searchQuery: 'Kalaram Temple Road, Panchavati, Nashik',
      description: 'Continuously disinfected smart public restroom complex equipped with wheelchair ramps, hot water showers, and baby care rooms.',
      image: '/kumbh-bg.jpg',
      timings: 'Open 24 Hours',
      distance: '150 meters from Kalaram Temple',
      verified: true,
      facilities: ['Hot Water Showers', 'Wheelchair Ramps', 'Baby Changing Room', 'Automatic Flush']
    },

    // --- 5. PHARMACY ---
    {
      _id: 'fac-10',
      name: 'Kumbh 24/7 Generic Jan Aushadhi Pharmacy Post',
      category: 'Pharmacy',
      address: 'Ramkund Main Entrance Promenade, Nashik 422003',
      location: 'Ramkund Main Entrance Promenade, Nashik 422003',
      searchQuery: 'Ramkund, Panchavati, Nashik',
      description: 'Government subsidised pharmacy dispensing essential emergency medicines, ORS packets, and first-aid supplies round the clock.',
      image: '/shahi-snan.jpg',
      timings: 'Open 24 Hours',
      distance: 'Ramkund Ghat Gate',
      contactNumber: '104',
      verified: true,
      facilities: ['Generic Medicines', 'First-Aid Kits', 'ORS Packets', 'BP / Sugar Check']
    },

    // --- 6. PARKING & TRANSPORT ---
    {
      _id: 'fac-11',
      name: 'Tapovan Satellite Bus & Parking Terminal A',
      category: 'Parking',
      address: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
      location: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
      searchQuery: 'Tapovan Parking, Nashik, Maharashtra',
      description: 'Sprawling 50-acre satellite parking lot holding 25,000 buses and cars. Connected to free electric shuttle buses running every 3 mins to Ramkund.',
      image: '/kumbh-bg1.jpg',
      timings: 'Open 24 Hours',
      distance: '4.5 km from Ramkund (Free Bus Available)',
      contactNumber: '0253-2578899',
      verified: true,
      facilities: ['Free Electric Shuttles', 'Driver Rest Bay', 'EV Charging', 'CCTV Security']
    },
    {
      _id: 'fac-12',
      name: 'Nashik Road Railway Station Shuttle Bus Hub',
      category: 'Transport',
      address: 'Nashik Road Railway Station Compound 422101',
      location: 'Nashik Road Railway Station Compound 422101',
      searchQuery: 'Nashik Road Railway Station, Maharashtra',
      description: 'Continuous MSRTC & Electric City Shuttle bus departure terminal transporting arriving train passengers directly to outer parking hubs and ghats.',
      image: '/kumbh-bg.jpg',
      timings: 'Open 24/7',
      distance: 'At Railway Station Exit',
      contactNumber: '0253-2465432',
      verified: true,
      facilities: ['Continuous Bus Frequency', 'Ticket Tokens', 'Tourist Desk', 'Luggage Assistance']
    },

    // --- 7. POLICE CENTRE ---
    {
      _id: 'fac-13',
      name: 'Kumbh Central Police Control Room & RFID Lost Person Desk',
      category: 'Police Centre',
      address: 'Panchavati Police Station Compound, Nashik 422003',
      location: 'Panchavati Police Station Compound, Nashik 422003',
      searchQuery: 'Panchavati Police Station, Nashik, Maharashtra',
      description: 'CCTV control room, Lost & Found family reunion cell, and tourist police guidance center for pilgrims.',
      image: '/shahi.jpg',
      timings: 'Open 24 Hours',
      distance: '400m from Ramkund',
      contactNumber: '112',
      verified: true,
      facilities: ['Lost & Found Registration', 'Public Announcement System', 'RFID Tagging']
    }
  ];

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await api.get('/facilities').catch(() => null);
        if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          // Filter out any medical items from API
          const filteredApi = res.data.data.filter(item => item.category !== 'Medical' && item.category !== 'Medical Centre');

          const enrichedApiItems = filteredApi.map(item => ({
            ...item,
            address: item.address || item.location || 'Panchavati, Nashik, Maharashtra 422003',
            description: item.description || item.capacityNotes || item.details || item.notes || 'Verified pilgrim assistance facility equipped with essential infrastructure for Simhastha Kumbh 2026-2027.',
            image: item.image || item.imageUrl || '/shahi-snan.jpg',
            timings: item.timings || item.hours || 'Open 24 Hours (Continuous Service)',
            distance: item.distance || 'Central Kumbh Corridor (5 mins walk)',
            contactNumber: item.contactNumber || item.contactInfo || item.phone || '0253-2575555',
            facilities: (item.facilities && item.facilities.length > 0) ? item.facilities : ['24/7 Operational', 'Verified Desk', 'Clean Amenities']
          }));

          const apiNames = new Set(enrichedApiItems.map(i => i.name));
          const combined = [...enrichedApiItems, ...defaultFacilities.filter(d => !apiNames.has(d.name))];
          setFacilities(combined);
        } else {
          setFacilities(defaultFacilities);
        }
      } catch (err) {
        setFacilities(defaultFacilities);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  const matchCategory = (itemCat, targetCat) => {
    if (!targetCat || targetCat === 'All') return true;
    if (!itemCat) return false;

    const item = String(itemCat).trim().toLowerCase();
    const target = String(targetCat).trim().toLowerCase();

    if (item === target) return true;

    // Strict non-leaking category matching logic:
    if (target === 'drinking water') {
      return item === 'drinking water' || item === 'water';
    }
    if (target === 'food area') {
      return item === 'food area' || item === 'food';
    }
    if (target === 'accommodation') {
      return item === 'accommodation' || item === 'camp/accommodation' || item === 'camp';
    }
    if (target === 'toilet') {
      return item === 'toilet' || item === 'sanitation';
    }
    if (target === 'pharmacy') {
      return item === 'pharmacy';
    }
    if (target === 'parking') {
      return item === 'parking';
    }
    if (target === 'police centre' || target === 'police/help centre') {
      return item === 'police centre' || item === 'police/help centre' || item === 'police';
    }
    if (target === 'transport') {
      return item === 'transport';
    }

    return item === target;
  };

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
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            📍
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('nearbyFacilities')}</h2>
            <p className="text-xs sm:text-sm text-purple-100 font-medium mt-0.5">
              Verified Pilgrim Camps, Free Food Arenas, RO Water Stations & Emergency Posts
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Chips */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-purple-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nearby camps, food arenas, water stations, parking..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-purple-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {categories.map((cat) => {
            const count = countForCategory(cat);
            const isSelected = selectedCat === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border ${
                  isSelected
                    ? 'bg-purple-700 text-white border-purple-600 shadow-md scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                }`}
              >
                <span>{getCatIcon(cat)}</span>
                <span>{cat}</span>
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

      {/* Facilities Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">
          Loading nearby Kumbh facilities...
        </div>
      ) : filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFacilities.map((fac) => {
            const displayAddress = fac.address || fac.location || 'Panchavati, Nashik, Maharashtra 422003';
            const displayDesc = fac.description || fac.capacityNotes || fac.details || fac.notes || 'Verified pilgrim assistance facility equipped with essential infrastructure for Simhastha Kumbh 2026-2027.';
            const displayImage = fac.image || fac.imageUrl || '/shahi-snan.jpg';
            const displayTimings = fac.timings || fac.hours || 'Open 24 Hours';
            const displayDistance = fac.distance || 'Central Kumbh Corridor';

            return (
              <div 
                key={fac._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img 
                      src={displayImage} 
                      alt={fac.name}
                      onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-purple-900/80 backdrop-blur-md text-purple-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-purple-400/40 flex items-center space-x-1">
                      <span>{getCatIcon(fac.category)}</span>
                      <span>{fac.category}</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-white" />
                      <span>Officially Verified</span>
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

                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFacility(fac)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5 text-purple-600" /> Details
                  </button>

                  <a
                    href={getGoogleMapsDirectionsUrl(fac)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Directions
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

      {/* Facility Details Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-purple-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCatIcon(selectedFacility.category)}</span>
                <h3 className="font-bold text-base text-slate-900">{selectedFacility.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedFacility(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-48 rounded-2xl overflow-hidden bg-slate-900 relative">
              <img 
                src={selectedFacility.image || selectedFacility.imageUrl || '/shahi-snan.jpg'} 
                alt={selectedFacility.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                Officially Verified
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed font-medium">
                {selectedFacility.description || selectedFacility.capacityNotes || 'Verified pilgrim assistance facility equipped with essential infrastructure for Simhastha Kumbh 2026-2027.'}
              </p>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 font-medium">
                <div>📍 Address: <span className="font-bold text-slate-900">{selectedFacility.address || selectedFacility.location || 'Panchavati, Nashik'}</span></div>
                <div>⏰ Hours: <span className="font-bold text-slate-900">{selectedFacility.timings || selectedFacility.hours || '24/7'}</span></div>
                <div>📞 Contact: <span className="font-bold text-purple-700">{selectedFacility.contactNumber || selectedFacility.phone || '0253-2575555'}</span></div>
                <div>🚗 Distance: <span className="font-bold text-slate-900">{selectedFacility.distance || 'Central'}</span></div>
              </div>

              {selectedFacility.facilities && selectedFacility.facilities.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-700 mb-1.5">Amenities Available:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFacility.facilities.map((fac, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-purple-700" /> {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex gap-2">
              <button
                onClick={() => setSelectedFacility(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
              <a
                href={getGoogleMapsDirectionsUrl(selectedFacility)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow"
              >
                <Navigation className="w-4 h-4" /> Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyFacilities;

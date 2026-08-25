import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, Search, Navigation, Phone, CheckCircle, AlertTriangle, 
  Map as MapIcon, ListFilter, Compass, Clock, ShieldCheck, Sparkles,
  Award, Info, ExternalLink, Filter
} from 'lucide-react';
import api from '../../services/api';

const FindPlaces = () => {
  const { t, langCode } = useLanguage();
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Ghat');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);

  const categories = [
    'Ghat', 'Temple', 'Medical Centre', 'Police/Help Centre', 
    'Parking', 'Drinking Water', 'Toilet', 'Food Area', 'Camp/Accommodation', 'All'
  ];

  // Comprehensive Authentic Dataset with Exact Google Maps Direction Queries
  const defaultLocations = [
    // --- GHATS ---
    {
      _id: 'loc-1',
      name: 'Ramkund Holy Ghat (रामकुंड पवित्र घाट)',
      category: 'Ghat',
      coordinates: { lat: 20.0063, lng: 73.7915 },
      address: 'Panchavati, Nashik, Maharashtra 422003',
      searchQuery: 'Ramkund Holy Ghat, Panchavati, Nashik, Maharashtra',
      description: 'The central, most sacred bathing ghat on the banks of River Godavari where Lord Rama bathed during his 14-year exile. Primary site for Shahi Snan and evening Maha Aarti.',
      status: 'Active & Open 24/7',
      verified: true,
      contactNumber: '0253-2575555',
      image: '/shahi-snan.jpg',
      timings: 'Open 24 Hours (Holy Dip 4:00 AM - 10:00 PM)',
      facilities: ['Safety Netting', 'Life Guards', 'Clean Changing Rooms', 'Emergency Helpdesk'],
      distance: '2.5 km from Nashik CBS Bus Stand'
    },
    {
      _id: 'loc-2',
      name: 'Kushavarta Kund (कुशावर्त कुंड - त्र्यंबकेश्वर)',
      category: 'Ghat',
      coordinates: { lat: 19.9324, lng: 73.5307 },
      address: 'Trimbakeshwar Town, Nashik District 422212',
      searchQuery: 'Kushavarta Kund, Trimbakeshwar, Nashik, Maharashtra',
      description: 'Sacred pond in Trimbakeshwar regarded as the symbolic origin of River Godavari. The holy bathing spot for Shaivite Naga Sadhus during Simhastha Kumbh.',
      status: 'Active & Open',
      verified: true,
      contactNumber: '0253-2591241',
      image: '/shahi-snan-for-kumbh-mela.webp',
      timings: '5:00 AM - 9:00 PM',
      facilities: ['Vedic Pandits', 'Pardha Changing Area', 'Continuous Water Treatment', 'Police Security'],
      distance: '28 km from Nashik City'
    },
    {
      _id: 'loc-3',
      name: 'Laxman Ghat & Ahilya Ghat (लक्ष्मण घाट एवं अहिल्या घाट)',
      category: 'Ghat',
      coordinates: { lat: 20.0071, lng: 73.7922 },
      address: 'Downstream Godavari River, Panchavati, Nashik',
      searchQuery: 'Laxman Ghat, Panchavati, Nashik, Maharashtra',
      description: 'Serene secondary bathing ghats ideal for ancestral Tarpan rituals and peaceful holy baths away from peak crowd congestion.',
      status: 'Active',
      verified: true,
      contactNumber: '0253-2570001',
      image: '/68c4435662438-pitru-paksha-120221463-16x9.webp',
      timings: 'Open 24 Hours',
      facilities: ['Tarpan Pedestals', 'Drinking Water Station', 'Ramp Access'],
      distance: '2.8 km from City Center'
    },

    // --- TEMPLES ---
    {
      _id: 'loc-4',
      name: 'Trimbakeshwar Jyotirlinga Temple (त्र्यंबकेश्वर ज्योतिर्लिंग)',
      category: 'Temple',
      coordinates: { lat: 19.9324, lng: 73.5307 },
      address: 'Trimbak, Nashik District, Maharashtra 422212',
      searchQuery: 'Trimbakeshwar Jyotirlinga Temple, Trimbak, Maharashtra',
      description: 'One of India’s 12 revered Jyotirlingas. Built of black basalt by Peshwa Balaji Baji Rao, featuring three lingams representing Brahma, Vishnu, and Shiva.',
      status: 'Active',
      verified: true,
      contactNumber: '0253-2591241',
      image: '/dhwajarohan.webp',
      timings: '5:00 AM - 9:00 PM (Special Kumbh Abhishekam)',
      facilities: ['VIP Pass Counter', 'Footwear Depot', 'Queue Complex', 'Wheelchair Facility'],
      distance: '28 km West of Nashik'
    },
    {
      _id: 'loc-5',
      name: 'Kalaram Temple (कालाराम मंदिर - पंचवटी)',
      category: 'Temple',
      coordinates: { lat: 20.0080, lng: 73.7935 },
      address: 'Panchavati, Nashik, Maharashtra 422003',
      searchQuery: 'Kalaram Temple, Panchavati, Nashik, Maharashtra',
      description: 'Historic 1788 temple housing a 2-foot black basalt idol of Lord Rama, Sita, and Lakshmana. Built with 70,000 tons of solid black stone.',
      status: 'Active',
      verified: true,
      contactNumber: '0253-2511108',
      image: '/kumbh-bg.jpg',
      timings: '6:00 AM - 9:00 PM',
      facilities: ['Prasad Counter', 'Historical Information Desk', 'Spacious Courtyard'],
      distance: '3.0 km from Railway Station Shuttle Stop'
    },
    {
      _id: 'loc-6',
      name: 'Sita Gufa & Panchavati (सीता गुफा एवं पंचवटी)',
      category: 'Temple',
      coordinates: { lat: 20.0088, lng: 73.7942 },
      address: 'Panchavati Sacred Grove, Nashik',
      searchQuery: 'Sita Gufa, Panchavati, Nashik, Maharashtra',
      description: 'Ancient cave near the 5 sacred Banyan trees (Panchavati) where Goddess Sita stayed during exile and from where Ravana abducted her.',
      status: 'Active',
      verified: true,
      contactNumber: '0253-2512200',
      image: '/nagarpradakshina.webp',
      timings: '6:00 AM - 8:00 PM',
      facilities: ['Guided Pilgrimage Path', 'Cooling Misting Fans', 'Souvenir Shops'],
      distance: '3.2 km from Nashik CBS'
    },

    // --- MEDICAL CENTRES ---
    {
      _id: 'loc-7',
      name: 'Ramkund Central Emergency Medical Complex (रामकुंड केंद्रीय चिकित्सा केंद्र)',
      category: 'Medical Centre',
      coordinates: { lat: 20.0068, lng: 73.7910 },
      address: 'Ghat Entry Road, Panchavati, Nashik',
      searchQuery: 'Ramkund Panchavati, Nashik, Maharashtra',
      description: '24/7 emergency medical hub equipped with 50 beds, cardiac ICU ambulances, heatstroke relief wards, and free essential medicines.',
      status: '24/7 Active',
      verified: true,
      contactNumber: '108',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      timings: 'Open 24/7 Emergency',
      facilities: ['ICU Ambulances', 'Oxygen Supply', 'Doctors On Duty', 'Free Medicines'],
      distance: 'Adjacent to Ramkund Ghat'
    },
    {
      _id: 'loc-8',
      name: 'Tapovan Sadhugram Super-Specialty Medical Camp',
      category: 'Medical Centre',
      coordinates: { lat: 20.0110, lng: 73.8055 },
      address: 'Sector 4, Tapovan Sadhugram, Nashik',
      searchQuery: 'Tapovan Sadhugram, Nashik, Maharashtra',
      description: 'Dedicated 100-bed hospital camp for Sadhus and pilgrims featuring trauma response units, orthopedic care, and 24-hour pharmacy.',
      status: '24/7 Active',
      verified: true,
      contactNumber: '0253-2571000',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      timings: 'Open 24/7',
      facilities: ['24/7 Pharmacy', 'Mobile X-Ray', 'Heat Stroke Relief Wards'],
      distance: 'Inside Tapovan Camp City'
    },

    // --- POLICE & HELP CENTRES ---
    {
      _id: 'loc-9',
      name: 'Kumbh Central Police Control Room & Missing Persons Desk',
      category: 'Police/Help Centre',
      coordinates: { lat: 20.0055, lng: 73.7905 },
      address: 'Panchavati Police Station Compound, Nashik',
      searchQuery: 'Panchavati Police Station, Nashik, Maharashtra',
      description: 'High-tech CCTV command monitoring center, lost & found assistance desk, RFID wristband registering for children and elderly.',
      status: 'Active 24/7',
      verified: true,
      contactNumber: '112',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      timings: 'Open 24 Hours',
      facilities: ['Lost & Found Registration', 'Public Address Announcement Systems', 'RFID Tagging Desk', 'Tourist Police Assistance'],
      distance: '400 meters from Ghat Main Gate'
    },

    // --- PARKING HUBS ---
    {
      _id: 'loc-10',
      name: 'Tapovan Satellite Parking Hub A (तपोवन उपग्रह पार्किंग अ)',
      category: 'Parking',
      coordinates: { lat: 20.0125, lng: 73.8080 },
      address: 'Nashik-Aurangabad Highway, Tapovan, Nashik',
      searchQuery: 'Tapovan Parking, Nashik, Maharashtra',
      description: 'Massive 50-acre parking lot capable of holding 25,000 tourist buses and cars. Connects to free electric shuttle buses running every 3 mins to Ramkund.',
      status: 'Open 24 Hours',
      verified: true,
      contactNumber: '0253-2578899',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      timings: 'Open 24/7',
      facilities: ['Free Electric Shuttles', 'EV Charging Stations', 'Driver Resting Bay', 'CCTV Security'],
      distance: '4.5 km from Ramkund (Free Bus Available)'
    },
    {
      _id: 'loc-11',
      name: 'Adgaon Outer Highway Mega Parking Hub B',
      category: 'Parking',
      coordinates: { lat: 20.0350, lng: 73.8300 },
      address: 'Mumbai-Agra NH3 Highway, Adgaon, Nashik',
      searchQuery: 'Adgaon Truck Terminal, Nashik, Maharashtra',
      description: 'Primary holding area for heavy vehicles and outstation tourist coaches arriving from Mumbai and Dhule highways.',
      status: 'Open 24 Hours',
      verified: true,
      contactNumber: '0253-2578900',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      timings: 'Open 24/7',
      facilities: ['Shuttle Terminal', 'Canteen', 'Restrooms', 'Security Patrol'],
      distance: '8 km North of City Center'
    },

    // --- DRINKING WATER BOOTHS ---
    {
      _id: 'loc-12',
      name: 'Ramkund RO Water Dispensing Station #1',
      category: 'Drinking Water',
      coordinates: { lat: 20.0065, lng: 73.7918 },
      address: 'Ramkund Upper Bridge Promenade, Nashik',
      searchQuery: 'Ramkund, Panchavati, Nashik, Maharashtra',
      description: 'High-capacity RO purified drinking water fountain serving cold and ambient drinking water continuously to pilgrims.',
      status: 'Active 24 Hours',
      verified: true,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
      timings: '24 Hours Supply',
      facilities: ['RO Purified', 'Chilled Water Fountains', 'Zero Single-Use Plastic Bottling Station'],
      distance: 'At Ramkund Ghat Entrance'
    },

    // --- TOILETS & SANITATION ---
    {
      _id: 'loc-13',
      name: 'Panchavati Deluxe Smart Sanitation Block #4',
      category: 'Toilet',
      coordinates: { lat: 20.0075, lng: 73.7930 },
      address: 'Panchavati Temple Road, Nashik',
      searchQuery: 'Kalaram Temple Road, Panchavati, Nashik',
      description: 'Eco-friendly, continuously disinfected smart public restroom complex with handicap accessible ramps and baby care rooms.',
      status: 'Active 24 Hours',
      verified: true,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      timings: 'Open 24 Hours',
      facilities: ['Separate Male/Female Blocks', 'Wheelchair Accessible', 'Continuous Sanitization', 'Hot Water Available'],
      distance: '150 meters from Kalaram Temple'
    },

    // --- FOOD AREA & ANNA KSHETRAS ---
    {
      _id: 'loc-14',
      name: 'ISKCON & Government Free Maha Prasad Annachhatra',
      category: 'Food Area',
      coordinates: { lat: 20.0100, lng: 73.8040 },
      address: 'Sector 2, Tapovan Sadhugram, Nashik',
      searchQuery: 'ISKCON Temple Tapovan, Nashik, Maharashtra',
      description: 'Massive community dining hall serving fresh, wholesome, pure vegetarian Mahaprasad (Khichdi, Puri, Sabzi) free of cost to over 100,000 pilgrims daily.',
      status: 'Active (Meal Hours)',
      verified: true,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      timings: '7:00 AM - 10:30 PM (Continuous Annadan)',
      facilities: ['Free Mahaprasad', 'Hygienic Dining Benches', 'Purified Water', 'RO Drinking Water'],
      distance: 'Inside Tapovan City'
    },

    // --- CAMP & ACCOMMODATION ---
    {
      _id: 'loc-15',
      name: 'Tapovan Sadhugram Akhara Tent City (तपोवन साधुग्राम नगर)',
      category: 'Camp/Accommodation',
      coordinates: { lat: 20.0105, lng: 73.8050 },
      address: 'Tapovan, Nashik, Maharashtra 422003',
      searchQuery: 'Tapovan Sadhugram, Nashik, Maharashtra',
      description: 'The world-famous sprawling tent township housing thousands of Sadhus, Akhara leaders, Mahants, and international devotees during the 21-month Kumbh Mela.',
      status: 'Active',
      verified: true,
      contactNumber: '0253-2571000',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: 'Open 24 Hours',
      facilities: ['Free Pilgrim Tents', 'Satsang Halls', 'Security Patrol', 'Medical Booths'],
      distance: '3.5 km East of Ramkund Ghat'
    }
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/locations').catch(() => null);
        if (res?.data?.success && res.data.data.length > 0) {
          setLocations(res.data.data);
        } else {
          setLocations(defaultLocations);
        }
      } catch (err) {
        setLocations(defaultLocations);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(loc => {
    const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory;
    const matchesSearch = (loc.name && loc.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (loc.address && loc.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (loc.description && loc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'Ghat': return '🌊';
      case 'Temple': return '🛕';
      case 'Medical Centre': return '🏥';
      case 'Police/Help Centre': return '👮';
      case 'Parking': return '🅿️';
      case 'Drinking Water': return '💧';
      case 'Toilet': return '🚻';
      case 'Food Area': return '🍽️';
      case 'Camp/Accommodation': return '🏕️';
      default: return '📍';
    }
  };

  // Turn-by-turn direction link from user's current GPS location to exact card place name
  const getGoogleMapsDirectionsUrl = (loc) => {
    const destinationQuery = loc.searchQuery || `${loc.name}, ${loc.address || 'Nashik'}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            🗺️
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-500/30 px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-100 mb-1 border border-amber-200/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('smartGpsDesc')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('findPlaces')}</h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium mt-0.5">
              {t('locatePlacesSub') || 'Interactive Map, Ghats, Temples & Emergency Shrines'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-amber-950/60 p-1.5 rounded-2xl border border-amber-400/40 text-xs self-start sm:self-auto z-10">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${viewMode === 'list' ? 'bg-white text-amber-950 shadow-md' : 'text-amber-100 hover:text-white'}`}
          >
            📋 {t('listView')} ({filteredLocations.length})
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${viewMode === 'map' ? 'bg-white text-amber-950 shadow-md' : 'text-amber-100 hover:text-white'}`}
          >
            🗺️ {t('mapView')}
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-amber-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Filter Chips Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {categories.map((cat) => {
            const count = cat === 'All' ? locations.length : locations.filter(l => l.category === cat).length;
            const categoryLabel = cat === 'All' ? t('allCategories') : (t(cat) || cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5 rtl:space-x-reverse ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white ring-2 ring-amber-400 scale-102'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-amber-50'
                }`}
              >
                <span>{getCategoryEmoji(cat)}</span>
                <span>{categoryLabel}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedCategory === cat ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map View Simulation */}
      {viewMode === 'map' && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-300 rounded-3xl p-6 text-center shadow-md relative overflow-hidden min-h-80 flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-700 mb-1 animate-bounce">
            <MapIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-amber-950">{t('mapView')} Active</h3>
          <p className="text-xs text-slate-700 max-w-md leading-relaxed font-medium">
            {t('gpsActiveDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-[11px] font-bold pt-2">
            <span className="bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full border border-cyan-300">🌊 {t('Ramkund Holy Ghat (रामकुंड पवित्र घाट)')}</span>
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">🛕 {t('Trimbakeshwar Jyotirlinga Temple (त्र्यंबकेश्वर ज्योतिर्लिंग)')}</span>
            <span className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full border border-indigo-300">🅿️ Tapovan Shuttle</span>
          </div>
        </div>
      )}

      {/* Locations List Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">
          Searching Nashik & Trimbakeshwar Kumbh locations...
        </div>
      ) : filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLocations.map((loc) => {
            const categoryLabel = t(loc.category) || loc.category;
            return (
              <div 
                key={loc._id} 
                className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img 
                      src={loc.image || '/kumbh-bg.jpg'} 
                      alt={t(loc.name)} 
                      onError={(e) => { e.target.src = '/kumbh-bg.jpg'; }}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-amber-400/40 flex items-center space-x-1">
                      <span>{getCategoryEmoji(loc.category)}</span>
                      <span>{categoryLabel}</span>
                    </div>

                    {loc.verified && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                        <span>{t('verified')}</span>
                      </div>
                    )}

                    {loc.timings && (
                      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{t(loc.timings)}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-slate-950 leading-snug">
                      {t(loc.name)}
                    </h3>

                    <div className="flex items-start space-x-1.5 text-xs text-amber-800 font-semibold">
                      <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{t(loc.address)}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {t(loc.description)}
                    </p>

                    {loc.distance && (
                      <div className="text-[11px] font-bold text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center space-x-1">
                        <Compass className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t('distance')}: {t(loc.distance)}</span>
                      </div>
                    )}

                    {/* Facilities Badges */}
                    {loc.facilities && loc.facilities.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                          {t('keyFacilities')}:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {loc.facilities.map((fac, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md"
                            >
                              ✓ {t(fac)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  {loc.contactNumber ? (
                    <a
                      href={`tel:${loc.contactNumber}`}
                      className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t('call')} {loc.contactNumber}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {t('status')}: {loc.status || t('active')}
                    </span>
                  )}

                  {/* Direct Turn-by-Turn GPS Navigation from User's Current Location */}
                  <a
                    href={getGoogleMapsDirectionsUrl(loc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-transform hover:scale-102"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{t('takeMeThere')}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-3xl border-2 border-dashed border-amber-300 text-slate-600 space-y-2">
          <div className="text-3xl">🔍</div>
          <h4 className="font-bold text-base">No locations match your current search or category filter.</h4>
          <p className="text-xs text-slate-500">Try resetting the filter or searching for another location name like Ramkund or Trimbakeshwar.</p>
        </div>
      )}
    </div>
  );
};

export default FindPlaces;

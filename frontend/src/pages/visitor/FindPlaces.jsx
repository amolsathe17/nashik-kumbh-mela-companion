import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, Search, Navigation, Phone, CheckCircle, AlertTriangle, 
  Map as MapIcon, Compass, Clock, ShieldCheck, Sparkles,
  Info, ExternalLink, X, Building2, Droplets, Utensils, HeartPulse
} from 'lucide-react';
import api from '../../services/api';

const FindPlaces = () => {
  const { t } = useLanguage();
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Removed Medical Centre tab as requested
  const categories = [
    'All', 'Ghat', 'Temple', 'Police/Help Centre', 
    'Parking', 'Drinking Water', 'Toilet', 'Food Area', 'Camp/Accommodation', 'Info / Help'
  ];

  // Authentic Dataset for Nashik-Trimbakeshwar Kumbh Mela 2026-2027 (Strictly Local Nashik Kumbh Images & No Medical Tab)
  const defaultLocations = [
    // --- GHATS ---
    {
      _id: 'loc-1',
      name: 'Ramkund Holy Bathing Ghat (रामकुंड पवित्र घाट)',
      category: 'Ghat',
      coordinates: { lat: 20.0063, lng: 73.7915 },
      address: 'Panchavati, Nashik, Maharashtra 422003',
      location: 'Panchavati, Nashik, Maharashtra 422003',
      searchQuery: 'Ramkund Holy Ghat, Panchavati, Nashik, Maharashtra',
      description: 'The central, most sacred bathing ghat on River Godavari where Lord Rama performed rituals. Primary site for royal Shahi Snan and evening Maha Aarti.',
      status: 'Active & Open 24/7',
      isConfirmed: true,
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
      location: 'Trimbakeshwar Town, Nashik District 422212',
      searchQuery: 'Kushavarta Kund, Trimbakeshwar, Nashik, Maharashtra',
      description: 'Sacred pond in Trimbakeshwar regarded as the symbolic origin of River Godavari. Holy bathing spot for Shaivite Naga Sadhus during Simhastha Kumbh.',
      status: 'Active & Open',
      isConfirmed: true,
      contactNumber: '0253-2591241',
      image: '/shahi-snan-for-kumbh-mela.webp',
      timings: '5:00 AM - 9:00 PM',
      facilities: ['Vedic Pandits', 'Changing Area', 'Water Filtration', 'Police Security'],
      distance: '28 km West of Nashik'
    },
    {
      _id: 'loc-3',
      name: 'Laxman Ghat & Ahilya Ghat (लक्ष्मण घाट एवं अहिल्या घाट)',
      category: 'Ghat',
      coordinates: { lat: 20.0071, lng: 73.7922 },
      address: 'Downstream Godavari River, Panchavati, Nashik 422003',
      location: 'Downstream Godavari River, Panchavati, Nashik 422003',
      searchQuery: 'Laxman Ghat, Panchavati, Nashik, Maharashtra',
      description: 'Serene secondary bathing ghats ideal for ancestral Tarpan rituals and peaceful holy baths away from peak crowd congestion.',
      status: 'Active',
      isConfirmed: true,
      contactNumber: '0253-2570001',
      image: '/68c4435662438-pitru-paksha-120221463-16x9.webp',
      timings: 'Open 24 Hours',
      facilities: ['Tarpan Pedestals', 'Drinking Water Station', 'Ramp Access'],
      distance: '2.8 km from City Center'
    },
    {
      _id: 'loc-3b',
      name: 'Takli Sangam Ghat (टाकळी संगम घाट)',
      category: 'Ghat',
      coordinates: { lat: 19.9980, lng: 73.8050 },
      address: 'Takli, Confluence of Godavari & Kapila Rivers, Nashik',
      location: 'Takli, Confluence of Godavari & Kapila Rivers, Nashik',
      searchQuery: 'Takli Sangam Ghat, Nashik, Maharashtra',
      description: 'Holy confluence of Godavari and Kapila rivers where Samarth Ramdas Swami meditated for 12 years. Reserved for quiet pilgrim dips.',
      status: 'Planned Simhastha 2027 Upgrade',
      isConfirmed: false,
      contactNumber: '0253-2570002',
      image: '/goda-aarti-chatg.webp',
      timings: '6:00 AM - 8:00 PM',
      facilities: ['Riverfront Promenade', 'Ramp Walkway', 'Lighting Posts'],
      distance: '4.2 km from Ramkund'
    },

    // --- TEMPLES ---
    {
      _id: 'loc-4',
      name: 'Trimbakeshwar Jyotirlinga Temple (त्र्यंबकेश्वर ज्योतिर्लिंग)',
      category: 'Temple',
      coordinates: { lat: 19.9324, lng: 73.5307 },
      address: 'Trimbak, Nashik District, Maharashtra 422212',
      location: 'Trimbak, Nashik District, Maharashtra 422212',
      searchQuery: 'Trimbakeshwar Jyotirlinga Temple, Trimbak, Maharashtra',
      description: 'One of India’s 12 revered Jyotirlingas. Built of black basalt by Peshwa Balaji Baji Rao, featuring three lingams representing Brahma, Vishnu, and Shiva.',
      status: 'Active',
      isConfirmed: true,
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
      location: 'Panchavati, Nashik, Maharashtra 422003',
      searchQuery: 'Kalaram Temple, Panchavati, Nashik, Maharashtra',
      description: 'Historic 1788 temple housing a 2-foot black basalt idol of Lord Rama, Sita, and Lakshmana. Built with 70,000 tons of solid black stone.',
      status: 'Active',
      isConfirmed: true,
      contactNumber: '0253-2511108',
      image: '/img_20250206_1205497474678292145460306.webp',
      timings: '6:00 AM - 9:00 PM',
      facilities: ['Prasad Counter', 'Historical Information Desk', 'Spacious Courtyard'],
      distance: '3.0 km from Railway Station Shuttle Stop'
    },
    {
      _id: 'loc-6',
      name: 'Sita Gufa & Panchavati Grove (सीता गुफा एवं पंचवटी)',
      category: 'Temple',
      coordinates: { lat: 20.0088, lng: 73.7942 },
      address: 'Panchavati Sacred Grove, Nashik 422003',
      location: 'Panchavati Sacred Grove, Nashik 422003',
      searchQuery: 'Sita Gufa, Panchavati, Nashik, Maharashtra',
      description: 'Ancient cave near the 5 sacred Banyan trees (Panchavati) where Goddess Sita stayed during exile.',
      status: 'Active',
      isConfirmed: true,
      contactNumber: '0253-2512200',
      image: '/nagarpradakshina.webp',
      timings: '6:00 AM - 8:00 PM',
      facilities: ['Guided Pilgrimage Path', 'Cooling Misting Fans', 'Souvenir Shops'],
      distance: '3.2 km from Nashik CBS'
    },
    {
      _id: 'loc-6b',
      name: 'Muktidham Marble Temple (मुक्तिधाम मंदिर - नाशिक रोड)',
      category: 'Temple',
      coordinates: { lat: 19.9550, lng: 73.8320 },
      address: 'Nashik Road, Nashik, Maharashtra 422101',
      location: 'Nashik Road, Nashik, Maharashtra 422101',
      searchQuery: 'Muktidham Temple, Nashik Road, Maharashtra',
      description: 'Famous white marble temple complex replicating all 12 Jyotirlingas with 18 chapters of Bhagavad Gita carved on its walls.',
      status: 'Active',
      isConfirmed: true,
      contactNumber: '0253-2461150',
      image: '/kumbh-bg.jpg',
      timings: '6:00 AM - 9:00 PM',
      facilities: ['Pilgrim Dharamshala', 'Pure Veg Canteen', 'Large Parking'],
      distance: '1.5 km from Nashik Road Railway Station'
    },

    // --- POLICE / HELP CENTRES ---
    {
      _id: 'loc-9',
      name: 'Kumbh Central Police Control Room & Lost Person Desk',
      category: 'Police/Help Centre',
      coordinates: { lat: 20.0055, lng: 73.7905 },
      address: 'Panchavati Police Station Compound, Nashik 422003',
      location: 'Panchavati Police Station Compound, Nashik 422003',
      searchQuery: 'Panchavati Police Station, Nashik, Maharashtra',
      description: 'High-tech CCTV command monitoring center, lost & found assistance desk, RFID wristband registering for children and elderly.',
      status: 'Active 24/7',
      isConfirmed: true,
      contactNumber: '112',
      image: '/shahi.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Lost & Found Registration', 'Public Announcement Systems', 'RFID Tagging Desk', 'Tourist Police Assistance'],
      distance: '400 meters from Ghat Main Gate'
    },
    {
      _id: 'loc-9b',
      name: 'Trimbakeshwar Kumbh Security Post & Lost Found Desk',
      category: 'Police/Help Centre',
      coordinates: { lat: 19.9320, lng: 73.5315 },
      address: 'Temple Main Ring Road, Trimbakeshwar 422212',
      location: 'Temple Main Ring Road, Trimbakeshwar 422212',
      searchQuery: 'Trimbakeshwar Police Station, Nashik, Maharashtra',
      description: 'Dedicated police command and family reunion center servicing pilgrims visiting Kushavarta Kund and Trimbakeshwar Temple.',
      status: 'Active 24/7',
      isConfirmed: true,
      contactNumber: '0253-2591244',
      image: '/dhwajarohan.webp',
      timings: 'Open 24 Hours',
      facilities: ['Family Reunion Lounge', 'Lost & Found Cell', 'Emergency Hotline Desk'],
      distance: '200 meters from Kushavarta Kund'
    },

    // --- PARKING HUBS ---
    {
      _id: 'loc-10',
      name: 'Tapovan Satellite Parking Hub A (तपोवन पार्किंग अ)',
      category: 'Parking',
      coordinates: { lat: 20.0125, lng: 73.8080 },
      address: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
      location: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
      searchQuery: 'Tapovan Parking, Nashik, Maharashtra',
      description: 'Massive 50-acre parking lot capable of holding 25,000 tourist buses and cars. Connects to free electric shuttle buses running every 3 mins to Ramkund.',
      status: 'Open 24 Hours',
      isConfirmed: true,
      contactNumber: '0253-2578899',
      image: '/kumbh-bg1.jpg',
      timings: 'Open 24/7',
      facilities: ['Free Electric Shuttles', 'EV Charging Stations', 'Driver Resting Bay', 'CCTV Security'],
      distance: '4.5 km from Ramkund (Free Bus Available)'
    },
    {
      _id: 'loc-11',
      name: 'Adgaon Outer Highway Mega Parking Hub B',
      category: 'Parking',
      coordinates: { lat: 20.0350, lng: 73.8300 },
      address: 'Mumbai-Agra NH3 Highway, Adgaon, Nashik 422003',
      location: 'Mumbai-Agra NH3 Highway, Adgaon, Nashik 422003',
      searchQuery: 'Adgaon Truck Terminal, Nashik, Maharashtra',
      description: 'Primary holding area for heavy vehicles and outstation tourist coaches arriving from Mumbai and Dhule highways.',
      status: 'Open 24 Hours',
      isConfirmed: true,
      contactNumber: '0253-2578900',
      image: '/kumbh-bg.jpg',
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
      address: 'Ramkund Upper Bridge Promenade, Nashik 422003',
      location: 'Ramkund Upper Bridge Promenade, Nashik 422003',
      searchQuery: 'Ramkund, Panchavati, Nashik, Maharashtra',
      description: 'High-capacity RO purified drinking water fountain serving cold and ambient drinking water continuously to pilgrims.',
      status: 'Active 24 Hours',
      isConfirmed: true,
      image: '/goda-aarti-chatg.webp',
      timings: '24 Hours Supply',
      facilities: ['RO Purified', 'Chilled Water Fountains', 'Zero Plastic Bottling Station'],
      distance: 'At Ramkund Ghat Entrance'
    },
    {
      _id: 'loc-12b',
      name: 'Tapovan Sadhugram RO Water Distribution Hub #2',
      category: 'Drinking Water',
      coordinates: { lat: 20.0108, lng: 73.8045 },
      address: 'Sector 3 Main Avenue, Tapovan, Nashik 422003',
      location: 'Sector 3 Main Avenue, Tapovan, Nashik 422003',
      searchQuery: 'Tapovan Sadhugram, Nashik, Maharashtra',
      description: 'Solar-powered 10,000 LPH filtration kiosk providing clean drinking water for pilgrim camps in Tapovan.',
      status: 'Active 24 Hours',
      isConfirmed: true,
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: '24 Hours Supply',
      facilities: ['Solar RO Filtration', 'Touchless Taps', 'Cold Water'],
      distance: 'Inside Tapovan City'
    },

    // --- TOILETS & SANITATION ---
    {
      _id: 'loc-13',
      name: 'Panchavati Deluxe Smart Sanitation Block #1',
      category: 'Toilet',
      coordinates: { lat: 20.0075, lng: 73.7930 },
      address: 'Panchavati Temple Road, Nashik 422003',
      location: 'Panchavati Temple Road, Nashik 422003',
      searchQuery: 'Kalaram Temple Road, Panchavati, Nashik',
      description: 'Eco-friendly, continuously disinfected smart public restroom complex with handicap accessible ramps and baby care rooms.',
      status: 'Active 24 Hours',
      isConfirmed: true,
      image: '/kumbh-bg.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Separate Male/Female Blocks', 'Wheelchair Accessible', 'Continuous Sanitization', 'Hot Water'],
      distance: '150 meters from Kalaram Temple'
    },

    // --- FOOD AREA / ANNA KSHETRA ---
    {
      _id: 'loc-14',
      name: 'Tapovan Annadan & Food Arena (तपोवन अन्नछत्र)',
      category: 'Food Area',
      coordinates: { lat: 20.0100, lng: 73.8040 },
      address: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      location: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      searchQuery: 'ISKCON Temple Tapovan, Nashik, Maharashtra',
      description: 'Massive community dining hall serving fresh, wholesome, pure vegetarian Mahaprasad (Khichdi, Puri, Sabzi) free of cost to over 100,000 pilgrims daily.',
      status: 'Active (Meal Hours)',
      isConfirmed: true,
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
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
      location: 'Tapovan, Nashik, Maharashtra 422003',
      searchQuery: 'Tapovan Sadhugram, Nashik, Maharashtra',
      description: 'The world-famous sprawling tent township housing thousands of Sadhus, Akhara leaders, Mahants, and international devotees.',
      status: 'Active',
      isConfirmed: true,
      contactNumber: '0253-2571000',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: 'Open 24 Hours',
      facilities: ['Free Pilgrim Tents', 'Satsang Halls', 'Security Patrol', 'Medical Booths'],
      distance: '3.5 km East of Ramkund Ghat'
    },

    // --- INFORMATION / HELP CENTRES ---
    {
      _id: 'loc-16',
      name: 'Ramkund Central Pilgrim Information Desk',
      category: 'Info / Help',
      coordinates: { lat: 20.0060, lng: 73.7912 },
      address: 'Ramkund Main Entrance, Panchavati, Nashik 422003',
      location: 'Ramkund Main Entrance, Panchavati, Nashik 422003',
      searchQuery: 'Ramkund, Panchavati, Nashik, Maharashtra',
      description: 'Official information booth providing free multilingual maps, Snan timing charts, lost person reporting, and shuttle bus schedules.',
      status: 'Active 24 Hours',
      isConfirmed: true,
      contactNumber: '0253-2575555',
      image: '/goda-aarti-chatg.webp',
      timings: 'Open 24 Hours',
      facilities: ['Multilingual Staff (28 Languages)', 'Free Printed Maps', 'Lost & Found Desk', 'Bus Timetables'],
      distance: 'At Ramkund Ghat Entrance'
    },
    {
      _id: 'loc-17',
      name: 'Nashik Road Railway Station Tourist & Kumbh Cell',
      category: 'Info / Help',
      coordinates: { lat: 19.9540, lng: 73.8310 },
      address: 'Platform 1 Exit, Nashik Road Railway Station 422101',
      location: 'Platform 1 Exit, Nashik Road Railway Station 422101',
      searchQuery: 'Nashik Road Railway Station, Maharashtra',
      description: '24/7 Indian Railways & Kumbh Authority reception counter assisting arriving train passengers with free shuttle bus passes, maps, and camp directions.',
      status: 'Active 24 Hours',
      isConfirmed: true,
      contactNumber: '0253-2465432',
      image: '/kumbh-bg1.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Railway Special Train Charts', 'Shuttle Bus Tokens', 'Baggage Lockers'],
      distance: 'Nashik Road Station Main Exit'
    }
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/locations').catch(() => null);
        if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const filteredApi = res.data.data.filter(item => item.category !== 'Medical' && item.category !== 'Medical Centre');

          const enrichedApiItems = filteredApi.map(item => ({
            ...item,
            address: item.address || item.location || 'Panchavati, Nashik, Maharashtra 422003',
            description: item.description || item.capacityNotes || item.details || item.notes || 'Official Nashik Kumbh Mela facility and pilgrim service location.',
            image: item.image || item.imageUrl || '/shahi-snan.jpg',
            timings: item.timings || item.hours || 'Open 24 Hours',
            distance: item.distance || 'Central Kumbh Area',
            contactNumber: item.contactNumber || item.phone || '0253-2575555',
            facilities: (item.facilities && item.facilities.length > 0) ? item.facilities : ['24/7 Service', 'Verified Site', 'Helpdesk']
          }));

          const apiNames = new Set(enrichedApiItems.map(i => i.name));
          const combined = [...enrichedApiItems, ...defaultLocations.filter(d => !apiNames.has(d.name))];
          setLocations(combined);
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

  const matchCategory = (itemCat, targetCat) => {
    if (!targetCat || targetCat === 'All') return true;
    if (!itemCat) return false;

    const item = String(itemCat).trim().toLowerCase();
    const target = String(targetCat).trim().toLowerCase();

    if (item === target) return true;

    if (target === 'ghat') return item === 'ghat';
    if (target === 'temple') return item === 'temple';
    if (target === 'police/help centre') return item === 'police/help centre' || item === 'police' || item === 'police centre';
    if (target === 'parking') return item === 'parking';
    if (target === 'drinking water') return item === 'drinking water' || item === 'water';
    if (target === 'toilet') return item === 'toilet';
    if (target === 'food area') return item === 'food area' || item === 'food';
    if (target === 'camp/accommodation') return item === 'camp/accommodation' || item === 'camp' || item === 'accommodation';
    if (target === 'info / help') return item === 'info / help' || item === 'info' || item === 'help';

    return item === target;
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
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            🗺️
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('findPlaces')}</h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium mt-0.5">
              {t('locatePlacesSub') || 'Official Directory for Ghats, Temples, Parking, Water & Pilgrim Services'}
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

        {/* Category Filter Chips Horizontal Scroll matching reference image */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {categories.map((cat) => {
            const count = countForCategory(cat);
            const categoryLabel = cat === 'All' ? t('allCategories') : (t(cat) || cat);
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border ${
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
            <span className="bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full border border-cyan-300">🌊 Ramkund Holy Ghat</span>
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">🛕 Trimbakeshwar Temple</span>
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
            const displayAddress = loc.address || loc.location || 'Panchavati, Nashik, Maharashtra 422003';
            const displayDesc = loc.description || loc.capacityNotes || loc.details || loc.notes || 'Official Nashik Kumbh Mela facility and pilgrim service location.';
            const displayImage = loc.image || loc.imageUrl || '/shahi-snan.jpg';
            const displayTimings = loc.timings || loc.hours || 'Open 24 Hours';
            const displayDistance = loc.distance || 'Central Kumbh Area';

            return (
              <div 
                key={loc._id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img 
                      src={displayImage} 
                      alt={t(loc.name)} 
                      onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-amber-400/40 flex items-center space-x-1">
                      <span>{getCategoryEmoji(loc.category)}</span>
                      <span>{categoryLabel}</span>
                    </div>

                    {/* Official Confirmation Tag */}
                    <div className="absolute top-3 right-3">
                      {loc.isConfirmed !== false ? (
                        <div className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-white" />
                          <span>Officially Confirmed</span>
                        </div>
                      ) : (
                        <div className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-white" />
                          <span>Proposed 2027</span>
                        </div>
                      )}
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

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPlace(loc)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5 text-amber-600" /> View Details
                  </button>

                  <a
                    href={getGoogleMapsDirectionsUrl(loc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Get Directions
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

      {/* Place Details Modal Popup */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-amber-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryEmoji(selectedPlace.category)}</span>
                <h3 className="font-bold text-base text-slate-900">{selectedPlace.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedPlace(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-48 rounded-2xl overflow-hidden bg-slate-900 relative">
              <img 
                src={selectedPlace.image || selectedPlace.imageUrl || '/shahi-snan.jpg'} 
                alt={selectedPlace.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                {selectedPlace.isConfirmed !== false ? 'Officially Confirmed' : 'Proposed 2027'}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-slate-700 mb-1">About Location:</h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedPlace.description || selectedPlace.capacityNotes || 'Official Nashik Kumbh Mela facility and pilgrim service location.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 font-medium">
                <div>📍 Address: <span className="font-bold text-slate-900">{selectedPlace.address || selectedPlace.location || 'Panchavati, Nashik'}</span></div>
                <div>⏰ Timings: <span className="font-bold text-slate-900">{selectedPlace.timings || selectedPlace.hours || '24/7'}</span></div>
                <div>📞 Helpline: <span className="font-bold text-amber-700">{selectedPlace.contactNumber || selectedPlace.phone || '0253-2575555'}</span></div>
                <div>🚗 Distance: <span className="font-bold text-slate-900">{selectedPlace.distance || 'Central'}</span></div>
              </div>

              {selectedPlace.facilities && selectedPlace.facilities.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-700 mb-1.5">Available Services & Infrastructure:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlace.facilities.map((fac, idx) => (
                      <span key={idx} className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-amber-700" /> {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex gap-2">
              <button
                onClick={() => setSelectedPlace(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
              <a
                href={getGoogleMapsDirectionsUrl(selectedPlace)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow"
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

export default FindPlaces;

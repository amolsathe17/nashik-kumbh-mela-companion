import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bus, Car, Footprints, AlertTriangle, ArrowRight, MapPin, 
  Compass, Navigation, Clock, ShieldAlert, CheckCircle, Sparkles, Map as MapIcon
} from 'lucide-react';
import api from '../../services/api';

const TravelParking = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState('list');
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Journey planner local state
  const [fromLoc, setFromLoc] = useState('');
  const [toLoc, setToLoc] = useState('');
  const [journeyResult, setJourneyResult] = useState(null);

  const defaultTravelData = [
    // --- JOURNEY ROUTES ---
    {
      _id: 'trv-1',
      id: 'trv-1',
      fromLocation: 'Sita Gufa',
      toLocation: 'Ramkund',
      title: 'Sita Gufa to Ramkund Bathing Ghat Corridor',
      routeType: 'Journey Route',
      estimatedTime: '8 - 12 Mins (Shuttle) / 10 Mins Walk',
      distance: '1.2 km',
      nearestParking: 'Tapovan Satellite Parking Hub A',
      parkingSlotsTotal: 5000,
      parkingSlotsAvailable: 3850,
      shuttleServiceInfo: 'Eco Electric Shuttle Bus B3 (Running every 3 to 5 minutes - Free Service)',
      privateVehicleInfo: 'Private vehicles restricted inside Panchavati core zone (4 AM to 10 PM). Park at Tapovan Hub.',
      walkingPathInfo: 'Pedestrian green corridor via Panchavati Marg with drinking water booths and shade tents every 200 meters.',
      status: 'Clear',
      description: 'Primary pilgrimage pedestrian and electric shuttle route connecting Sita Gufa to Ramkund Holy Bathing Ghat.'
    },
    {
      _id: 'trv-2',
      id: 'trv-2',
      fromLocation: 'Tapovan Parking',
      toLocation: 'Ramkund',
      title: 'Tapovan Satellite Hub to Ramkund Ghat',
      routeType: 'Journey Route',
      estimatedTime: '12 - 15 Mins (Shuttle Bus)',
      distance: '3.5 km',
      nearestParking: 'Tapovan Satellite Hub A & B',
      parkingSlotsTotal: 25000,
      parkingSlotsAvailable: 18200,
      shuttleServiceInfo: 'High-frequency Ring Road Shuttle Bus Fleet #1 & #2 (Every 3 mins - Free Service)',
      privateVehicleInfo: 'All private cars, SUVs & tourist buses must park at Tapovan Satellite Hub. Free shuttle transfer included.',
      walkingPathInfo: '3.5 km barricaded walking corridor available for pilgrims preferring to walk along river bank promenade.',
      status: 'Clear',
      description: 'Major transit corridor for pilgrims arriving from Mumbai-Agra Highway and Aurangabad Road.'
    },
    {
      _id: 'trv-3',
      id: 'trv-3',
      fromLocation: 'CBS Bus Stand',
      toLocation: 'Trimbakeshwar Temple',
      title: 'Nashik CBS Central Station to Trimbakeshwar Jyotirlinga',
      routeType: 'Journey Route',
      estimatedTime: '45 - 55 Mins (MSRTC Express Bus)',
      distance: '28 km',
      nearestParking: 'Trimbak Outer Ring Parking C',
      parkingSlotsTotal: 8000,
      parkingSlotsAvailable: 5400,
      shuttleServiceInfo: 'MSRTC Kumbh Special Non-Stop Express Shuttle Buses (Every 5 mins from CBS)',
      privateVehicleInfo: 'Private vehicles permitted up to Trimbak Ring Road Checkpoint (5 km outside temple town).',
      walkingPathInfo: 'Paved queue walkway from Trimbak Outer Bus Stand to Kushavarta Kund (1.2 km).',
      status: 'Moderate Traffic',
      description: 'Inter-city pilgrimage route connecting central Nashik railway/bus station to Trimbakeshwar temple.'
    },

    // --- PARKING SLOTS ---
    {
      _id: 'trv-4',
      id: 'trv-4',
      fromLocation: 'Adgaon Highway Entrance',
      toLocation: 'Panchavati Promenade',
      title: 'Adgaon NH-3 Outer Highway Mega Parking Hub B',
      routeType: 'Parking Slot',
      estimatedTime: '15 - 20 Mins Shuttle',
      distance: '5.8 km',
      nearestParking: 'Adgaon Outer Highway Parking Complex B',
      parkingSlotsTotal: 15000,
      parkingSlotsAvailable: 11400,
      shuttleServiceInfo: 'Electric Shuttle Bus Route #7 running to Panchavati Karanja every 5 mins.',
      privateVehicleInfo: 'Heavy vehicles and private cars diverted at Adgaon Naka. Mandatory parking at Adgaon Complex.',
      walkingPathInfo: 'Dedicated shaded walkway with medical aid stations along Mumbai-Agra road.',
      status: 'Clear',
      description: 'Highway ingress holding area for private cars and outstation tourist buses from Mumbai and Dhule.'
    },
    {
      _id: 'trv-5',
      id: 'trv-5',
      fromLocation: 'Aurangabad Road',
      toLocation: 'Tapovan City',
      title: 'Tapovan Satellite Mega Parking Hub A',
      routeType: 'Parking Slot',
      estimatedTime: '5 Mins Shuttle Transfer',
      distance: '3.0 km',
      nearestParking: 'Tapovan Satellite Parking Hub A',
      parkingSlotsTotal: 25000,
      parkingSlotsAvailable: 19800,
      shuttleServiceInfo: 'Free 24/7 E-Shuttles running every 3 minutes directly to Ramkund.',
      privateVehicleInfo: 'Primary satellite parking lot equipped with EV charging stations and driver rest rooms.',
      walkingPathInfo: 'Direct lighted walkway leading to Sadhugram Akhara tent city.',
      status: 'Clear',
      description: 'Largest 50-acre parking facility servicing eastern approach to Nashik Kumbh Mela.'
    },

    // --- SHUTTLE BUS ---
    {
      _id: 'trv-6',
      id: 'trv-6',
      fromLocation: 'Tapovan Satellite Hub',
      toLocation: 'Ramkund Main Ghat',
      title: 'Ramkund Express Electric Shuttle Bus Fleet #1',
      routeType: 'Shuttle Bus',
      estimatedTime: '8 - 10 Mins (Continuous Loop)',
      distance: '2.5 km',
      nearestParking: 'Tapovan Satellite Parking Hub A',
      parkingSlotsTotal: 25000,
      parkingSlotsAvailable: 18200,
      shuttleServiceInfo: '150 Low-Floor AC Electric Buses operating non-stop 24/7 (Zero Fare / Free for Pilgrims).',
      privateVehicleInfo: 'Shuttle buses have exclusive dedicated traffic lane on Godavari Riverbank Road.',
      walkingPathInfo: 'Shuttle drop-off point is 100 meters from Ramkund main bathing ghat entrance.',
      status: 'Clear',
      description: 'High-frequency eco-friendly shuttle bus connecting outer parking directly to central Shahi Snan ghats.'
    },
    {
      _id: 'trv-7',
      id: 'trv-7',
      fromLocation: 'Nashik Road Railway Station',
      toLocation: 'Panchavati & Tapovan',
      title: 'Nashik Road Station Pilgrim Express Shuttle Fleet #3',
      routeType: 'Shuttle Bus',
      estimatedTime: '20 Mins Direct Shuttle',
      distance: '9.5 km',
      nearestParking: 'Nashik Road Station Parking',
      parkingSlotsTotal: 3500,
      parkingSlotsAvailable: 2100,
      shuttleServiceInfo: 'Direct MSRTC Kumbh Electric Buses running every 5 minutes from Railway Station Exit.',
      privateVehicleInfo: 'Dedicated transit corridor for public buses bypassing city traffic congestions.',
      walkingPathInfo: 'Covered queue complex at Railway Station Exit 1.',
      status: 'Clear',
      description: 'Direct shuttle bus link for train passengers arriving at Nashik Road Station.'
    },

    // --- PRIVATE VEHICLE ADVISORY ---
    {
      _id: 'trv-8',
      id: 'trv-8',
      fromLocation: 'Outer City Ring Road',
      toLocation: 'Panchavati Core Zone',
      title: 'Panchavati Core Ghat Zone Vehicle Restriction Advisory',
      routeType: 'Private Vehicle Advisory',
      estimatedTime: 'Advisory Active 24/7',
      distance: '0 km Inner Radius',
      nearestParking: 'Tapovan Hub A & Adgaon Hub B',
      parkingSlotsTotal: 40000,
      parkingSlotsAvailable: 29600,
      shuttleServiceInfo: 'Mandatory transfer to Free Electric Shuttles at outer parking checkposts.',
      privateVehicleInfo: 'STRICT VEHICLE PROHIBITION: All private 2-wheelers, cars, and buses prohibited within 3 km radius of Ramkund (4:00 AM to 11:00 PM).',
      walkingPathInfo: 'Pedestrian-only green zones established throughout Panchavati, Kalaram Temple & Ramkund.',
      status: 'Clear',
      description: 'Official traffic police advisory restricting private vehicle entry into core Shahi Snan zones.'
    },
    {
      _id: 'trv-9',
      id: 'trv-9',
      fromLocation: 'Nashik-Trimbak Highway',
      toLocation: 'Trimbakeshwar Temple Town',
      title: 'Trimbakeshwar Inner Temple Town Traffic Advisory',
      routeType: 'Private Vehicle Advisory',
      estimatedTime: 'Advisory Active on Snan Days',
      distance: '5 km Temple Radius',
      nearestParking: 'Trimbak Outer Ring Parking C',
      parkingSlotsTotal: 8000,
      parkingSlotsAvailable: 5400,
      shuttleServiceInfo: 'Free mini-shuttle vans operating from Ring Road Checkpoint to Kushavarta Kund.',
      privateVehicleInfo: 'No private cars permitted inside Trimbakeshwar municipal limits during peak Kumbh Snan dates.',
      walkingPathInfo: 'Pilgrim walking tracks equipped with misters and drinking water stations.',
      status: 'Moderate Traffic',
      description: 'Traffic restriction advisory for pilgrims traveling to Trimbakeshwar Jyotirlinga.'
    },

    // --- ROAD DIVERSION ---
    {
      _id: 'trv-10',
      id: 'trv-10',
      fromLocation: 'Dwarka Circle',
      toLocation: 'Panchavati Karanja',
      title: 'Shahi Snan Days One-Way Traffic Diversion Scheme',
      routeType: 'Road Diversion',
      estimatedTime: 'Diversion in Effect',
      distance: '4.2 km Loop',
      nearestParking: 'Tapovan Satellite Hub A',
      parkingSlotsTotal: 25000,
      parkingSlotsAvailable: 19800,
      shuttleServiceInfo: 'Shuttles follow clockwise one-way loop: Dwarka -> Kathe Gali -> Tapovan -> Panchavati -> CBS.',
      privateVehicleInfo: 'Dwarka Circle to Panchavati route converted to strict One-Way traffic during main royal bath days.',
      walkingPathInfo: 'Segregated pedestrian paths along both sides of Godavari river bridges.',
      status: 'Clear',
      description: 'Official traffic diversion scheme implemented by Nashik City Traffic Police during major Shahi Snan dates.'
    },
    {
      _id: 'trv-11',
      id: 'trv-11',
      fromLocation: 'Mumbai-Agra NH3 Highway',
      toLocation: 'Gujarat Highway Bypass',
      title: 'Outstation Heavy Commercial Vehicle Bypass Diversion',
      routeType: 'Road Diversion',
      estimatedTime: 'Continuous Bypass',
      distance: '18 km Bypass',
      nearestParking: 'Adgaon Outer Highway Parking B',
      parkingSlotsTotal: 15000,
      parkingSlotsAvailable: 11400,
      shuttleServiceInfo: 'N/A (Commercial Freight Bypass)',
      privateVehicleInfo: 'All non-Kumbh commercial trucks diverted via Outer Ring Expressway bypassing Nashik city completely.',
      walkingPathInfo: 'N/A',
      status: 'Clear',
      description: 'Freight traffic diversion keeping city roads clear for Kumbh Mela passenger transport.'
    }
  ];

  useEffect(() => {
    fetchTravelData();
  }, []);

  const fetchTravelData = async () => {
    try {
      setLoading(true);
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_travel') || '[]');
      const customTravel = JSON.parse(localStorage.getItem('kumbh_custom_travel') || '[]');

      const res = await api.get('/travel').catch(() => null);
      let apiItems = (res?.data?.success && Array.isArray(res.data.data)) ? res.data.data : [];

      const rawList = [...customTravel, ...apiItems, ...defaultTravelData];
      const seenTitles = new Set();
      const seenIds = new Set();
      const finalItems = [];

      for (const item of rawList) {
        if (!item) continue;
        const itemId = String(item._id || item.id || '').trim();
        const normTitle = String(item.title || item.name || `${item.fromLocation || ''} to ${item.toLocation || ''}`).trim().toLowerCase();

        if (deletedIds.includes(itemId) || deletedIds.includes(item._id) || deletedIds.includes(item.id)) {
          continue;
        }

        if ((itemId && seenIds.has(itemId)) || (normTitle && seenTitles.has(normTitle))) {
          continue;
        }

        if (itemId) seenIds.add(itemId);
        if (normTitle) seenTitles.add(normTitle);

        finalItems.push({
          _id: itemId || 'trv-' + Date.now(),
          id: itemId || 'trv-' + Date.now(),
          fromLocation: item.fromLocation || item.from || 'Tapovan',
          toLocation: item.toLocation || item.to || 'Ramkund',
          title: item.title || `${item.fromLocation || 'Origin'} to ${item.toLocation || 'Destination'}`,
          routeType: item.routeType || item.type || 'Journey Route',
          estimatedTime: item.estimatedTime || item.time || '10 - 15 Mins',
          distance: item.distance || '2 km',
          nearestParking: item.nearestParking || item.parkingName || 'Tapovan Satellite Hub',
          parkingSlotsTotal: Number(item.parkingSlotsTotal || 5000),
          parkingSlotsAvailable: Number(item.parkingSlotsAvailable || 3850),
          shuttleServiceInfo: item.shuttleServiceInfo || item.shuttleBus || 'Electric Shuttle Bus running every 3 to 5 minutes (Free Service)',
          privateVehicleInfo: item.privateVehicleInfo || item.privateVehicle || 'Private vehicles restricted inside core ghat area.',
          walkingPathInfo: item.walkingPathInfo || item.walkingPath || 'Pedestrian green route available.',
          status: item.status || 'Clear',
          description: item.description || 'Verified Simhastha transport update.'
        });
      }

      // Apply custom sequence ordering set by Admin
      const orderIds = JSON.parse(localStorage.getItem('kumbh_order_travel') || '[]');
      if (orderIds && orderIds.length > 0) {
        const orderMap = new Map();
        orderIds.forEach((id, idx) => orderMap.set(String(id), idx));

        finalItems.sort((a, b) => {
          const idA = String(a._id || a.id || '');
          const idB = String(b._id || b.id || '');
          const posA = orderMap.has(idA) ? orderMap.get(idA) : 99999;
          const posB = orderMap.has(idB) ? orderMap.get(idB) : 99999;
          return posA - posB;
        });
      }

      setTravelData(finalItems);
    } catch (err) {
      setTravelData(defaultTravelData);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanJourney = (e) => {
    e.preventDefault();
    if (!fromLoc.trim() || !toLoc.trim()) return;

    const fromClean = fromLoc.trim().toLowerCase();
    const toClean = toLoc.trim().toLowerCase();

    // Match exact or partial route from Admin travelData
    const matchedRoute = travelData.find(item => {
      const f = (item.fromLocation || '').toLowerCase();
      const tLoc = (item.toLocation || '').toLowerCase();
      const title = (item.title || '').toLowerCase();

      return (f.includes(fromClean) && tLoc.includes(toClean)) ||
             (title.includes(fromClean) && title.includes(toClean)) ||
             (f.includes(fromClean) || tLoc.includes(toClean));
    });

    if (matchedRoute) {
      const total = matchedRoute.parkingSlotsTotal || 5000;
      const avail = matchedRoute.parkingSlotsAvailable || 3850;
      const freePct = Math.round((avail / total) * 100);

      setJourneyResult({
        from: fromLoc.trim(),
        to: toLoc.trim(),
        matchedTitle: matchedRoute.title,
        estimatedTime: matchedRoute.estimatedTime || '10 - 15 Mins',
        distance: matchedRoute.distance || '1.5 km',
        shuttleService: matchedRoute.shuttleServiceInfo || `Eco Electric Shuttle Bus B3 from ${fromLoc} to ${toLoc}. Runs every 3-5 mins (Free).`,
        parkingName: matchedRoute.nearestParking || 'Tapovan Satellite Parking Hub A',
        parkingSlotsTotal: total,
        parkingSlotsAvailable: avail,
        parkingFreePct: freePct,
        privateVehicleInfo: matchedRoute.privateVehicleInfo || 'Private vehicles restricted inside core ghat zone. Park at satellite hubs.',
        walkingPath: matchedRoute.walkingPathInfo || 'Pedestrian green corridor with drinking water booths and shade tents every 200m.',
        status: matchedRoute.status || 'Clear'
      });
    } else {
      // Dynamic fallback route using admin defaults
      setJourneyResult({
        from: fromLoc.trim(),
        to: toLoc.trim(),
        matchedTitle: `${fromLoc.trim()} to ${toLoc.trim()} Route`,
        estimatedTime: '10 - 15 Mins (Shuttle Bus)',
        distance: '2.0 km',
        shuttleService: `Free Ring Road Electric Shuttle Bus connecting ${fromLoc.trim()} to ${toLoc.trim()} (Every 3 to 5 minutes).`,
        parkingName: 'Tapovan Satellite Parking Hub A',
        parkingSlotsTotal: 5000,
        parkingSlotsAvailable: 3850,
        parkingFreePct: 77,
        privateVehicleInfo: `Private vehicles restricted beyond ${fromLoc.trim()} inner boundary. Park at outer satellite hubs.`,
        walkingPath: `Pedestrian green walkway along River Godavari corridor connecting ${fromLoc.trim()} directly to ${toLoc.trim()}.`,
        status: 'Clear'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Title Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md border border-white/20">
            🚌
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight truncate">{t('travelParking') || 'Travel & Parking'}</h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium mt-0.5 truncate">
              Shuttles, Routes, Parking Availability & Live Travel Advisories
            </p>
          </div>
        </div>        {/* List View / Map View Toggle Buttons (Hidden on Desktop / Laptop) */}
        <div className="flex lg:hidden bg-blue-950/60 p-1.5 rounded-2xl border border-blue-400/40 text-xs self-start sm:self-auto z-10 flex-shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${viewMode === 'list' ? 'bg-white text-blue-950 shadow-md' : 'text-blue-100 hover:text-white'}`}
          >
            📋 List View ({travelData.length})
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${viewMode === 'map' ? 'bg-white text-blue-950 shadow-md' : 'text-blue-100 hover:text-white'}`}
          >
            🗺️ Map View
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
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Tapovan+Satellite+Parking,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-cyan-100/90 hover:bg-cyan-200 text-cyan-950 border border-cyan-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🅿️</span>
              <span>Tapovan Satellite Hub</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Ramkund+Shuttle+Drop,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🚌</span>
              <span>Ramkund E-Shuttle Drop</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Adgaon+Highway+Parking,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-indigo-100/90 hover:bg-indigo-200 text-indigo-950 border border-indigo-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🚧</span>
              <span>Adgaon Outer Checkpost</span>
            </button>
          </div>
        </div>
      )}

      {/* Journey Planner Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-lg space-y-5">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-blue-900 border-b pb-3">
          <Compass className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-slate-900">Simple Journey Planner</h3>
            <p className="text-xs text-slate-500 font-medium">Select origin & destination to check live parking slots, travel times, and shuttle buses</p>
          </div>
        </div>

        <form onSubmit={handlePlanJourney} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Where are you currently? (From)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-blue-600 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={fromLoc}
                onChange={(e) => setFromLoc(e.target.value)}
                placeholder="e.g. Sita Gufa / Tapovan Parking / CBS"
                className="w-full pl-10 pr-4 py-3 bg-blue-50/50 border-2 border-blue-200 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Where do you want to go? (To)</label>
            <div className="relative">
              <Navigation className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                placeholder="e.g. Ramkund / Trimbakeshwar Temple"
                className="w-full pl-10 pr-4 py-3 bg-blue-50/50 border-2 border-blue-200 rounded-2xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-2 flex justify-start">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-full shadow-md flex items-center space-x-2 transition-all hover:scale-102 border border-blue-500 flex-shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>Check Route & Parking Availability</span>
            </button>
          </div>
        </form>

        {/* Detailed Journey Planner Results (Synchronized from Admin TravelMgmt.jsx) */}
        {journeyResult && (
          <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900">
                  Optimal Route Advisories
                </span>
                <h4 className="font-bold text-base text-blue-950 mt-1">{journeyResult.matchedTitle}</h4>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                <span className="bg-white px-3 py-1 rounded-full border border-blue-200 shadow-sm flex items-center gap-1">
                  ⏱️ {journeyResult.estimatedTime}
                </span>
                <span className="bg-white px-3 py-1 rounded-full border border-blue-200 shadow-sm flex items-center gap-1">
                  📍 {journeyResult.distance}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Shuttle Service Box */}
              <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-950 border-b pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Shuttle Bus Connection</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">24/7 Free</span>
                </div>
                <p className="font-medium text-slate-700 leading-relaxed text-xs">{journeyResult.shuttleService}</p>
              </div>

              {/* Parking Hub Availability */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-950 border-b pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">{journeyResult.parkingName}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {journeyResult.parkingFreePct}% Available
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-600">Real-time Slots Available:</span>
                  <span className="font-mono text-emerald-800 font-bold text-sm">
                    {journeyResult.parkingSlotsAvailable.toLocaleString()} / {journeyResult.parkingSlotsTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Private Vehicle Advisory */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-950 border-b pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Private Vehicle Advisory</span>
                  </span>
                </div>
                <p className="font-medium text-slate-700 leading-relaxed text-xs">{journeyResult.privateVehicleInfo}</p>
              </div>

              {/* Walking Corridor / Pedestrian Pathway */}
              <div className="bg-white p-4 rounded-2xl border border-blue-300 shadow-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-950 border-b pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Footprints className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Walking Path & Promenade</span>
                  </span>
                </div>
                <p className="font-medium text-slate-700 leading-relaxed text-xs">{journeyResult.walkingPathInfo || journeyResult.walkingPath}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Route & Transport Advisories List */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Bus className="w-5 h-5 text-blue-600" />
          <span>Live Shuttle, Parking & Transport Advisories</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-bold text-sm">Loading live transport updates...</div>
        ) : travelData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelData.map((item) => {
              const freePct = Math.round((item.parkingSlotsAvailable / item.parkingSlotsTotal) * 100) || 75;

              return (
                <div key={item._id || item.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex flex-col justify-between h-full space-y-3 hover:shadow-lg transition-shadow">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
                        {item.routeType}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        item.status === 'Clear' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                    <div className="space-y-2 pt-2 border-t text-xs">
                      <div className="flex items-center justify-between bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-blue-950 font-medium">
                        <span className="flex items-center gap-1 font-bold">
                          <Bus className="w-3.5 h-3.5 text-blue-600" /> Shuttle Bus:
                        </span>
                        <span className="text-blue-900">{item.shuttleServiceInfo}</span>
                      </div>

                      <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
                        <span className="flex items-center gap-1 font-bold">
                          <Car className="w-3.5 h-3.5 text-emerald-600" /> Parking Free:
                        </span>
                        <span className="font-mono text-emerald-800 font-bold">
                          {item.parkingSlotsAvailable.toLocaleString()} / {item.parkingSlotsTotal.toLocaleString()} Slots ({freePct}% Available)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Perfectly Aligned Pill-Shaped Get Direction Button */}
                  <div className="pt-2 mt-auto flex justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        const destinationQuery = encodeURIComponent((item.nearestParking || item.title) + ', Nashik');
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`, '_blank');
                      }}
                      className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md inline-flex items-center space-x-2 transition-all hover:scale-105 border border-blue-500 flex-shrink-0"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Direction</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-3xl border border-blue-100 text-slate-600 text-xs font-medium">
            No active road blockages reported. Electric shuttle buses are running continuously between Outer Parking Satellite Hubs and Panchavati Ghats every 3 to 5 minutes.
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelParking;

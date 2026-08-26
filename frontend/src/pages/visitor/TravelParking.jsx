import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bus, Car, Footprints, AlertTriangle, ArrowRight, MapPin, 
  Compass, Navigation, Clock, ShieldAlert, CheckCircle, Sparkles
} from 'lucide-react';
import api from '../../services/api';

const TravelParking = () => {
  const { t } = useLanguage();
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Journey planner local state
  const [fromLoc, setFromLoc] = useState('');
  const [toLoc, setToLoc] = useState('');
  const [journeyResult, setJourneyResult] = useState(null);

  const defaultTravelData = [
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

      const combined = [...customTravel, ...apiItems];

      const enrichedApiItems = combined
        .filter(item => !deletedIds.includes(item._id) && !deletedIds.includes(item.id))
        .map(item => ({
          _id: item._id || item.id,
          id: item._id || item.id,
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
        }));

      const apiTitles = new Set(enrichedApiItems.map(i => i.title));
      const finalItems = [
        ...enrichedApiItems,
        ...defaultTravelData.filter(d => !apiTitles.has(d.title) && !deletedIds.includes(d.id))
      ];

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
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            🚌
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('travelParking') || 'Travel & Parking'}</h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium mt-0.5">
              Shuttles, Routes, Parking Availability & Live Travel Advisories
            </p>
          </div>
        </div>
      </div>

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

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-101 border border-blue-500"
            >
              <span>Show Route & Transport Options</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Detailed Journey Planner Results (Synchronized from Admin TravelMgmt.jsx) */}
        {journeyResult && (
          <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 border-2 border-blue-300 space-y-4 text-xs text-slate-800 shadow-md animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-blue-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  Recommended Travel Route
                </span>
                <h4 className="font-bold text-base text-blue-950 mt-1">{journeyResult.matchedTitle}</h4>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Travel Time: {journeyResult.estimatedTime} ({journeyResult.distance})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Near Parking Availability */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-950 border-b pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">Near Parking Slot Availability</span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-mono">
                    {journeyResult.parkingFreePct}% Available
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-xs">{journeyResult.parkingName}</p>
                <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span>Free Slots: {journeyResult.parkingSlotsAvailable.toLocaleString()}</span>
                  <span>Total Capacity: {journeyResult.parkingSlotsTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Shuttle Bus Service Info */}
              <div className="bg-white p-4 rounded-2xl border border-indigo-300 shadow-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-indigo-950 border-b pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm">Shuttle Bus Service Info</span>
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[11px]">
                    Free Service
                  </span>
                </div>
                <p className="font-medium text-slate-800 leading-relaxed text-xs">{journeyResult.shuttleService}</p>
              </div>

              {/* Private Vehicle Info & Advisory */}
              <div className="bg-white p-4 rounded-2xl border border-amber-300 shadow-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-950 border-b pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span className="text-sm">Private Vehicle Advisory</span>
                  </span>
                </div>
                <p className="font-medium text-amber-900 leading-relaxed text-xs">{journeyResult.privateVehicleInfo}</p>
              </div>

              {/* Walking Corridor / Pedestrian Pathway */}
              <div className="bg-white p-4 rounded-2xl border border-blue-300 shadow-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-950 border-b pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Footprints className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Walking Path & Promenade</span>
                  </span>
                </div>
                <p className="font-medium text-slate-700 leading-relaxed text-xs">{journeyResult.walkingPath}</p>
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
                <div key={item._id || item.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3 hover:shadow-lg transition-shadow">
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

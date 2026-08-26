import React, { useState, useEffect } from 'react';
import { 
  Bus, Car, Footprints, Plus, Trash2, CheckCircle, AlertCircle, 
  MapPin, Clock, Navigation, Search, ShieldAlert, Compass, Edit3, X
} from 'lucide-react';
import api from '../../services/api';

const TravelMgmt = () => {
  const [travelItems, setTravelItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const routeTypes = [
    'All', 'Journey Route', 'Parking Slot', 'Shuttle Bus', 'Private Vehicle Advisory', 'Road Diversion'
  ];

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
    },
    {
      _id: 'trv-4',
      id: 'trv-4',
      fromLocation: 'Adgaon Highway Hub',
      toLocation: 'Panchavati',
      title: 'Adgaon NH-3 Entrance to Panchavati Promenade',
      routeType: 'Parking Slot',
      estimatedTime: '15 - 20 Mins',
      distance: '5.8 km',
      nearestParking: 'Adgaon Outer Highway Parking Complex B',
      parkingSlotsTotal: 15000,
      parkingSlotsAvailable: 11400,
      shuttleServiceInfo: 'Electric Shuttle Bus Route #7 running to Panchavati Karanja every 5 mins.',
      privateVehicleInfo: 'Heavy vehicles and private cars diverted at Adgaon Naka. Mandatory parking at Adgaon Complex.',
      walkingPathInfo: 'Dedicated shaded walkway with medical aid stations along Mumbai-Agra road.',
      status: 'Clear',
      description: 'Highway ingress point for traffic arriving from Thane, Mumbai, and North Maharashtra.'
    }
  ];

  const [form, setForm] = useState({
    fromLocation: '',
    toLocation: '',
    title: '',
    routeType: 'Journey Route',
    estimatedTime: '10 Mins (Shuttle)',
    distance: '1.5 km',
    nearestParking: 'Tapovan Satellite Parking Hub A',
    parkingSlotsTotal: 5000,
    parkingSlotsAvailable: 4200,
    shuttleServiceInfo: 'Electric Shuttle Bus running every 3 to 5 minutes (Free)',
    privateVehicleInfo: 'Private vehicles restricted inside core ghat area. Park at outer satellite hubs.',
    walkingPathInfo: 'Pedestrian green route available along river promenade.',
    status: 'Clear',
    description: ''
  });

  useEffect(() => {
    fetchTravel();
  }, []);

  const fetchTravel = async () => {
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
          parkingSlotsAvailable: Number(item.parkingSlotsAvailable || 3800),
          shuttleServiceInfo: item.shuttleServiceInfo || item.shuttleBus || 'Electric Shuttle Bus every 3-5 mins (Free)',
          privateVehicleInfo: item.privateVehicleInfo || item.privateVehicle || 'Private vehicles restricted in core area.',
          walkingPathInfo: item.walkingPathInfo || item.walkingPath || 'Pedestrian walkway available.',
          status: item.status || 'Clear',
          description: item.description || 'Verified Kumbh Mela transport and parking advisory.'
        }));

      const apiTitles = new Set(enrichedApiItems.map(i => i.title));
      const finalItems = [
        ...enrichedApiItems,
        ...defaultTravelData.filter(d => !apiTitles.has(d.title) && !deletedIds.includes(d.id))
      ];

      setTravelItems(finalItems);
    } catch (err) {
      setTravelItems(defaultTravelData);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fromLocation.trim() || !form.toLocation.trim()) {
      alert('Please enter From (Origin) and To (Destination) locations');
      return;
    }

    try {
      const newId = 'trv-' + Date.now();
      const generatedTitle = form.title.trim() || `${form.fromLocation.trim()} to ${form.toLocation.trim()} Transport Corridor`;

      const payload = {
        _id: newId,
        id: newId,
        fromLocation: form.fromLocation.trim(),
        toLocation: form.toLocation.trim(),
        title: generatedTitle,
        routeType: form.routeType,
        estimatedTime: form.estimatedTime.trim() || '10 - 15 Mins',
        distance: form.distance.trim() || '1.5 km',
        nearestParking: form.nearestParking.trim() || 'Tapovan Satellite Hub',
        parkingSlotsTotal: Number(form.parkingSlotsTotal) || 5000,
        parkingSlotsAvailable: Number(form.parkingSlotsAvailable) || 3800,
        shuttleServiceInfo: form.shuttleServiceInfo.trim(),
        privateVehicleInfo: form.privateVehicleInfo.trim(),
        walkingPathInfo: form.walkingPathInfo.trim(),
        status: form.status,
        description: form.description.trim() || `${generatedTitle} travel details, shuttle bus frequencies, and parking status.`
      };

      const res = await api.post('/travel', payload);
      if (res?.data?.success || res?.status === 200 || res?.status === 201) {
        setShowModal(false);
        setForm({
          fromLocation: '',
          toLocation: '',
          title: '',
          routeType: 'Journey Route',
          estimatedTime: '10 Mins (Shuttle)',
          distance: '1.5 km',
          nearestParking: 'Tapovan Satellite Parking Hub A',
          parkingSlotsTotal: 5000,
          parkingSlotsAvailable: 4200,
          shuttleServiceInfo: 'Electric Shuttle Bus running every 3 to 5 minutes (Free)',
          privateVehicleInfo: 'Private vehicles restricted inside core ghat area. Park at outer satellite hubs.',
          walkingPathInfo: 'Pedestrian green route available along river promenade.',
          status: 'Clear',
          description: ''
        });
        fetchTravel();
      }
    } catch (err) {
      alert('Error publishing travel & parking route');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? It will be removed from visitor journey planners.`)) return;

    try {
      await api.delete(`/travel/${id}`).catch(() => null);
      setTravelItems(prev => prev.filter(item => item._id !== id && item.id !== id && item.title !== title));
      alert(`"${title}" has been deleted.`);
      fetchTravel();
    } catch (err) {
      alert('Error deleting travel route');
    }
  };

  const filteredTravelItems = travelItems.filter(item => {
    const matchesType = selectedType === 'All' || 
      (item.routeType && item.routeType.toLowerCase().includes(selectedType.toLowerCase()));

    const searchLow = search.toLowerCase();
    const matchesSearch = searchLow === '' ||
      (item.title && item.title.toLowerCase().includes(searchLow)) ||
      (item.fromLocation && item.fromLocation.toLowerCase().includes(searchLow)) ||
      (item.toLocation && item.toLocation.toLowerCase().includes(searchLow)) ||
      (item.nearestParking && item.nearestParking.toLowerCase().includes(searchLow));

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-500/30">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 backdrop-blur-md border border-blue-400/40 flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            🚌
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-100">Travel & Parking Management</h2>
            <p className="text-xs text-blue-200/80 mt-0.5 font-medium">
              Create & Manage Routes, Parking Slot Availability, Shuttle Bus Services & Private Vehicle Info
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 border border-blue-400/40"
        >
          <Plus className="w-4 h-4" /> Add Route & Parking Config
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-blue-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routes by origin, destination, or parking hub name..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {routeTypes.map((type) => {
            const isSelected = selectedType === type;
            const count = type === 'All' ? travelItems.length : travelItems.filter(t => t.routeType && t.routeType.toLowerCase().includes(type.toLowerCase())).length;

            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border ${
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                }`}
              >
                <span>{type}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                  isSelected ? 'bg-blue-950/40 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Travel & Parking Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">Loading travel & parking management data...</div>
      ) : filteredTravelItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-blue-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Routes or Parking Config Found in "{selectedType}"</h3>
          <p className="text-xs text-slate-500">Click "Add Route & Parking Config" to create new origin-destination journey advisories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTravelItems.map((item) => {
            const occupancyPct = Math.round(((item.parkingSlotsTotal - item.parkingSlotsAvailable) / item.parkingSlotsTotal) * 100) || 30;

            return (
              <div 
                key={item._id || item.id} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                        {item.routeType}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{item.title}</h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'Clear' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold bg-blue-50 p-3 rounded-2xl border border-blue-200">
                    <div className="flex items-center space-x-1.5 text-blue-900">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{item.fromLocation}</span>
                      <Navigation className="w-3.5 h-3.5 text-blue-500 mx-1" />
                      <span>{item.toLocation}</span>
                    </div>
                    <span className="text-blue-800 font-mono text-[11px] bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                      ⏱️ {item.estimatedTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="space-y-2 pt-2 border-t text-xs">
                    <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-950">
                        <span className="flex items-center gap-1">
                          <Car className="w-4 h-4 text-emerald-700" />
                          <span>Parking Availability:</span>
                        </span>
                        <span className="font-mono text-emerald-800">
                          {item.parkingSlotsAvailable.toLocaleString()} / {item.parkingSlotsTotal.toLocaleString()} Slots Free ({100 - occupancyPct}% Available)
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-900 font-medium">{item.nearestParking}</p>
                    </div>

                    <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-200 space-y-1 text-indigo-950">
                      <p className="font-bold flex items-center gap-1">
                        <Bus className="w-4 h-4 text-indigo-700" />
                        <span>Shuttle Bus Service:</span>
                      </p>
                      <p className="text-[11px] font-medium text-indigo-900">{item.shuttleServiceInfo}</p>
                    </div>

                    <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 space-y-1 text-amber-950">
                      <p className="font-bold flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4 text-amber-700" />
                        <span>Private Vehicle Info:</span>
                      </p>
                      <p className="text-[11px] font-medium text-amber-900">{item.privateVehicleInfo}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center justify-between gap-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Published to Journey Planner
                  </span>

                  <button
                    onClick={() => handleDelete(item._id || item.id, item.title)}
                    className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
                    title="Delete Card"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Route & Parking Config */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-blue-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">Add Route & Parking Configuration</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From (Origin) *</label>
                  <input
                    type="text"
                    required
                    value={form.fromLocation}
                    onChange={(e) => setForm({ ...form, fromLocation: e.target.value })}
                    placeholder="e.g. Sita Gufa / Tapovan Parking"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">To (Destination) *</label>
                  <input
                    type="text"
                    required
                    value={form.toLocation}
                    onChange={(e) => setForm({ ...form, toLocation: e.target.value })}
                    placeholder="e.g. Ramkund / Trimbakeshwar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Route Title / Name</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Sita Gufa to Ramkund Bathing Ghat Corridor"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Route Type</label>
                  <select
                    value={form.routeType}
                    onChange={(e) => setForm({ ...form, routeType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                  >
                    <option value="Journey Route">Journey Route</option>
                    <option value="Parking Slot">Parking Slot</option>
                    <option value="Shuttle Bus">Shuttle Bus</option>
                    <option value="Private Vehicle Advisory">Private Vehicle Advisory</option>
                    <option value="Road Diversion">Road Diversion</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Travel Time / Duration</label>
                  <input
                    type="text"
                    value={form.estimatedTime}
                    onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                    placeholder="e.g. 8 - 12 Mins"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Distance</label>
                  <input
                    type="text"
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                    placeholder="e.g. 1.2 km"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="border-t pt-3 space-y-3">
                <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-blue-600" /> Near Parking Availability Configuration
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nearest Parking Hub Name</label>
                  <input
                    type="text"
                    value={form.nearestParking}
                    onChange={(e) => setForm({ ...form, nearestParking: e.target.value })}
                    placeholder="e.g. Tapovan Satellite Parking Hub A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Total Parking Slots</label>
                    <input
                      type="number"
                      value={form.parkingSlotsTotal}
                      onChange={(e) => setForm({ ...form, parkingSlotsTotal: e.target.value })}
                      placeholder="e.g. 5000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Available Free Slots</label>
                    <input
                      type="number"
                      value={form.parkingSlotsAvailable}
                      onChange={(e) => setForm({ ...form, parkingSlotsAvailable: e.target.value })}
                      placeholder="e.g. 3850"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shuttle Bus Service Info *</label>
                <input
                  type="text"
                  required
                  value={form.shuttleServiceInfo}
                  onChange={(e) => setForm({ ...form, shuttleServiceInfo: e.target.value })}
                  placeholder="e.g. Eco Electric Shuttle Bus B3 running every 3 to 5 minutes (Free)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Private Vehicle Info & Restrictions *</label>
                <input
                  type="text"
                  required
                  value={form.privateVehicleInfo}
                  onChange={(e) => setForm({ ...form, privateVehicleInfo: e.target.value })}
                  placeholder="e.g. Private vehicles restricted inside core ghat zone 4 AM - 10 PM. Mandatory parking at Tapovan."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Walking Path & Pedestrian Corridor Info</label>
                <input
                  type="text"
                  value={form.walkingPathInfo}
                  onChange={(e) => setForm({ ...form, walkingPathInfo: e.target.value })}
                  placeholder="e.g. Barricaded green walking corridor with drinking water booths every 200m."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
                />
              </div>

              <div className="pt-3 border-t flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Publish Route & Parking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelMgmt;

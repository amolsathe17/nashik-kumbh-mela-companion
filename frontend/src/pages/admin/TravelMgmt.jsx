import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bus, Car, Footprints, Plus, Trash2, CheckCircle, AlertCircle, 
  MapPin, Clock, Navigation, Search, ShieldAlert, Compass, Edit3, X, ArrowUp, ArrowDown, Copy, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

const TravelMgmt = () => {
  const tabsRef = useRef(null);
  const [travelItems, setTravelItems] = useState([]);
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

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [travelItems]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTravel, setEditingTravel] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('Journey Route');
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const routeTypes = [
    'Journey Route', 'Parking Slot', 'Shuttle Bus', 'Private Vehicle Advisory', 'Road Diversion'
  ];

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

  const resetForm = () => {
    setEditingTravel(null);
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
  };

  const handleEdit = (item) => {
    setEditingTravel(item);
    setForm({
      fromLocation: item.fromLocation || '',
      toLocation: item.toLocation || '',
      title: item.title || '',
      routeType: item.routeType || 'Journey Route',
      estimatedTime: item.estimatedTime || '10 Mins (Shuttle)',
      distance: item.distance || '1.5 km',
      nearestParking: item.nearestParking || 'Tapovan Satellite Parking Hub A',
      parkingSlotsTotal: item.parkingSlotsTotal || 5000,
      parkingSlotsAvailable: item.parkingSlotsAvailable || 4200,
      shuttleServiceInfo: item.shuttleServiceInfo || '',
      privateVehicleInfo: item.privateVehicleInfo || '',
      walkingPathInfo: item.walkingPathInfo || '',
      status: item.status || 'Clear',
      description: item.description || ''
    });
    setShowModal(true);
  };

  const handleCopy = (item) => {
    setEditingTravel(null);
    setForm({
      fromLocation: item.fromLocation || '',
      toLocation: item.toLocation || '',
      title: '',
      routeType: item.routeType || 'Journey Route',
      estimatedTime: item.estimatedTime || '10 Mins (Shuttle)',
      distance: item.distance || '1.5 km',
      nearestParking: item.nearestParking || 'Tapovan Satellite Parking Hub A',
      parkingSlotsTotal: item.parkingSlotsTotal || 5000,
      parkingSlotsAvailable: item.parkingSlotsAvailable || 4200,
      shuttleServiceInfo: item.shuttleServiceInfo || '',
      privateVehicleInfo: item.privateVehicleInfo || '',
      walkingPathInfo: item.walkingPathInfo || '',
      status: item.status || 'Clear',
      description: item.description || ''
    });
    setShowModal(true);
  };

  const applyCustomOrder = (items) => {
    const orderIds = JSON.parse(localStorage.getItem('kumbh_order_travel') || '[]');
    if (!orderIds || orderIds.length === 0) return items;

    const orderMap = new Map();
    orderIds.forEach((id, idx) => orderMap.set(String(id), idx));

    return [...items].sort((a, b) => {
      const idA = String(a._id || a.id || '');
      const idB = String(b._id || b.id || '');
      const posA = orderMap.has(idA) ? orderMap.get(idA) : 99999;
      const posB = orderMap.has(idB) ? orderMap.get(idB) : 99999;
      return posA - posB;
    });
  };

  const handleMove = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredTravelItems.length) return;

    const itemToMove = filteredTravelItems[index];
    const targetItem = filteredTravelItems[targetIndex];

    const realIndex = travelItems.findIndex(t => (t._id || t.id) === (itemToMove._id || itemToMove.id));
    const realTargetIndex = travelItems.findIndex(t => (t._id || t.id) === (targetItem._id || targetItem.id));

    if (realIndex === -1 || realTargetIndex === -1) return;

    const updated = [...travelItems];
    const temp = updated[realIndex];
    updated[realIndex] = updated[realTargetIndex];
    updated[realTargetIndex] = temp;

    setTravelItems(updated);

    const orderIds = updated.map(t => t._id || t.id);
    localStorage.setItem('kumbh_order_travel', JSON.stringify(orderIds));
  };

  const fetchTravel = async () => {
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
          parkingSlotsAvailable: Number(item.parkingSlotsAvailable || 3800),
          shuttleServiceInfo: item.shuttleServiceInfo || item.shuttleBus || 'Electric Shuttle Bus every 3-5 mins (Free)',
          privateVehicleInfo: item.privateVehicleInfo || item.privateVehicle || 'Private vehicles restricted in core area.',
          walkingPathInfo: item.walkingPathInfo || item.walkingPath || 'Pedestrian walkway available.',
          status: item.status || 'Clear',
          description: item.description || 'Verified Kumbh Mela transport and parking advisory.'
        });
      }

      setTravelItems(applyCustomOrder(finalItems));
    } catch (err) {
      setTravelItems(defaultTravelData);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fromLocation || !form.fromLocation.trim() || !form.toLocation || !form.toLocation.trim()) {
      alert('Please enter From (Origin) and To (Destination) locations');
      return;
    }

    try {
      const targetId = editingTravel ? (editingTravel._id || editingTravel.id) : ('trv-' + Date.now());
      const generatedTitle = (form.title || '').trim() || `${form.fromLocation.trim()} to ${form.toLocation.trim()} Transport Corridor`;

      const payload = {
        _id: targetId,
        id: targetId,
        fromLocation: form.fromLocation.trim(),
        toLocation: form.toLocation.trim(),
        title: generatedTitle,
        routeType: form.routeType || 'Journey Route',
        estimatedTime: (form.estimatedTime || '').trim() || '10 - 15 Mins',
        distance: (form.distance || '').trim() || '1.5 km',
        nearestParking: (form.nearestParking || '').trim() || 'Tapovan Satellite Hub',
        parkingSlotsTotal: Number(form.parkingSlotsTotal) || 5000,
        parkingSlotsAvailable: Number(form.parkingSlotsAvailable) || 3800,
        shuttleServiceInfo: (form.shuttleServiceInfo || '').trim() || 'Free Electric Shuttle Bus running every 3 mins',
        privateVehicleInfo: (form.privateVehicleInfo || '').trim() || 'Private vehicles restricted in core ghat area',
        walkingPathInfo: (form.walkingPathInfo || '').trim() || 'Pedestrian green corridor available',
        status: form.status || 'Clear',
        description: (form.description || '').trim() || `${generatedTitle} travel details, shuttle bus frequencies, and parking status.`
      };

      // Safely save to localStorage (with quota handling)
      try {
        const customTravel = JSON.parse(localStorage.getItem('kumbh_custom_travel') || '[]');
        const filteredCustom = customTravel.filter(c => c && c._id !== targetId && c.id !== targetId && c.title !== editingTravel?.title);
        localStorage.setItem('kumbh_custom_travel', JSON.stringify([payload, ...filteredCustom]));
      } catch (storageErr) {
        console.warn('LocalStorage quota warning:', storageErr);
      }

      // Optimistically update local state so card appears immediately
      setTravelItems(prev => {
        const filtered = prev.filter(t => (t._id || t.id) !== targetId && t.title !== editingTravel?.title);
        return [payload, ...filtered];
      });

      // Send to backend API asynchronously (ignore backend errors so local save always succeeds)
      await api.post('/travel', payload).catch(() => null);

      setShowModal(false);
      resetForm();
      setSaveSuccessMessage(`Route card "${generatedTitle}" saved successfully.`);
      setTimeout(() => setSaveSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error publishing travel & parking route:', err);
      alert('Error publishing travel & parking route: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = (id, title) => {
    setDeleteConfirmItem({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    const { id, title } = deleteConfirmItem;

    try {
      if (id) {
        await api.delete(`/travel/${id}`).catch(() => null);
      }

      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_travel') || '[]');
      if (id && !deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('kumbh_deleted_travel', JSON.stringify(deletedIds));
      }

      const customTravel = JSON.parse(localStorage.getItem('kumbh_custom_travel') || '[]');
      const updatedCustom = customTravel.filter(item => item._id !== id && item.id !== id && item.title !== title);
      localStorage.setItem('kumbh_custom_travel', JSON.stringify(updatedCustom));

      setTravelItems(prev => prev.filter(item => item._id !== id && item.id !== id && item.title !== title));
      fetchTravel();
    } catch (err) {
      alert('Error deleting travel route');
    } finally {
      setDeleteConfirmItem(null);
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
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 border border-blue-500/40 p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-blue-400/40 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md">
            🚌
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-100 leading-tight truncate">Travel & Parking Management</h2>
            <p className="text-xs sm:text-sm text-blue-200/80 mt-0.5 font-medium truncate">
              Create & Manage Routes, Parking Slot Availability, Shuttle Bus Services & Private Vehicle Info
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto z-10 flex-shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-blue-950/60 text-blue-100 border border-blue-400/40 text-xs font-bold shadow-md">
            📋 List View ({travelItems.length})
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 border border-blue-400/40"
          >
            <Plus className="w-4 h-4" /> Add Route & Parking Config
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Row: Search Left, Scrollable Tabs with Circular Arrow Buttons Right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Search Bar Input */}
        <div className="relative lg:w-72 xl:w-80 flex-shrink-0">
          <Search className="w-5 h-5 text-blue-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routes..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Horizontal Filter Chips with Circular Left/Right Arrow Buttons & Scrollbar */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-blue-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4 text-blue-700" />
            </button>
          )}

          <div
            ref={tabsRef}
            onScroll={checkScroll}
            className="flex-1 min-w-0 overflow-x-auto py-1 text-xs scrollbar-thin scrollbar-thumb-blue-300 scroll-smooth"
          >
            <div className="flex items-center gap-2 flex-nowrap min-w-max">
              {routeTypes.map((type) => {
                const isSelected = selectedType === type;
                const count = type === 'All' ? travelItems.length : travelItems.filter(t => t.routeType && t.routeType.toLowerCase().includes(type.toLowerCase())).length;

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border flex-shrink-0 ${
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

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="w-8 h-8 rounded-full bg-white hover:bg-blue-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4 text-blue-700" />
            </button>
          )}
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
          {filteredTravelItems.map((item, idx) => {
            const occupancyPct = Math.round(((item.parkingSlotsTotal - item.parkingSlotsAvailable) / item.parkingSlotsTotal) * 100) || 30;

            return (
              <div 
                key={item._id || item.id || idx} 
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

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        item.status === 'Clear' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}>
                        {item.status}
                      </span>

                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-all"
                          title="Move Sequence Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === filteredTravelItems.length - 1}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition-all"
                          title="Move Sequence Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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

                <div className="p-4 pt-3 mt-auto flex items-center justify-between gap-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Published
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item)}
                      className="px-3 py-1.5 rounded-full text-indigo-700 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                      title="Copy Card with Mandatory New Title"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>

                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1.5 rounded-full text-blue-700 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                      title="Edit Card"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item._id || item.id, item.title)}
                      className="px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add or Edit Route & Parking Config */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Fixed Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {editingTravel ? `Edit Travel Route ("${editingTravel.title}")` : 'Add Route & Parking Configuration'}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">Configure route parameters, shuttles, and parking capacity</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowModal(false); resetForm(); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form wrapping scrollable body and fixed footer */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">From (Origin) *</label>
                    <input
                      type="text"
                      required
                      value={form.fromLocation}
                      onChange={(e) => setForm({ ...form, fromLocation: e.target.value })}
                      placeholder="e.g. Sita Gufa / Tapovan Parking"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">To (Destination) *</label>
                    <input
                      type="text"
                      required
                      value={form.toLocation}
                      onChange={(e) => setForm({ ...form, toLocation: e.target.value })}
                      placeholder="e.g. Ramkund / Trimbakeshwar"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Route Title / Name</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Sita Gufa to Ramkund Bathing Ghat Corridor"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Route Type</label>
                    <select
                      value={form.routeType}
                      onChange={(e) => setForm({ ...form, routeType: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all"
                    >
                      <option value="Journey Route">Journey Route</option>
                      <option value="Parking Slot">Parking Slot</option>
                      <option value="Shuttle Bus">Shuttle Bus</option>
                      <option value="Private Vehicle Advisory">Private Vehicle Advisory</option>
                      <option value="Road Diversion">Road Diversion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Travel Time / Duration</label>
                    <input
                      type="text"
                      value={form.estimatedTime}
                      onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                      placeholder="e.g. 8 - 12 Mins"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Distance</label>
                    <input
                      type="text"
                      value={form.distance}
                      onChange={(e) => setForm({ ...form, distance: e.target.value })}
                      placeholder="e.g. 1.2 km"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="border-t pt-3 space-y-3">
                  <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-blue-600" /> Near Parking Availability Configuration
                  </h4>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Nearest Parking Hub Name</label>
                    <input
                      type="text"
                      value={form.nearestParking}
                      onChange={(e) => setForm({ ...form, nearestParking: e.target.value })}
                      placeholder="e.g. Tapovan Satellite Parking Hub A"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 text-xs mb-1.5">Total Parking Slots</label>
                      <input
                        type="number"
                        value={form.parkingSlotsTotal}
                        onChange={(e) => setForm({ ...form, parkingSlotsTotal: e.target.value })}
                        placeholder="e.g. 5000"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 text-xs mb-1.5">Available Free Slots</label>
                      <input
                        type="number"
                        value={form.parkingSlotsAvailable}
                        onChange={(e) => setForm({ ...form, parkingSlotsAvailable: e.target.value })}
                        placeholder="e.g. 3850"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Shuttle Bus Service Info *</label>
                  <input
                    type="text"
                    required
                    value={form.shuttleServiceInfo}
                    onChange={(e) => setForm({ ...form, shuttleServiceInfo: e.target.value })}
                    placeholder="e.g. Eco Electric Shuttle Bus B3 running every 3 to 5 minutes (Free)"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Private Vehicle Info & Restrictions *</label>
                  <input
                    type="text"
                    required
                    value={form.privateVehicleInfo}
                    onChange={(e) => setForm({ ...form, privateVehicleInfo: e.target.value })}
                    placeholder="e.g. Private vehicles restricted inside core ghat zone 4 AM - 10 PM. Mandatory parking at Tapovan."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Walking Path & Pedestrian Corridor Info</label>
                  <input
                    type="text"
                    value={form.walkingPathInfo}
                    onChange={(e) => setForm({ ...form, walkingPathInfo: e.target.value })}
                    placeholder="e.g. Barricaded green walking corridor with drinking water booths every 200m."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> {editingTravel ? 'Save Changes' : 'Publish Travel Route Card'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CUSTOM CENTER DELETE CONFIRMATION MODAL POPUP */}
      {deleteConfirmItem && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setDeleteConfirmItem(null)} />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner border border-red-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">Confirm Deletion</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteConfirmItem.title}"</span>? It will be removed from visitor journey planners.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all hover:scale-102"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CUSTOM CENTER SAVE SUCCESS MODAL POPUP */}
      {saveSuccessMessage && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-500/30 p-6 z-10 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">Saved Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {saveSuccessMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSaveSuccessMessage('')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-102"
            >
              OK, Got it!
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TravelMgmt;

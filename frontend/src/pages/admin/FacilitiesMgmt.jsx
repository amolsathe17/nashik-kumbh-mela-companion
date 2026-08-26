import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Trash2, CheckCircle, Search, AlertCircle, 
  MapPin, Clock, Phone, Navigation, X, Filter, Image as ImageIcon, Edit3, ArrowUp, ArrowDown, Copy
} from 'lucide-react';
import api from '../../services/api';

const FacilitiesMgmt = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories matching NearbyFacilities.jsx (No Medical tab)
  const categories = [
    'All', 'Accommodation', 'Food Area', 'Drinking Water', 
    'Toilet', 'Pharmacy', 'Parking', 'Police Centre', 'Transport'
  ];

  const presetImages = [
    { label: 'Tapovan Pilgrim Tent Township', url: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp' },
    { label: 'Trimbakeshwar Ashram & Bhakta Niwas', url: '/dhwajarohan.webp' },
    { label: 'Panchavati Yatri Niwas', url: '/nagarpradakshina.webp' },
    { label: 'Ramkund Prasadam & Water Station', url: '/goda-aarti-chatg.webp' },
    { label: 'Kumbh Parking & Shuttle Terminal', url: '/kumbh-bg1.jpg' },
    { label: 'Kumbh Police Control Room', url: '/shahi.jpg' },
    { label: 'Ramkund Main Bathing Promenade', url: '/shahi-snan.jpg' },
    { label: 'Panchavati Kalaram Temple', url: '/img_20250206_1205497474678292145460306.webp' }
  ];

  const defaultFacilities = [
    {
      _id: 'fac-1',
      name: 'Tapovan Sadhugram Pilgrim Tent Township (तपोवन साधुग्राम टेंट सिटी)',
      category: 'Accommodation',
      address: 'Tapovan Sector 3, Nashik, Maharashtra 422003',
      location: 'Tapovan Sector 3, Nashik, Maharashtra 422003',
      description: 'Government and Akhara-managed free tented accommodation hub offering clean bedding, community dining, and 24-hour security for visiting pilgrims.',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: 'Check-in 24/7',
      distance: '3.2 km from Ramkund Ghat',
      contactNumber: '0253-2571000',
      facilities: ['Free Pilgrim Tents', 'Clean Bedding & Blankets', '24/7 Security Patrol', 'Charging Stations']
    },
    {
      _id: 'fac-2',
      name: 'Trimbakeshwar Bhakta Niwas & Yatri Chhatraya',
      category: 'Accommodation',
      address: 'Trimbak Ring Road, Trimbakeshwar, Maharashtra 422212',
      location: 'Trimbak Ring Road, Trimbakeshwar, Maharashtra 422212',
      description: 'Clean pilgrim rest house complex providing subsidized dormitory beds, luggage lockers, and hot water amenities near the Jyotirlinga temple.',
      image: '/dhwajarohan.webp',
      timings: 'Open 24 Hours',
      distance: '800 meters from Kushavarta Kund',
      contactNumber: '02594-233215',
      facilities: ['Dormitory Beds', 'Luggage Lockers', 'Clean Washrooms', 'Drinking Water']
    },
    {
      _id: 'fac-3',
      name: 'Panchavati Goda Prasadam Annakut Hall',
      category: 'Food Area',
      address: 'Sita Gufa Road, Panchavati, Nashik 422003',
      location: 'Sita Gufa Road, Panchavati, Nashik 422003',
      description: 'Official Kumbh Mela community kitchen serving hygienic, free Satvik Mahaprasadam meals (Lunch & Dinner) to all visiting devotees.',
      image: '/goda-aarti-chatg.webp',
      timings: '10:30 AM - 3:30 PM, 6:30 PM - 10:00 PM',
      distance: '400 meters from Ramkund',
      contactNumber: '0253-2575555',
      facilities: ['Free Satvik Mahaprasad', 'Clean Seating Hall', 'RO Drinking Water', 'Clean Hygiene Standards']
    },
    {
      _id: 'fac-4',
      name: 'Ramkund Main Bathing Ghat RO Water Station #1',
      category: 'Drinking Water',
      address: 'Goda Promenade, Ramkund, Panchavati 422003',
      location: 'Goda Promenade, Ramkund, Panchavati 422003',
      description: 'High-capacity RO purified cold drinking water station equipped with touchless refilling taps and paper cup dispensers.',
      image: '/shahi-snan.jpg',
      timings: 'Continuous 24/7 Service',
      distance: '50 meters from Ramkund Step Well',
      contactNumber: '0253-2575555',
      facilities: ['RO Cold Water', 'Paper Cup Dispensers', 'Touchless Taps']
    },
    {
      _id: 'fac-5',
      name: 'Ramkund Stepwell Smart Sanitation Complex',
      category: 'Toilet',
      address: 'Near Ramkund Police Outpost, Panchavati 422003',
      location: 'Near Ramkund Police Outpost, Panchavati 422003',
      description: 'Regularly sanitized, eco-friendly modular restroom facility with accessible ramps, continuous water supply, and dedicated baby care units.',
      image: '/kumbh-bg.jpg',
      timings: 'Open 24 Hours',
      distance: '100 meters from Ramkund Ghat',
      contactNumber: '0253-2575555',
      facilities: ['Automatic Flushing', 'Accessible Ramps', 'Baby Changing Station', 'Hot Water Showers']
    },
    {
      _id: 'fac-6',
      name: 'Kumbh Emergency Medical & Generic Pharmacy Hub',
      category: 'Pharmacy',
      address: 'Panchavati Karanja Circle, Nashik 422003',
      location: 'Panchavati Karanja Circle, Nashik 422003',
      description: '24-hour emergency medical post providing essential medicines, first-aid treatment, doctor consultation, and ambulance dispatch.',
      image: '/img_20250206_1205497474678292145460306.webp',
      timings: 'Open 24/7 (Emergency Service)',
      distance: '300 meters from Ramkund',
      contactNumber: '108 / 0253-2575555',
      facilities: ['24/7 Pharmacist', 'Essential Medicines', 'Free First Aid', 'Ambulance Standby']
    },
    {
      _id: 'fac-7',
      name: 'Tapovan Satellite Parking & Electric Shuttle Station A',
      category: 'Parking',
      address: 'Tapovan Sector 1 Outer Ring Road, Nashik 422003',
      location: 'Tapovan Sector 1 Outer Ring Road, Nashik 422003',
      description: 'Massive barricaded parking complex with digital slot counters, CCTV surveillance, electric vehicle charging points, and free shuttle buses to ghats.',
      image: '/kumbh-bg1.jpg',
      timings: 'Open 24 Hours',
      distance: '3.5 km from Ramkund Ghat',
      contactNumber: '0253-2575555',
      facilities: ['25,000 Vehicle Capacity', 'Free Electric Shuttles', '24/7 Security Patrol', 'EV Fast Charging']
    },
    {
      _id: 'fac-8',
      name: 'Kumbh Police Central Control Room & Lost Person Cell',
      category: 'Police Centre',
      address: 'Panchavati Police Station Compound, Nashik 422003',
      location: 'Panchavati Police Station Compound, Nashik 422003',
      description: 'Central security monitoring desk, lost and found family reunification center, and emergency lost child RFID registration counter.',
      image: '/shahi.jpg',
      timings: 'Open 24 Hours',
      distance: '400 meters from Ramkund',
      contactNumber: '112 / 0253-2575555',
      facilities: ['Lost & Found Registration', 'RFID Wristband Issuance', 'Public Announcement System', 'Police Assistance Desk']
    },
    {
      _id: 'fac-9',
      name: 'Nashik CBS Central Bus Station Shuttle Corridor',
      category: 'Transport',
      address: 'CBS Circle, Shalimar, Nashik 422001',
      location: 'CBS Circle, Shalimar, Nashik 422001',
      description: 'Major transit terminal offering continuous MSRTC Kumbh special shuttle buses connecting Nashik Railway Station, Trimbakeshwar, and Tapovan.',
      image: '/kumbh-bg.jpg',
      timings: 'Continuous 24/7 Service',
      distance: '2.5 km from Ramkund Ghat',
      contactNumber: '0253-2465432',
      facilities: ['Continuous Bus Frequency', 'Helpdesk', 'Ticket Counters', 'Luggage Holding']
    }
  ];

  const [form, setForm] = useState({
    name: '',
    category: 'Food Area',
    address: '',
    description: '',
    image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
    timings: 'Open 24 Hours',
    distance: 'Central Kumbh Area',
    contactNumber: '0253-2575555',
    facilitiesInput: 'Clean Amenities, 24/7 Access, Helpdesk',
    status: 'Verified'
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const resetForm = () => {
    setEditingFacility(null);
    setForm({
      name: '',
      category: 'Food Area',
      address: '',
      description: '',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: 'Open 24 Hours',
      distance: 'Central Kumbh Area',
      contactNumber: '0253-2575555',
      facilitiesInput: 'Clean Amenities, 24/7 Access, Helpdesk',
      status: 'Verified'
    });
  };

  const handleEdit = (fac) => {
    setEditingFacility(fac);
    setForm({
      name: fac.name || '',
      category: fac.category || 'Food Area',
      address: fac.address || fac.location || '',
      description: fac.description || '',
      image: fac.image || fac.imageUrl || '/shahi-snan.jpg',
      timings: fac.timings || 'Open 24 Hours',
      distance: fac.distance || 'Central Kumbh Area',
      contactNumber: fac.contactNumber || '0253-2575555',
      facilitiesInput: Array.isArray(fac.facilities) ? fac.facilities.join(', ') : (fac.facilities || 'Clean Amenities, 24/7 Access'),
      status: fac.status || 'Verified'
    });
    setShowModal(true);
  };

  const handleCopy = (fac) => {
    setEditingFacility(null);
    setForm({
      name: '',
      category: fac.category || 'Food Area',
      address: fac.address || fac.location || '',
      description: fac.description || '',
      image: fac.image || fac.imageUrl || '/shahi-snan.jpg',
      timings: fac.timings || 'Open 24 Hours',
      distance: fac.distance || 'Central Kumbh Area',
      contactNumber: fac.contactNumber || '0253-2575555',
      facilitiesInput: Array.isArray(fac.facilities) ? fac.facilities.join(', ') : (fac.facilities || 'Clean Amenities, 24/7 Access'),
      status: fac.status || 'Verified'
    });
    setShowModal(true);
  };

  const applyCustomOrder = (items) => {
    const orderIds = JSON.parse(localStorage.getItem('kumbh_order_facilities') || '[]');
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
    if (targetIndex < 0 || targetIndex >= filteredFacilities.length) return;

    const itemToMove = filteredFacilities[index];
    const targetItem = filteredFacilities[targetIndex];

    const realIndex = facilities.findIndex(f => (f._id || f.id) === (itemToMove._id || itemToMove.id));
    const realTargetIndex = facilities.findIndex(f => (f._id || f.id) === (targetItem._id || targetItem.id));

    if (realIndex === -1 || realTargetIndex === -1) return;

    const updated = [...facilities];
    const temp = updated[realIndex];
    updated[realIndex] = updated[realTargetIndex];
    updated[realTargetIndex] = temp;

    setFacilities(updated);

    const orderIds = updated.map(f => f._id || f.id);
    localStorage.setItem('kumbh_order_facilities', JSON.stringify(orderIds));
  };

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
      const customItems = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');

      const res = await api.get('/facilities').catch(() => null);
      let apiItems = (res?.data?.success && Array.isArray(res.data.data)) ? res.data.data : [];

      const rawList = [...customItems, ...apiItems, ...defaultFacilities];
      const seenNames = new Set();
      const seenIds = new Set();
      const finalItems = [];

      for (const item of rawList) {
        if (!item) continue;
        const itemId = String(item._id || item.id || '').trim();
        const normName = String(item.name || item.title || '').trim().toLowerCase();

        if (item.category === 'Medical' || item.category === 'Medical Centre') continue;

        if (deletedIds.includes(itemId) || deletedIds.includes(item._id) || deletedIds.includes(item.id)) {
          continue;
        }

        if ((itemId && seenIds.has(itemId)) || (normName && seenNames.has(normName))) {
          continue;
        }

        if (itemId) seenIds.add(itemId);
        if (normName) seenNames.add(normName);

        finalItems.push({
          _id: itemId || 'fac-' + Date.now(),
          id: itemId || 'fac-' + Date.now(),
          name: item.name || 'Verified Facility',
          category: item.category || 'Food Area',
          address: item.address || item.location || 'Panchavati, Nashik',
          location: item.address || item.location || 'Panchavati, Nashik',
          description: item.description || 'Verified Kumbh Mela pilgrim facility.',
          image: item.image || item.imageUrl || '/shahi-snan.jpg',
          timings: item.timings || item.hours || 'Open 24 Hours',
          distance: item.distance || 'Central Kumbh Area',
          contactNumber: item.contactNumber || item.phone || '0253-2575555',
          facilities: (item.facilities && item.facilities.length > 0) ? item.facilities : ['24/7 Service', 'Helpdesk']
        });
      }

      setFacilities(applyCustomOrder(finalItems));
    } catch (err) {
      setFacilities(defaultFacilities);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      alert('Please fill in facility name and address');
      return;
    }

    try {
      const facilitiesArray = form.facilitiesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const targetId = editingFacility ? (editingFacility._id || editingFacility.id) : ('fac-' + Date.now());

      const payload = {
        _id: targetId,
        id: targetId,
        name: form.name.trim(),
        category: form.category,
        address: form.address.trim(),
        location: form.address.trim(),
        description: form.description.trim() || `${form.name} official facility.`,
        image: form.image || '/shahi-snan.jpg',
        timings: form.timings || 'Open 24 Hours',
        distance: form.distance || 'Central Kumbh Area',
        contactNumber: form.contactNumber || '0253-2575555',
        facilities: facilitiesArray.length > 0 ? facilitiesArray : ['Verified Desk', 'Clean Amenities'],
        status: form.status,
        verified: true,
        isConfirmed: true
      };

      const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
      const filteredCustom = customLocs.filter(c => c._id !== targetId && c.id !== targetId && c.name !== editingFacility?.name);
      localStorage.setItem('kumbh_custom_locations', JSON.stringify([payload, ...filteredCustom]));

      await api.post('/facilities', payload).catch(() => null);
      await api.post('/locations', payload).catch(() => null);

      setShowModal(false);
      resetForm();
      alert(`Facility card "${form.name}" saved successfully.`);
      fetchFacilities();
    } catch (err) {
      alert('Error saving facility card');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? It will be removed for all visitors across all tabs.`)) return;

    try {
      if (id) {
        await api.delete(`/facilities/${id}`).catch(() => null);
        await api.delete(`/locations/${id}`).catch(() => null);
      }

      // Persist deletion to localStorage so default/local cards are also permanently hidden
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
      if (id && !deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('kumbh_deleted_locations', JSON.stringify(deletedIds));
      }

      // Clean up from custom locations storage if present
      const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
      const updatedCustom = customLocs.filter(item => item._id !== id && item.id !== id && item.name !== name);
      localStorage.setItem('kumbh_custom_locations', JSON.stringify(updatedCustom));

      setFacilities(prev => prev.filter(item => item._id !== id && item.id !== id && item.name !== name));
      alert(`"${name}" has been deleted successfully.`);
      fetchFacilities();
    } catch (err) {
      alert('Error deleting facility card');
    }
  };

  const matchCategory = (itemCat, targetCat) => {
    if (!targetCat || targetCat === 'All') return true;
    if (!itemCat) return false;

    const normalize = (catStr) => {
      const s = String(catStr || '').trim().toLowerCase();
      if (s.includes('ghat')) return 'ghat';
      if (s.includes('temple') || s.includes('mandir')) return 'temple';
      if (s.includes('toilet') || s.includes('sanitation') || s.includes('washroom') || s.includes('restroom')) return 'toilet';
      if (s.includes('water')) return 'drinking water';
      if (s.includes('food') || s.includes('annadan') || s.includes('meal')) return 'food area';
      if (s.includes('police') || s.includes('help centre') || s.includes('help center') || s.includes('helpdesk')) return 'police centre';
      if (s.includes('camp') || s.includes('accommodation') || s.includes('tent') || s.includes('yatri niwas')) return 'accommodation';
      if (s.includes('parking')) return 'parking';
      if (s.includes('pharmacy') || s.includes('medical')) return 'pharmacy';
      if (s.includes('transport') || s.includes('shuttle') || s.includes('bus')) return 'transport';
      return s;
    };

    return normalize(itemCat) === normalize(targetCat);
  };

  const filteredFacilities = facilities.filter(fac => {
    const matchesCat = matchCategory(fac.category, selectedCategory);
    const searchLow = search.toLowerCase();
    const matchesSearch = searchLow === '' ||
      (fac.name && fac.name.toLowerCase().includes(searchLow)) ||
      (fac.address && fac.address.toLowerCase().includes(searchLow)) ||
      (fac.description && fac.description.toLowerCase().includes(searchLow));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-500/30">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 backdrop-blur-md border border-purple-400/40 flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            📍
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-purple-100">Nearby Facilities Management</h2>
            <p className="text-xs text-purple-200/80 mt-0.5 font-medium">
              Create & Manage Cards for Accommodation, Food Arenas, Water Stations, Parking & Transport
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 border border-purple-400/40"
        >
          <Plus className="w-4 h-4" /> Create New Facility Card
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-purple-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facility cards by title, address, or description..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-purple-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Horizontal Category Filter Pills matching NearbyFacilities.jsx */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' ? facilities.length : facilities.filter(f => matchCategory(f.category, cat)).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border ${
                  isSelected
                    ? 'bg-purple-700 text-white border-purple-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                }`}
              >
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

      {/* Facilities Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">Loading facilities management cards...</div>
      ) : filteredFacilities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-purple-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Facility Cards Found in "{selectedCategory}"</h3>
          <p className="text-xs text-slate-500">Click "Create New Facility Card" to add a new place visible to all visitors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFacilities.map((fac, idx) => (
            <div 
              key={fac._id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  <img 
                    src={fac.image || fac.imageUrl || '/shahi-snan.jpg'} 
                    alt={fac.name}
                    onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-purple-900/90 backdrop-blur-md text-purple-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-purple-400/40">
                    {fac.category}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/70 backdrop-blur-md p-1 rounded-xl border border-white/20">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-lg hover:bg-white/20 text-white disabled:opacity-30 transition-all"
                      title="Move Sequence Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === filteredFacilities.length - 1}
                      className="p-1 rounded-lg hover:bg-white/20 text-white disabled:opacity-30 transition-all"
                      title="Move Sequence Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{fac.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{fac.description || fac.address}</p>

                  <div className="space-y-1.5 pt-1 text-xs text-slate-500 font-medium">
                    <div className="flex items-center space-x-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      <span className="truncate">{fac.address || fac.location}</span>
                    </div>
                    {fac.timings && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>{fac.timings}</span>
                      </div>
                    )}
                    {fac.distance && (
                      <div className="flex items-center space-x-2 text-purple-700 font-bold">
                        <Navigation className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                        <span>{fac.distance}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Published to Visitor Facilities
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(fac)}
                    className="px-2.5 py-2 rounded-xl text-purple-700 hover:bg-purple-50 border border-purple-200 hover:border-purple-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Copy Card with Mandatory New Name"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => handleEdit(fac)}
                    className="px-2.5 py-2 rounded-xl text-amber-700 hover:bg-amber-50 border border-amber-200 hover:border-amber-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Edit Card"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(fac._id || fac.id, fac.name)}
                    className="px-2.5 py-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Delete Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create or Edit Facility Card */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-purple-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  {editingFacility ? `Edit Facility Card ("${editingFacility.name}")` : 'Create New Facility Card'}
                </h3>
              </div>
              <button 
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Facility Name / Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tapovan Annadan & Free Meal Arena"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold outline-none"
                  >
                    <option value="Accommodation">Accommodation</option>
                    <option value="Food Area">Food Area</option>
                    <option value="Drinking Water">Drinking Water</option>
                    <option value="Toilet">Toilet</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Parking">Parking</option>
                    <option value="Police Centre">Police Centre</option>
                    <option value="Transport">Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    placeholder="e.g. 0253-2575555"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address / Location *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Sector 2, Tapovan Sadhugram, Nashik 422003"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide clear details about capacity, opening hours, or free services..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Authentic Image</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {presetImages.slice(0, 6).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm({ ...form, image: img.url })}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        form.image === img.url ? 'border-purple-600 ring-2 ring-purple-500' : 'border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-white text-[9px] truncate px-1 py-0.5 text-center font-bold">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Or enter custom image path (e.g. /shahi-snan.jpg)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Operating Hours / Timings</label>
                  <input
                    type="text"
                    value={form.timings}
                    onChange={(e) => setForm({ ...form, timings: e.target.value })}
                    placeholder="e.g. Open 24 Hours (Continuous)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Distance Landmark</label>
                  <input
                    type="text"
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                    placeholder="e.g. 500m from Ramkund Ghat"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amenities / Facilities (Comma Separated)</label>
                <input
                  type="text"
                  value={form.facilitiesInput}
                  onChange={(e) => setForm({ ...form, facilitiesInput: e.target.value })}
                  placeholder="e.g. Free Mahaprasad, Purified Water, Benches"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold outline-none"
                />
              </div>

              <div className="pt-3 border-t flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {editingFacility ? 'Save Changes' : 'Publish Facility Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesMgmt;

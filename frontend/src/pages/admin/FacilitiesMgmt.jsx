import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Trash2, CheckCircle, Search, AlertCircle, 
  MapPin, Clock, Phone, Navigation, X, Filter, Image as ImageIcon
} from 'lucide-react';
import api from '../../services/api';

const FacilitiesMgmt = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
      name: 'Trimbakeshwar Bhakta Niwas & Ashram Complex (त्रिंबकेश्वर भक्त निवास)',
      category: 'Accommodation',
      address: 'Near Kushavarta Kund, Trimbakeshwar, Nashik 422212',
      location: 'Near Kushavarta Kund, Trimbakeshwar, Nashik 422212',
      description: 'Comfortable pilgrim rest houses near Trimbakeshwar Jyotirlinga providing clean rooms, hot water, and dining facilities.',
      image: '/dhwajarohan.webp',
      timings: '5:00 AM - 10:00 PM',
      distance: '500 meters from Kushavarta Kund',
      contactNumber: '0253-2591241',
      facilities: ['Family Rooms', 'Attached Bathrooms', 'Hot Water Available', 'Purified Water']
    },
    {
      _id: 'fac-4',
      name: 'Tapovan Annadan & Food Arena (तपोवन अन्नछत्र)',
      category: 'Food Area',
      address: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      location: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      description: 'Massive community dining hall serving fresh, wholesome, pure vegetarian Mahaprasad (Khichdi, Puri, Sabzi) free of cost to over 100,000 pilgrims daily.',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: '7:00 AM - 10:30 PM (Continuous Mahaprasad)',
      distance: 'Inside Tapovan Sadhugram City',
      contactNumber: '0253-2575555',
      facilities: ['Free Mahaprasad', 'Hygienic Dining Benches', 'Purified Water', 'RO Drinking Water']
    },
    {
      _id: 'fac-6',
      name: 'Ramkund Promenade RO Water Station #1 (रामकुंड शुध्द जल केंद्र)',
      category: 'Drinking Water',
      address: 'Ramkund Bathing Ghat Promenade, Nashik 422003',
      location: 'Ramkund Bathing Ghat Promenade, Nashik 422003',
      description: 'Solar-powered 10,000 LPH RO water filtration plant dispensing chilled and ambient purified drinking water 24/7.',
      image: '/goda-aarti-chatg.webp',
      timings: 'Continuous 24/7',
      distance: 'Ramkund Ghat Bank',
      contactNumber: '0253-2578899',
      facilities: ['RO Purified', 'Chilled Water Fountains', 'Zero Single-Use Plastic Station']
    },
    {
      _id: 'fac-8',
      name: 'Panchavati Deluxe Smart Sanitation Block #1',
      category: 'Toilet',
      address: 'Kalaram Temple Road, Panchavati, Nashik 422003',
      location: 'Kalaram Temple Road, Panchavati, Nashik 422003',
      description: 'Continuously disinfected smart public restroom complex equipped with wheelchair ramps, hot water showers, and baby care rooms.',
      image: '/kumbh-bg.jpg',
      timings: 'Open 24 Hours',
      distance: '150 meters from Kalaram Temple',
      facilities: ['Hot Water Showers', 'Wheelchair Ramps', 'Baby Changing Room', 'Automatic Flush']
    },
    {
      _id: 'fac-10',
      name: 'Kumbh 24/7 Generic Jan Aushadhi Pharmacy Post',
      category: 'Pharmacy',
      address: 'Ramkund Main Entrance Promenade, Nashik 422003',
      location: 'Ramkund Main Entrance Promenade, Nashik 422003',
      description: 'Government subsidised pharmacy dispensing essential emergency medicines, ORS packets, and first-aid supplies round the clock.',
      image: '/shahi-snan.jpg',
      timings: 'Open 24 Hours',
      distance: 'Ramkund Ghat Gate',
      contactNumber: '104',
      facilities: ['Generic Medicines', 'First-Aid Kits', 'ORS Packets', 'BP / Sugar Check']
    },
    {
      _id: 'fac-11',
      name: 'Tapovan Satellite Bus & Parking Terminal A',
      category: 'Parking',
      address: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
      location: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
      description: 'Sprawling 50-acre satellite parking lot holding 25,000 buses and cars. Connected to free electric shuttle buses running every 3 mins to Ramkund.',
      image: '/kumbh-bg1.jpg',
      timings: 'Open 24 Hours',
      distance: '4.5 km from Ramkund (Free Bus Available)',
      contactNumber: '0253-2578899',
      facilities: ['Free Electric Shuttles', 'Driver Rest Bay', 'EV Charging', 'CCTV Security']
    },
    {
      _id: 'fac-13',
      name: 'Kumbh Central Police Control Room & RFID Lost Person Desk',
      category: 'Police Centre',
      address: 'Panchavati Police Station Compound, Nashik 422003',
      location: 'Panchavati Police Station Compound, Nashik 422003',
      description: 'CCTV control room, Lost & Found family reunion cell, and tourist police guidance center for pilgrims.',
      image: '/shahi.jpg',
      timings: 'Open 24 Hours',
      distance: '400m from Ramkund',
      contactNumber: '112',
      facilities: ['Lost & Found Registration', 'Public Announcement System', 'RFID Tagging']
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

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
      const customItems = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');

      const res = await api.get('/facilities').catch(() => null);
      let apiItems = (res?.data?.success && Array.isArray(res.data.data)) ? res.data.data : [];

      const combined = [...customItems, ...apiItems];

      // Exclude Medical category & deleted IDs
      const filteredApi = combined.filter(item => 
        item.category !== 'Medical' && 
        item.category !== 'Medical Centre' && 
        !deletedIds.includes(item._id)
      );

      const enrichedApiItems = filteredApi.map(item => ({
        _id: item._id,
        name: item.name,
        category: item.category || 'Food Area',
        address: item.address || item.location || 'Panchavati, Nashik, Maharashtra 422003',
        description: item.description || item.capacityNotes || item.details || item.notes || 'Verified pilgrim facility.',
        image: item.image || item.imageUrl || '/shahi-snan.jpg',
        timings: item.timings || item.hours || 'Open 24 Hours',
        distance: item.distance || 'Central Area',
        contactNumber: item.contactNumber || item.phone || '0253-2575555',
        facilities: (item.facilities && item.facilities.length > 0) ? item.facilities : ['24/7 Service', 'Helpdesk']
      }));

      const apiNames = new Set(enrichedApiItems.map(i => i.name));
      const finalItems = [
        ...enrichedApiItems,
        ...defaultFacilities.filter(d => !apiNames.has(d.name) && !deletedIds.includes(d._id))
      ];

      setFacilities(finalItems);
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

      const newId = 'fac-' + Date.now();
      const payload = {
        _id: newId,
        name: form.name.trim(),
        category: form.category,
        address: form.address.trim(),
        location: form.address.trim(),
        description: form.description.trim() || `${form.name} official facility.`,
        image: form.image || '/shahi-snan.jpg',
        timings: form.timings || 'Open 24 Hours',
        distance: form.distance || 'Central Area',
        contactNumber: form.contactNumber || '0253-2575555',
        facilities: facilitiesArray.length > 0 ? facilitiesArray : ['Verified Desk', 'Clean Amenities'],
        status: form.status,
        verified: true,
        isConfirmed: true
      };

      const res = await api.post('/facilities', payload);
      await api.post('/locations', payload).catch(() => null);

      if (res?.data?.success || res?.status === 200 || res?.status === 201) {
        setShowModal(false);
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
        fetchFacilities();
      }
    } catch (err) {
      alert('Error creating facility card');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? It will be removed for all visitors across all tabs.`)) return;

    try {
      await api.delete(`/facilities/${id}`).catch(() => null);
      await api.delete(`/locations/${id}`).catch(() => null);

      setFacilities(prev => prev.filter(item => item._id !== id && item.name !== name));
      alert(`"${name}" has been deleted.`);
      fetchFacilities();
    } catch (err) {
      alert('Error deleting facility card');
    }
  };

  const filteredFacilities = facilities.filter(fac => {
    const matchesCat = selectedCategory === 'All' || 
      (fac.category && fac.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (selectedCategory === 'Police Centre' && (fac.category?.includes('Police') || fac.category?.includes('Help')));

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
            const count = cat === 'All' ? facilities.length : facilities.filter(f => f.category && f.category.toLowerCase().includes(cat.toLowerCase())).length;

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
          {filteredFacilities.map((fac) => (
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

                <button
                  onClick={() => handleDelete(fac._id, fac.name)}
                  className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create New Facility Card */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-purple-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-lg text-slate-900">Create New Facility Card</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
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
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Publish Facility Card
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

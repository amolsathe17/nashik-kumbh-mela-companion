import React, { useState, useEffect } from 'react';
import { 
  MapPin, Plus, Trash2, CheckCircle, Search, AlertCircle, 
  Navigation, Clock, Phone, Building2, Image as ImageIcon, X, Filter, Edit3, ArrowUp, ArrowDown, Copy
} from 'lucide-react';
import api from '../../services/api';

const LocationsMgmt = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 'Ghat', 'Temple', 'Accommodation', 'Food Area', 
    'Drinking Water', 'Toilet', 'Pharmacy', 'Parking', 
    'Police / Help Centre', 'Transport', 'Info / Help'
  ];

  const presetImages = [
    { label: 'Ramkund Shahi Snan', url: '/shahi-snan.jpg' },
    { label: 'Dhwajarohan Temple', url: '/dhwajarohan.webp' },
    { label: 'Goda Aarti Promenade', url: '/goda-aarti-chatg.webp' },
    { label: 'Nagarpradakshina Pilgrimage', url: '/nagarpradakshina.webp' },
    { label: 'Tapovan Annadan Yagna', url: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp' },
    { label: 'Kumbh Aerial View 1', url: '/kumbh-bg.jpg' },
    { label: 'Kumbh Aerial View 2', url: '/kumbh-bg1.jpg' },
    { label: 'Panchavati Kalaram Temple', url: '/img_20250206_1205497474678292145460306.webp' },
    { label: 'Tarpan Ritual Ghat', url: '/68c4435662438-pitru-paksha-120221463-16x9.webp' }
  ];

  const [form, setForm] = useState({
    name: '',
    category: 'Ghat',
    address: '',
    description: '',
    image: '/shahi-snan.jpg',
    timings: 'Open 24 Hours',
    distance: 'Central Kumbh Area',
    contactNumber: '0253-2575555',
    facilitiesInput: '24/7 Access, Helpdesk, Security',
    status: 'Active'
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const resetForm = () => {
    setEditingLocation(null);
    setForm({
      name: '',
      category: 'Ghat',
      address: '',
      description: '',
      image: '/shahi-snan.jpg',
      timings: 'Open 24 Hours',
      distance: 'Central Kumbh Area',
      contactNumber: '0253-2575555',
      facilitiesInput: '24/7 Access, Helpdesk, Security',
      status: 'Active'
    });
  };

  const handleEdit = (loc) => {
    setEditingLocation(loc);
    setForm({
      name: loc.name || '',
      category: loc.category || 'Ghat',
      address: loc.address || loc.location || '',
      description: loc.description || '',
      image: loc.image || loc.imageUrl || '/shahi-snan.jpg',
      timings: loc.timings || 'Open 24 Hours',
      distance: loc.distance || 'Central Kumbh Area',
      contactNumber: loc.contactNumber || '0253-2575555',
      facilitiesInput: Array.isArray(loc.facilities) ? loc.facilities.join(', ') : (loc.facilities || '24/7 Access, Helpdesk'),
      status: loc.status || 'Active'
    });
    setShowModal(true);
  };

  const handleCopy = (loc) => {
    setEditingLocation(null);
    setForm({
      name: '',
      category: loc.category || 'Ghat',
      address: loc.address || loc.location || '',
      description: loc.description || '',
      image: loc.image || loc.imageUrl || '/shahi-snan.jpg',
      timings: loc.timings || 'Open 24 Hours',
      distance: loc.distance || 'Central Kumbh Area',
      contactNumber: loc.contactNumber || '0253-2575555',
      facilitiesInput: Array.isArray(loc.facilities) ? loc.facilities.join(', ') : (loc.facilities || '24/7 Access, Helpdesk'),
      status: loc.status || 'Active'
    });
    setShowModal(true);
  };

  const applyCustomOrder = (items) => {
    const orderIds = JSON.parse(localStorage.getItem('kumbh_order_locations') || '[]');
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
    if (targetIndex < 0 || targetIndex >= filteredLocations.length) return;

    // Find actual indices in locations array
    const itemToMove = filteredLocations[index];
    const targetItem = filteredLocations[targetIndex];

    const realIndex = locations.findIndex(l => (l._id || l.id) === (itemToMove._id || itemToMove.id));
    const realTargetIndex = locations.findIndex(l => (l._id || l.id) === (targetItem._id || targetItem.id));

    if (realIndex === -1 || realTargetIndex === -1) return;

    const updated = [...locations];
    const temp = updated[realIndex];
    updated[realIndex] = updated[realTargetIndex];
    updated[realTargetIndex] = temp;

    setLocations(updated);

    const orderIds = updated.map(l => l._id || l.id);
    localStorage.setItem('kumbh_order_locations', JSON.stringify(orderIds));
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
      const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');

      const [locRes, facRes] = await Promise.all([
        api.get('/locations').catch(() => null),
        api.get('/facilities').catch(() => null)
      ]);

      let rawList = [...customLocs];
      if (locRes?.data?.success && Array.isArray(locRes.data.data)) {
        rawList = [...rawList, ...locRes.data.data];
      }
      if (facRes?.data?.success && Array.isArray(facRes.data.data)) {
        rawList = [...rawList, ...facRes.data.data];
      }

      const seenNames = new Set();
      const seenIds = new Set();
      const combined = [];

      for (const item of rawList) {
        if (!item) continue;
        const normName = String(item.name || item.title || '').trim().toLowerCase();
        const itemId = String(item._id || item.id || '').trim();

        if (deletedIds.includes(itemId) || deletedIds.includes(item._id) || deletedIds.includes(item.id)) {
          continue;
        }

        if (seenNames.has(normName) || (itemId && seenIds.has(itemId))) {
          continue;
        }
        if (normName) seenNames.add(normName);
        if (itemId) seenIds.add(itemId);

        combined.push(item);
      }

      setLocations(applyCustomOrder(combined));
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      alert('Please fill in location name and address');
      return;
    }

    try {
      const facilitiesArray = form.facilitiesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const targetId = editingLocation ? (editingLocation._id || editingLocation.id) : ('loc-' + Date.now());

      const payload = {
        _id: targetId,
        id: targetId,
        name: form.name.trim(),
        category: form.category,
        address: form.address.trim(),
        location: form.address.trim(),
        description: form.description.trim() || `${form.name} official Kumbh service location.`,
        image: form.image || '/shahi-snan.jpg',
        timings: form.timings || 'Open 24 Hours',
        distance: form.distance || 'Central Area',
        contactNumber: form.contactNumber || '0253-2575555',
        facilities: facilitiesArray.length > 0 ? facilitiesArray : ['Verified Site', 'Helpdesk'],
        status: form.status,
        isConfirmed: true,
        verified: true
      };

      const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
      const filteredCustom = customLocs.filter(c => c._id !== targetId && c.id !== targetId && c.name !== editingLocation?.name);
      localStorage.setItem('kumbh_custom_locations', JSON.stringify([payload, ...filteredCustom]));

      await api.post('/locations', payload).catch(() => null);
      await api.post('/facilities', payload).catch(() => null);

      setShowModal(false);
      resetForm();
      alert(`Location card "${form.name}" saved successfully.`);
      fetchLocations();
    } catch (err) {
      alert('Error saving location card');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? It will be removed for all visitors across all tabs.`)) return;

    try {
      if (id) {
        await api.delete(`/locations/${id}`).catch(() => null);
        await api.delete(`/facilities/${id}`).catch(() => null);
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

      setLocations(prev => prev.filter(item => item._id !== id && item.id !== id && item.name !== name));
      alert(`"${name}" has been deleted successfully.`);
      fetchLocations();
    } catch (err) {
      alert('Error deleting location card');
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
      if (s.includes('police') || s.includes('help centre') || s.includes('help center') || s.includes('helpdesk')) return 'police / help centre';
      if (s.includes('camp') || s.includes('accommodation') || s.includes('tent') || s.includes('yatri niwas')) return 'accommodation';
      if (s.includes('parking')) return 'parking';
      if (s.includes('pharmacy') || s.includes('medical')) return 'pharmacy';
      if (s.includes('transport') || s.includes('shuttle') || s.includes('bus')) return 'transport';
      if (s.includes('info')) return 'info / help';
      return s;
    };

    return normalize(itemCat) === normalize(targetCat);
  };

  const filteredLocations = locations.filter(loc => {
    const matchesCat = matchCategory(loc.category, selectedCategory);
    const searchLow = search.toLowerCase();
    const matchesSearch = searchLow === '' ||
      (loc.name && loc.name.toLowerCase().includes(searchLow)) ||
      (loc.address && loc.address.toLowerCase().includes(searchLow)) ||
      (loc.description && loc.description.toLowerCase().includes(searchLow));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-orange-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-500/30">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            🗺️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-100">Map & Location Management</h2>
            <p className="text-xs text-amber-200/80 mt-0.5 font-medium">
              Create, Edit & Delete Direction Cards across Ghats, Temples, Parking, Water & Camps
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 border border-amber-400/40"
        >
          <Plus className="w-4 h-4" /> Create New Location Card
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location cards by title, address, or description..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-amber-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Horizontal Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' ? locations.length : locations.filter(l => matchCategory(l.category, cat)).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                }`}
              >
                <span>{cat}</span>
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

      {/* Locations Card Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">Loading location management cards...</div>
      ) : filteredLocations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Location Cards Found in "{selectedCategory}"</h3>
          <p className="text-xs text-slate-500">Click "Create New Location Card" to add a new place visible to all visitors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLocations.map((loc, idx) => (
            <div 
              key={loc._id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  <img 
                    src={loc.image || loc.imageUrl || '/shahi-snan.jpg'} 
                    alt={loc.name}
                    onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-amber-900/90 backdrop-blur-md text-amber-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-amber-400/40">
                    {loc.category}
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
                      disabled={idx === filteredLocations.length - 1}
                      className="p-1 rounded-lg hover:bg-white/20 text-white disabled:opacity-30 transition-all"
                      title="Move Sequence Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{loc.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{loc.description || loc.address}</p>

                  <div className="space-y-1.5 pt-1 text-xs text-slate-500 font-medium">
                    <div className="flex items-center space-x-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span className="truncate">{loc.address || loc.location}</span>
                    </div>
                    {loc.timings && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>{loc.timings}</span>
                      </div>
                    )}
                    {loc.distance && (
                      <div className="flex items-center space-x-2 text-amber-700 font-bold">
                        <Navigation className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{loc.distance}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Published to Visitor Pages
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(loc)}
                    className="px-2.5 py-2 rounded-xl text-blue-700 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Copy Card with Mandatory New Name"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => handleEdit(loc)}
                    className="px-2.5 py-2 rounded-xl text-amber-700 hover:bg-amber-50 border border-amber-200 hover:border-amber-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Edit Card"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(loc._id || loc.id, loc.name)}
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

      {/* Modal: Create or Edit Location Card */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-amber-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-amber-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  {editingLocation ? `Edit Location Card ("${editingLocation.name}")` : 'Create New Location Card'}
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
                <label className="block font-bold text-slate-700 mb-1">Place Name / Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Panchavati Shahi Snan Help Centre"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold outline-none"
                  >
                    <option value="Ghat">Ghat</option>
                    <option value="Temple">Temple</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Food Area">Food Area</option>
                    <option value="Drinking Water">Drinking Water</option>
                    <option value="Toilet">Toilet</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Parking">Parking</option>
                    <option value="Police / Help Centre">Police / Help Centre</option>
                    <option value="Transport">Transport</option>
                    <option value="Info / Help">Info / Help</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    placeholder="e.g. 0253-2575555"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold outline-none"
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
                  placeholder="e.g. Panchavati Temple Road, Nashik 422003"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide clear details about facilities, pilgrim rules, or services..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold outline-none"
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
                        form.image === img.url ? 'border-amber-600 ring-2 ring-amber-500' : 'border-slate-200 hover:border-amber-300'
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
                    placeholder="e.g. Open 24 Hours"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Distance Landmark</label>
                  <input
                    type="text"
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                    placeholder="e.g. 500m from Ramkund Ghat"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amenities / Facilities (Comma Separated)</label>
                <input
                  type="text"
                  value={form.facilitiesInput}
                  onChange={(e) => setForm({ ...form, facilitiesInput: e.target.value })}
                  placeholder="e.g. RO Drinking Water, Free Bedding, Security Patrol"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold outline-none"
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
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> {editingLocation ? 'Save Changes' : 'Publish Card to Visitor Pages'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsMgmt;

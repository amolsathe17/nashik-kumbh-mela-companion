import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  MapPin, Plus, Trash2, CheckCircle, Search, AlertCircle, 
  Navigation, Clock, Phone, Building2, Image as ImageIcon, X, Filter, Edit3, ArrowUp, ArrowDown, Copy, Upload, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import MediaUploader from '../../components/common/MediaUploader';
import { deleteFromCloudinary } from '../../services/cloudinaryService';
import { defaultLocations, getMergedLocations, matchCategory, deduplicateLocationsList } from '../../data/initialLocations';

const LocationsMgmt = () => {
  const tabsRef = useRef(null);
  const [locations, setLocations] = useState([]);
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
  }, [locations]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Ghat');
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const categories = [
    'Ghat', 'Temple', 
    'Shahi Snan', 'Ritual Guide', 'Akharas', 
    'Accommodation', 'Food Area', 'Drinking Water', 
    'Toilet', 'Pharmacy', 'Parking', 'Police / Help Centre', 'Transport'
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please select a smaller image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
      const customLocs = getMergedLocations();

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
      rawList = [...rawList, ...defaultLocations];

      const combined = deduplicateLocationsList(rawList, deletedIds);

      const finalOrdered = applyCustomOrder(combined);
      setLocations(finalOrdered);

      if (!localStorage.getItem('kumbh_custom_locations')) {
        try {
          localStorage.setItem('kumbh_custom_locations', JSON.stringify(finalOrdered));
        } catch (e) {
          console.warn('Quota warning:', e);
        }
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.name.trim() || !form.address || !form.address.trim()) {
      alert('Please fill in location name and address');
      return;
    }

    try {
      const facilitiesInputStr = String(form.facilitiesInput || '');
      const facilitiesArray = facilitiesInputStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const targetId = editingLocation ? (editingLocation._id || editingLocation.id) : ('loc-' + Date.now());

      const payload = {
        _id: targetId,
        id: targetId,
        name: form.name.trim(),
        category: form.category || 'Ghat',
        address: form.address.trim(),
        location: form.address.trim(),
        description: (form.description || '').trim() || `${form.name} official Kumbh service location.`,
        image: form.image || '/shahi-snan.jpg',
        timings: form.timings || 'Open 24 Hours',
        distance: form.distance || 'Central Area',
        contactNumber: form.contactNumber || '0253-2575555',
        facilities: facilitiesArray.length > 0 ? facilitiesArray : ['Verified Site', 'Helpdesk'],
        status: form.status || 'Active',
        isConfirmed: true,
        verified: true
      };

      // Safely save to localStorage (with quota handling)
      try {
        const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
        const filteredCustom = customLocs.filter(c => c && c._id !== targetId && c.id !== targetId && c.name !== editingLocation?.name);
        localStorage.setItem('kumbh_custom_locations', JSON.stringify([payload, ...filteredCustom]));
      } catch (storageErr) {
        console.warn('LocalStorage quota warning:', storageErr);
      }

      // Optimistically update local state so card appears immediately
      setLocations(prev => {
        const filtered = prev.filter(l => (l._id || l.id) !== targetId && l.name !== editingLocation?.name);
        return [payload, ...filtered];
      });

      // Send to backend API asynchronously (ignore backend errors so local save always succeeds)
      await api.post('/locations', payload).catch(() => null);
      await api.post('/facilities', payload).catch(() => null);

      const savedName = form.name.trim();
      setShowModal(false);
      resetForm();
      setSaveSuccessMessage(`Location card "${savedName}" saved successfully.`);
      setTimeout(() => setSaveSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving location card:', err);
      alert('Error saving location card: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = (id, name) => {
    setDeleteConfirmItem({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    const { id, name } = deleteConfirmItem;

    try {
      // 1. Delete associated media (photo or video) from Cloudinary
      const targetCard = locations.find(item => (item._id || item.id) === id || item.name === name);
      if (targetCard && (targetCard.image || targetCard.imageUrl)) {
        await deleteFromCloudinary(targetCard.image || targetCard.imageUrl);
      }

      // 2. Delete card record from backend API database
      if (id) {
        await api.delete(`/locations/${id}`).catch(() => null);
        await api.delete(`/facilities/${id}`).catch(() => null);
      }

      // 3. Purge card record from all local storage data stores
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
      if (id && !deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('kumbh_deleted_locations', JSON.stringify(deletedIds));
      }

      const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
      const updatedCustom = customLocs.filter(item => item._id !== id && item.id !== id && item.name !== name);
      localStorage.setItem('kumbh_custom_locations', JSON.stringify(updatedCustom));

      // 4. Update UI state instantly
      setLocations(prev => prev.filter(item => item._id !== id && item.id !== id && item.name !== name));
      fetchLocations();
    } catch (err) {
      console.error('Error deleting location card:', err);
      alert('Error deleting location card');
    } finally {
      setDeleteConfirmItem(null);
    }
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
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 border border-amber-500/40 p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md">
            🗺️
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-100 leading-tight truncate">Map & Location Management</h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-0.5 font-medium truncate">
              Create, Edit & Delete Direction Cards across Ghats, Temples, Parking, Water & Camps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto z-10 flex-shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-amber-950/60 text-amber-100 border border-amber-400/40 text-xs font-bold shadow-md">
            📋 List View ({locations.length})
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 border border-amber-400/40"
          >
            <Plus className="w-4 h-4" /> Create New Location Card
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Row: Search Left, Scrollable Tabs with Circular Arrow Buttons Right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Search Bar Input */}
        <div className="relative lg:w-72 xl:w-80 flex-shrink-0">
          <Search className="w-5 h-5 text-amber-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locations..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-amber-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Horizontal Filter Chips with Circular Left/Right Arrow Buttons & Scrollbar */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-amber-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4 text-amber-700" />
            </button>
          )}

          <div
            ref={tabsRef}
            onScroll={checkScroll}
            className="flex-1 min-w-0 overflow-x-auto py-1 text-xs scrollbar-thin scrollbar-thumb-amber-300 scroll-smooth"
          >
            <div className="flex items-center gap-2 flex-nowrap min-w-max">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === 'All' ? locations.length : locations.filter(l => matchCategory(l.category, cat)).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border flex-shrink-0 ${
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

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="w-8 h-8 rounded-full bg-white hover:bg-amber-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4 text-amber-700" />
            </button>
          )}
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
              key={loc._id || loc.id || idx} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col h-full"
            >
              <div className="flex-1 flex flex-col justify-between">
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
              </div>

              {/* Perfectly Aligned Pill-Shaped Action Buttons */}
              <div className="p-5 pt-3 mt-auto flex items-center justify-between gap-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Published
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(loc)}
                    className="px-3 py-1.5 rounded-full text-blue-700 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Copy Card with Mandatory New Name"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => handleEdit(loc)}
                    className="px-3 py-1.5 rounded-full text-amber-700 hover:bg-amber-50 border border-amber-200 hover:border-amber-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Edit Card"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(loc._id || loc.id, loc.name)}
                    className="px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
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
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Fixed Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {editingLocation ? `Edit Location Card ("${editingLocation.name}")` : 'Create New Location Card'}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">Configure places, ghats, temples, and help centers</p>
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
                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Location / Place Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramkund Main Shahi Snan Ghat"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-xs outline-none transition-all"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Contact Phone Number</label>
                    <input
                      type="text"
                      value={form.contactNumber}
                      onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                      placeholder="e.g. 0253-2575555"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Address / Location *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. Panchavati, Godavari Riverbank, Nashik 422003"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Provide details about significance, access points, or entry instructions..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <MediaUploader
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                    label="Location Card Photo or Video (Cloudinary Upload)"
                    folder="kumbh_mela/locations"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Operating Hours / Timings</label>
                    <input
                      type="text"
                      value={form.timings}
                      onChange={(e) => setForm({ ...form, timings: e.target.value })}
                      placeholder="e.g. Open 24 Hours"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Distance Landmark</label>
                    <input
                      type="text"
                      value={form.distance}
                      onChange={(e) => setForm({ ...form, distance: e.target.value })}
                      placeholder="e.g. 500m from Ramkund Ghat"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Amenities / Facilities (Comma Separated)</label>
                  <input
                    type="text"
                    value={form.facilitiesInput}
                    onChange={(e) => setForm({ ...form, facilitiesInput: e.target.value })}
                    placeholder="e.g. RO Drinking Water, Free Bedding, Security Patrol"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
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
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> {editingLocation ? 'Save Changes' : 'Publish Location Card'}
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
                Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteConfirmItem.name}"</span>? It will be removed for all visitors across all tabs.
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

export default LocationsMgmt;

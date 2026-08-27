import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Compass, Plus, Trash2, CheckCircle, Calendar, AlertCircle, 
  Search, BookOpen, MapPin, Sparkles, X, Filter, Image as ImageIcon, Edit3, ArrowUp, ArrowDown, Copy, Upload, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

const PilgrimGuideMgmt = () => {
  const tabsRef = useRef(null);
  const [guideItems, setGuideItems] = useState([]);
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
  }, [guideItems]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Shahi Snan');
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  const categories = [
    'Shahi Snan', 'Ritual Guide', 'Akharas'
  ];

  const presetImages = [
    { label: 'Ramkund Shahi Snan', url: '/shahi-snan.jpg' },
    { label: 'Dhwajarohan Flag Hoisting', url: '/dhwajarohan.webp' },
    { label: 'Godavari Aarti Promenade', url: '/goda-aarti-chatg.webp' },
    { label: 'Nagarpradakshina Procession', url: '/nagarpradakshina.webp' },
    { label: 'Tapovan Annadan Yagna', url: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp' },
    { label: 'Vaishnavite & Shaivite Akharas', url: '/unnamed-2025-02-03t105950ss_1738561979.jpg' },
    { label: 'Naga Sadhus Encampment', url: '/shahi.jpg' },
    { label: 'Kalaram Temple Darshan', url: '/img_20250206_1205497474678292145460306.webp' },
    { label: 'Pitri Tarpan Rituals', url: '/68c4435662438-pitru-paksha-120221463-16x9.webp' }
  ];

  const defaultGuides = [
    {
      id: 'guide-ritual-0',
      _id: 'guide-ritual-0',
      category: 'Ritual Guide',
      title: 'Dhwajarohan (ध्वजारोहण) - Official Commencement',
      subtitle: '31 October 2026 • Ramkund & Kushavarta Kund',
      image: '/dhwajarohan.webp',
      location: 'Ramkund Ghat & Kushavarta Kund',
      description: 'The 21-month long Simhastha Kumbh Mela officially commences with the sacred flag hoisting (Dhwajarohan) ceremony performed simultaneously by sadhus and administrators at Ramkund and Kushavarta Kund.',
      highlights: [
        'Sacred flag hoisted at sunrise amidst Vedic chanting',
        'Official opening of Akhara camps in Tapovan and Trimbakeshwar',
        'Marks the astronomical entry of Jupiter into Leo (Simha Rashi)'
      ]
    },
    {
      id: 'guide-shahi-2',
      _id: 'guide-shahi-2',
      category: 'Shahi Snan',
      title: 'First Amrit Shahi Snan (प्रथम अमृत शाही स्नान)',
      subtitle: '02 August 2027 • Main Royal Bathing Day',
      image: '/shahi-snan.jpg',
      location: 'Ramkund Ghat & Godavari Promenade',
      description: 'The first grand royal bath date of the Simhastha Kumbh. Thousands of Nagas and Mahant Sadhus process with silver palanquins and trumpets to take the celestial dip in Godavari.',
      highlights: [
        'Royal procession of Shaivite & Vaishnavite Akharas starting at 4:00 AM',
        'Public bathing permitted after Akhara holy dips conclude',
        'Heavy security cordons & shuttle buses operational from outer parking hubs'
      ]
    },
    {
      id: 'guide-shahi-3',
      _id: 'guide-shahi-3',
      category: 'Shahi Snan',
      title: 'Second Main Amrit Shahi Snan (द्वितीय अमृत शाही स्नान)',
      subtitle: '31 August 2027 • Peak Pilgrim Holy Immersion',
      image: '/unnamed-2025-02-03t105950ss_1738561979.jpg',
      location: 'Ramkund Ghats & Kushavarta Kund',
      description: 'The central and largest Shahi Snan date expected to draw millions of pilgrims to Ramkund ghats and Trimbakeshwar Jyotirlinga river banks.',
      highlights: [
        'Peak astrological alignment for holy immersion in Godavari (Dakshin Ganga)',
        'Grand floral decorations across Ramkund and Panchavati',
        'Special medical camps and missing-person booths along all river routes'
      ]
    },
    {
      id: 'guide-ritual-1',
      _id: 'guide-ritual-1',
      category: 'Ritual Guide',
      title: 'Godavari Maha Aarti & Deep Daan (गोदावरी महाआरती)',
      subtitle: 'Every Evening at Sunset • Ramkund Promenade',
      image: '/goda-aarti-chatg.webp',
      location: 'Ramkund Riverfront Promenade',
      description: 'Experience the mesmerizing evening Godavari Aarti where Vedic priests wave large multi-tiered brass oil lamps, accompanied by temple bells, conch shells, and floating flower diyas.',
      highlights: [
        'Evening Aarti begins promptly at sunset (6:30 PM)',
        'Devotees float bio-degradable leaf diyas in the holy river',
        'Viewing platforms reserved for senior citizens and pilgrims'
      ]
    },
    {
      id: 'guide-akhara-1',
      _id: 'guide-akhara-1',
      category: 'Akharas',
      title: 'Shaivite Akharas (शैव अखाड़े) - Juna, Niranjani & Mahanirvani',
      subtitle: 'Trimbakeshwar & Tapovan Sadhugram',
      image: '/shahi.jpg',
      location: 'Trimbakeshwar & Tapovan Sector 1',
      description: 'The ancient Shaivite monastic orders (Shri Panch Dashnam Juna Akhara, Niranjani Akhara, Mahanirvani Akhara) led by Naga Sadhus who renounce worldly life and meditate on Lord Shiva.',
      highlights: [
        'Lead the first royal Shahi Snan procession at Kushavarta Kund',
        'Famous for Trishul weapons demonstrations and ash-smearing rituals',
        'Satsang halls open for pilgrim darshan in Tapovan'
      ]
    },
    {
      id: 'guide-akhara-2',
      _id: 'guide-akhara-2',
      category: 'Akharas',
      title: 'Vaishnavite Akharas (वैष्णव अखाड़े) - Nirmohi, Digambar & Nirvani Ani',
      subtitle: 'Panchavati & Tapovan Sadhugram',
      image: '/unnamed-2025-02-03t105950ss_1738561979.jpg',
      location: 'Tapovan Sadhugram & Panchavati Promenade',
      description: 'The three prominent Vaishnavite Ani Akharas (Nirmohi Ani, Digambar Ani, and Nirvani Ani Akhara) dedicated to Lord Vishnu and Lord Rama, renowned for their grand holy processions.',
      highlights: [
        'Lead the royal Shahi Snan processions at Ramkund Bathing Ghat',
        'Spiritual discourses, Ram Katha, and Mahaprasadam distribution in Sadhugram',
        'Decorated silver chariots and flag-bearing sadhu processions'
      ]
    },
    {
      id: 'guide-temple-1',
      _id: 'guide-temple-1',
      category: 'Ritual Guide',
      title: 'Trimbakeshwar Jyotirlinga Darshan Protocol',
      subtitle: '5:00 AM - 9:00 PM • Trimbak Town',
      image: '/dhwajarohan.webp',
      location: 'Trimbakeshwar Temple Complex',
      description: 'Guidelines for visiting the 10th-century black stone temple housing the unique three-faced Lingam representing Brahma, Vishnu, and Shiva.',
      highlights: [
        'Online e-pass queuing system active during peak Shahi Snan weeks',
        'Footwear holding stalls & free drinking water inside queue complex',
        'Traditional modest dress code mandatory (Dhoti/Kurta or Saree/Salwar)'
      ]
    },
    {
      id: 'guide-safety-1',
      _id: 'guide-safety-1',
      category: 'Ritual Guide',
      title: 'Satellite Parking & Electric Shuttle Bus Corridors',
      subtitle: 'City Transport Protocol',
      image: '/kumbh-bg1.jpg',
      location: 'Outer Satellite Ring Road Parking Hubs',
      description: 'On Shahi Snan dates, private cars and buses are held at outer satellite parking terminals. Free electric shuttle buses transport pilgrims directly to inner drop points.',
      highlights: [
        'Tapovan Parking A (Aurangabad Rd) & Adgaon Parking B (Mumbai NH3)',
        '24/7 free electric shuttle frequency running every 3 minutes',
        'Pedestrian green corridors with RFID family tracking helpdesks'
      ]
    }
  ];

  const [form, setForm] = useState({
    category: 'Shahi Snan',
    title: '',
    subtitle: '',
    location: '',
    image: '/shahi-snan.jpg',
    description: '',
    highlightsText: ''
  });

  useEffect(() => {
    fetchGuideItems();
  }, []);

  const applyCustomOrder = (items) => {
    const orderIds = JSON.parse(localStorage.getItem('kumbh_order_guides') || '[]');
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
    if (targetIndex < 0 || targetIndex >= filteredGuideItems.length) return;

    const itemToMove = filteredGuideItems[index];
    const targetItem = filteredGuideItems[targetIndex];

    const realIndex = guideItems.findIndex(g => (g._id || g.id) === (itemToMove._id || itemToMove.id));
    const realTargetIndex = guideItems.findIndex(g => (g._id || g.id) === (targetItem._id || targetItem.id));

    if (realIndex === -1 || realTargetIndex === -1) return;

    const updated = [...guideItems];
    const temp = updated[realIndex];
    updated[realIndex] = updated[realTargetIndex];
    updated[realTargetIndex] = temp;

    setGuideItems(updated);

    const orderIds = updated.map(g => g._id || g.id);
    localStorage.setItem('kumbh_order_guide', JSON.stringify(orderIds));
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

  const fetchGuideItems = async () => {
    try {
      setLoading(true);
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_guides') || '[]');
      const customGuides = JSON.parse(localStorage.getItem('kumbh_custom_guides') || '[]');

      const res = await api.get('/pilgrim-guide').catch(() => null);
      let apiItems = (res?.data?.success && Array.isArray(res.data.data)) ? res.data.data : [];

      const rawList = [...customGuides, ...apiItems, ...defaultGuides];
      const seenTitles = new Set();
      const seenIds = new Set();
      const uniqueItems = [];

      for (const item of rawList) {
        if (!item) continue;
        const itemId = String(item._id || item.id || '').trim();
        let itemTitle = item.title || item.name || 'Pilgrim Guide';
        let itemCategory = item.category || 'Shahi Snan';

        let normTitle = itemTitle.trim().toLowerCase();

        // Automatic normalization for Shaivite Akharas and Dhwajarohan
        if (normTitle.includes('shaivite') || normTitle.includes('naga akharas') || normTitle.includes('oldest naga')) {
          itemTitle = 'Shaivite Akharas (शैव अखाड़े) - Juna, Niranjani & Mahanirvani';
          itemCategory = 'Akharas';
          normTitle = itemTitle.toLowerCase();
        }

        if (normTitle.includes('dhwajarohan') && itemCategory === 'Shahi Snan') {
          itemCategory = 'Ritual Guide';
        }

        const removedCardIds = ['guide-ritual-2', 'guide-ritual-3', 'guide-temple-2', 'guide-safety-2'];
        if (removedCardIds.includes(itemId) || deletedIds.includes(itemId) || deletedIds.includes(item._id) || deletedIds.includes(item.id)) {
          continue;
        }

        if ((itemId && seenIds.has(itemId)) || (normTitle && seenTitles.has(normTitle))) {
          continue;
        }

        if (itemId) seenIds.add(itemId);
        if (normTitle) seenTitles.add(normTitle);

        uniqueItems.push({
          _id: itemId || 'guide-' + Date.now(),
          id: itemId || 'guide-' + Date.now(),
          category: itemCategory,
          title: itemTitle,
          subtitle: item.subtitle || item.eventDate || 'Pilgrim Guidance Note',
          image: item.image || item.imageUrl || '/shahi.jpg',
          location: item.location || 'Panchavati, Nashik',
          description: item.description || 'Simhastha Kumbh pilgrim guidance.',
          highlights: (item.highlights && item.highlights.length > 0) ? item.highlights : [item.description || 'Guide Info']
        });
      }

      setGuideItems(applyCustomOrder(uniqueItems));
    } catch (err) {
      setGuideItems(defaultGuides);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingGuide(null);
    setForm({
      category: 'Shahi Snan',
      title: '',
      subtitle: '',
      location: '',
      image: '/shahi-snan.jpg',
      description: '',
      highlightsText: ''
    });
  };

  const handleEdit = (item) => {
    setEditingGuide(item);
    setForm({
      category: item.category || 'Shahi Snan',
      title: item.title || '',
      subtitle: item.subtitle || item.eventDate || '',
      location: item.location || '',
      image: item.image || '/shahi-snan.jpg',
      description: item.description || '',
      highlightsText: Array.isArray(item.highlights) ? item.highlights.join('\n') : (item.highlights || '')
    });
    setShowModal(true);
  };

  const handleCopy = (item) => {
    setEditingGuide(null);
    setForm({
      category: item.category || 'Shahi Snan',
      title: '',
      subtitle: item.subtitle || item.eventDate || '',
      location: item.location || '',
      image: item.image || '/shahi-snan.jpg',
      description: item.description || '',
      highlightsText: Array.isArray(item.highlights) ? item.highlights.join('\n') : (item.highlights || '')
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.title.trim() || !form.description || !form.description.trim()) {
      alert('Please fill in card title and description');
      return;
    }

    try {
      const highlightsTextStr = String(form.highlightsText || '');
      const highlights = highlightsTextStr
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const targetId = editingGuide ? (editingGuide._id || editingGuide.id) : ('guide-' + Date.now());

      const payload = {
        _id: targetId,
        id: targetId,
        category: form.category || 'Shahi Snan',
        title: form.title.trim(),
        subtitle: (form.subtitle || '').trim() || 'Official Pilgrim Guide',
        eventDate: (form.subtitle || '').trim(),
        location: (form.location || '').trim() || 'Panchavati, Nashik',
        description: form.description.trim(),
        image: form.image || '/shahi-snan.jpg',
        highlights: highlights.length > 0 ? highlights : [form.description.trim()]
      };

      // Safely save to localStorage (with quota handling)
      try {
        const customGuides = JSON.parse(localStorage.getItem('kumbh_custom_guides') || '[]');
        const filteredCustom = customGuides.filter(c => c && c._id !== targetId && c.id !== targetId && c.title !== editingGuide?.title);
        localStorage.setItem('kumbh_custom_guides', JSON.stringify([payload, ...filteredCustom]));
      } catch (storageErr) {
        console.warn('LocalStorage quota warning:', storageErr);
      }

      // Optimistically update local state so card appears immediately
      setGuideItems(prev => {
        const filtered = prev.filter(g => (g._id || g.id) !== targetId && g.title !== editingGuide?.title);
        return [payload, ...filtered];
      });

      // Send to backend API asynchronously (ignore backend errors so local save always succeeds)
      await api.post('/pilgrim-guide', payload).catch(() => null);

      const savedTitle = form.title.trim();
      setShowModal(false);
      resetForm();
      setSaveSuccessMessage(`Guide card "${savedTitle}" saved successfully.`);
      setTimeout(() => setSaveSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving pilgrim guide card:', err);
      alert('Error saving pilgrim guide card: ' + (err.message || 'Unknown error'));
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
        await api.delete(`/pilgrim-guide/${id}`).catch(() => null);
      }

      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_guides') || '[]');
      if (id && !deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('kumbh_deleted_guides', JSON.stringify(deletedIds));
      }

      const customGuides = JSON.parse(localStorage.getItem('kumbh_custom_guides') || '[]');
      const updatedCustom = customGuides.filter(item => item._id !== id && item.id !== id && item.title !== title);
      localStorage.setItem('kumbh_custom_guides', JSON.stringify(updatedCustom));

      setGuideItems(prev => prev.filter(item => item._id !== id && item.id !== id && item.title !== title));
      fetchGuideItems();
    } catch (err) {
      alert('Error deleting guide card');
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  const matchCategory = (itemCat, targetCat) => {
    if (!targetCat || targetCat === 'All') return true;
    if (!itemCat) return false;

    const normalize = (catStr) => {
      const s = String(catStr || '').trim().toLowerCase();
      if (s.includes('shahi snan')) return 'shahi snan';
      if (s.includes('ritual')) return 'ritual guide';
      if (s.includes('akhara')) return 'akharas';
      if (s.includes('temple')) return 'temple guide';
      if (s.includes('travel') || s.includes('safety')) return 'travel & safety';
      return s;
    };

    return normalize(itemCat) === normalize(targetCat);
  };

  const filteredGuideItems = guideItems.filter(item => {
    const matchesCat = matchCategory(item.category, selectedCategory);
    const searchLow = search.toLowerCase();
    const matchesSearch = searchLow === '' ||
      (item.title && item.title.toLowerCase().includes(searchLow)) ||
      (item.description && item.description.toLowerCase().includes(searchLow)) ||
      (item.location && item.location.toLowerCase().includes(searchLow));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border border-rose-500/40 p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-rose-400/40 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md">
            📕
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-rose-100 leading-tight truncate">Pilgrim Guide Management</h2>
            <p className="text-xs sm:text-sm text-rose-200/80 mt-0.5 font-medium truncate">
              Create & Manage Cards for Shahi Snan Dates, Sacred Rituals, Akharas, Temple Darshan & Travel Safety
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto z-10 flex-shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-rose-950/60 text-rose-100 border border-rose-400/40 text-xs font-bold shadow-md">
            📋 List View ({guideItems.length})
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 border border-rose-400/40"
          >
            <Plus className="w-4 h-4" /> Create New Guide Card
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Row: Search Left, Scrollable Tabs with Circular Arrow Buttons Right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Search Bar Input */}
        <div className="relative lg:w-72 xl:w-80 flex-shrink-0">
          <Search className="w-5 h-5 text-rose-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guide cards..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-rose-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Horizontal Filter Chips with Circular Left/Right Arrow Buttons & Scrollbar */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4 text-rose-700" />
            </button>
          )}

          <div
            ref={tabsRef}
            onScroll={checkScroll}
            className="flex-1 min-w-0 overflow-x-auto py-1 text-xs scrollbar-thin scrollbar-thumb-rose-300 scroll-smooth"
          >
            <div className="flex items-center gap-2 flex-nowrap min-w-max">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === 'All' ? guideItems.length : guideItems.filter(g => matchCategory(g.category, cat)).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border flex-shrink-0 ${
                      isSelected
                        ? 'bg-rose-700 text-white border-rose-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      isSelected ? 'bg-rose-950/40 text-white' : 'bg-slate-100 text-slate-700'
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
              className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4 text-rose-700" />
            </button>
          )}
        </div>
      </div>

      {/* Guide Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-bold text-sm">Loading pilgrim guide management cards...</div>
      ) : filteredGuideItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Pilgrim Guide Cards Found in "{selectedCategory}"</h3>
          <p className="text-xs text-slate-500">Click "Create New Guide Card" to add a new card visible to all visitors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuideItems.map((item, idx) => (
            <div 
              key={item._id || item.id || idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col h-full"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img 
                      src={item.image || '/shahi-snan.jpg'} 
                      alt={item.title}
                      onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-rose-900/90 backdrop-blur-md text-rose-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-rose-400/40">
                      {item.category}
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
                        disabled={idx === filteredGuideItems.length - 1}
                        className="p-1 rounded-lg hover:bg-white/20 text-white disabled:opacity-30 transition-all"
                        title="Move Sequence Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-bold text-base text-slate-900 leading-snug">{item.title}</h3>
                    {item.subtitle && <p className="text-[11px] font-bold text-rose-700">{item.subtitle}</p>}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.description}</p>

                    {item.location && (
                      <div className="flex items-center space-x-1.5 text-xs text-rose-800 font-bold bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
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
                    onClick={() => handleCopy(item)}
                    className="px-3 py-1.5 rounded-full text-rose-700 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Copy Card with Mandatory New Title"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 rounded-full text-amber-700 hover:bg-amber-50 border border-amber-200 hover:border-amber-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
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
          ))}
        </div>
      )}

      {/* Modal: Create or Edit Pilgrim Guide Card */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Fixed Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold flex-shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {editingGuide ? `Edit Pilgrim Guide Card ("${editingGuide.title}")` : 'Create New Pilgrim Guide Card'}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">Configure ritual guides, akhara details, and bathing ghat schedules</p>
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
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Guide Card Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Vaishnavite Akharas - Digambar, Nirmohi & Nirvani"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-xs outline-none transition-all"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Location / Sector *</label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Tapovan Sadhugram Sector 1 & Ramkund Ghat"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Provide full description of rituals, historical significance, or guidelines..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Guide Card Image (Upload File or Enter URL)</label>
                  
                  {form.image ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group mb-2 bg-slate-900">
                      <img 
                        src={form.image} 
                        alt="Card Preview" 
                        className="w-full h-40 object-cover" 
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="cursor-pointer px-3.5 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-rose-600" />
                          <span>Change Image</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload} 
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image: '' })}
                          className="px-3.5 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow hover:bg-red-700 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 hover:border-rose-500 bg-slate-50 hover:bg-rose-50/40 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-800">Click to Upload Image File from Device</p>
                        <p className="text-[10px] text-slate-500 font-medium">PNG, JPG, WEBP formats supported (Will display on cards for all users)</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  )}

                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Or paste custom image URL (e.g. /shahi-snan.jpg or https://...)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Operating Hours / Schedule</label>
                    <input
                      type="text"
                      value={form.timings}
                      onChange={(e) => setForm({ ...form, timings: e.target.value })}
                      placeholder="e.g. 4:00 AM - 10:00 PM Daily"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Dress Code & Etiquette</label>
                    <input
                      type="text"
                      value={form.dressCode}
                      onChange={(e) => setForm({ ...form, dressCode: e.target.value })}
                      placeholder="e.g. Traditional ethnic attire required"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Pilgrim Rules / Dos & Don'ts (Comma Separated)</label>
                  <input
                    type="text"
                    value={form.rulesInput}
                    onChange={(e) => setForm({ ...form, rulesInput: e.target.value })}
                    placeholder="e.g. Maintain silence near sanctum, No plastic footwear near ghat"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
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
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> {editingGuide ? 'Save Changes' : 'Publish Guide Card'}
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
                Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteConfirmItem.title}"</span>? It will be removed for all visitors across all tabs.
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

export default PilgrimGuideMgmt;

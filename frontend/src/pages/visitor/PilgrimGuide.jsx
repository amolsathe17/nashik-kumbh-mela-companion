import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Compass, Calendar, BookOpen, Globe2, Sparkles, CheckCircle2, 
  ShieldCheck, MapPin, ExternalLink, Sun, Flame, Info, Heart, Droplets,
  AlertTriangle, PhoneCall, Bus, HelpCircle, UserCheck, X, Search, ChevronLeft, ChevronRight, Navigation, Map as MapIcon
} from 'lucide-react';
import api from '../../services/api';

const PilgrimGuide = () => {
  const tabsRef = useRef(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
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

  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('Shahi Snan');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [guides]);

  // Category Tabs with Emojis
  const categories = [
    { id: 'Shahi Snan', label: `👑 ${t('shahiSnan') || 'Shahi Snan'}` },
    { id: 'Ritual Guide', label: `🔱 ${t('sacredRituals') || 'Sacred Rituals & Traditions'}` },
    { id: 'Akharas', label: `🛕 ${t('akharas') || 'Akharas & Sadhus'}` }
  ];

  // Comprehensive Authentic Dataset matching original guide categories (Strictly Local Nashik Kumbh Images)
  const defaultGuideData = [
    // --- 1. SHAHI SNAN DATES ---
    {
      id: 'guide-ritual-0',
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

    // --- 2. SACRED RITUAL GUIDE ---
    {
      id: 'guide-ritual-1',
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

    // --- 3. AKHARAS & SADHUS ---
    {
      id: 'guide-akhara-1',
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

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const deletedIds = [
        ...JSON.parse(localStorage.getItem('kumbh_deleted_guides') || '[]'),
        ...JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]')
      ];
      const customGuides = [
        ...JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]'),
        ...JSON.parse(localStorage.getItem('kumbh_custom_guides') || '[]')
      ];

      const res = await api.get('/pilgrim-guide').catch(() => null);
      let apiItems = (res?.data?.success && Array.isArray(res.data.data)) ? res.data.data : [];

      // If customGuides exists in localStorage, display strictly admin-managed cards
      const rawList = customGuides.length > 0 ? [...customGuides, ...apiItems] : [...apiItems, ...defaultGuideData];
      const seenTitles = new Set();
      const seenIds = new Set();
      const finalItems = [];

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

        const isGuideCategory = (catStr) => {
          if (!catStr) return false;
          const s = String(catStr).trim().toLowerCase();
          return s.includes('shahi snan') || s.includes('snan') || s.includes('ritual') || s.includes('tradition') || s.includes('akhara');
        };

        if (!isGuideCategory(itemCategory)) {
          continue;
        }

        if (deletedIds.includes(itemId) || deletedIds.includes(item._id) || deletedIds.includes(item.id)) {
          continue;
        }

        if ((itemId && seenIds.has(itemId)) || (normTitle && seenTitles.has(normTitle))) {
          continue;
        }

        if (itemId) seenIds.add(itemId);
        if (normTitle) seenTitles.add(normTitle);

        finalItems.push({
          id: itemId || 'guide-' + Date.now(),
          _id: itemId || 'guide-' + Date.now(),
          category: itemCategory,
          title: itemTitle,
          subtitle: item.subtitle || item.eventDate || 'Pilgrim Guidance Note',
          image: item.image || item.imageUrl || '/shahi.jpg',
          location: item.location || 'Panchavati, Nashik',
          description: item.description || 'Simhastha Kumbh pilgrim guidance.',
          highlights: (item.highlights && item.highlights.length > 0) ? item.highlights : [item.description || 'Guide Info']
        });
      }

      // Apply custom sequence ordering set by Admin
      const orderIds = JSON.parse(localStorage.getItem('kumbh_order_guides') || '[]');
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

      setGuides(finalItems);
    } catch (err) {
      setGuides(defaultGuideData);
    } finally {
      setLoading(false);
    }
  };

  const matchCategory = (itemCat, targetCatId) => {
    if (!targetCatId || targetCatId === 'All') return true;
    if (!itemCat) return false;

    const normalize = (catStr) => {
      const s = String(catStr || '').trim().toLowerCase();
      if (s.includes('shahi snan') || s.includes('snan')) return 'shahi snan';
      if (s.includes('akhara')) return 'akharas';
      if (s.includes('ritual') || s.includes('tradition')) return 'ritual guide';
      return 'ritual guide';
    };

    return normalize(itemCat) === normalize(targetCatId);
  };

  const filteredGuides = guides.filter(g => {
    const matchesCat = matchCategory(g.category, activeCategory);
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = searchLow === '' ||
      (g.title && g.title.toLowerCase().includes(searchLow)) ||
      (g.description && g.description.toLowerCase().includes(searchLow)) ||
      (g.location && g.location.toLowerCase().includes(searchLow)) ||
      (g.subtitle && g.subtitle.toLowerCase().includes(searchLow));

    return matchesCat && matchesSearch;
  });

  const countForCategory = (catId) => {
    return guides.filter(g => matchCategory(g.category, catId)).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md border border-white/20">
            📕
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight truncate">{t('pilgrimGuide')}</h2>
            <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5 truncate">
              Comprehensive Shahi Snan Schedule, Akharas, Sacred Rituals & Visitor Guidelines
            </p>
          </div>
        </div>

        {/* Header Right Action Group: List View Badge & Map View Toggle */}
        <div className="flex items-center gap-3 self-start sm:self-auto z-10 flex-shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-rose-950/60 text-rose-100 border border-rose-400/40 text-xs font-bold shadow-md">
            📋 List View ({guides.length})
          </span>
          <button
            onClick={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')}
            className="lg:hidden px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-100 font-bold text-xs border border-rose-400/40 shadow-md transition-all"
          >
            {viewMode === 'map' ? '📋 List View' : '🗺️ Map View'}
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
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Ramkund+Bathing+Ghat,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-cyan-100/90 hover:bg-cyan-200 text-cyan-950 border border-cyan-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🌊</span>
              <span>Ramkund Bathing Ghat</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Trimbakeshwar+Jyotirlinga,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🛕</span>
              <span>Trimbakeshwar Jyotirlinga</span>
            </button>

            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Kalaram+Temple,+Panchavati,+Nashik', '_blank')}
              className="px-4 py-2 rounded-full bg-indigo-100/90 hover:bg-indigo-200 text-indigo-950 border border-indigo-300 text-xs font-bold shadow-sm inline-flex items-center space-x-1.5 transition-all hover:scale-105"
            >
              <span>🚩</span>
              <span>Kalaram Temple</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Bar & Category Filter Bar Row: Search Left, Scrollable Tabs with Circular Arrow Buttons Right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Search Bar Input */}
        <div className="relative lg:w-72 xl:w-80 flex-shrink-0">
          <Search className="w-5 h-5 text-rose-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
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
                const count = countForCategory(cat.id);
                const isSelected = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border flex-shrink-0 ${
                      isSelected
                        ? 'bg-rose-700 text-white border-rose-600 shadow-md scale-102'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    <span>{cat.label}</span>
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
        <div className="p-12 text-center text-slate-500 font-bold text-sm">Loading pilgrim guide cards...</div>
      ) : filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div 
              key={guide.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col h-full"
              onClick={() => setSelectedGuide(guide)}
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img 
                      src={guide.image || '/shahi-snan.jpg'} 
                      alt={guide.title}
                      onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-rose-700 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow">
                      {guide.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{guide.title}</h3>
                      {guide.subtitle && <p className="text-[11px] font-bold text-rose-700 mt-0.5">{guide.subtitle}</p>}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{guide.description}</p>

                    {guide.location && (
                      <div className="flex items-center space-x-1.5 text-xs text-rose-800 font-bold bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span className="truncate">{guide.location}</span>
                      </div>
                    )}

                    {guide.highlights && guide.highlights.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                        {guide.highlights.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Perfectly Aligned Pill-Shaped Get Direction Button */}
              <div className="p-5 pt-0 mt-auto flex justify-start">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const destinationQuery = encodeURIComponent((guide.location || guide.title) + ', Nashik Kumbh Mela');
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`, '_blank');
                  }}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md inline-flex items-center space-x-2 transition-all hover:scale-105 border border-rose-500 flex-shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Direction</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No guide cards found in "{activeCategory}"</h3>
          <p className="text-xs text-slate-500">Select "All Categories" to view all available pilgrim guides.</p>
        </div>
      )}
    </div>
  );
};

export default PilgrimGuide;

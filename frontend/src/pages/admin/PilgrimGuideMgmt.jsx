import React, { useState, useEffect } from 'react';
import { 
  Compass, Plus, Trash2, CheckCircle, Calendar, AlertCircle, 
  Search, BookOpen, MapPin, Sparkles, X, Filter, Image as ImageIcon
} from 'lucide-react';
import api from '../../services/api';

const PilgrimGuideMgmt = () => {
  const [guideItems, setGuideItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 'Shahi Snan', 'Ritual Guide', 'Akharas', 'Temple Guide', 'Travel & Safety'
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
      id: 'guide-shahi-1',
      _id: 'guide-shahi-1',
      category: 'Shahi Snan',
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
      title: 'Shaivite Naga Akharas (ज Oldest Naga Sadhu Orders)',
      subtitle: 'Trimbakeshwar & Tapovan Sadhugram',
      image: '/shahi.jpg',
      location: 'Trimbakeshwar & Tapovan Sector 1',
      description: 'The ancient Shaivite monastic orders (Juna Akhara, Niranjani Akhara, Mahanirvani Akhara) led by Naga Sadhus who renounce worldly life and meditate on Lord Shiva.',
      highlights: [
        'Lead the first royal Shahi Snan procession at Kushavarta Kund',
        'Famous for Trishul weapons demonstrations and ash-smearing rituals',
        'Satsang halls open for pilgrim darshan in Tapovan'
      ]
    },
    {
      id: 'guide-temple-1',
      _id: 'guide-temple-1',
      category: 'Temple Guide',
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
      category: 'Travel & Safety',
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

  const fetchGuideItems = async () => {
    try {
      setLoading(true);
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_guides') || '[]');
      const customGuides = JSON.parse(localStorage.getItem('kumbh_custom_guides') || '[]');

      const res = await api.get('/pilgrim-guide').catch(() => null);
      let apiItems = (res?.data?.success && Array.isArray(res.data.data)) ? res.data.data : [];

      const combined = [...customGuides, ...apiItems];

      const enrichedApiItems = combined
        .filter(item => !deletedIds.includes(item._id) && !deletedIds.includes(item.id))
        .map(item => ({
          _id: item._id || item.id,
          id: item._id || item.id,
          category: item.category || 'Shahi Snan',
          title: item.title,
          subtitle: item.subtitle || item.eventDate || 'Pilgrim Guidance Note',
          image: item.image || item.imageUrl || '/shahi-snan.jpg',
          location: item.location || 'Panchavati, Nashik',
          description: item.description,
          highlights: (item.highlights && item.highlights.length > 0) ? item.highlights : [item.description]
        }));

      const apiTitles = new Set(enrichedApiItems.map(i => i.title));
      const finalItems = [
        ...enrichedApiItems,
        ...defaultGuides.filter(d => !apiTitles.has(d.title) && !deletedIds.includes(d.id))
      ];

      setGuideItems(finalItems);
    } catch (err) {
      setGuideItems(defaultGuides);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert('Please fill in card title and description');
      return;
    }

    try {
      const highlights = form.highlightsText
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const newId = 'guide-' + Date.now();
      const payload = {
        _id: newId,
        id: newId,
        category: form.category,
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || 'Official Pilgrim Guide',
        eventDate: form.subtitle.trim(),
        location: form.location.trim() || 'Panchavati, Nashik',
        description: form.description.trim(),
        image: form.image || '/shahi-snan.jpg',
        highlights: highlights.length > 0 ? highlights : [form.description.trim()]
      };

      const res = await api.post('/pilgrim-guide', payload);
      if (res?.data?.success || res?.status === 200 || res?.status === 201) {
        setShowModal(false);
        setForm({
          category: 'Shahi Snan',
          title: '',
          subtitle: '',
          location: '',
          image: '/shahi-snan.jpg',
          description: '',
          highlightsText: ''
        });
        fetchGuideItems();
      }
    } catch (err) {
      alert('Error creating pilgrim guide card');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? It will be removed for all visitors across all tabs.`)) return;
    
    try {
      await api.delete(`/pilgrim-guide/${id}`).catch(() => null);

      setGuideItems(prev => prev.filter(item => item._id !== id && item.id !== id && item.title !== title));
      alert(`"${title}" has been deleted.`);
      fetchGuideItems();
    } catch (err) {
      alert('Error deleting guide card');
    }
  };

  const filteredGuideItems = guideItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || 
      (item.category && item.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (selectedCategory === 'Ritual Guide' && (item.category?.includes('Ritual') || item.category?.includes('Yagna'))) ||
      (selectedCategory === 'Travel & Safety' && (item.category?.includes('Travel') || item.category?.includes('Safety')));

    const searchLow = search.toLowerCase();
    const matchesSearch = searchLow === '' ||
      (item.title && item.title.toLowerCase().includes(searchLow)) ||
      (item.description && item.description.toLowerCase().includes(searchLow)) ||
      (item.location && item.location.toLowerCase().includes(searchLow));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-rose-500/30">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 backdrop-blur-md border border-rose-400/40 flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
            📕
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-rose-100">Pilgrim Guide Management</h2>
            <p className="text-xs text-rose-200/80 mt-0.5 font-medium">
              Create & Manage Cards for Shahi Snan Dates, Sacred Rituals, Akharas, Temple Darshan & Travel Safety
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 border border-rose-400/40"
        >
          <Plus className="w-4 h-4" /> Create New Guide Card
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-rose-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guide cards by title, description, or location..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-rose-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Horizontal Filter Chips matching visitor tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' ? guideItems.length : guideItems.filter(g => g.category && g.category.toLowerCase().includes(cat.toLowerCase())).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border ${
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
          {filteredGuideItems.map((item) => (
            <div 
              key={item._id || item.id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img 
                    src={item.image || item.imageUrl || '/shahi-snan.jpg'} 
                    alt={item.title}
                    onError={(e) => { e.target.src = '/shahi-snan.jpg'; }}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-rose-900/90 backdrop-blur-md text-rose-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-rose-400/40">
                    {item.category}
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

              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Published to Visitor Guide
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
          ))}
        </div>
      )}

      {/* Modal: Create New Pilgrim Guide Card */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-rose-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-6 h-6 text-rose-600" />
                <h3 className="font-bold text-lg text-slate-900">Create Pilgrim Guide Card</h3>
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
                <label className="block font-bold text-slate-700 mb-1">Card Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. First Amrit Shahi Snan Guidelines"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold outline-none"
                  >
                    <option value="Shahi Snan">Shahi Snan</option>
                    <option value="Ritual Guide">Ritual Guide</option>
                    <option value="Akharas">Akharas</option>
                    <option value="Temple Guide">Temple Guide</option>
                    <option value="Travel & Safety">Travel & Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtitle / Event Date</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="e.g. 02 August 2027 • Main Bathing Day"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilgrimage Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Ramkund Bathing Ghat & Kushavarta Kund"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide essential background information, spiritual history, or rules..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold outline-none"
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
                        form.image === img.url ? 'border-rose-600 ring-2 ring-rose-500' : 'border-slate-200 hover:border-rose-300'
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Highlights & Protocol (One per line)</label>
                <textarea
                  rows={3}
                  value={form.highlightsText}
                  onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
                  placeholder="• Royal procession starts at 4:00 AM&#10;• Public bathing after Akhara holy dips conclude&#10;• Free shuttle buses from outer parking hubs"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold outline-none"
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
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Publish Guide Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PilgrimGuideMgmt;

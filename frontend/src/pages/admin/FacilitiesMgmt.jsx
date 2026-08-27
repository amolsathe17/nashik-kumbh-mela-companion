import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Building2, Plus, Trash2, CheckCircle, Search, AlertCircle, 
  MapPin, Clock, Phone, Navigation, X, Filter, Image as ImageIcon, Edit3, ArrowUp, ArrowDown, Copy, Upload, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

const FacilitiesMgmt = () => {
  const tabsRef = useRef(null);
  const [facilities, setFacilities] = useState([]);
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
  }, [facilities]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Accommodation');
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Categories matching NearbyFacilities.jsx (No Medical or All tabs)
  const categories = [
    'Accommodation', 'Food Area', 'Drinking Water', 
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
      description: 'Clean pilgrim rest house complex providing subsidized dormitory beds, luggage lockers, and hot water amenities near the Jyotirlinga temple.',
      image: '/dhwajarohan.webp',
      timings: '5:00 AM - 10:00 PM',
      distance: '500 meters from Kushavarta Kund',
      contactNumber: '02594-233215',
      facilities: ['Family Rooms', 'Attached Bathrooms', 'Hot Water Available', 'Purified Water']
    },
    {
      _id: 'fac-3',
      name: 'Panchavati Yatri Niwas Holding Hub (पंचवटी यात्री निवास)',
      category: 'Accommodation',
      address: 'Kalaram Temple Road, Panchavati, Nashik 422003',
      location: 'Kalaram Temple Road, Panchavati, Nashik 422003',
      description: 'Budget dormitory accommodation with secure locker rooms and tourist helpdesk within walking distance of Kalaram Temple and Ramkund.',
      image: '/nagarpradakshina.webp',
      timings: 'Open 24/7',
      distance: '1.2 km from Ramkund Ghat',
      contactNumber: '0253-2511108',
      facilities: ['Dormitory Beds', 'Luggage Storage Locker', 'CCTV Security', 'Information Desk']
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
      _id: 'fac-5',
      name: 'Ramkund Maha Aarti Prasadam Counter (रामकुंड महाप्रसाद केंद्र)',
      category: 'Food Area',
      address: 'Ramkund Upper Promenade, Panchavati, Nashik 422003',
      location: 'Ramkund Upper Promenade, Panchavati, Nashik 422003',
      description: 'Official prasad distribution center operated by Nashik Municipal Corporation serving fresh traditional sweets and packed water.',
      image: '/goda-aarti-chatg.webp',
      timings: '6:00 AM - 9:30 PM',
      distance: 'At Ramkund Entry Gate',
      contactNumber: '0253-2570001',
      facilities: ['Packed Prasadam Boxes', 'Pure Desi Ghee Sweets', 'Clean Counter']
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
      _id: 'fac-7',
      name: 'Trimbakeshwar Kushavarta RO Drinking Kiosk #2',
      category: 'Drinking Water',
      address: 'Main Promenade, Trimbakeshwar Temple Road 422212',
      location: 'Main Promenade, Trimbakeshwar Temple Road 422212',
      description: 'High-speed clean drinking water taps continuously serviced during peak holy bath hours.',
      image: '/shahi-snan-for-kumbh-mela.webp',
      timings: 'Continuous 24/7',
      distance: '100m from Kushavarta Kund',
      contactNumber: '02594-233215',
      facilities: ['RO Water', 'Touchless Taps', 'Cold Water Dispenser']
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
      contactNumber: '0253-2575555',
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
      _id: 'fac-12',
      name: 'Nashik Road Railway Station Pilgrim Shuttle Bus Terminal (नाशिक रोड रेल्वे स्टेशन शटल टर्मिनल)',
      category: 'Transport',
      address: 'Nashik Road Railway Station Exit Gate 1, Nashik 422101',
      location: 'Nashik Road Railway Station Exit Gate 1, Nashik 422101',
      description: 'Official 24/7 MSRTC & Electric City Bus hub providing free direct shuttle buses connecting train passengers to Tapovan Sadhugram, Ramkund Ghats, and outer satellite parking.',
      image: '/kumbh-bg.jpg',
      timings: 'Continuous 24/7 Service (Buses every 3 mins)',
      distance: '10 meters from Railway Station Main Exit',
      contactNumber: '0253-2465432',
      facilities: ['Free Electric Shuttles', '24/7 Ticket Counters', 'Baggage Holding Counter', 'Tourist Police Desk', 'Wheelchair Support']
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
    },
    {
      _id: 'fac-14',
      name: 'Nashik Central CBS Bus Depot Transit Terminal (नाशिक मध्यवर्ती बस स्थानक शटल टर्मिनल)',
      category: 'Transport',
      address: 'CBS Circle, Shalimar, Nashik 422001',
      location: 'CBS Circle, Shalimar, Nashik 422001',
      description: 'Central MSRTC transport interchange hub with non-stop express buses running to Trimbakeshwar Jyotirlinga, Tapovan Tent City, and Mumbai/Pune highways.',
      image: '/kumbh-bg1.jpg',
      timings: 'Continuous 24/7 Departure',
      distance: '2.2 km from Ramkund Ghat',
      contactNumber: '0253-2575555',
      facilities: ['Non-Stop Express Shuttles', 'Passenger Rest Waiting Hall', 'Multilingual Helpdesk', 'RO Water Dispensers']
    },
    {
      _id: 'fac-15',
      name: 'Tapovan Electric Shuttle Ring Road Corridor (तपोवन इलेक्ट्रिक बस मार्ग)',
      category: 'Transport',
      address: 'Tapovan Sector 1 Shuttle Station, Nashik 422003',
      location: 'Tapovan Sector 1 Shuttle Station, Nashik 422003',
      description: 'Zero-emission electric shuttle corridor connecting outer satellite parking terminals to Ramkund bathing ghats during peak Shahi Snan days.',
      image: '/shahi-snan.jpg',
      timings: '4:00 AM - 11:30 PM (Peak Frequencies)',
      distance: 'Direct Express Route to Ghats',
      contactNumber: '0253-2578899',
      facilities: ['100% Electric Fleet', 'Zero Pilgrim Fare', 'Low-Floor Accessibility', 'Dedicated Traffic Lane']
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

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_facilities') || '[]');
      const customItems = JSON.parse(localStorage.getItem('kumbh_custom_facilities') || '[]');

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
    if (!form.name || !form.name.trim() || !form.address || !form.address.trim()) {
      alert('Please fill in facility name and address');
      return;
    }

    try {
      const facilitiesInputStr = String(form.facilitiesInput || '');
      const facilitiesArray = facilitiesInputStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const targetId = editingFacility ? (editingFacility._id || editingFacility.id) : ('fac-' + Date.now());

      const payload = {
        _id: targetId,
        id: targetId,
        name: form.name.trim(),
        category: form.category || 'Food Area',
        address: form.address.trim(),
        location: form.address.trim(),
        description: (form.description || '').trim() || `${form.name} official facility.`,
        image: form.image || '/shahi-snan.jpg',
        timings: form.timings || 'Open 24 Hours',
        distance: form.distance || 'Central Kumbh Area',
        contactNumber: form.contactNumber || '0253-2575555',
        facilities: facilitiesArray.length > 0 ? facilitiesArray : ['Verified Desk', 'Clean Amenities'],
        status: form.status || 'Verified',
        verified: true,
        isConfirmed: true
      };

      // Safely save to localStorage (with quota handling)
      try {
        const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_facilities') || '[]');
        const filteredCustom = customLocs.filter(c => c && c._id !== targetId && c.id !== targetId && c.name !== editingFacility?.name);
        localStorage.setItem('kumbh_custom_facilities', JSON.stringify([payload, ...filteredCustom]));
      } catch (storageErr) {
        console.warn('LocalStorage quota warning:', storageErr);
      }

      // Optimistically update local state so card appears immediately
      setFacilities(prev => {
        const filtered = prev.filter(f => (f._id || f.id) !== targetId && f.name !== editingFacility?.name);
        return [payload, ...filtered];
      });

      // Send to backend API asynchronously (ignore backend errors so local save always succeeds)
      await api.post('/facilities', payload).catch(() => null);

      const savedName = form.name.trim();
      setShowModal(false);
      resetForm();
      setSaveSuccessMessage(`Facility card "${savedName}" saved successfully.`);
      setTimeout(() => setSaveSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving facility card:', err);
      alert('Error saving facility card: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = (id, name) => {
    setDeleteConfirmItem({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    const { id, name } = deleteConfirmItem;

    try {
      if (id) {
        await api.delete(`/facilities/${id}`).catch(() => null);
      }

      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_facilities') || '[]');
      if (id && !deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('kumbh_deleted_facilities', JSON.stringify(deletedIds));
      }

      const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_facilities') || '[]');
      const updatedCustom = customLocs.filter(item => item._id !== id && item.id !== id && item.name !== name);
      localStorage.setItem('kumbh_custom_facilities', JSON.stringify(updatedCustom));

      setFacilities(prev => prev.filter(item => item._id !== id && item.id !== id && item.name !== name));
      fetchFacilities();
    } catch (err) {
      alert('Error deleting facility card');
    } finally {
      setDeleteConfirmItem(null);
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
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 border border-purple-500/40 p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-purple-400/40 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md">
            📍
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-purple-100 leading-tight truncate">Nearby Facilities Management</h2>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-0.5 font-medium truncate">
              Create & Manage Cards for Accommodation, Food Arenas, Water Stations, Parking & Transport
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto z-10 flex-shrink-0">
          <span className="px-4 py-2.5 rounded-2xl bg-purple-950/60 text-purple-100 border border-purple-400/40 text-xs font-bold shadow-md">
            📋 List View ({facilities.length})
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all hover:scale-102 border border-purple-400/40"
          >
            <Plus className="w-4 h-4" /> Create New Facility Card
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Row: Search Left, Scrollable Tabs with Circular Arrow Buttons Right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* Search Bar Input */}
        <div className="relative lg:w-72 xl:w-80 flex-shrink-0">
          <Search className="w-5 h-5 text-purple-600 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facility cards..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-purple-200 rounded-2xl shadow-sm text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none rtl:pr-12 rtl:pl-4"
          />
        </div>

        {/* Category Horizontal Filter Chips with Circular Left/Right Arrow Buttons & Scrollbar */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-purple-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Left"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4 text-purple-700" />
            </button>
          )}

          <div
            ref={tabsRef}
            onScroll={checkScroll}
            className="flex-1 min-w-0 overflow-x-auto py-1 text-xs scrollbar-thin scrollbar-thumb-purple-300 scroll-smooth"
          >
            <div className="flex items-center gap-2 flex-nowrap min-w-max">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === 'All' ? facilities.length : facilities.filter(f => matchCategory(f.category, cat)).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse border flex-shrink-0 ${
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

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="w-8 h-8 rounded-full bg-white hover:bg-purple-50 border border-slate-300 text-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
              title="Scroll Right"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4 text-purple-700" />
            </button>
          )}
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
              key={fac._id || fac.id || idx} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col h-full"
            >
              <div className="flex-1 flex flex-col justify-between">
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
              </div>

              {/* Perfectly Aligned Pill-Shaped Action Buttons */}
              <div className="p-5 pt-3 mt-auto flex items-center justify-between gap-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Published
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(fac)}
                    className="px-3 py-1.5 rounded-full text-purple-700 hover:bg-purple-50 border border-purple-200 hover:border-purple-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Copy Card with Mandatory New Name"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => handleEdit(fac)}
                    className="px-3 py-1.5 rounded-full text-amber-700 hover:bg-amber-50 border border-amber-200 hover:border-amber-300 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="Edit Card"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(fac._id || fac.id, fac.name)}
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

      {/* Modal: Create or Edit Facility Card */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Fixed Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center font-bold flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {editingFacility ? `Edit Facility Card ("${editingFacility.name}")` : 'Create New Facility Card'}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">Configure medical centers, lost & found, toilets, and food hubs</p>
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
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Facility Center Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Panchavati Sector 1 Emergency Medical Hub"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-xs outline-none transition-all"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Emergency Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={form.contactNumber}
                      onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                      placeholder="e.g. 0253-2575555 / 108"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Location / Address *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. Near Tapovan Satellite Bus Stand Gate 2, Nashik 422003"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Provide details about available services, capacity, or doctor availability..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Facility Card Image (Upload File or Enter URL)</label>
                  
                  {form.image ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group mb-2 bg-slate-900">
                      <img 
                        src={form.image} 
                        alt="Card Preview" 
                        className="w-full h-40 object-cover" 
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="cursor-pointer px-3.5 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-purple-600" />
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
                    <label className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/40 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
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
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Operating Hours / Timings</label>
                    <input
                      type="text"
                      value={form.timings}
                      onChange={(e) => setForm({ ...form, timings: e.target.value })}
                      placeholder="e.g. 24 Hours Emergency Service"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 text-xs mb-1.5">Distance Landmark</label>
                    <input
                      type="text"
                      value={form.distance}
                      onChange={(e) => setForm({ ...form, distance: e.target.value })}
                      placeholder="e.g. 200m from Tapovan Gate"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Available Services & Features (Comma Separated)</label>
                  <input
                    type="text"
                    value={form.servicesInput}
                    onChange={(e) => setForm({ ...form, servicesInput: e.target.value })}
                    placeholder="e.g. ICU Ambulance, Free Medicines, Wheelchair Access, 50 Beds"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
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
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> {editingFacility ? 'Save Changes' : 'Publish Facility Card'}
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

export default FacilitiesMgmt;

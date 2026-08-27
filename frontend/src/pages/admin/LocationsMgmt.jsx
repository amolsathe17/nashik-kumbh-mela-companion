import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  MapPin, Plus, Trash2, CheckCircle, Search, AlertCircle, 
  Navigation, Clock, Phone, Building2, Image as ImageIcon, X, Filter, Edit3, ArrowUp, ArrowDown, Copy, Upload, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../services/api';

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

  const defaultLocations = [
    // --- GHATS ---
    {
      _id: 'loc-1',
      name: 'Ramkund Holy Bathing Ghat (रामकुंड पवित्र घाट)',
      category: 'Ghat',
      address: 'Panchavati, Nashik, Maharashtra 422003',
      description: 'The central, most sacred bathing ghat on River Godavari where Lord Rama performed rituals. Primary site for royal Shahi Snan and evening Goda Aarti.',
      status: 'Active',
      contactNumber: '0253-2575555',
      image: '/shahi-snan.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Safety Netting', 'Life Guards', 'Clean Changing Rooms', 'Emergency Helpdesk'],
      distance: '2.5 km from CBS Bus Stand'
    },
    {
      _id: 'loc-2',
      name: 'Kushavarta Kund (कुशावर्त कुंड - त्र्यंबकेश्वर)',
      category: 'Ghat',
      address: 'Trimbakeshwar Town, Nashik District 422212',
      description: 'Sacred pond in Trimbakeshwar regarded as the origin of River Godavari. Primary holy bath spot for Shaivite Akharas.',
      status: 'Active',
      contactNumber: '0253-2591241',
      image: '/shahi-snan-for-kumbh-mela.webp',
      timings: '5:00 AM - 9:00 PM',
      facilities: ['Vedic Pandits', 'Changing Area', 'Water Filtration', 'Police Security'],
      distance: '28 km West of Nashik'
    },
    {
      _id: 'loc-3',
      name: 'Laxman Ghat & Ahilya Ghat (लक्ष्मण घाट एवं अहिल्या घाट)',
      category: 'Ghat',
      address: 'Downstream Godavari River, Panchavati, Nashik 422003',
      description: 'Serene secondary bathing ghats ideal for ancestral Tarpan rituals and peaceful holy baths.',
      status: 'Active',
      contactNumber: '0253-2570001',
      image: '/68c4435662438-pitru-paksha-120221463-16x9.webp',
      timings: 'Open 24 Hours',
      facilities: ['Tarpan Pedestals', 'Drinking Water Station', 'Ramp Access'],
      distance: '2.8 km from City Center'
    },
    {
      _id: 'loc-3b',
      name: 'Takli Sangam Ghat (टाकळी संगम घाट)',
      category: 'Ghat',
      address: 'Takli, Confluence of Godavari & Kapila Rivers, Nashik',
      description: 'Holy confluence of Godavari and Kapila rivers where Samarth Ramdas Swami meditated for 12 years.',
      status: 'Active',
      contactNumber: '0253-2570002',
      image: '/goda-aarti-chatg.webp',
      timings: '6:00 AM - 8:00 PM',
      facilities: ['Riverfront Promenade', 'Ramp Walkway', 'Lighting Posts'],
      distance: '4.2 km from Ramkund'
    },

    // --- TEMPLES ---
    {
      _id: 'loc-6b',
      name: 'Muktidham Marble Temple (मुक्तिधाम मंदिर - नाशिक रोड)',
      category: 'Temple',
      address: 'Nashik Road, Nashik, Maharashtra 422101',
      description: 'Famous white marble temple complex replicating all 12 Jyotirlingas with 18 chapters of Bhagavad Gita carved on its walls.',
      status: 'Active',
      contactNumber: '0253-2461150',
      image: '/kumbh-bg.jpg',
      timings: '6:00 AM - 9:00 PM',
      facilities: ['Pilgrim Dharamshala', 'Pure Veg Canteen', 'Large Parking'],
      distance: '1.5 km from Nashik Road Station'
    },
    {
      _id: 'loc-6',
      name: 'Sita Gufa & Panchavati Grove (सीता गुफा एवं पंचवटी)',
      category: 'Temple',
      address: 'Panchavati Sacred Grove, Nashik 422003',
      description: 'Ancient cave near the 5 sacred Banyan trees (Panchavati) where Goddess Sita stayed during exile.',
      status: 'Active',
      contactNumber: '0253-2512200',
      image: '/nagarpradakshina.webp',
      timings: '6:00 AM - 8:00 PM',
      facilities: ['Guided Pilgrimage Path', 'Cooling Misting Fans', 'Souvenir Shops'],
      distance: '3.2 km from Nashik CBS'
    },
    {
      _id: 'loc-5',
      name: 'Kalaram Temple (कालाराम मंदिर - पंचवटी)',
      category: 'Temple',
      address: 'Panchavati, Nashik, Maharashtra 422003',
      description: 'Historic 1788 temple housing a 2-foot black basalt idol of Lord Rama, Sita, and Lakshmana.',
      status: 'Active',
      contactNumber: '0253-2511108',
      image: '/img_20250206_1205497474678292145460306.webp',
      timings: '6:00 AM - 9:00 PM',
      facilities: ['Prasad Counter', 'Historical Information Desk', 'Spacious Courtyard'],
      distance: '3.0 km from Railway Station Shuttle Stop'
    },
    {
      _id: 'loc-4',
      name: 'Trimbakeshwar Jyotirlinga Temple (त्र्यंबकेश्वर ज्योतिर्लिंग)',
      category: 'Temple',
      address: 'Trimbak Town, Nashik District, Maharashtra 422212',
      description: 'One of the 12 sacred Jyotirlinga temples of Lord Shiva. Built of black basalt by Peshwa Balaji Baji Rao.',
      status: 'Active',
      contactNumber: '0253-2591241',
      image: '/dhwajarohan.webp',
      timings: '5:00 AM - 9:00 PM',
      facilities: ['VIP Pass Counter', 'Footwear Depot', 'Queue Complex', 'Wheelchair Facility'],
      distance: '28 km West of Nashik'
    },
    {
      _id: 'loc-6c',
      name: 'Kapaleshwar Temple (कपालेश्वर मंदिर - पंचवटी)',
      category: 'Temple',
      address: 'Panchavati, Opposite Ramkund, Nashik 422003',
      description: 'Ancient Shiva temple unique in India for having no Nandi bull facing the deity, as Shiva accepted Nandi as his Guru here.',
      status: 'Active',
      contactNumber: '0253-2575555',
      image: '/goda-aarti-chatg.webp',
      timings: '5:00 AM - 10:00 PM',
      facilities: ['Ramkund View Deck', 'Pooja Counter', 'Queue Line'],
      distance: '100 meters from Ramkund Ghat'
    },
    {
      _id: 'loc-6d',
      name: 'Someshwar Temple & Waterfall (सोमेश्वर मंदिर एवं धबधबा)',
      category: 'Temple',
      address: 'Gangapur Road, Someshwar, Nashik 422013',
      description: 'Picturesque Lord Shiva temple situated on the banks of Godavari river near a natural waterfall, surrounded by lush green hills.',
      status: 'Active',
      contactNumber: '0253-2341100',
      image: '/kumbh-bg1.jpg',
      timings: '6:00 AM - 8:30 PM',
      facilities: ['River Ghats', 'Boating Facility', 'Garden Walkway', 'Parking Lot'],
      distance: '7 km West of Panchavati'
    },

    // --- SHAHI SNAN DATES ---
    {
      _id: 'loc-shahi-1',
      name: 'First Amrit Shahi Snan (प्रथम अमृत शाही स्नान)',
      category: 'Shahi Snan',
      address: 'Ramkund Ghat & Godavari Promenade',
      description: 'The first grand royal bath date of the Simhastha Kumbh. Thousands of Nagas and Mahant Sadhus process with silver palanquins and trumpets to take the celestial dip.',
      status: 'Active',
      contactNumber: '0253-2575555',
      image: '/shahi-snan.jpg',
      timings: '02 August 2027 • Starts 4:00 AM',
      facilities: ['Royal Procession Path', 'Vedic Chanting', 'Strict Security Cordon'],
      distance: 'Central Godavari Promenade'
    },
    {
      _id: 'loc-shahi-2',
      name: 'Second Main Amrit Shahi Snan (द्वितीय अमृत शाही स्नान)',
      category: 'Shahi Snan',
      address: 'Ramkund Ghats & Kushavarta Kund',
      description: 'The central and largest Shahi Snan date expected to draw millions of pilgrims to Ramkund ghats and Trimbakeshwar Jyotirlinga river banks.',
      status: 'Active',
      contactNumber: '0253-2575555',
      image: '/unnamed-2025-02-03t105950ss_1738561979.jpg',
      timings: '31 August 2027 • All Day',
      facilities: ['Peak Holy Immersion', 'Floral Decorations', 'Medical & Lost-Person Booths'],
      distance: 'Ramkund & Trimbak'
    },

    // --- RITUAL GUIDE ---
    {
      _id: 'loc-ritual-0',
      name: 'Dhwajarohan (ध्वजारोहण) - Official Commencement',
      category: 'Ritual Guide',
      address: 'Ramkund Ghat & Kushavarta Kund',
      description: 'The 21-month long Simhastha Kumbh Mela officially commences with the sacred flag hoisting ceremony performed simultaneously by sadhus and administrators.',
      status: 'Active',
      contactNumber: '0253-2575555',
      image: '/dhwajarohan.webp',
      timings: '31 October 2026 • Sunrise',
      facilities: ['Vedic Flag Hoisting', 'Akhara Camp Opening', 'Astronomic Alignment'],
      distance: 'Ramkund & Kushavarta'
    },
    {
      _id: 'loc-ritual-1',
      name: 'Godavari Maha Aarti & Deep Daan (गोदावरी महाआरती)',
      category: 'Ritual Guide',
      address: 'Ramkund Riverfront Promenade',
      description: 'Experience the mesmerizing evening Godavari Aarti where Vedic priests wave large multi-tiered brass oil lamps, accompanied by temple bells and floating flower diyas.',
      status: 'Active',
      contactNumber: '0253-2575555',
      image: '/goda-aarti-chatg.webp',
      timings: 'Every Evening at Sunset (6:30 PM)',
      facilities: ['Multi-tiered Lamps', 'Floating Diyas', 'Senior Citizen Seating'],
      distance: 'Ramkund Promenade'
    },
    {
      _id: 'loc-ritual-2',
      name: 'Trimbakeshwar Jyotirlinga Darshan Protocol',
      category: 'Ritual Guide',
      address: 'Trimbakeshwar Temple Complex',
      description: 'Guidelines for visiting the 10th-century black stone temple housing the unique three-faced Lingam representing Brahma, Vishnu, and Shiva.',
      status: 'Active',
      contactNumber: '02594-233215',
      image: '/dhwajarohan.webp',
      timings: '5:00 AM - 9:00 PM',
      facilities: ['E-pass Queuing', 'Footwear Stalls', 'Traditional Dress Code'],
      distance: 'Trimbakeshwar Town'
    },

    // --- AKHARAS & SADHUS ---
    {
      _id: 'loc-akhara-1',
      name: 'Shaivite Akharas (शैव अखाड़े) - Juna, Niranjani & Mahanirvani',
      category: 'Akharas',
      address: 'Trimbakeshwar & Tapovan Sector 1',
      description: 'The ancient Shaivite monastic orders led by Naga Sadhus who renounce worldly life and meditate on Lord Shiva.',
      status: 'Active',
      contactNumber: '0253-2571000',
      image: '/shahi.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Naga Sadhu Processions', 'Trishul Demonstrations', 'Satsang Halls'],
      distance: 'Tapovan & Trimbak'
    },
    {
      _id: 'loc-akhara-2',
      name: 'Vaishnavite Akharas (वैष्णव अखाड़े) - Nirmohi, Digambar & Nirvani Ani',
      category: 'Akharas',
      address: 'Tapovan Sadhugram & Panchavati Promenade',
      description: 'The three prominent Vaishnavite Ani Akharas dedicated to Lord Vishnu and Lord Rama, renowned for their grand holy processions.',
      status: 'Active',
      contactNumber: '0253-2571000',
      image: '/unnamed-2025-02-03t105950ss_1738561979.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Silver Chariots', 'Ram Katha', 'Mahaprasadam Distribution'],
      distance: 'Tapovan Sadhugram'
    },

    // --- ACCOMMODATION ---
    {
      _id: 'loc-acc-1',
      name: 'Tapovan Sadhugram Akhara Tent City (तपोवन साधुग्राम नगर)',
      category: 'Accommodation',
      address: 'Tapovan, Nashik, Maharashtra 422003',
      description: 'World-famous sprawling tent township housing thousands of Sadhus, Akhara leaders, Mahants, and international devotees.',
      status: 'Active',
      contactNumber: '0253-2571000',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: 'Open 24 Hours',
      facilities: ['Free Pilgrim Tents', 'Satsang Halls', 'Security Patrol', 'Medical Booths'],
      distance: '3.5 km East of Ramkund'
    },
    {
      _id: 'loc-acc-2',
      name: 'Panchavati Yatri Niwas & Pilgrim Lodge (पंचवटी यात्री निवास)',
      category: 'Accommodation',
      address: 'Sardar Patel Road, Panchavati, Nashik 422003',
      description: 'Government registered pilgrim lodge offering clean dormitories and family rooms at subsidized rates.',
      status: 'Active',
      contactNumber: '0253-2514455',
      image: '/kumbh-bg1.jpg',
      timings: 'Check-in 24 Hours',
      facilities: ['24/7 Hot Water', 'Luggage Lockers', 'RO Water Dispensers', 'Canteen'],
      distance: '1.2 km from Ramkund'
    },
    {
      _id: 'loc-acc-3',
      name: 'Trimbakeshwar Bhakta Niwas & Ashram Complex',
      category: 'Accommodation',
      address: 'Near Kushavarta Kund, Trimbakeshwar 422212',
      description: 'Spiritual rest house complex with clean dormitory halls and family rooms near Kushavarta Kund.',
      status: 'Active',
      contactNumber: '02594-233215',
      image: '/dhwajarohan.webp',
      timings: 'Open 24 Hours',
      facilities: ['Family Rooms', 'Attached Bathrooms', 'Subsidized Meals'],
      distance: '500m from Kushavarta'
    },

    // --- TRANSPORT ---
    {
      _id: 'loc-trans-1',
      name: 'Central Kumbh Electric Shuttle Bus Terminal',
      category: 'Transport',
      address: 'Outer Ring Road Terminal Hub, Nashik 422004',
      description: '24/7 zero-emission electric shuttle fleet connecting outer satellite parking hubs directly to inner Ramkund and Tapovan drop points.',
      status: 'Active',
      contactNumber: '0253-2570009',
      image: '/kumbh-bg1.jpg',
      timings: 'Continuous 24/7 Shuttle Frequency',
      facilities: ['100% Electric Fleet', 'Zero Pilgrim Fare', 'Low-Floor Accessibility', 'Dedicated Traffic Lane'],
      distance: 'Outer Satellite Ring Road'
    },

    // --- FOOD AREA ---
    {
      _id: 'loc-14',
      name: 'Tapovan Annadan & Food Arena (तपोवन अन्नछत्र)',
      category: 'Food Area',
      address: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      description: 'Massive community dining hall serving fresh, wholesome, pure vegetarian Mahaprasad free of cost to over 100,000 pilgrims daily.',
      status: 'Active',
      contactNumber: '0253-2572211',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: '7:00 AM - 10:30 PM',
      facilities: ['Free Mahaprasad', 'Hygienic Dining Benches', 'Purified Water', 'RO Drinking Water'],
      distance: 'Inside Tapovan City'
    },
    {
      _id: 'loc-14b',
      name: 'Ramkund Mahaprasad Distribution Kshetra',
      category: 'Food Area',
      address: 'Godavari Riverbank Promenade, Panchavati, Nashik 422003',
      description: 'Continuous free meals and tea distribution center managed by charitable trusts during all Snan days.',
      status: 'Active',
      contactNumber: '0253-2570003',
      image: '/goda-aarti-chatg.webp',
      timings: '6:00 AM - 11:00 PM',
      facilities: ['Free Meals', 'Seating Benches', 'Clean Trash Bins'],
      distance: '100m from Ramkund'
    },

    // --- DRINKING WATER ---
    {
      _id: 'loc-12',
      name: 'Ramkund RO Water Dispensing Station #1',
      category: 'Drinking Water',
      address: 'Ramkund Upper Bridge Promenade, Nashik 422003',
      description: 'High-capacity RO purified drinking water fountain serving cold and ambient drinking water continuously.',
      status: 'Active',
      contactNumber: '0253-2570004',
      image: '/goda-aarti-chatg.webp',
      timings: 'Open 24 Hours',
      facilities: ['RO Purified', 'Chilled Water Fountains', 'Zero Plastic Bottling Station'],
      distance: 'At Ramkund Ghat Entrance'
    },
    {
      _id: 'loc-12b',
      name: 'Tapovan Sadhugram RO Water Distribution Hub #2',
      category: 'Drinking Water',
      address: 'Sector 3 Main Avenue, Tapovan, Nashik 422003',
      description: 'Solar-powered 10,000 LPH filtration kiosk providing clean drinking water for pilgrim camps.',
      status: 'Active',
      contactNumber: '0253-2570005',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: 'Open 24 Hours',
      facilities: ['Solar RO Filtration', 'Touchless Taps', 'Cold Water'],
      distance: 'Inside Tapovan City'
    },

    // --- TOILET ---
    {
      _id: 'loc-13',
      name: 'Panchavati Deluxe Smart Sanitation Block #1',
      category: 'Toilet',
      address: 'Panchavati Temple Road, Nashik 422003',
      description: 'Eco-friendly, continuously disinfected smart public restroom complex with handicap accessible ramps.',
      status: 'Active',
      contactNumber: '0253-2570006',
      image: '/kumbh-bg.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Separate Male/Female Blocks', 'Wheelchair Accessible', 'Continuous Sanitization'],
      distance: '150 meters from Kalaram Temple'
    },
    {
      _id: 'loc-13b',
      name: 'Ramkund Riverfront Mobile Sanitation Complex #2',
      category: 'Toilet',
      address: 'Downstream Promenade, Ramkund, Nashik 422003',
      description: '24-bay high capacity bio-toilet block with running water and dedicated cleaning crew.',
      status: 'Active',
      contactNumber: '0253-2570007',
      image: '/kumbh-bg1.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Running Water Taps', 'Handwash Counters', 'Janitor Desk'],
      distance: '200 meters from Ramkund'
    },

    // --- PHARMACY ---
    {
      _id: 'loc-18',
      name: 'Panchavati Central Kumbh Pharmacy & First Aid Desk',
      category: 'Pharmacy',
      address: 'CBS Road Junction, Panchavati, Nashik 422003',
      description: '24/7 government emergency medical and pharmacy counter providing free essential medicines, ORS, and first aid.',
      status: 'Active',
      contactNumber: '108',
      image: '/shahi.jpg',
      timings: 'Open 24 Hours',
      facilities: ['24/7 Pharmacist', 'Free Essential Drugs', 'First Aid Trauma Kit', 'Ambulance Standby'],
      distance: '300 meters from Ghat Main Gate'
    },
    {
      _id: 'loc-18b',
      name: 'Trimbakeshwar Municipal Pharmacy & Medical Counter',
      category: 'Pharmacy',
      address: 'Temple Ring Road, Trimbakeshwar 422212',
      description: '24-hour medical supply counter stocked with emergency trauma supplies, pain relief, and hydration salts.',
      status: 'Active',
      contactNumber: '0253-2591244',
      image: '/dhwajarohan.webp',
      timings: 'Open 24 Hours',
      facilities: ['Free Medicines', 'Oxygen Cylinders', 'Doctor on Duty'],
      distance: '150 meters from Kushavarta Kund'
    },

    // --- PARKING ---
    {
      _id: 'loc-10',
      name: 'Tapovan Satellite Parking Hub A (तपोवन पार्किंग अ)',
      category: 'Parking',
      address: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
      description: 'Massive 50-acre parking lot capable of holding 25,000 tourist buses and cars. Connects to free electric shuttle buses.',
      status: 'Active',
      contactNumber: '0253-2578899',
      image: '/kumbh-bg1.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Free Electric Shuttles', 'EV Charging Stations', 'Driver Resting Bay', 'CCTV Security'],
      distance: '4.5 km from Ramkund'
    },
    {
      _id: 'loc-11',
      name: 'Adgaon Outer Highway Mega Parking Hub B',
      category: 'Parking',
      address: 'Mumbai-Agra NH3 Highway, Adgaon, Nashik 422003',
      description: 'Primary holding area for heavy vehicles and outstation tourist coaches arriving from Mumbai and Dhule highways.',
      status: 'Active',
      contactNumber: '0253-2578900',
      image: '/kumbh-bg.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Shuttle Terminal', 'Canteen', 'Restrooms', 'Security Patrol'],
      distance: '8 km North of City Center'
    },

    // --- POLICE / HELP CENTRE ---
    {
      _id: 'loc-9',
      name: 'Kumbh Central Police Control Room & Lost Person Desk',
      category: 'Police / Help Centre',
      address: 'Panchavati Police Station Compound, Nashik 422003',
      description: 'High-tech CCTV command monitoring center, lost & found assistance desk, RFID wristband registering for children and elderly.',
      status: 'Active',
      contactNumber: '112',
      image: '/shahi.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Lost & Found Registration', 'Public Announcement Systems', 'RFID Tagging Desk'],
      distance: '400 meters from Ghat Main Gate'
    },
    {
      _id: 'loc-9b',
      name: 'Trimbakeshwar Kumbh Security Post & Lost Found Desk',
      category: 'Police / Help Centre',
      address: 'Temple Main Ring Road, Trimbakeshwar 422212',
      description: 'Dedicated police command and family reunion center servicing pilgrims visiting Kushavarta Kund.',
      status: 'Active',
      contactNumber: '0253-2591244',
      image: '/dhwajarohan.webp',
      timings: 'Open 24 Hours',
      facilities: ['Family Reunion Lounge', 'Lost & Found Cell', 'Emergency Hotline Desk'],
      distance: '200 meters from Kushavarta Kund'
    },

    // --- POLICE & HELP DESKS ---
    {
      _id: 'loc-16',
      name: 'Ramkund Central Pilgrim Information Desk',
      category: 'Police / Help Centre',
      address: 'Ramkund Main Entrance, Panchavati, Nashik 422003',
      description: 'Official information booth providing free multilingual maps, Snan timing charts, lost person reporting, and shuttle bus schedules.',
      status: 'Active',
      contactNumber: '0253-2575555',
      image: '/goda-aarti-chatg.webp',
      timings: 'Open 24 Hours',
      facilities: ['Multilingual Staff', 'Free Printed Maps', 'Lost & Found Desk', 'Bus Timetables'],
      distance: 'At Ramkund Ghat Entrance'
    },
    {
      _id: 'loc-17',
      name: 'Nashik Road Railway Station Tourist & Kumbh Cell',
      category: 'Police / Help Centre',
      address: 'Platform 1 Exit, Nashik Road Railway Station 422101',
      description: '24/7 reception counter assisting arriving train passengers with free shuttle bus passes, maps, and camp directions.',
      status: 'Active',
      contactNumber: '0253-2465432',
      image: '/kumbh-bg1.jpg',
      timings: 'Open 24 Hours',
      facilities: ['Railway Special Train Charts', 'Shuttle Bus Tokens', 'Baggage Lockers'],
      distance: 'Nashik Road Station Main Exit'
    }
  ];

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
      rawList = [...rawList, ...defaultLocations];

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
      if (id) {
        await api.delete(`/locations/${id}`).catch(() => null);
        await api.delete(`/facilities/${id}`).catch(() => null);
      }

      const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
      if (id && !deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('kumbh_deleted_locations', JSON.stringify(deletedIds));
      }

      const customLocs = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
      const updatedCustom = customLocs.filter(item => item._id !== id && item.id !== id && item.name !== name);
      localStorage.setItem('kumbh_custom_locations', JSON.stringify(updatedCustom));

      setLocations(prev => prev.filter(item => item._id !== id && item.id !== id && item.name !== name));
      fetchLocations();
    } catch (err) {
      alert('Error deleting location card');
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
                  <label className="block font-semibold text-slate-700 text-xs mb-1.5">Location Card Image (Upload File or Enter URL)</label>
                  
                  {form.image ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group mb-2 bg-slate-900">
                      <img 
                        src={form.image} 
                        alt="Card Preview" 
                        className="w-full h-40 object-cover" 
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="cursor-pointer px-3.5 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-amber-600" />
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
                    <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
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

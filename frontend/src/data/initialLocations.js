// Master Initial Dataset for Nashik-Trimbakeshwar Kumbh Mela 2026-2027
export const defaultLocations = [
  // --- GHATS ---
  {
    _id: 'loc-1',
    id: 'loc-1',
    name: 'Ramkund Holy Bathing Ghat (रामकुंड पवित्र घाट)',
    category: 'Ghat',
    address: 'Panchavati, Nashik, Maharashtra 422003',
    location: 'Panchavati, Nashik, Maharashtra 422003',
    description: 'The central, most sacred bathing ghat on River Godavari where Lord Rama performed rituals. Primary site for royal Shahi Snan and evening Maha Aarti.',
    status: 'Active',
    contactNumber: '0253-2575555',
    image: '/shahi-snan.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Safety Netting', 'Life Guards', 'Clean Changing Rooms', 'Emergency Helpdesk'],
    distance: '2.5 km from CBS Bus Stand'
  },
  {
    _id: 'loc-2',
    id: 'loc-2',
    name: 'Kushavarta Kund (कुशावर्त कुंड - त्र्यंबकेश्वर)',
    category: 'Ghat',
    address: 'Trimbakeshwar Town, Nashik District 422212',
    location: 'Trimbakeshwar Town, Nashik District 422212',
    description: 'Sacred pond in Trimbakeshwar regarded as the symbolic origin of River Godavari. Holy bathing spot for Shaivite Naga Sadhus during Simhastha Kumbh.',
    status: 'Active',
    contactNumber: '0253-2591241',
    image: '/shahi-snan-for-kumbh-mela.webp',
    timings: '5:00 AM - 9:00 PM',
    facilities: ['Vedic Pandits', 'Changing Area', 'Water Filtration', 'Police Security'],
    distance: '28 km West of Nashik'
  },
  {
    _id: 'loc-3',
    id: 'loc-3',
    name: 'Laxman Ghat & Ahilya Ghat (लक्ष्मण घाट एवं अहिल्या घाट)',
    category: 'Ghat',
    address: 'Downstream Godavari River, Panchavati, Nashik 422003',
    location: 'Downstream Godavari River, Panchavati, Nashik 422003',
    description: 'Serene secondary bathing ghats ideal for ancestral Tarpan rituals and peaceful holy baths away from peak crowd congestion.',
    status: 'Active',
    contactNumber: '0253-2570001',
    image: '/68c4435662438-pitru-paksha-120221463-16x9.webp',
    timings: 'Open 24 Hours',
    facilities: ['Tarpan Pedestals', 'Drinking Water Station', 'Ramp Access'],
    distance: '2.8 km from City Center'
  },

  // --- TEMPLES ---
  {
    _id: 'loc-4',
    id: 'loc-4',
    name: 'Trimbakeshwar Jyotirlinga Temple (त्र्यंबकेश्वर ज्योतिर्लिंग)',
    category: 'Temple',
    address: 'Trimbak Town, Nashik District, Maharashtra 422212',
    location: 'Trimbak Town, Nashik District, Maharashtra 422212',
    description: 'One of the 12 sacred Jyotirlinga temples of Lord Shiva. Built of black basalt by Peshwa Balaji Baji Rao.',
    status: 'Active',
    contactNumber: '0253-2591241',
    image: '/dhwajarohan.webp',
    timings: '5:00 AM - 9:00 PM',
    facilities: ['VIP Pass Counter', 'Footwear Depot', 'Queue Complex', 'Wheelchair Facility'],
    distance: '28 km West of Nashik'
  },
  {
    _id: 'loc-5',
    id: 'loc-5',
    name: 'Kalaram Temple (कालाराम मंदिर - पंचवटी)',
    category: 'Temple',
    address: 'Panchavati, Nashik, Maharashtra 422003',
    location: 'Panchavati, Nashik, Maharashtra 422003',
    description: 'Historic 1788 temple housing a 2-foot black basalt idol of Lord Rama, Sita, and Lakshmana.',
    status: 'Active',
    contactNumber: '0253-2511108',
    image: '/img_20250206_1205497474678292145460306.webp',
    timings: '6:00 AM - 9:00 PM',
    facilities: ['Prasad Counter', 'Historical Information Desk', 'Spacious Courtyard'],
    distance: '3.0 km from CBS'
  },
  {
    _id: 'loc-6',
    id: 'loc-6',
    name: 'Sita Gufa & Panchavati Grove (सीता गुफा एवं पंचवटी)',
    category: 'Temple',
    address: 'Panchavati Sacred Grove, Nashik 422003',
    location: 'Panchavati Sacred Grove, Nashik 422003',
    description: 'Ancient cave near the 5 sacred Banyan trees (Panchavati) where Goddess Sita stayed during exile.',
    status: 'Active',
    contactNumber: '0253-2512200',
    image: '/nagarpradakshina.webp',
    timings: '6:00 AM - 8:00 PM',
    facilities: ['Guided Pilgrimage Path', 'Cooling Misting Fans', 'Souvenir Shops'],
    distance: '3.2 km from Nashik CBS'
  },

  // --- SHAHI SNAN ---
  {
    _id: 'loc-shahi-1',
    id: 'loc-shahi-1',
    name: 'First Amrit Shahi Snan (प्रथम अमृत शाही स्नान)',
    category: 'Shahi Snan',
    address: 'Ramkund Ghat & Godavari Promenade',
    location: 'Ramkund Ghat & Godavari Promenade',
    description: 'The first grand royal bath date of the Simhastha Kumbh. Thousands of Nagas and Mahant Sadhus process with silver palanquins and trumpets to take the celestial dip.',
    status: 'Active',
    contactNumber: '0253-2575555',
    image: '/shahi-snan.jpg',
    timings: '02 August 2027 • Starts 4:00 AM',
    facilities: ['Royal Procession Path', 'Vedic Chanting', 'Strict Security Cordon'],
    distance: 'Ramkund Main Ghat'
  },
  {
    _id: 'loc-shahi-2',
    id: 'loc-shahi-2',
    name: 'Second Main Amrit Shahi Snan (द्वितीय अमृत शाही स्नान)',
    category: 'Shahi Snan',
    address: 'Ramkund Ghats & Kushavarta Kund',
    location: 'Ramkund Ghats & Kushavarta Kund',
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
    id: 'loc-ritual-0',
    name: 'Dhwajarohan (ध्वजारोहण) - Official Commencement',
    category: 'Ritual Guide',
    address: 'Ramkund Ghat & Kushavarta Kund',
    location: 'Ramkund Ghat & Kushavarta Kund',
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
    id: 'loc-ritual-1',
    name: 'Godavari Maha Aarti & Deep Daan (गोदावरी महाआरती)',
    category: 'Ritual Guide',
    address: 'Ramkund Riverfront Promenade',
    location: 'Ramkund Riverfront Promenade',
    description: 'Experience the mesmerizing evening Godavari Aarti where Vedic priests wave large multi-tiered brass oil lamps, accompanied by temple bells and floating flower diyas.',
    status: 'Active',
    contactNumber: '0253-2575555',
    image: '/goda-aarti-chatg.webp',
    timings: 'Every Evening at Sunset (6:30 PM)',
    facilities: ['Multi-tiered Lamps', 'Floating Diyas', 'Senior Citizen Seating'],
    distance: 'Ramkund Promenade'
  },

  // --- AKHARAS ---
  {
    _id: 'loc-akhara-1',
    id: 'loc-akhara-1',
    name: 'Shaivite Akharas (शैव अखाड़े) - Juna, Niranjani & Mahanirvani',
    category: 'Akharas',
    address: 'Trimbakeshwar & Tapovan Sector 1',
    location: 'Trimbakeshwar & Tapovan Sector 1',
    description: 'The ancient Shaivite monastic orders led by Naga Sadhus who renounce worldly life and meditate on Lord Shiva.',
    status: 'Active',
    contactNumber: '0253-2575555',
    image: '/shahi.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Naga Sadhu Processions', 'Trishul Demonstrations', 'Satsang Halls'],
    distance: 'Tapovan & Trimbakeshwar'
  },

  // --- ACCOMMODATION ---
  {
    _id: 'loc-acc-1',
    id: 'loc-acc-1',
    name: 'Tapovan Sadhugram Pilgrim Tent City (तपोवन साधुग्राम टेंट सिटी)',
    category: 'Accommodation',
    address: 'Tapovan, Nashik, Maharashtra 422003',
    location: 'Tapovan, Nashik, Maharashtra 422003',
    description: 'World-famous sprawling tent township housing thousands of Sadhus, Akhara leaders, Mahants, and international devotees.',
    status: 'Active',
    contactNumber: '0253-2571000',
    image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
    timings: 'Open 24 Hours',
    facilities: ['Free Pilgrim Tents', 'Satsang Halls', 'Security Patrol', 'Medical Booths'],
    distance: '3.5 km East of Ramkund'
  },

  // --- FOOD AREA ---
  {
    _id: 'loc-14',
    id: 'loc-14',
    name: 'Tapovan Annadan & Food Arena (तपोवन अन्नछत्र)',
    category: 'Food Area',
    address: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
    location: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
    description: 'Massive community dining hall serving fresh, wholesome, pure vegetarian Mahaprasad free of cost to over 100,000 pilgrims daily.',
    status: 'Active',
    contactNumber: '0253-2572211',
    image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
    timings: '7:00 AM - 10:30 PM',
    facilities: ['Free Mahaprasad', 'Clean Water', 'Shaded Seating'],
    distance: 'Tapovan Sadhugram'
  },

  // --- DRINKING WATER ---
  {
    _id: 'loc-12',
    id: 'loc-12',
    name: 'Ramkund RO Water Dispensing Station #1',
    category: 'Drinking Water',
    address: 'Ramkund Upper Bridge Promenade, Nashik 422003',
    location: 'Ramkund Upper Bridge Promenade, Nashik 422003',
    description: 'High-capacity RO purified drinking water fountain serving cold and ambient drinking water continuously.',
    status: 'Active',
    contactNumber: '0253-2570004',
    image: '/goda-aarti-chatg.webp',
    timings: 'Open 24 Hours',
    facilities: ['RO Purified', 'Chilled Water Fountains', 'Zero Plastic Bottling Station'],
    distance: 'At Ramkund Ghat Entrance'
  },

  // --- TOILET ---
  {
    _id: 'loc-13',
    id: 'loc-13',
    name: 'Panchavati Deluxe Smart Sanitation Block #1',
    category: 'Toilet',
    address: 'Panchavati Temple Road, Nashik 422003',
    location: 'Panchavati Temple Road, Nashik 422003',
    description: 'Eco-friendly, continuously disinfected smart public restroom complex with handicap accessible ramps.',
    status: 'Active',
    contactNumber: '0253-2570006',
    image: '/kumbh-bg.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Separate Male/Female Blocks', 'Wheelchair Accessible', 'Continuous Sanitization'],
    distance: '150 meters from Kalaram Temple'
  },

  // --- PHARMACY ---
  {
    _id: 'loc-pharma-1',
    id: 'loc-pharma-1',
    name: 'Kumbh 24/7 Generic Jan Aushadhi Pharmacy Post',
    category: 'Pharmacy',
    address: 'Ramkund Main Entrance Promenade, Nashik 422003',
    location: 'Ramkund Main Entrance Promenade, Nashik 422003',
    description: 'Government subsidised pharmacy dispensing essential emergency medicines, ORS packets, and first-aid supplies round the clock.',
    status: 'Active',
    contactNumber: '104',
    image: '/shahi-snan.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Generic Medicines', 'First-Aid Kits', 'ORS Packets', 'BP Check'],
    distance: 'Ramkund Gate'
  },

  // --- PARKING ---
  {
    _id: 'loc-7',
    id: 'loc-7',
    name: 'Tapovan Satellite Highway Mega Parking Hub A',
    category: 'Parking',
    address: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
    location: 'Nashik-Aurangabad Highway, Tapovan, Nashik 422003',
    description: 'Sprawling 50-acre satellite holding area for 25,000 private vehicles and outstation tourist buses.',
    status: 'Active',
    contactNumber: '0253-2578899',
    image: '/kumbh-bg1.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Free Electric Shuttles', 'CCTV Security', 'EV Charging Posts'],
    distance: '4.5 km East of Ramkund'
  },

  // --- POLICE / HELP CENTRE ---
  {
    _id: 'loc-9',
    id: 'loc-9',
    name: 'Kumbh Central Police Control Room & Lost Person Desk',
    category: 'Police / Help Centre',
    address: 'Panchavati Police Station Compound, Nashik 422003',
    location: 'Panchavati Police Station Compound, Nashik 422003',
    description: 'High-tech CCTV command monitoring center, lost & found assistance desk, RFID wristband registering for children and elderly.',
    status: 'Active',
    contactNumber: '112',
    image: '/shahi.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Lost & Found Registration', 'Public Announcement Systems', 'RFID Tagging Desk'],
    distance: '400 meters from Ghat Main Gate'
  },

  // --- TRANSPORT ---
  {
    _id: 'loc-trans-1',
    id: 'loc-trans-1',
    name: 'Central Kumbh Electric Shuttle Bus Terminal',
    category: 'Transport',
    address: 'Outer Ring Road Terminal Hub, Nashik 422004',
    location: 'Outer Ring Road Terminal Hub, Nashik 422004',
    description: '24/7 zero-emission electric shuttle fleet connecting outer satellite parking hubs directly to inner Ramkund and Tapovan drop points.',
    status: 'Active',
    contactNumber: '0253-2570009',
    image: '/kumbh-bg1.jpg',
    timings: 'Continuous 24/7 Shuttle Frequency',
    facilities: ['100% Electric Fleet', 'Zero Pilgrim Fare', 'Low-Floor Accessibility', 'Dedicated Traffic Lane'],
    distance: 'Outer Satellite Ring Road'
  }
];

export default defaultLocations;

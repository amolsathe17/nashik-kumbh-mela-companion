// Master Synchronized Baseline Dataset & Category Matching Engine for Nashik-Trimbakeshwar Kumbh Mela 2026-2027
export const DATA_VERSION = 'v4.0_FULL_SYNC_CATEGORIES';

export const defaultLocations = [
  // --- GHATS (4 Main Bathing Ghats) ---
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
    timings: 'Open 24 Hours (Holy Dip 4:00 AM - 10:00 PM)',
    facilities: ['Safety Netting', 'Life Guards', 'Clean Changing Rooms', 'Emergency Helpdesk'],
    distance: '2.5 km from Nashik CBS Bus Stand'
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
  {
    _id: 'loc-3b',
    id: 'loc-3b',
    name: 'Takli Sangam Ghat (टाकळी संगम घाट)',
    category: 'Ghat',
    address: 'Takli, Confluence of Godavari & Kapila Rivers, Nashik',
    location: 'Takli, Confluence of Godavari & Kapila Rivers, Nashik',
    description: 'Holy confluence of Godavari and Kapila rivers where Samarth Ramdas Swami meditated for 12 years. Reserved for quiet pilgrim dips.',
    status: 'Active',
    contactNumber: '0253-2570002',
    image: '/goda-aarti-chatg.webp',
    timings: '6:00 AM - 8:00 PM',
    facilities: ['Riverfront Promenade', 'Ramp Walkway', 'Lighting Posts'],
    distance: '4.2 km from Ramkund'
  },

  // --- TEMPLES (6 Main Sacred Temples) ---
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
  {
    _id: 'loc-6b',
    id: 'loc-6b',
    name: 'Muktidham Marble Temple (मुक्तिधाम मंदिर - नाशिक रोड)',
    category: 'Temple',
    address: 'Nashik Road, Nashik, Maharashtra 422101',
    location: 'Nashik Road, Nashik, Maharashtra 422101',
    description: 'Famous white marble temple complex replicating all 12 Jyotirlingas with 18 chapters of Bhagavad Gita carved on its walls.',
    status: 'Active',
    contactNumber: '0253-2461150',
    image: '/kumbh-bg.jpg',
    timings: '6:00 AM - 9:00 PM',
    facilities: ['Pilgrim Dharamshala', 'Pure Veg Canteen', 'Large Parking'],
    distance: '1.5 km from Nashik Road Station'
  },
  {
    _id: 'loc-6c',
    id: 'loc-6c',
    name: 'Kapaleshwar Temple (कपालेश्वर मंदिर - पंचवटी)',
    category: 'Temple',
    address: 'Panchavati, Opposite Ramkund, Nashik 422003',
    location: 'Panchavati, Opposite Ramkund, Nashik 422003',
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
    id: 'loc-6d',
    name: 'Someshwar Temple & Waterfall (सोमेश्वर मंदिर एवं धबधबा)',
    category: 'Temple',
    address: 'Gangapur Road, Someshwar, Nashik 422013',
    location: 'Gangapur Road, Someshwar, Nashik 422013',
    description: 'Picturesque Lord Shiva temple situated on the banks of Godavari river near a natural waterfall, surrounded by lush green hills.',
    status: 'Active',
    contactNumber: '0253-2341100',
    image: '/kumbh-bg1.jpg',
    timings: '6:00 AM - 8:30 PM',
    facilities: ['River Ghats', 'Boating Facility', 'Garden Walkway', 'Parking Lot'],
    distance: '7 km West of Panchavati'
  },

  // --- ACCOMMODATION (5 Pilgrim Accommodations) ---
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
  {
    _id: 'loc-acc-2',
    id: 'loc-acc-2',
    name: 'Panchavati Yatri Niwas & Pilgrim Lodge (पंचवटी यात्री निवास)',
    category: 'Accommodation',
    address: 'Sardar Patel Road, Panchavati, Nashik 422003',
    location: 'Sardar Patel Road, Panchavati, Nashik 422003',
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
    id: 'loc-acc-3',
    name: 'Trimbakeshwar Bhakta Niwas & Ashram Complex (त्रिंबकेश्वर भक्त निवास)',
    category: 'Accommodation',
    address: 'Near Kushavarta Kund, Trimbakeshwar 422212',
    location: 'Near Kushavarta Kund, Trimbakeshwar 422212',
    description: 'Spiritual rest house complex with clean dormitory halls and family rooms near Kushavarta Kund.',
    status: 'Active',
    contactNumber: '02594-233215',
    image: '/dhwajarohan.webp',
    timings: 'Open 24 Hours',
    facilities: ['Family Rooms', 'Attached Bathrooms', 'Subsidized Meals'],
    distance: '500m from Kushavarta'
  },
  {
    _id: 'loc-acc-4',
    id: 'loc-acc-4',
    name: 'Tapovan Sector 3 Sadhu Camp Township (तपोवन साधुग्राम शिविर 3)',
    category: 'Accommodation',
    address: 'Tapovan Sector 3, Nashik 422003',
    location: 'Tapovan Sector 3, Nashik 422003',
    description: 'Special Akhara guest tenting complex offering community dining, charging points, and 24-hour security.',
    status: 'Active',
    contactNumber: '0253-2571002',
    image: '/nagarpradakshina.webp',
    timings: 'Open 24 Hours',
    facilities: ['Community Tents', 'Clean Bedding', 'Security Guard', 'Pure Drinking Water'],
    distance: '3.8 km East of Ramkund'
  },
  {
    _id: 'loc-acc-5',
    id: 'loc-acc-5',
    name: 'Kumbh Mela Deluxe Tourist Tent City Hub',
    category: 'Accommodation',
    address: 'Gangapur Road, Nashik 422013',
    location: 'Gangapur Road, Nashik 422013',
    description: 'Premium air-conditioned tent township equipped with private bath facilities, dining pavilion, and cultural event arena.',
    status: 'Active',
    contactNumber: '0253-2345678',
    image: '/kumbh-bg.jpg',
    timings: 'Check-in 12:00 PM',
    facilities: ['AC Deluxe Tents', 'Private Bath', 'Buffet Breakfast', 'Cultural Stage'],
    distance: '6.5 km from Panchavati'
  },

  // --- FOOD AREA (4 Community Kitchens & Prasadam Centers) ---
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
  {
    _id: 'loc-15',
    id: 'loc-15',
    name: 'Ramkund Maha Aarti Prasadam Center (रामकुंड महाप्रसाद केंद्र)',
    category: 'Food Area',
    address: 'Ramkund Upper Promenade, Panchavati 422003',
    location: 'Ramkund Upper Promenade, Panchavati 422003',
    description: 'Official prasad distribution center serving fresh traditional sweets and packed water.',
    status: 'Active',
    contactNumber: '0253-2570001',
    image: '/goda-aarti-chatg.webp',
    timings: '6:00 AM - 9:30 PM',
    facilities: ['Packed Prasadam Boxes', 'Desi Ghee Sweets', 'Clean Counter'],
    distance: 'At Ramkund Gate'
  },
  {
    _id: 'loc-15b',
    id: 'loc-15b',
    name: 'Panchavati ISKCON Mahaprasad Dining Hall',
    category: 'Food Area',
    address: 'Panchavati Temple Area, Nashik 422003',
    location: 'Panchavati Temple Area, Nashik 422003',
    description: 'Hygienic pure vegetarian prasadam serving nutritious meals to visiting devotees continuously.',
    status: 'Active',
    contactNumber: '0253-2511234',
    image: '/shahi-snan.jpg',
    timings: '8:00 AM - 10:00 PM',
    facilities: ['Pure Veg Meals', 'Clean Dining Hall', 'Purified Water'],
    distance: 'Panchavati Center'
  },
  {
    _id: 'loc-15c',
    id: 'loc-15c',
    name: 'Trimbakeshwar Free Community Kitchen (अन्नपूर्णा अन्नछत्र)',
    category: 'Food Area',
    address: 'Kushavarta Road, Trimbakeshwar 422212',
    location: 'Kushavarta Road, Trimbakeshwar 422212',
    description: 'Charitable trust food center distributing free meals, tea, and breakfast to all pilgrims.',
    status: 'Active',
    contactNumber: '02594-233100',
    image: '/dhwajarohan.webp',
    timings: '6:00 AM - 11:00 PM',
    facilities: ['Free Hot Meals', 'Tea & Snacks', 'Seating Benches'],
    distance: 'Near Kushavarta'
  },

  // --- TOILET (4 Sanitation Complexes) ---
  {
    _id: 'loc-13',
    id: 'loc-13',
    name: 'Panchavati Deluxe Smart Sanitation Block #1 (पंचवटी स्मार्ट शौचालय)',
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
  {
    _id: 'loc-13b',
    id: 'loc-13b',
    name: 'Ramkund Riverfront Mobile Sanitation Complex #2 (रामकुंड मोबाईल शौचालय)',
    category: 'Toilet',
    address: 'Downstream Promenade, Ramkund, Nashik 422003',
    location: 'Downstream Promenade, Ramkund, Nashik 422003',
    description: '24-bay high capacity bio-toilet block with running water and dedicated cleaning crew.',
    status: 'Active',
    contactNumber: '0253-2570007',
    image: '/kumbh-bg1.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Running Water Taps', 'Handwash Counters', 'Janitor Desk'],
    distance: '200 meters from Ramkund'
  },
  {
    _id: 'loc-13c',
    id: 'loc-13c',
    name: 'Tapovan Sadhugram Sanitation Station #3 (तपोवन साधुग्राम स्वच्छता गृह)',
    category: 'Toilet',
    address: 'Sector 1 Main Ring Road, Tapovan 422003',
    location: 'Sector 1 Main Ring Road, Tapovan 422003',
    description: 'High capacity public sanitation complex equipped with hot water shower bays for pilgrims.',
    status: 'Active',
    contactNumber: '0253-2570008',
    image: '/nagarpradakshina.webp',
    timings: 'Open 24 Hours',
    facilities: ['Hot Water Showers', 'Disinfected Hourly', 'Hand Sanitizer Kiosks'],
    distance: 'Tapovan Sadhugram'
  },
  {
    _id: 'loc-13d',
    id: 'loc-13d',
    name: 'Trimbakeshwar Kushavarta Smart Sanitation Complex #4',
    category: 'Toilet',
    address: 'Temple Outer Ring Road, Trimbakeshwar 422212',
    location: 'Temple Outer Ring Road, Trimbakeshwar 422212',
    description: 'Modern public restroom block servicing pilgrims visiting Kushavarta Bathing Kund.',
    status: 'Active',
    contactNumber: '02594-233215',
    image: '/shahi-snan-for-kumbh-mela.webp',
    timings: 'Open 24 Hours',
    facilities: ['Clean Water Flush', 'Wheelchair Access', 'Baby Care Desk'],
    distance: '100m from Kushavarta'
  },

  // --- DRINKING WATER (3 RO Stations) ---
  {
    _id: 'loc-12',
    id: 'loc-12',
    name: 'Ramkund RO Water Dispensing Station #1 (रामकुंड शुध्द जल केंद्र)',
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
  {
    _id: 'loc-12b',
    id: 'loc-12b',
    name: 'Tapovan Sadhugram RO Water Distribution Hub #2',
    category: 'Drinking Water',
    address: 'Sector 3 Main Avenue, Tapovan, Nashik 422003',
    location: 'Sector 3 Main Avenue, Tapovan, Nashik 422003',
    description: 'Solar-powered 10,000 LPH filtration kiosk providing clean drinking water for pilgrim camps.',
    status: 'Active',
    contactNumber: '0253-2570005',
    image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
    timings: 'Open 24 Hours',
    facilities: ['Solar RO Filtration', 'Touchless Taps', 'Cold Water'],
    distance: 'Inside Tapovan City'
  },
  {
    _id: 'loc-12c',
    id: 'loc-12c',
    name: 'Trimbakeshwar Kushavarta RO Drinking Kiosk #3',
    category: 'Drinking Water',
    address: 'Main Promenade, Trimbakeshwar Temple Road 422212',
    location: 'Main Promenade, Trimbakeshwar Temple Road 422212',
    description: 'High-speed clean drinking water taps continuously serviced during peak holy bath hours.',
    status: 'Active',
    contactNumber: '0253-2591241',
    image: '/shahi-snan-for-kumbh-mela.webp',
    timings: 'Continuous 24/7',
    facilities: ['RO Water', 'Touchless Taps', 'Cold Water Dispenser'],
    distance: '100m from Kushavarta Kund'
  },

  // --- PHARMACY (3 Generic Pharmacies) ---
  {
    _id: 'loc-pharma-1',
    id: 'loc-pharma-1',
    name: 'Kumbh 24/7 Generic Jan Aushadhi Pharmacy Post (नाशिक जन औषधि केंद्र)',
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
  {
    _id: 'loc-pharma-2',
    id: 'loc-pharma-2',
    name: 'Trimbakeshwar Municipal Emergency Pharmacy Counter',
    category: 'Pharmacy',
    address: 'Temple Ring Road, Trimbakeshwar 422212',
    location: 'Temple Ring Road, Trimbakeshwar 422212',
    description: '24-hour medical supply counter stocked with emergency trauma supplies, pain relief, and hydration salts.',
    status: 'Active',
    contactNumber: '0253-2591244',
    image: '/dhwajarohan.webp',
    timings: 'Open 24 Hours',
    facilities: ['Free Medicines', 'Oxygen Cylinders', 'Doctor on Duty'],
    distance: '150 meters from Kushavarta Kund'
  },
  {
    _id: 'loc-pharma-3',
    id: 'loc-pharma-3',
    name: 'Tapovan Sadhugram Sector 1 Medical & Pharmacy Kiosk',
    category: 'Pharmacy',
    address: 'Tapovan Sector 1 Entrance, Nashik 422003',
    location: 'Tapovan Sector 1 Entrance, Nashik 422003',
    description: 'First aid post dispensing essential prescription and OTC remedies for arriving sadhus and pilgrims.',
    status: 'Active',
    contactNumber: '0253-2571005',
    image: '/shahi.jpg',
    timings: 'Open 24 Hours',
    facilities: ['First Aid Desk', 'Emergency Ambulance Point', 'Essential Drugs'],
    distance: 'Tapovan Sector 1'
  },

  // --- PARKING (3 Highway Mega Parking Hubs) ---
  {
    _id: 'loc-7',
    id: 'loc-7',
    name: 'Tapovan Satellite Highway Mega Parking Hub A (तपोवन पार्किंग अ)',
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
  {
    _id: 'loc-8',
    id: 'loc-8',
    name: 'Adgaon Outer Highway Mega Parking Hub B (आडगाव पार्किंग ब)',
    category: 'Parking',
    address: 'Mumbai-Agra NH3 Highway, Adgaon, Nashik 422003',
    location: 'Mumbai-Agra NH3 Highway, Adgaon, Nashik 422003',
    description: 'Primary holding area for heavy vehicles and outstation tourist coaches arriving from Mumbai and Dhule highways.',
    status: 'Active',
    contactNumber: '0253-2578900',
    image: '/kumbh-bg.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Shuttle Terminal', 'Canteen', 'Restrooms', 'Security Patrol'],
    distance: '8 km North of City Center'
  },
  {
    _id: 'loc-8b',
    id: 'loc-8b',
    name: 'Trimbakeshwar Highway Outer Satellite Parking Hub C',
    category: 'Parking',
    address: 'Nashik-Trimbak Highway Entry Gate, Trimbakeshwar 422212',
    location: 'Nashik-Trimbak Highway Entry Gate, Trimbakeshwar 422212',
    description: 'Large parking bay for private cars visiting Kushavarta Kund and Trimbakeshwar temple.',
    status: 'Active',
    contactNumber: '0253-2591244',
    image: '/dhwajarohan.webp',
    timings: 'Open 24 Hours',
    facilities: ['Shuttle Bus Terminal', 'Rest Bays', 'Drinking Water'],
    distance: '3 km from Trimbakeshwar Temple'
  },

  // --- POLICE / HELP CENTRE (3 Command Posts) ---
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
  {
    _id: 'loc-9b',
    id: 'loc-9b',
    name: 'Trimbakeshwar Kumbh Security Post & Lost Found Desk',
    category: 'Police / Help Centre',
    address: 'Temple Main Ring Road, Trimbakeshwar 422212',
    location: 'Temple Main Ring Road, Trimbakeshwar 422212',
    description: 'Dedicated police command and family reunion center servicing pilgrims visiting Kushavarta Kund.',
    status: 'Active',
    contactNumber: '0253-2591244',
    image: '/dhwajarohan.webp',
    timings: 'Open 24 Hours',
    facilities: ['Family Reunion Lounge', 'Lost & Found Cell', 'Emergency Hotline Desk'],
    distance: '200 meters from Kushavarta Kund'
  },
  {
    _id: 'loc-16',
    id: 'loc-16',
    name: 'Ramkund Central Pilgrim Information & Help Desk',
    category: 'Police / Help Centre',
    address: 'Ramkund Main Entrance, Panchavati, Nashik 422003',
    location: 'Ramkund Main Entrance, Panchavati, Nashik 422003',
    description: 'Official information booth providing free multilingual maps, Snan timing charts, lost person reporting, and shuttle bus schedules.',
    status: 'Active',
    contactNumber: '0253-2575555',
    image: '/goda-aarti-chatg.webp',
    timings: 'Open 24 Hours',
    facilities: ['Multilingual Staff', 'Free Printed Maps', 'Lost & Found Desk', 'Bus Timetables'],
    distance: 'At Ramkund Ghat Entrance'
  },

  // --- TRANSPORT (3 Transit Terminals) ---
  {
    _id: 'loc-trans-1',
    id: 'loc-trans-1',
    name: 'Central Kumbh Electric Shuttle Bus Terminal (नाशिक रोड इलेक्‍ट्रिक बस)',
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
  },
  {
    _id: 'loc-trans-2',
    id: 'loc-trans-2',
    name: 'Nashik Central CBS Bus Depot Transit Terminal (नाशिक मध्यवर्ती बस स्थानक)',
    category: 'Transport',
    address: 'CBS Circle, Shalimar, Nashik 422001',
    location: 'CBS Circle, Shalimar, Nashik 422001',
    description: 'Central MSRTC transport interchange hub with non-stop express buses running to Trimbakeshwar Jyotirlinga, Tapovan Tent City, and highways.',
    status: 'Active',
    contactNumber: '0253-2575555',
    image: '/kumbh-bg.jpg',
    timings: 'Continuous 24/7 Departure',
    facilities: ['Non-Stop Express Shuttles', 'Passenger Rest Waiting Hall', 'Multilingual Helpdesk', 'RO Water Dispensers'],
    distance: '2.2 km from Ramkund Ghat'
  },
  {
    _id: 'loc-trans-3',
    id: 'loc-trans-3',
    name: 'Tapovan Express Electric Bus Ring Corridor (तपोवन इलेक्ट्रिक बस मार्ग)',
    category: 'Transport',
    address: 'Tapovan Sector 1 Shuttle Station, Nashik 422003',
    location: 'Tapovan Sector 1 Shuttle Station, Nashik 422003',
    description: 'Zero-emission electric shuttle corridor connecting outer satellite parking terminals to Ramkund bathing ghats during peak Shahi Snan days.',
    status: 'Active',
    contactNumber: '0253-2578899',
    image: '/shahi-snan.jpg',
    timings: '4:00 AM - 11:30 PM (Peak Frequencies)',
    facilities: ['100% Electric Fleet', 'Zero Pilgrim Fare', 'Low-Floor Accessibility', 'Dedicated Traffic Lane'],
    distance: 'Direct Express Route to Ghats'
  },

  // --- SHAHI SNAN DATES ---
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
  {
    _id: 'loc-ritual-2',
    id: 'loc-ritual-2',
    name: 'Trimbakeshwar Jyotirlinga Darshan Protocol',
    category: 'Ritual Guide',
    address: 'Trimbakeshwar Temple Complex',
    location: 'Trimbakeshwar Temple Complex',
    description: 'Guidelines for visiting the 10th-century black stone temple housing the unique three-faced Lingam representing Brahma, Vishnu, and Shiva.',
    status: 'Active',
    contactNumber: '02594-233215',
    image: '/dhwajarohan.webp',
    timings: '5:00 AM - 9:00 PM',
    facilities: ['E-pass Queuing', 'Footwear Stalls', 'Traditional Dress Code'],
    distance: 'Trimbakeshwar Town'
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
  {
    _id: 'loc-akhara-2',
    id: 'loc-akhara-2',
    name: 'Vaishnavite Akharas (वैष्णव अखाड़े) - Nirmohi, Digambar & Nirvani Ani',
    category: 'Akharas',
    address: 'Tapovan Sadhugram & Panchavati Promenade',
    location: 'Tapovan Sadhugram & Panchavati Promenade',
    description: 'The three prominent Vaishnavite Ani Akharas dedicated to Lord Vishnu and Lord Rama, renowned for their grand holy processions.',
    status: 'Active',
    contactNumber: '0253-2575555',
    image: '/unnamed-2025-02-03t105950ss_1738561979.jpg',
    timings: 'Open 24 Hours',
    facilities: ['Silver Chariots', 'Ram Katha', 'Mahaprasadam Distribution'],
    distance: 'Tapovan Sadhugram'
  }
];

/**
 * Universal Category Matching Engine across all Admin and Visitor Pages
 */
export const matchCategory = (itemCat, targetCat) => {
  if (!targetCat || targetCat === 'All') return true;
  if (!itemCat) return false;

  const normalize = (catStr) => {
    const s = String(catStr || '').trim().toLowerCase();
    if (s.includes('ghat')) return 'ghat';
    if (s.includes('temple') || s.includes('mandir')) return 'temple';
    if (s.includes('toilet') || s.includes('sanitation') || s.includes('washroom') || s.includes('restroom') || s.includes('swachh')) return 'toilet';
    if (s.includes('water') || s.includes('jal') || s.includes('ro')) return 'drinking water';
    if (s.includes('food') || s.includes('annadan') || s.includes('annachhatra') || s.includes('meal') || s.includes('prasad') || s.includes('canteen')) return 'food area';
    if (s.includes('police') || s.includes('help') || s.includes('control') || s.includes('desk') || s.includes('info')) return 'police / help centre';
    if (s.includes('camp') || s.includes('accommodation') || s.includes('tent') || s.includes('yatri niwas') || s.includes('lodge') || s.includes('dharamshala') || s.includes('bhakta niwas') || s.includes('hotel') || s.includes('resort')) return 'accommodation';
    if (s.includes('parking') || s.includes('park')) return 'parking';
    if (s.includes('pharmacy') || s.includes('medical') || s.includes('chemist') || s.includes('aushadhi') || s.includes('drug')) return 'pharmacy';
    if (s.includes('transport') || s.includes('shuttle') || s.includes('bus') || s.includes('railway') || s.includes('transit') || s.includes('auto')) return 'transport';
    if (s.includes('shahi') || s.includes('snan')) return 'shahi snan';
    if (s.includes('ritual') || s.includes('guide') || s.includes('tradition')) return 'ritual guide';
    if (s.includes('akhara') || s.includes('sadhu')) return 'akharas';
    return s;
  };

  return normalize(itemCat) === normalize(targetCat);
};

export const getMergedLocations = () => {
  const currentVer = localStorage.getItem('kumbh_data_version');
  let customLocs = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
  const deletedIds = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');

  // Force-reset storage when DATA_VERSION changes to guarantee 100% sync between Local & Online
  if (currentVer !== DATA_VERSION) {
    try {
      localStorage.setItem('kumbh_data_version', DATA_VERSION);
      localStorage.removeItem('kumbh_deleted_locations');
      
      // Preserve only newly created admin cards (non-default cards)
      const defaultIds = new Set(defaultLocations.map(d => String(d._id || d.id)));
      const customCreatedCards = customLocs.filter(c => c && !defaultIds.has(String(c._id || c.id)));

      customLocs = [...defaultLocations, ...customCreatedCards];
      localStorage.setItem('kumbh_custom_locations', JSON.stringify(customLocs));
      return customLocs;
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }

  if (!customLocs || customLocs.length === 0) {
    customLocs = [...defaultLocations];
    localStorage.setItem('kumbh_custom_locations', JSON.stringify(customLocs));
  }

  return customLocs.filter(loc => loc && !deletedIds.includes(loc._id) && !deletedIds.includes(loc.id));
};

export default defaultLocations;

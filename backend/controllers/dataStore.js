// Initial seed data for Nashik Kumbh Mela

const memoryStore = {
  dailyInfo: [
    {
      _id: 'daily-1',
      date: new Date().toISOString().split('T')[0],
      title: "Today's Nashik Kumbh Mela Highlights",
      description: "Welcome to Nashik Kumbh Mela. Special holy dip arrangements are active at Ramkund and Trimbakeshwar.",
      programmes: [
        { time: '05:00 AM', title: 'Morning Aarti & Mangal Snan', location: 'Ramkund Ghat', description: 'Grand morning prayers and auspicious bathing rituals.' },
        { time: '10:30 AM', title: 'Pravachan by Revered Saints', location: 'Sadhugram Tapovan', description: 'Spiritual discourses and blessings from Akhada leaders.' },
        { time: '06:30 PM', title: 'Maha Ganga Aarti', location: 'Godavari Ghat Panchavati', description: 'Illuminated lamp offering ceremony along the Godavari river.' }
      ],
      importantLocations: ['Ramkund Ghat', 'Trimbakeshwar Temple', 'Panchavati', 'Tapovan Sadhugram'],
      travelAdvisories: [
        'Outer Ring Road parking mandatory for heavy vehicles.',
        'Electric shuttle buses running every 5 mins from Tapovan hub.'
      ],
      safetyAdvisories: [
        'Keep elderly and children registered at RFID assistance centers.',
        'Use designated bathing areas with safety netting.'
      ],
      officialNotes: 'Emergency medical desks are stationed every 500 meters along main bathing routes.',
      status: 'Published',
      languageVersions: {
        hi: { title: "आज का नासिक कुंभ मेला समाचार", description: "रामकुंड एवं त्र्यंबकेश्वर में पवित्र स्नान की विशेष व्यवस्था की गई है।" },
        mr: { title: "आजची नाशिक कुंभमेळा माहिती", description: "रामकुंड आणि त्र्यंबकेश्वर येथे पवित्र स्नानाची विशेष सोय करण्यात आली आहे." }
      }
    }
  ],

  announcements: [
    {
      _id: 'ann-1',
      title: 'Shahi Snan Route Advisories Active',
      message: 'Pedestrian flow management active around Panchavati. Please follow police green corridors.',
      category: 'Safety Advisories',
      priority: 'High',
      status: 'Published',
      publishedAt: new Date().toISOString()
    },
    {
      _id: 'ann-2',
      title: 'Free Electric Shuttles from Outer Parking',
      message: '200 eco-friendly electric shuttles deployed for free pilgrim transit from Tapovan Parking Lot A.',
      category: 'Travel Updates',
      priority: 'Normal',
      status: 'Published',
      publishedAt: new Date().toISOString()
    }
  ],

  notifications: [
    {
      _id: 'notif-1',
      title: 'Today\'s Nashik Kumbh Guide Updated',
      message: 'Check today\'s Shahi Snan schedules, shuttle routes, and weather updates.',
      category: 'Daily Kumbh Information',
      destinationPage: '/todays-kumbh',
      targetLanguage: 'All',
      status: 'Sent',
      sentAt: new Date().toISOString(),
      deliveryStats: { targetCount: 14500, deliveredCount: 14210 }
    }
  ],

  locations: [
    {
      _id: 'loc-1',
      name: 'Ramkund Holy Ghat',
      category: 'Ghat',
      coordinates: { lat: 20.0063, lng: 73.7915 },
      address: 'Panchavati, Nashik, Maharashtra 422003',
      description: 'Central holy bathing ghat on the bank of River Godavari where Lord Rama performed rituals.',
      status: 'Active',
      verified: true,
      contactNumber: '0253-2575555'
    },
    {
      _id: 'loc-2',
      name: 'Trimbakeshwar Jyotirlinga Temple',
      category: 'Temple',
      coordinates: { lat: 19.9324, lng: 73.5307 },
      address: 'Trimbak, Nashik District, Maharashtra 422212',
      description: 'One of the 12 sacred Jyotirlingas, origin of River Godavari.',
      status: 'Active',
      verified: true,
      contactNumber: '0253-2591241'
    },
    {
      _id: 'loc-3',
      name: 'Tapovan Sadhugram Camp Area',
      category: 'Camp/Accommodation',
      coordinates: { lat: 20.0105, lng: 73.8050 },
      address: 'Tapovan, Nashik, Maharashtra',
      description: 'Main sadhu encampment and spiritual tents complex during Kumbh Mela.',
      status: 'Active',
      verified: true
    },
    {
      _id: 'loc-4',
      name: 'Central Pilgrim Medical Centre & Helpdesk',
      category: 'Medical Centre',
      coordinates: { lat: 20.0040, lng: 73.7880 },
      address: 'Near CBS Bus Stand, Nashik',
      description: '24/7 Multi-specialty medical aid, emergency trauma unit, and lost person assistance.',
      status: 'Active',
      verified: true,
      contactNumber: '108'
    },
    {
      _id: 'loc-5',
      name: 'Panchavati Public Clean Water Station',
      category: 'Drinking Water',
      coordinates: { lat: 20.0075, lng: 73.7930 },
      address: 'Kalaram Temple Road, Panchavati',
      description: 'Free purified RO drinking water dispensers and hydration booths.',
      status: 'Active',
      verified: true
    },
    {
      _id: 'loc-6',
      name: 'Outer Ring Road Parking Complex A',
      category: 'Parking',
      coordinates: { lat: 19.9850, lng: 73.8150 },
      address: 'Mumbai-Agra Highway Exit, Nashik',
      description: 'Spacious parking lot capacity for 10,000 vehicles with free electric shuttle connection.',
      status: 'Active',
      verified: true
    },
    {
      _id: 'loc-7',
      name: 'Kumbh Police Central Control Room',
      category: 'Police/Help Centre',
      coordinates: { lat: 20.0020, lng: 73.7850 },
      address: 'Police HQ, Old Agra Road, Nashik',
      description: 'Central crowd management, lost and found center, and emergency support hotline.',
      status: 'Active',
      verified: true,
      contactNumber: '112'
    },
    {
      _id: 'loc-8',
      name: 'Sanitary Toilet Facility Block 12',
      category: 'Toilet',
      coordinates: { lat: 20.0055, lng: 73.7900 },
      address: 'Godavari Riverbank Promenade',
      description: 'Eco-friendly, accessible modular toilets with continuous cleaning staff.',
      status: 'Active',
      verified: true
    }
  ],

  travelUpdates: [
    {
      _id: 'travel-1',
      title: 'Tapovan Electric Shuttle Service',
      type: 'Shuttle',
      routeFrom: 'Tapovan Parking Lot A',
      routeTo: 'Panchavati Ghat Gate 2',
      description: 'Buses operate every 3-5 minutes. Free service for all pilgrims.',
      status: 'Active'
    },
    {
      _id: 'travel-2',
      title: 'Agra Highway Outer Parking Occupancy',
      type: 'Parking',
      description: 'Parking Complex A is 45% full. Parking Complex B open with ample space.',
      occupancyPercentage: 45,
      status: 'Active'
    },
    {
      _id: 'travel-3',
      title: 'Godavari Promenade Walking Route',
      type: 'Walking Route',
      routeFrom: 'CBS Bus Terminus',
      routeTo: 'Ramkund Bathing Area',
      description: 'Shaded 1.2 km pedestrian corridor equipped with misting fans and drinking water taps.',
      status: 'Active'
    }
  ],

  facilities: [
    {
      _id: 'fac-1',
      name: 'Annapurna Maha Prasad Bhojanalaya',
      category: 'Food Area',
      location: 'Sadhugram Sector 3',
      verified: true,
      status: 'Open',
      capacityNotes: 'Free sattvic meals served continuously from 7:00 AM to 10:00 PM.'
    },
    {
      _id: 'fac-2',
      name: 'Senior Citizen Rest Tent & Aid Hub',
      category: 'Accommodation',
      location: 'Near Kalaram Temple',
      verified: true,
      status: 'Open',
      capacityNotes: 'Air-cooled rest area with wheelchair assistance and basic health checkups.'
    }
  ],

  assistanceRequests: [
    {
      _id: 'req-1',
      requestType: 'Lost & Found',
      requesterName: 'Ramesh Sharma',
      contactInfo: '+91 98765 43210',
      locationDescription: 'Near Ramkund Ghat Gate 3',
      description: 'Lost black leather bag containing spectacles and ID card around 9 AM.',
      status: 'In Progress',
      internalNotes: 'Checked with Police Post #4. Bag located at central lost & found.',
      createdAt: new Date().toISOString()
    }
  ],

  programs: [
    {
      _id: 'prog-1',
      title: 'First Shahi Snan (Royal Holy Bath)',
      category: 'Shahi Snan',
      eventDate: '2026-09-14',
      location: 'Ramkund Ghat & Kushavarta Kund',
      description: 'The premier holy bathing day led by Sadhus of various Akhadas in solemn procession.',
      guidelines: [
        'General public allowed in designated public ghat sections after 11:00 AM.',
        'Do not carry sharp objects or plastic bags near the water.',
        'Follow instructions from life-guards and police personnel.'
      ],
      importance: 'Supreme spiritual merit according to Vedic scriptures.'
    },
    {
      _id: 'prog-2',
      title: 'Temple Visit Guidelines for International Visitors',
      category: 'International Visitor Guide',
      eventDate: 'Ongoing',
      location: 'All Nashik & Trimbakeshwar Temples',
      description: 'Essential cultural tips for respectful participation in Kumbh rituals.',
      guidelines: [
        'Remove footwear at designated shoe stands before entering temple compounds.',
        'Dress modestly covering shoulders and knees.',
        'Seek permission before photographing holy men and private family rituals.'
      ],
      importance: 'Ensures harmony and cultural respect.'
    }
  ]
};

module.exports = memoryStore;

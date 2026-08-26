import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
// Detect if URL is pointing to local unhosted port 5000 or empty
const isLocalhost5000 = !rawApiUrl || rawApiUrl.includes('localhost:5000') || rawApiUrl.includes('127.0.0.1:5000');

// Comprehensive Mock dataset for all app endpoints
const mockData = {
  '/announcements': [
    {
      _id: '1',
      title: 'Latest Notice',
      message: 'welcome',
      priority: 'high',
      createdAt: new Date().toISOString()
    }
  ],
  '/daily-information/today': {
    _id: '1',
    title: 'todaysKumbh',
    date: '2026 Simhastha',
    description: 'todaysKumbhDesc'
  },
  '/daily-information': [
    {
      _id: '1',
      title: "Today's Kumbh Mela Official Schedule & Rituals",
      date: new Date().toISOString().split('T')[0],
      description: "Official schedule for holy dip at Ramkund and Kushavarta Kund.",
      status: 'Published'
    }
  ],
  '/notifications': [
    {
      _id: 'n-1',
      title: "Today's Kumbh Mela Schedule & Rituals Released",
      message: "Official bathing and saint darshan schedule has been published for all pilgrims.",
      category: 'Daily Info',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'n-2',
      title: "Welcome to Nashik Simhastha Kumbh Mela 2026",
      message: "Official pilgrim companion portal is active. Access emergency SOS & location guides.",
      category: 'Official Notice',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'n-3',
      title: "Outer Parking & Free Shuttle Buses Active",
      message: "Free ring-road shuttles running every 5 minutes from Tapovan and Panchavati hubs.",
      category: 'Travel & Parking',
      createdAt: new Date().toISOString()
    }
  ],
  '/locations': [
    {
      _id: 'loc-1',
      name: 'Ramkund Holy Bathing Ghat (रामकुंड पवित्र घाट)',
      category: 'Ghat',
      address: 'Panchavati, Nashik, Maharashtra 422003',
      location: 'Panchavati, Nashik, Maharashtra 422003',
      description: 'Primary sacred bathing ghat on River Godavari where Lord Rama performed rituals. Primary site for Shahi Snan and evening Maha Aarti.',
      coordinates: { lat: 20.0063, lng: 73.7915 },
      status: 'Active',
      isConfirmed: true,
      verified: true,
      contactNumber: '0253-2575555',
      image: '/shahi-snan.jpg',
      timings: 'Open 24 Hours (Holy Dip 4:00 AM - 10:00 PM)',
      facilities: ['Safety Netting', 'Life Guards', 'Clean Changing Rooms', 'Emergency Helpdesk'],
      distance: '2.5 km from Nashik CBS Bus Stand'
    },
    {
      _id: 'loc-2',
      name: 'Trimbakeshwar Jyotirlinga Temple (त्र्यंबकेश्वर ज्योतिर्लिंग)',
      category: 'Temple',
      address: 'Trimbak Town, Nashik District, Maharashtra 422212',
      location: 'Trimbak Town, Nashik District, Maharashtra 422212',
      description: 'One of the 12 sacred Jyotirlinga temples of Lord Shiva. Built of black basalt by Peshwa Balaji Baji Rao.',
      coordinates: { lat: 19.9322, lng: 73.5303 },
      status: 'Active',
      isConfirmed: true,
      verified: true,
      contactNumber: '0253-2591241',
      image: '/dhwajarohan.webp',
      timings: '5:00 AM - 9:00 PM',
      facilities: ['VIP Pass Counter', 'Footwear Depot', 'Queue Complex', 'Wheelchair Facility'],
      distance: '28 km West of Nashik'
    }
  ],
  '/facilities': [
    {
      _id: 'fac-1',
      name: 'Tapovan Annadan & Food Arena (तपोवन अन्नछत्र)',
      category: 'Food Area',
      address: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      location: 'Sector 2, Tapovan Sadhugram, Nashik 422003',
      description: 'Massive community dining hall serving fresh, wholesome, pure vegetarian Mahaprasad free of cost to over 100,000 pilgrims daily.',
      capacityNotes: 'Free langar meals served 24/7 for all pilgrims.',
      image: '/Putrakameshti-Yagna-Explained-A-Ritual-Guide-for-2025.jpeg.jpg.webp',
      timings: '7:00 AM - 10:30 PM (Continuous Mahaprasad)',
      distance: 'Inside Tapovan Sadhugram City',
      contactNumber: '0253-2575555',
      verified: true,
      isConfirmed: true,
      facilities: ['Free Mahaprasad', 'Hygienic Dining Benches', 'Purified Water', 'RO Drinking Water']
    }
  ],
  '/pilgrim-guide': [
    {
      _id: 'guide-1',
      category: 'Shahi Snan',
      title: 'First Amrit Shahi Snan (प्रथम अमृत शाही स्नान)',
      subtitle: '02 August 2027 • Main Bathing Day',
      eventDate: '02 August 2027',
      location: 'Ramkund (Nashik) & Kushavarta Kund (Trimbakeshwar)',
      description: 'The first grand royal bath date of Simhastha Kumbh with Naga Sadhus royal procession.',
      image: '/shahi-snan.jpg',
      highlights: ['Royal bath procession by Akharas', 'Sacred dip at sunrise in Godavari River']
    }
  ],
  '/assistance': [
    {
      _id: 'req-1',
      requesterName: 'Ramesh Kumar Sharma',
      contactInfo: '+91 98230 12345',
      requestType: 'Medical Support',
      locationDescription: 'Ramkund Ghat - Near Gate 3',
      description: 'Senior citizen pilgrim experiencing heat exhaustion. Need medical volunteer assistance.',
      status: 'New',
      createdAt: new Date().toISOString()
    }
  ],
  '/travel': []
};

const api = axios.create({
  baseURL: isLocalhost5000 ? '' : rawApiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: resolve locally with dynamic CRUD & Auto-Notification Broadcast if isLocalhost5000
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('kumbh_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (isLocalhost5000) {
    const endpoint = (config.url || '').replace(/^\/api/, '');
    const method = (config.method || 'get').toLowerCase();

    // Handler for Admin Login endpoint
    if (endpoint === '/auth/login') {
      let bodyData = {};
      try {
        bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
      } catch (e) {}

      const mockUser = { 
        id: 'admin-1', 
        name: 'Kumbh Administrator', 
        email: bodyData.email || 'admin@kumbhmela.gov.in', 
        role: 'SuperAdmin' 
      };
      const mockToken = 'mock-jwt-token-kumbh-2026';

      config.adapter = () => Promise.resolve({
        data: { success: true, token: mockToken, user: mockUser },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
      return config;
    }

    // Handle PUT (Update status or item)
    if (method === 'put') {
      let bodyData = {};
      try {
        bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
      } catch (e) {}

      const parts = endpoint.split('/').filter(Boolean);
      const id = parts.pop();
      const basePath = '/' + parts.join('/');

      if (Array.isArray(mockData[basePath])) {
        const itemIdx = mockData[basePath].findIndex(i => i._id === id);
        if (itemIdx >= 0) {
          mockData[basePath][itemIdx] = { ...mockData[basePath][itemIdx], ...bodyData };
        }
      }

      config.adapter = () => Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
      return config;
    }

    // Handle POST (Create Item + Auto-Broadcast to /notifications)
    if (method === 'post') {
      let bodyData = {};
      try {
        bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
      } catch (e) {
        bodyData = config.data || {};
      }
      const newItem = {
        _id: Date.now().toString(),
        ...bodyData,
        createdAt: new Date().toISOString()
      };
      
      if (endpoint === '/daily-information') {
        mockData['/daily-information'].unshift(newItem);
        mockData['/daily-information/today'] = newItem;

        mockData['/notifications'].unshift({
          _id: 'notif-' + Date.now(),
          title: newItem.title || "Daily Information Released",
          message: newItem.description || "New daily schedule updated by Admin.",
          category: 'Daily Info',
          createdAt: new Date().toISOString()
        });
      } else if (endpoint === '/announcements') {
        mockData['/announcements'].unshift(newItem);
        
        mockData['/notifications'].unshift({
          _id: 'notif-' + Date.now(),
          title: newItem.title || "Official Announcement",
          message: newItem.message || "New official notice released.",
          category: 'Official Notice',
          createdAt: new Date().toISOString()
        });
      } else if (endpoint === '/travel') {
        mockData['/travel'].unshift(newItem);

        mockData['/notifications'].unshift({
          _id: 'notif-' + Date.now(),
          title: newItem.title || "Travel & Parking Advisory",
          message: newItem.description || "Transport status updated by Admin.",
          category: 'Travel & Parking',
          createdAt: new Date().toISOString()
        });
      } else if (endpoint === '/assistance') {
        mockData['/assistance'].unshift(newItem);

        mockData['/notifications'].unshift({
          _id: 'notif-' + Date.now(),
          title: `Help Request Received: ${newItem.requestType}`,
          message: `Request from ${newItem.requesterName} (${newItem.contactInfo}) at ${newItem.locationDescription || 'Nashik'}`,
          category: 'Emergency Alert',
          createdAt: new Date().toISOString()
        });
      } else if (endpoint === '/locations' || endpoint === '/facilities') {
        if (!mockData['/locations']) mockData['/locations'] = [];
        if (!mockData['/facilities']) mockData['/facilities'] = [];

        mockData['/locations'] = mockData['/locations'].filter(item => item._id !== newItem._id && item.name !== newItem.name);
        mockData['/facilities'] = mockData['/facilities'].filter(item => item._id !== newItem._id && item.name !== newItem.name);

        mockData['/locations'].unshift(newItem);
        mockData['/facilities'].unshift(newItem);

        // Store custom locations in localStorage for persistence
        try {
          const savedCustom = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
          savedCustom.unshift(newItem);
          localStorage.setItem('kumbh_custom_locations', JSON.stringify(savedCustom));
        } catch (e) {}
      } else if (endpoint === '/pilgrim-guide') {
        if (!mockData['/pilgrim-guide']) mockData['/pilgrim-guide'] = [];
        mockData['/pilgrim-guide'] = mockData['/pilgrim-guide'].filter(item => item._id !== newItem._id && item.id !== newItem.id);
        mockData['/pilgrim-guide'].unshift(newItem);

        try {
          const savedCustom = JSON.parse(localStorage.getItem('kumbh_custom_guides') || '[]');
          savedCustom.unshift(newItem);
          localStorage.setItem('kumbh_custom_guides', JSON.stringify(savedCustom));
        } catch (e) {}
      } else {
        if (!mockData[endpoint]) mockData[endpoint] = [];
        if (Array.isArray(mockData[endpoint])) {
          mockData[endpoint].unshift(newItem);
        } else {
          mockData[endpoint] = newItem;
        }
      }

      config.adapter = () => Promise.resolve({
        data: { success: true, data: newItem },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
      return config;
    }

    // Handle DELETE (Remove Item)
    if (method === 'delete') {
      const parts = endpoint.split('/').filter(Boolean);
      const id = parts.pop();
      const basePath = '/' + parts.join('/');
      
      if (basePath === '/daily-information' || endpoint.startsWith('/daily-information')) {
        mockData['/daily-information'] = mockData['/daily-information'].filter(item => item._id !== id);
        if (mockData['/daily-information/today']?._id === id) {
          mockData['/daily-information/today'] = mockData['/daily-information'][0] || null;
        }
      } else if (basePath === '/locations' || basePath === '/facilities' || endpoint.startsWith('/locations') || endpoint.startsWith('/facilities')) {
        if (Array.isArray(mockData['/locations'])) {
          mockData['/locations'] = mockData['/locations'].filter(item => item._id !== id);
        }
        if (Array.isArray(mockData['/facilities'])) {
          mockData['/facilities'] = mockData['/facilities'].filter(item => item._id !== id);
        }

        // Store deleted ID in localStorage for persistence
        try {
          const savedDeleted = JSON.parse(localStorage.getItem('kumbh_deleted_locations') || '[]');
          if (!savedDeleted.includes(id)) savedDeleted.push(id);
          localStorage.setItem('kumbh_deleted_locations', JSON.stringify(savedDeleted));

          // Remove from custom stored locations as well
          const savedCustom = JSON.parse(localStorage.getItem('kumbh_custom_locations') || '[]');
          const updatedCustom = savedCustom.filter(item => item._id !== id);
          localStorage.setItem('kumbh_custom_locations', JSON.stringify(updatedCustom));
        } catch (e) {}
      } else if (basePath === '/pilgrim-guide' || endpoint.startsWith('/pilgrim-guide')) {
        if (Array.isArray(mockData['/pilgrim-guide'])) {
          mockData['/pilgrim-guide'] = mockData['/pilgrim-guide'].filter(item => item._id !== id && item.id !== id);
        }

        try {
          const savedDeleted = JSON.parse(localStorage.getItem('kumbh_deleted_guides') || '[]');
          if (!savedDeleted.includes(id)) savedDeleted.push(id);
          localStorage.setItem('kumbh_deleted_guides', JSON.stringify(savedDeleted));

          const savedCustom = JSON.parse(localStorage.getItem('kumbh_custom_guides') || '[]');
          const updatedCustom = savedCustom.filter(item => item._id !== id && item.id !== id);
          localStorage.setItem('kumbh_custom_guides', JSON.stringify(updatedCustom));
        } catch (e) {}
      } else if (Array.isArray(mockData[basePath])) {
        mockData[basePath] = mockData[basePath].filter(item => item._id !== id);
      }

      config.adapter = () => Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
      return config;
    }

    // Handle GET
    const data = mockData[endpoint] !== undefined ? mockData[endpoint] : (mockData[config.url] !== undefined ? mockData[config.url] : []);
    config.adapter = () => Promise.resolve({
      data: { success: true, data },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }

  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: catch any unexpected network errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      const endpoint = (error.config?.url || '').replace(/^\/api/, '');
      const fallback = mockData[endpoint] !== undefined ? mockData[endpoint] : (mockData[error.config?.url] !== undefined ? mockData[error.config?.url] : []);
      return Promise.resolve({
        data: { success: true, data: fallback, offline: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config
      });
    }
    return Promise.reject(error);
  }
);

export default api;

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
      name: 'Ramkund Holy Bathing Ghat',
      category: 'Ghat',
      address: 'Panchavati, Nashik, Maharashtra 422003',
      description: 'Primary sacred bathing ghat on the banks of Godavari River.',
      coordinates: { lat: 20.0063, lng: 73.7915 },
      status: 'Active'
    },
    {
      _id: 'loc-2',
      name: 'Trimbakeshwar Jyotirlinga Temple',
      category: 'Temple',
      address: 'Trimbak, Nashik, Maharashtra 422212',
      description: 'One of the 12 sacred Jyotirlinga temples of Lord Shiva.',
      coordinates: { lat: 19.9322, lng: 73.5303 },
      status: 'Active'
    }
  ],
  '/facilities': [
    {
      _id: 'fac-1',
      name: 'Tapovan Annadan & Food Arena',
      category: 'Food Area',
      location: 'Tapovan Sadhugram, Nashik',
      capacityNotes: 'Free langar meals served 24/7 for all pilgrims.'
    },
    {
      _id: 'fac-2',
      name: 'Panchavati Pilgrim Medical & Emergency Hub',
      category: 'Medical',
      location: 'Near Ramkund Ghat, Panchavati',
      capacityNotes: 'Doctors on duty, ICU ambulances and free medicines.'
    }
  ],
  '/pilgrim-guide': [
    {
      _id: 'guide-1',
      category: 'Shahi Snan',
      title: 'First Amrit Shahi Snan (प्रथम अमृत शाही स्नान)',
      eventDate: '02 August 2027',
      location: 'Ramkund (Nashik) & Kushavarta Kund (Trimbakeshwar)',
      description: 'The first grand royal bath date of Simhastha Kumbh with Naga Sadhus royal procession.',
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

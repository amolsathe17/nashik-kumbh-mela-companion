# 🛕 Nashik Kumbh Mela Companion

A modern, lightweight, scalable, secure, and accessible digital platform designed for **pilgrims, visitors, elderly users, and international tourists** attending the Nashik Kumbh Mela.

> **Find → Travel → Understand → Get Help**

---

## 🌟 Key Features

### 📱 Visitor & Pilgrim Mobile Application
- **🌐 Multilingual System (25+ Languages)**:
  - **Indian**: English, Hindi (हिंदी), Marathi (मराठी), Gujarati (ગુજરાતી), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Urdu (اردو), Sanskrit (संस्कृतम्).
  - **International**: French, German, Spanish, Italian, Portuguese, Dutch, Polish, Russian, Ukrainian, Arabic, Turkish, Chinese, Japanese, Korean, Thai, Indonesian.
  - Full Right-to-Left (RTL) support for Arabic & Urdu.
- **🗺️ Find Places (Smart Map)**: Locate Ghats (Ramkund), Temples (Trimbakeshwar), Toilets, Drinking Water, Medical Centers, Police Help Desks, Food Camps with **"📍 Take Me There"** instant navigation links.
- **🚌 Travel & Parking**: Live shuttle bus schedules, parking occupancy percentages, walking green corridors, and interactive **Journey Planner** (*"Where are you? → Where do you want to go?"*).
- **📅 Today's Kumbh**: Daily official schedules, Shahi Snan dates, travel alerts, and safety advisories.
- **🛕 Pilgrim Guide**: Ritual guidelines, temple etiquette, Shahi Snan dates, and dedicated guidance for international visitors.
- **📍 Nearby Facilities**: Verified directory of camps, food counters, medical aid posts, and pharmacies.
- **🆘 Help & Safety Centre**: Lost & found submission form, non-emergency assistance requests, and 24/7 direct helpline dials (Police 112, Ambulance 108).
- **🔔 Notification Centre**: Language-aware push notification inbox and safety announcements.
- **👨‍👩‍👧‍👦 Optional Travel Group**: Voluntary family group creation with code sharing, meeting point coordination, and privacy controls.

---

### 🧑‍💻 Secure Admin Dashboard
- **Authentication**: JWT-based authentication for authorized administrators.
- **Daily Information Management**: Content workflow (*Draft → Translation → Review → Approved → Published*).
- **Push Notification Management**: Instant and scheduled broadcasts with target audience language filtering and preview confirmation.
- **Map & Location Management**: Add/edit points of interest, coordinates, category tags, and status.
- **Travel & Parking Updates**: Real-time parking occupancy updates, shuttle frequency editor, road diversion alerts.
- **Assistance Requests Triage**: Manage pilgrim assistance inquiries (*New → In Progress → Resolved*) with internal staff notes.
- **Analytics & Reports**: Visual demographics on language usage, top searched locations, and assistance stats.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM, Axios |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Cors, Morgan |
| **Database** | MongoDB Atlas (Mongoose) with built-in standalone memory fallback engine |
| **Localization** | Centralized i18n Engine with 25+ languages & RTL direction switching |
| **Deployment** | Vercel (Frontend), Render (Backend API), MongoDB Atlas (Database) |

---

## 📁 Project Architecture

```text
nashik-kumbh-mela/
├── frontend/                  # React + Vite Frontend App
│   ├── src/
│   │   ├── components/        # Navbar, Footer, AdminSidebar, Modals
│   │   ├── context/           # LanguageContext (i18n & RTL), AuthContext
│   │   ├── locales/           # 25+ Language configs & UI translation dictionaries
│   │   ├── pages/
│   │   │   ├── visitor/       # Home, TodaysKumbh, FindPlaces, TravelParking, etc.
│   │   │   └── admin/         # Login, Overview, DailyInfoMgmt, AnnouncementsMgmt, etc.
│   │   └── services/          # Axios API service
│   ├── vercel.json            # SPA Rewrite Configuration for Vercel
│   └── package.json
│
├── backend/                   # Express.js REST API
│   ├── controllers/           # Auth, DailyInfo, Announcements, Locations, Travel, etc.
│   ├── middleware/            # JWT Auth Middleware & Error Handlers
│   ├── models/                # Mongoose Schemas (AdminUser, Location, DailyInfo, etc.)
│   ├── routes/                # REST API endpoints
│   ├── render.yaml            # Render Deployment Spec
│   ├── seed.js                # Database seeder script
│   └── server.js              # Server entry point with /api/health
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Backend Setup
```bash
cd backend
npm install

# (Optional) Add your MONGODB_URI in .env
# If MONGODB_URI is omitted, backend automatically runs in Standalone Memory Mode!

npm start
```
- API Health Check: `http://localhost:5000/api/health`

### 3. Database Seeding (Optional for Cloud MongoDB)
```bash
cd backend
npm run seed
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Visitor Mobile App: `http://localhost:5173/`
- Admin Dashboard: `http://localhost:5173/admin/login`

---

## 🔑 Demo Admin Credentials

| Email | Password | Role |
|---|---|---|
| `admin@kumbhmela.gov.in` | `Admin@123456` | SuperAdmin |

---

## ☁️ Deployment Instructions

### Frontend Deployment (Vercel)
1. Push project to GitHub.
2. Import `/frontend` folder in **Vercel**.
3. Set Environment Variable:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api`
4. Deploy!

### Backend Deployment (Render)
1. Import `/backend` folder in **Render**.
2. Environment Variables on Render:
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/kumbhmela`
   - `JWT_SECRET` = `your_super_secret_jwt_key`
   - `CLIENT_URL` = `https://your-vercel-app.vercel.app`
3. Start Command: `node server.js`
4. Deploy!

---

## 🛡️ License & Compliance
Maintained for **Nashik Kumbh Mela 2026**. Designed with privacy, accessibility, and high-performance scalability.

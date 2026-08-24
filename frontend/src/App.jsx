import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import ScrollToTop from './components/common/ScrollToTop';
import { useAuth } from './context/AuthContext';

// Visitor Pages
import LanguageSelect from './pages/visitor/LanguageSelect';
import Home from './pages/visitor/Home';
import AboutKumbh from './pages/visitor/AboutKumbh';
import AboutKumbhmela from './pages/visitor/AboutKumbhmela';
import TodaysKumbh from './pages/visitor/TodaysKumbh';
import FindPlaces from './pages/visitor/FindPlaces';
import TravelParking from './pages/visitor/TravelParking';
import PilgrimGuide from './pages/visitor/PilgrimGuide';
import NearbyFacilities from './pages/visitor/NearbyFacilities';
import HelpSafety from './pages/visitor/HelpSafety';
import NotificationCentre from './pages/visitor/NotificationCentre';
import FamilyGroup from './pages/visitor/FamilyGroup';

// Admin Pages
import Login from './pages/admin/Login';
import Overview from './pages/admin/Overview';
import DailyInfoMgmt from './pages/admin/DailyInfoMgmt';
import AnnouncementsMgmt from './pages/admin/AnnouncementsMgmt';
import LocationsMgmt from './pages/admin/LocationsMgmt';
import TravelMgmt from './pages/admin/TravelMgmt';
import FacilitiesMgmt from './pages/admin/FacilitiesMgmt';
import AssistanceMgmt from './pages/admin/AssistanceMgmt';
import LanguagesMgmt from './pages/admin/LanguagesMgmt';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import Settings from './pages/admin/Settings';

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const isSplashLanguagePage = location.pathname === '/language';
  const isAdminLogin = location.pathname === '/admin/login';
  const isAdminArea = location.pathname.startsWith('/admin') && !isAdminLogin;
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen w-full flex flex-col selection:bg-amber-200 selection:text-amber-900 bg-[#e5ecf6] relative">
      {!isSplashLanguagePage && !isAdminArea && <Navbar />}

      <div 
        className="flex-1 min-h-[calc(100vh-70px)] relative"
        style={
          isHomePage ? {
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)), url('/kumbh-bg.jpg')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center top',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
          } : {
            backgroundColor: '#e5ecf6'
          }
        }
      >
        <Routes>
          {/* Visitor Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about-kumbhmela" element={<AboutKumbhmela />} />
          <Route path="/about-kumbh" element={<AboutKumbh />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/todays-kumbh" element={<TodaysKumbh />} />
          <Route path="/find-places" element={<FindPlaces />} />
          <Route path="/travel-parking" element={<TravelParking />} />
          <Route path="/pilgrim-guide" element={<PilgrimGuide />} />
          <Route path="/nearby-facilities" element={<NearbyFacilities />} />
          <Route path="/help-safety" element={<HelpSafety />} />
          <Route path="/notifications" element={<NotificationCentre />} />
          <Route path="/family-group" element={<FamilyGroup />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Section */}
          <Route path="/admin/overview" element={<ProtectedAdminRoute><Overview /></ProtectedAdminRoute>} />
          <Route path="/admin/daily-info" element={<ProtectedAdminRoute><DailyInfoMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/announcements" element={<ProtectedAdminRoute><AnnouncementsMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/locations" element={<ProtectedAdminRoute><LocationsMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/travel" element={<ProtectedAdminRoute><TravelMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/guide" element={<ProtectedAdminRoute><PilgrimGuide /></ProtectedAdminRoute>} />
          <Route path="/admin/facilities" element={<ProtectedAdminRoute><FacilitiesMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/assistance" element={<ProtectedAdminRoute><AssistanceMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/languages" element={<ProtectedAdminRoute><LanguagesMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/reports" element={<ProtectedAdminRoute><ReportsAnalytics /></ProtectedAdminRoute>} />
          <Route path="/admin/settings" element={<ProtectedAdminRoute><Settings /></ProtectedAdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isSplashLanguagePage && !isAdminArea && <Footer />}
      <ScrollToTop />
    </div>
  );
};

export default App;

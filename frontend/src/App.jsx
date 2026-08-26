import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import AdminHeader from './components/layout/AdminHeader';
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
import PilgrimGuideMgmt from './pages/admin/PilgrimGuideMgmt';
import FacilitiesMgmt from './pages/admin/FacilitiesMgmt';
import AssistanceMgmt from './pages/admin/AssistanceMgmt';
import LanguagesMgmt from './pages/admin/LanguagesMgmt';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import Settings from './pages/admin/Settings';

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef(null);
  const location = useLocation();

  // Scroll main container to top on admin route changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Monitor scroll position of main content container
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      if (mainEl.scrollTop > 150) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="h-screen w-screen bg-[#e6ebf5] flex overflow-hidden relative">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden min-w-0">
        <AdminHeader isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <main ref={mainRef} className="flex-1 p-3 sm:p-6 overflow-y-auto min-w-0 flex flex-col justify-between relative">
          <div className="flex-1">
            {children}
          </div>
          <footer className="pt-6 pb-2 text-center text-xs font-semibold text-slate-500 border-t border-slate-300/50 mt-6">
            © 2026 Nashik Kumbh Mela Authority. All rights reserved.
          </footer>
        </main>
      </div>

      {/* Floating Scroll-to-Top Button for Admin Pages */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-2xl transition-all border border-amber-300/40 hover:scale-110 active:scale-95 animate-fade-in flex items-center justify-center"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
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
    <div className="min-h-screen w-full flex flex-col selection:bg-amber-200 selection:text-amber-900 bg-[#e5ecf6] relative overflow-x-hidden">
      {!isSplashLanguagePage && !isAdminArea && <Navbar />}

      <div 
        className={`flex-1 min-h-[calc(100vh-70px)] relative ${isHomePage ? 'kumbh-landing-bg' : 'bg-[#e5ecf6]'}`}
      >
        {isHomePage && (
          <>
            {/* Fixed Background Image for Desktop / Laptop View (matching Admin Login page) */}
            <img 
              src="/kumbh-bg.jpg" 
              alt="Kumbh Mela Background" 
              className="hidden md:block fixed inset-0 w-full h-full object-fill pointer-events-none z-0"
            />
            {/* Dark Overlay for Desktop View */}
            <div className="hidden md:block fixed inset-0 bg-slate-950/40 pointer-events-none z-0" />
          </>
        )}

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
          <Route path="/admin/guide" element={<ProtectedAdminRoute><PilgrimGuideMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/facilities" element={<ProtectedAdminRoute><FacilitiesMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/assistance" element={<ProtectedAdminRoute><AssistanceMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/languages" element={<ProtectedAdminRoute><LanguagesMgmt /></ProtectedAdminRoute>} />
          <Route path="/admin/reports" element={<ProtectedAdminRoute><ReportsAnalytics /></ProtectedAdminRoute>} />
          <Route path="/admin/settings" element={<ProtectedAdminRoute><Settings /></ProtectedAdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isSplashLanguagePage && !isAdminArea && !isAdminLogin && (
        <div className={isHomePage ? "block lg:hidden" : "block"}>
          <Footer />
        </div>
      )}
      <ScrollToTop />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Globe, PhoneCall, UserCheck, Menu, X, Home, ChevronRight, CheckCircle, Trash2,
  BookOpen, MapPin, Compass, Building2, Bell, Scroll, Bus, Calendar, HelpCircle, Users, ShieldCheck
} from 'lucide-react';
import LanguageModal from '../common/LanguageModal';
import EmergencyModal from '../common/EmergencyModal';
import api from '../../services/api';

const Navbar = () => {
  const { currentLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification Dropdown State
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState([]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res?.data?.success && Array.isArray(res.data.data)) {
        setNotifications(res.data.data);
      }
    } catch (err) {}
  };

  const handleMarkRead = (id) => {
    if (!readNotifIds.includes(id)) {
      setReadNotifIds(prev => [...prev, id]);
    }
  };

  const handleDeleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    setReadNotifIds(prev => prev.filter(readId => readId !== id));
  };

  const handleMarkAllRead = () => {
    setReadNotifIds(notifications.map(n => n._id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setReadNotifIds([]);
  };

  const unreadCount = notifications.filter(n => !readNotifIds.includes(n._id)).length;

  // Navigation Links matching exact sequence
  const navLinks = [
    {
      titleKey: 'aboutKumbhmela',
      labelFallback: 'About Kumbhmela',
      descKey: 'aboutKumbhmelaCardDesc',
      icon: BookOpen,
      path: '/about-kumbhmela',
      color: 'from-orange-600 to-amber-600',
      borderColor: 'border-orange-500'
    },
    {
      titleKey: 'aboutKumbh',
      labelFallback: 'About Nasik Kumbh',
      descKey: 'aboutKumbhCardDesc',
      icon: Scroll,
      path: '/about-kumbh',
      color: 'from-amber-600 to-yellow-600',
      borderColor: 'border-amber-500'
    },
    {
      titleKey: 'todaysKumbh',
      labelFallback: "Today's Kumbh",
      descKey: 'todaysKumbhDesc',
      icon: Calendar,
      path: '/todays-kumbh',
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-400'
    },
    {
      titleKey: 'findPlaces',
      labelFallback: 'Find Places',
      descKey: 'findPlacesDesc',
      icon: MapPin,
      path: '/find-places',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-400'
    },
    {
      titleKey: 'pilgrimGuide',
      labelFallback: 'Pilgrim Guide',
      descKey: 'pilgrimGuideDesc',
      icon: Compass,
      path: '/pilgrim-guide',
      color: 'from-rose-500 to-red-600',
      borderColor: 'border-rose-400'
    },
    {
      titleKey: 'nearbyFacilities',
      labelFallback: 'Nearby Facilities',
      descKey: 'nearbyFacilitiesDesc',
      icon: Building2,
      path: '/nearby-facilities',
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-400'
    },
    {
      titleKey: 'travelParking',
      labelFallback: 'Travel & Parking',
      descKey: 'travelParkingDesc',
      icon: Bus,
      path: '/travel-parking',
      color: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-400'
    },
    {
      titleKey: 'familyGroup',
      labelFallback: 'Travel Group',
      descKey: 'familyGroupDesc',
      icon: Users,
      path: '/family-group',
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-400'
    },
    {
      titleKey: 'travelSafetyTips',
      labelFallback: 'Travel, Safety & Tips',
      descKey: 'helpSafetyDesc',
      icon: ShieldCheck,
      path: '/travel-safety-tips',
      color: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-400'
    },
    {
      titleKey: 'alerts',
      labelFallback: 'Alerts & News',
      descKey: 'alertsDesc',
      icon: Bell,
      path: '/notifications',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-cyan-400'
    },
    {
      titleKey: 'helpSafety',
      labelFallback: 'Help & Safety',
      descKey: 'helpSafetyDesc',
      icon: HelpCircle,
      path: '/help-safety',
      color: 'from-red-500 to-orange-600',
      borderColor: 'border-red-400'
    }
  ];

  return (
    <>
      {/* Full-Screen Backdrop Blur Overlay */}
      {isNotifDropdownOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] transition-all animate-fade-in"
          onClick={() => setIsNotifDropdownOpen(false)}
        />
      )}

      {/* Top Navigation Bar (Fixed on Top) */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 text-white shadow-xl border-b-2 border-amber-500/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between">
          
          {/* Logo & Branding Header */}
          <Link to="/" className="flex items-center space-x-2.5 rtl:space-x-reverse group">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-xl shadow-lg border-2 border-amber-300 group-hover:scale-105 transition-transform">
              🛕
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1 leading-none">
                <span>{t('appName')}</span>
              </h1>
              <p className="text-[10px] text-amber-200 font-mono tracking-wider mt-0.5">
                Simhastha 2026
              </p>
            </div>
          </Link>

          {/* Action Bar */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse relative">
            
            {/* Notification Bell Icon & Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifDropdownOpen(!isNotifDropdownOpen);
                  fetchNotifications();
                }}
                className="relative bg-white/15 hover:bg-white/25 p-2 rounded-full text-amber-100 border border-white/20 transition-all flex items-center justify-center shadow-sm group"
                title="Notification Centre & Dropdown Alerts"
                aria-label="Open Notifications Dropdown"
              >
                <Bell className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center border border-amber-600 shadow animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {isNotifDropdownOpen && (
                <div className="fixed left-1/2 -translate-x-1/2 top-16 w-[92vw] max-w-sm sm:absolute sm:left-auto sm:right-0 sm:top-full sm:translate-x-0 sm:mt-3 sm:w-96 bg-white text-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400/80 z-[101] overflow-hidden animate-fade-in">
                  {/* Dropdown Header */}
                  <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white p-3.5 flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Bell className="w-4 h-4 text-amber-200" />
                      <span className="font-bold text-xs">Alerts ({unreadCount} unread)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead} 
                          className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full font-bold transition-colors"
                        >
                          Mark All Read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button 
                          onClick={handleClearAll} 
                          className="bg-red-600/90 hover:bg-red-700 px-2 py-0.5 rounded-full font-bold transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Notifications Body List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications.length > 0 ? (
                      notifications.map((n) => {
                        const isRead = readNotifIds.includes(n._id);
                        return (
                          <div 
                            key={n._id} 
                            className={`p-3.5 space-y-1.5 transition-colors ${
                              isRead ? 'bg-slate-50/70 opacity-75' : 'bg-amber-50/50 font-medium'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                                {n.category || 'Notice'}
                              </span>

                              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                                {!isRead && (
                                  <button
                                    onClick={() => handleMarkRead(n._id)}
                                    className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center gap-0.5 text-[10px] font-bold"
                                    title="Mark as Read"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Read</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteNotif(n._id)}
                                  className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                                  title="Delete Notification"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <h5 className="text-xs font-bold text-slate-950 leading-snug">{n.title}</h5>
                            <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-xs font-medium">
                        No notifications or alerts.
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer Link */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotifDropdownOpen(false)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center justify-center gap-1"
                    >
                      <span>View All in Notification Centre</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Button */}
            <button
              onClick={() => setIsLangOpen(true)}
              className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all text-amber-50 shadow-sm"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline">{currentLang.nativeName}</span>
            </button>

            {/* Emergency Call Button (Visible on Desktop Header) */}
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="hidden sm:flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all animate-pulse"
              title="Emergency Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS Help</span>
            </button>

            {/* Admin Link or Back to Visitor App (Hidden on Mobile View) */}
            {isAdminRoute ? (
              <Link
                to="/"
                className="hidden md:flex bg-amber-800 hover:bg-amber-900 text-amber-100 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-600 items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{t('backToHome')}</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="hidden md:flex bg-black/20 hover:bg-black/40 text-amber-100 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-400/30 items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Modern Mobile Menu Toggle Button (Visible on Mobile/Tablet only, hidden on desktop/laptop) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden bg-amber-900/60 hover:bg-amber-900/80 text-amber-100 p-2 rounded-full border border-amber-400/40 shadow-md transition-all active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-200" />
              ) : (
                <Menu className="w-5 h-5 text-amber-100" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Modern UI/UX Slide-Over Mobile Toggle Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/70 backdrop-blur-md transition-opacity animate-fade-in">
          {/* Backdrop Click Dismiss */}
          <div 
            className="absolute inset-0"
            onClick={() => setIsMobileMenuOpen(false)} 
          />

          {/* Slide Drawer Content */}
          <div className="relative w-full max-w-xs bg-slate-900 border-l border-amber-500/30 shadow-2xl h-full flex flex-col z-10 animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-amber-800 to-orange-900 text-white flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-base shadow">
                  🛕
                </div>
                <span className="font-bold text-sm text-amber-100">Kumbh Navigation</span>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-amber-200 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean Text-Only Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {navLinks.map((btn, idx) => {
                const Icon = btn.icon;
                return (
                  <Link
                    key={idx}
                    to={btn.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-amber-600 text-amber-100 hover:text-white border border-slate-700/60 hover:border-amber-500 transition-all text-xs font-bold shadow-sm group"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Icon className="w-4 h-4 text-amber-400 group-hover:text-white flex-shrink-0" />
                      <span>{t(btn.titleKey) !== btn.titleKey ? t(btn.titleKey) : (btn.labelFallback || t(btn.titleKey))}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}

              {/* Admin Portal Link in Mobile Menu */}
              <div className="pt-2 border-t border-slate-800">
                <Link
                  to={isAdminRoute ? "/" : "/admin/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border border-amber-400/40 transition-all text-xs font-bold shadow-md group"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    {isAdminRoute ? (
                      <Home className="w-4 h-4 text-amber-100 flex-shrink-0" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-amber-100 flex-shrink-0" />
                    )}
                    <span>{isAdminRoute ? t('backToHome') : 'Admin Portal Login'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-200 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {isLangOpen && <LanguageModal isOpen={true} onClose={() => setIsLangOpen(false)} />}

      {/* Emergency Modal */}
      {isEmergencyOpen && <EmergencyModal isOpen={true} onClose={() => setIsEmergencyOpen(false)} />}
    </>
  );
};

export default Navbar;

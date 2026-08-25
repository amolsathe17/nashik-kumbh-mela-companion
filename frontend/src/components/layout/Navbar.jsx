import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Globe, PhoneCall, UserCheck, Menu, X, Home, ChevronRight,
  BookOpen, MapPin, Compass, Building2, Bell, Scroll, Bus, Calendar, HelpCircle, Users
} from 'lucide-react';
import LanguageModal from '../common/LanguageModal';
import EmergencyModal from '../common/EmergencyModal';

const Navbar = () => {
  const { currentLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  // All 10 Navigation Links matching the reference image layout & styling
  const navLinks = [
    {
      titleKey: 'aboutKumbhmela',
      descKey: 'aboutKumbhmelaCardDesc',
      icon: BookOpen,
      path: '/about-kumbhmela',
      color: 'from-orange-600 to-amber-600',
      borderColor: 'border-orange-500'
    },
    {
      titleKey: 'findPlaces',
      descKey: 'findPlacesDesc',
      icon: MapPin,
      path: '/find-places',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-400'
    },
    {
      titleKey: 'pilgrimGuide',
      descKey: 'pilgrimGuideDesc',
      icon: Compass,
      path: '/pilgrim-guide',
      color: 'from-rose-500 to-red-600',
      borderColor: 'border-rose-400'
    },
    {
      titleKey: 'nearbyFacilities',
      descKey: 'nearbyFacilitiesDesc',
      icon: Building2,
      path: '/nearby-facilities',
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-400'
    },
    {
      titleKey: 'alerts',
      descKey: 'alertsDesc',
      icon: Bell,
      path: '/notifications',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-cyan-400'
    },
    {
      titleKey: 'aboutKumbh',
      descKey: 'aboutKumbhCardDesc',
      icon: Scroll,
      path: '/about-kumbh',
      color: 'from-amber-600 to-yellow-600',
      borderColor: 'border-amber-500'
    },
    {
      titleKey: 'travelParking',
      descKey: 'travelParkingDesc',
      icon: Bus,
      path: '/travel-parking',
      color: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-400'
    },
    {
      titleKey: 'todaysKumbh',
      descKey: 'todaysKumbhDesc',
      icon: Calendar,
      path: '/todays-kumbh',
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-400'
    },
    {
      titleKey: 'helpSafety',
      descKey: 'helpSafetyDesc',
      icon: HelpCircle,
      path: '/help-safety',
      color: 'from-red-500 to-orange-600',
      borderColor: 'border-red-400'
    },
    {
      titleKey: 'familyGroup',
      descKey: 'familyGroupDesc',
      icon: Users,
      path: '/family-group',
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-400'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md border-b border-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center space-x-2.5 rtl:space-x-reverse group">
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
              🛕
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-tight group-hover:text-amber-200 transition-colors">
                {t('appName')}
              </h1>
              <p className="text-[10px] text-amber-100 font-medium tracking-wide">
                Nashik 2026 • Nashik Municipal Corp
              </p>
            </div>
          </Link>

          {/* Action Bar */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Language Selector Button */}
            <button
              onClick={() => setIsLangOpen(true)}
              className="flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all text-amber-50 shadow-sm"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-amber-200" />
              <span>{currentLang.nativeName}</span>
            </button>

            {/* Emergency Call Button */}
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all animate-pulse"
              title="Emergency Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOS Help</span>
            </button>

            {/* Admin Link or Back to Visitor App */}
            {isAdminRoute ? (
              <Link
                to="/"
                className="bg-amber-800 hover:bg-amber-900 text-amber-100 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-600 flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t('backToHome')}</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="bg-black/20 hover:bg-black/40 text-amber-100 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-400/30 flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}

            {/* Modern Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-amber-900/60 hover:bg-amber-900/80 text-amber-100 p-2 rounded-full border border-amber-400/40 shadow-md transition-all active:scale-95"
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
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md transition-opacity animate-fade-in">
          {/* Backdrop Click Dismiss */}
          <div 
            className="absolute inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950 text-white h-full overflow-y-auto shadow-2xl flex flex-col border-l border-amber-500/30 z-10">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center text-xl font-bold">
                  🛕
                </div>
                <div>
                  <h3 className="font-black text-base text-amber-100 leading-tight">
                    {t('appName')}
                  </h3>
                  <p className="text-[10px] text-amber-300/80 font-medium">
                    Navigation Menu • 2026
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links Grid (Reference Image Layout: 2 Columns on sm, Stacked on Mobile) */}
            <div className="p-4 sm:p-5 flex-1 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Quick Links
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  10 Visitor Services
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {navLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={idx}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`p-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 border-2 transition-all hover:scale-102 flex items-center justify-between gap-2.5 shadow-md ${link.borderColor}`}
                    >
                      <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${link.color} text-white flex items-center justify-center shadow-sm flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black leading-tight text-slate-950 truncate">
                            {t(link.titleKey)}
                          </h4>
                          <p className="text-[10px] text-slate-600 line-clamp-1 mt-0.5 font-medium">
                            {t(link.descKey)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-amber-500/20 space-y-2 text-xs">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLangOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-200 font-bold flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>{t('language')}: {currentLang.nativeName}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsEmergencyOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <PhoneCall className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>{t('emergencyHelpline')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modals */}
      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </>
  );
};

export default Navbar;

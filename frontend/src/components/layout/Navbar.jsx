import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, PhoneCall, ShieldAlert, UserCheck, Menu, X, Home } from 'lucide-react';
import LanguageModal from '../common/LanguageModal';
import EmergencyModal from '../common/EmergencyModal';

const Navbar = () => {
  const { currentLang, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

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
          </div>
        </div>
      </header>

      {/* Modals */}
      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </>
  );
};

export default Navbar;

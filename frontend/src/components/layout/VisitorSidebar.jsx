import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BookOpen, Scroll, MapPin, Bus, Compass, Calendar, 
  Building2, HelpCircle, Bell, Users, ShieldCheck 
} from 'lucide-react';

const VisitorSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { titleKey: 'aboutKumbhmela', labelFallback: 'About Kumbhmela', icon: BookOpen, path: '/about-kumbhmela' },
    { titleKey: 'aboutKumbh', labelFallback: 'About Nasik Kumbh', icon: Scroll, path: '/about-kumbh' },
    { titleKey: 'todaysKumbh', labelFallback: "Today's Kumbh", icon: Calendar, path: '/todays-kumbh' },
    { titleKey: 'findPlaces', labelFallback: 'Find Places', icon: MapPin, path: '/find-places' },
    { titleKey: 'pilgrimGuide', labelFallback: 'Pilgrim Guide', icon: Compass, path: '/pilgrim-guide' },
    { titleKey: 'nearbyFacilities', labelFallback: 'Nearby Facilities', icon: Building2, path: '/nearby-facilities' },
    { titleKey: 'travelParking', labelFallback: 'Travel & Parking', icon: Bus, path: '/travel-parking' },
    { titleKey: 'familyGroup', labelFallback: 'Travel Group', icon: Users, path: '/family-group' },
    { titleKey: 'travelSafetyTips', labelFallback: 'Travel, Safety & Tips', icon: ShieldCheck, path: '/travel-safety-tips' },
    { titleKey: 'alerts', labelFallback: 'Alerts & News', icon: Bell, path: '/notifications' },
    { titleKey: 'helpSafety', labelFallback: 'Help & Safety', icon: HelpCircle, path: '/help-safety' }
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-[#0a0f1d] text-slate-100 z-40 flex-col shadow-2xl border-r border-slate-800/80 py-4">
      {/* Clean Text & Icon Links Only */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 custom-scrollbar">
        {navLinks.map((btn, idx) => {
          const Icon = btn.icon;
          const isActive = location.pathname === btn.path;
          return (
            <Link
              key={idx}
              to={btn.path}
              className={`w-full px-4 py-3 rounded-xl flex items-center space-x-3.5 rtl:space-x-reverse transition-all text-[14.5px] tracking-tight ${
                isActive 
                  ? 'bg-[#d97706] text-white font-bold shadow-md shadow-amber-950/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-300'}`} />
              <span className="truncate">
                {t(btn.titleKey) !== btn.titleKey ? t(btn.titleKey) : (btn.labelFallback || t(btn.titleKey))}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default VisitorSidebar;

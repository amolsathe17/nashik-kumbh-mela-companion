import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, Bus, Compass, Calendar, Building2, HelpCircle, 
  Bell, Users, Sparkles, ChevronRight, AlertTriangle 
} from 'lucide-react';
import api from '../../services/api';

const Home = () => {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [todayInfo, setTodayInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, todayRes] = await Promise.all([
          api.get('/announcements'),
          api.get('/daily-information/today')
        ]);
        if (annRes.data.success) setAnnouncements(annRes.data.data);
        if (todayRes.data.success) setTodayInfo(todayRes.data.data);
      } catch (err) {
        console.log('Using static fallback for Home');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Left column 4 cards (desktop) - Solid white background, vivid colored border, NO card gradient
  const leftCards = [
    {
      title: t('findPlaces'),
      desc: t('findPlacesDesc'),
      icon: MapPin,
      path: '/find-places',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-400'
    },
    {
      title: t('pilgrimGuide'),
      desc: t('pilgrimGuideDesc'),
      icon: Compass,
      path: '/pilgrim-guide',
      color: 'from-rose-500 to-red-600',
      borderColor: 'border-rose-400'
    },
    {
      title: t('nearbyFacilities'),
      desc: t('nearbyFacilitiesDesc'),
      icon: Building2,
      path: '/nearby-facilities',
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-400'
    },
    {
      title: t('alerts'),
      desc: t('alertsDesc'),
      icon: Bell,
      path: '/notifications',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-cyan-400'
    }
  ];

  // Right column 4 cards (desktop) - Solid white background, vivid colored border, NO card gradient
  const rightCards = [
    {
      title: t('travelParking'),
      desc: t('travelParkingDesc'),
      icon: Bus,
      path: '/travel-parking',
      color: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-400'
    },
    {
      title: t('todaysKumbh'),
      desc: t('todaysKumbhDesc'),
      icon: Calendar,
      path: '/todays-kumbh',
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-400'
    },
    {
      title: t('helpSafety'),
      desc: t('helpSafetyDesc'),
      icon: HelpCircle,
      path: '/help-safety',
      color: 'from-red-500 to-orange-600',
      borderColor: 'border-red-400'
    },
    {
      title: t('familyGroup'),
      desc: t('familyGroupDesc'),
      icon: Users,
      path: '/family-group',
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-400'
    }
  ];

  const allCards = [...leftCards, ...rightCards];

  const renderCard = (btn, idx) => {
    const Icon = btn.icon;
    return (
      <Link
        key={idx}
        to={btn.path}
        className={`p-3 sm:p-4 rounded-[22px] sm:rounded-[28px] border-2 bg-white hover:bg-slate-200 hover:border-slate-400 text-slate-900 transition-all hover:scale-102 hover:shadow-2xl flex items-center justify-between gap-2 sm:gap-3 shadow-lg ${btn.borderColor}`}
      >
        <div className="flex items-center space-x-2.5 sm:space-x-3 rtl:space-x-reverse min-w-0">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${btn.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-extrabold leading-tight text-slate-950 truncate">{btn.title}</h4>
            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{btn.desc}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0 hidden xs:block" />
      </Link>
    );
  };

  const heroSection = (
    <div className="relative rounded-3xl px-4 py-8 sm:py-12 border-0 bg-transparent text-white flex flex-col items-center justify-center text-center shadow-none mx-auto w-full min-h-[160px] sm:min-h-[820px]">
      <div className="relative z-10 space-y-13 flex flex-col items-center justify-center text-center mx-auto">
        <div className="inline-flex items-center justify-center space-x-2 bg-amber-600/85 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-amber-50 shadow-md border border-amber-300/40 mx-auto">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Official Pilgrim Companion • कुंभ महापर्व</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-amber-100 text-center mx-auto max-w-xl">
          {t('welcome')}
        </h2>
      </div>
    </div>
  );

  const announcementTicker = announcements.length > 0 && (
    <div className="bg-white border-2 border-amber-400 rounded-2xl p-4 flex items-center space-x-3 rtl:space-x-reverse shadow-xl">
      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-5 h-5 animate-pulse" />
      </div>
      <div className="flex-1 overflow-hidden">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
          Latest Official Notice
        </span>
        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
          {announcements[0].title}: {announcements[0].message}
        </p>
      </div>
      <Link to="/notifications" className="text-xs font-bold text-amber-700 hover:underline flex items-center">
        View <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );

  const todaysSummary = todayInfo && (
    <div className="bg-white hover:bg-slate-200 hover:border-slate-400 transition-all rounded-[28px] p-5 border-2 border-amber-400 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-amber-900">
          <Calendar className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-base text-slate-900">{todayInfo.title}</h3>
        </div>
        <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold">
          {todayInfo.date}
        </span>
      </div>
      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {todayInfo.description}
      </p>
      <div className="pt-2 flex justify-end">
        <Link
          to="/todays-kumbh"
          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
        >
          <span>Explore Today's Schedule</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* DESKTOP LAYOUT (lg:): 4 Cards Left | Center Content | 4 Cards Right */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Left Column (4 Cards) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-2xl text-center shadow border border-slate-700">
            Quick Services
          </div>
          {leftCards.map((btn, idx) => renderCard(btn, `left-${idx}`))}
        </div>

        {/* Center Column (Hero Header + Announcements + Today's Summary) */}
        <div className="lg:col-span-6 space-y-6">
          {heroSection}
          {announcementTicker}
          {todaysSummary}
        </div>

        {/* Right Column (4 Cards) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-2xl text-center shadow border border-slate-700">
            Essential Guides
          </div>
          {rightCards.map((btn, idx) => renderCard(btn, `right-${idx}`))}
        </div>
      </div>

      {/* MOBILE & TABLET LAYOUT (< lg): Stacked View */}
      <div className="lg:hidden space-y-6 max-w-xl mx-auto">
        {heroSection}
        {announcementTicker}
        {todaysSummary}

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase px-3.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 mx-auto text-center w-fit shadow-md">
            Quick Access Services / सेवाएं
          </h3>

          <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
            {allCards.map((btn, idx) => renderCard(btn, `mob-${idx}`))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, Bus, Compass, Calendar, Building2, HelpCircle, 
  Bell, Users, Sparkles, ChevronRight, AlertTriangle, Scroll, BookOpen, X, Trash2
} from 'lucide-react';
import api from '../../services/api';

const Home = () => {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [todayInfo, setTodayInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Center Modal Popup state with localStorage persistence so viewed/dismissed alerts don't show again in popup
  const [showNoticeModal, setShowNoticeModal] = useState(true);

  const [dismissedAnnounceIds, setDismissedAnnounceIds] = useState(() => {
    try {
      const saved = localStorage.getItem('kumbh_dismissed_modal_announcements');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isTodayInfoDismissed, setIsTodayInfoDismissed] = useState(() => {
    return localStorage.getItem('kumbh_dismissed_modal_todayinfo') === 'true';
  });

  // Mobile 4-second reveal delay: background image displays first, then cards & welcome text fade in after 4 seconds
  const [showMobileContent, setShowMobileContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMobileContent(true);
    }, 4000); // 4 seconds delay for mobile view
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, todayRes] = await Promise.all([
          api.get('/announcements').catch(() => null),
          api.get('/daily-information/today').catch(() => null)
        ]);
        if (annRes?.data?.success) setAnnouncements(annRes.data.data);
        if (todayRes?.data?.success) setTodayInfo(todayRes.data.data);
      } catch (err) {
        // Silent local fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeAnnouncements = announcements.filter(a => !dismissedAnnounceIds.includes(a._id));
  const hasActiveModalContent = activeAnnouncements.length > 0 || (todayInfo && !isTodayInfoDismissed);

  // Trigger 4-second delay for mobile viewport reveal
  const triggerMobile4sDelay = () => {
    if (window.innerWidth < 1024) {
      setShowMobileContent(false);
      setTimeout(() => {
        setShowMobileContent(true);
      }, 4000);
    }
  };

  const handleCloseNoticeModal = () => {
    setShowNoticeModal(false);
    triggerMobile4sDelay();
  };

  // When pilgrim views or deletes a notice, remove from center modal popup permanently while keeping in dropdown
  const handleDeleteSingleAnnouncement = (id) => {
    setDismissedAnnounceIds(prev => {
      const updated = [...prev, id];
      try {
        localStorage.setItem('kumbh_dismissed_modal_announcements', JSON.stringify(updated));
      } catch (e) {}

      const remainingAnn = announcements.filter(a => !updated.includes(a._id));
      if (remainingAnn.length === 0 && (isTodayInfoDismissed || !todayInfo)) {
        setShowNoticeModal(false);
        triggerMobile4sDelay();
      }
      return updated;
    });
  };

  // When pilgrim views or deletes Today's Kumbh schedule alert
  const handleDeleteTodayInfo = () => {
    setIsTodayInfoDismissed(true);
    try {
      localStorage.setItem('kumbh_dismissed_modal_todayinfo', 'true');
    } catch (e) {}

    if (activeAnnouncements.length === 0) {
      setShowNoticeModal(false);
      triggerMobile4sDelay();
    }
  };

  const handleDeleteAllNotices = () => {
    const allIds = announcements.map(a => a._id);
    setDismissedAnnounceIds(allIds);
    setIsTodayInfoDismissed(true);
    try {
      localStorage.setItem('kumbh_dismissed_modal_announcements', JSON.stringify(allIds));
      localStorage.setItem('kumbh_dismissed_modal_todayinfo', 'true');
    } catch (e) {}
    setShowNoticeModal(false);
    triggerMobile4sDelay();
  };

  // Left column cards (desktop)
  const leftCards = [
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
    }
  ];

  // Right column cards (desktop)
  const rightCards = [
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

  const mobileCards = [
    leftCards[0],  // About Kumbhmela
    rightCards[0], // About Nasik Kumbh (Right side of About Kumbhmela)
    leftCards[1],  // Find Places
    rightCards[1], // Travel & Parking
    leftCards[2],  // Pilgrim Guide
    rightCards[2], // Today's Kumbh
    leftCards[3],  // Nearby Facilities
    rightCards[3], // Help & Safety
    leftCards[4],  // Alerts & News
    rightCards[4]  // Travel Group
  ];

  const renderCard = (btn, idx) => {
    const Icon = btn.icon;
    return (
      <Link
        key={idx}
        to={btn.path}
        className={`p-3 sm:p-3.5 rounded-[32px] border-2 bg-white hover:bg-slate-100 text-slate-900 transition-all hover:scale-102 flex items-center justify-between gap-3 shadow-lg hover:shadow-2xl ${btn.borderColor} my-auto`}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${btn.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold leading-snug text-slate-950 truncate tracking-tight">{t(btn.titleKey)}</h4>
            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">{t(btn.descKey)}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </Link>
    );
  };

  const desktopHeroSection = (
    <div className="relative text-center mx-auto max-w-xl">
      <h2 className="text-2xl sm:text-2xl lg:text-2xl font-black leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] text-amber-100 text-center mx-auto tracking-tight">
        {t('welcome')}
      </h2>
    </div>
  );

  const mobileWelcomeHeader = (
    <div className="text-center pt-1 pb-12">
      <h2 className="text-lg sm:text-2xl font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-amber-100 tracking-tight">
        {t('welcome')}
      </h2>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 relative z-10">
      {/* DESKTOP LAYOUT (lg:): Fixed Height, 0 Scrollbars, Equal Vertical Alignment */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 h-[calc(100vh-85px)] overflow-hidden items-stretch py-1">
        {/* Left Column (5 Cards Equally Spaced Vertically) */}
        <div className="lg:col-span-3 h-full flex flex-col justify-between py-1">
          {leftCards.map((btn, idx) => renderCard(btn, `left-${idx}`))}
        </div>

        {/* Center Column (Welcome Section Vertically Centered) */}
        <div className="lg:col-span-6 h-full flex flex-col items-center justify-center">
          {desktopHeroSection}
        </div>

        {/* Right Column (5 Cards Equally Spaced Vertically) */}
        <div className="lg:col-span-3 h-full flex flex-col justify-between py-1">
          {rightCards.map((btn, idx) => renderCard(btn, `right-${idx}`))}
        </div>
      </div>

      {/* MOBILE & TABLET LAYOUT (< lg): 4-Second Background Reveal Delay */}
      <div 
        onClick={() => setShowMobileContent(true)}
        className="lg:hidden space-y-4 max-w-xl mx-auto min-h-[75vh] cursor-pointer"
      >
        {showMobileContent ? (
          <div className="space-y-4 animate-fade-in transition-all duration-700">
            <div className="grid grid-cols-2 gap-2 sm:gap-3.5">
              {mobileCards.map((btn, idx) => renderCard(btn, `mob-${idx}`))}
            </div>

            {mobileWelcomeHeader}
          </div>
        ) : (
          <div className="min-h-[70vh] flex items-end justify-center pb-8 animate-pulse">
            <div className="bg-slate-950/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-amber-400/50 text-xs font-bold text-amber-200 shadow-2xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Loading Nashik Simhastha 2026...</span>
            </div>
          </div>
        )}
      </div>

      {/* CENTER MODAL POPUP FOR NOTICE & ALERTS */}
      {showNoticeModal && hasActiveModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-fade-in">
          {/* Backdrop dismiss */}
          <div className="absolute inset-0" onClick={handleCloseNoticeModal} />

          {/* Center Modal Container */}
          <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-500 via-orange-500 to-amber-700 p-1 rounded-[32px] shadow-2xl z-10 my-auto">
            <div className="bg-slate-950 text-white rounded-[28px] p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center text-xl font-bold shadow">
                    🛕
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-amber-100 leading-tight">
                      Official Kumbh Notice & Alerts
                    </h3>
                    <p className="text-[10px] text-amber-300/80 font-medium">
                      Nashik Simhastha 2026 Direct Updates
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseNoticeModal}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  aria-label="Close Notice Popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Cards with View and Delete actions */}
              <div className="space-y-4 py-1">
                
                {/* LATEST OFFICIAL NOTICES LIST */}
                {activeAnnouncements.map((ann, idx) => (
                  <div 
                    key={ann._id || idx} 
                    className="bg-white border-2 border-amber-400 rounded-[24px] p-4 text-slate-900 shadow-xl space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow">
                          <AlertTriangle className="w-5 h-5 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {t('latestNotice') || 'Latest Notice'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Link 
                          to="/notifications" 
                          onClick={() => {
                            handleDeleteSingleAnnouncement(ann._id);
                            handleCloseNoticeModal();
                          }}
                          className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-0.5"
                        >
                          <span>{t('view') || 'View'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDeleteSingleAnnouncement(ann._id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                          title="Dismiss from center modal popup"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-950 leading-snug pt-1">
                      {t(ann.title)}: {t(ann.message)}
                    </p>
                  </div>
                ))}

                {/* TODAY'S KUMBH SCHEDULE CARD */}
                {todayInfo && !isTodayInfoDismissed && (
                  <div className="bg-white hover:bg-slate-100 transition-colors rounded-[24px] p-5 border-2 border-amber-400 text-slate-900 shadow-xl space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>{t(todayInfo.title)}</span>
                      </div>

                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {todayInfo.date}
                        </span>

                        <button
                          onClick={handleDeleteTodayInfo}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                          title="Dismiss today's schedule from center modal popup"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {t(todayInfo.description)}
                    </p>

                    <div className="pt-1 flex justify-end">
                      <Link
                        to="/todays-kumbh"
                        onClick={() => {
                          handleDeleteTodayInfo();
                          handleCloseNoticeModal();
                        }}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                      >
                        <span>{t('exploreTodaysSchedule') || "Explore Today's Schedule"}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <button
                  onClick={handleDeleteAllNotices}
                  className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 border border-red-500/40 font-bold flex items-center gap-1.5 transition-colors"
                  title="Dismiss all modal notices permanently for this session"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Delete All Notices</span>
                </button>

                <button
                  onClick={handleCloseNoticeModal}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-transform hover:scale-102"
                >
                  Close Window
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

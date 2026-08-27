import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, AlertTriangle, CheckCircle, Clock, Calendar, Bus, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

const NotificationCentre = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) setNotifications(res.data.data);
      } catch (err) {
        console.log('Error loading notifications');
      } flex: {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getCategoryStyle = (cat = '') => {
    const category = String(cat).trim();
    if (category === 'Emergency Alert') {
      return { badge: 'bg-red-100 text-red-900 border-red-300', icon: ShieldAlert, iconBg: 'bg-red-600 text-white' };
    }
    if (category === 'Daily Info' || category.includes('Daily')) {
      return { badge: 'bg-amber-100 text-amber-900 border-amber-300', icon: Calendar, iconBg: 'bg-amber-600 text-white' };
    }
    if (category === 'Travel & Parking' || category.includes('Travel')) {
      return { badge: 'bg-blue-100 text-blue-900 border-blue-300', icon: Bus, iconBg: 'bg-blue-600 text-white' };
    }
    return { badge: 'bg-cyan-100 text-cyan-900 border-cyan-300', icon: Bell, iconBg: 'bg-cyan-600 text-white' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md border border-white/20">
            🔔
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight truncate">{t('alerts')}</h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium mt-0.5 truncate">
              {t('alertsDesc') || 'Live Broadcast Advisories, Daily Info Releases & Travel Alerts'}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 font-medium">{t('loadingNotifications') || 'Loading notifications...'}</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const style = getCategoryStyle(n.category);
            const Icon = style.icon;
            return (
              <div 
                key={n._id} 
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-start space-x-4 rtl:space-x-reverse hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-2xl ${style.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 font-bold shadow`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider border px-2.5 py-0.5 rounded-full ${style.badge}`}>
                      {t(n.category) || n.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(n.sentAt || n.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-gray-900 leading-snug">{t(n.title)}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{t(n.message)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed text-gray-500 text-xs font-medium">
          {t('noNotificationsYet') || 'No notifications broadcasted yet today.'}
        </div>
      )}
    </div>
  );
};

export default NotificationCentre;

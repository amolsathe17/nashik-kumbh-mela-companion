import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, AlertTriangle, CheckCircle, Clock, Info, ShieldAlert } from 'lucide-react';
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
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-6 rounded-3xl shadow-lg flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          🔔
        </div>
        <div>
          <h2 className="text-2xl font-black">{t('alerts')}</h2>
          <p className="text-xs text-cyan-100 font-medium">
            {t('alertsDesc') || 'In-App Notification Centre & Live Broadcast Advisories'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 font-medium">{t('loadingNotifications') || 'Loading notifications...'}</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div 
              key={n._id} 
              className="bg-white rounded-3xl p-5 border border-cyan-200 shadow-sm flex items-start space-x-4 rtl:space-x-reverse hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-900 px-2.5 py-0.5 rounded-full">
                    {t(n.category) || n.category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(n.sentAt || n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-base text-gray-900">{t(n.title)}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{t(n.message)}</p>
              </div>
            </div>
          ))}
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

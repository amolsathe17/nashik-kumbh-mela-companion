import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PhoneCall, ShieldAlert, Ambulance, Shield, X } from 'lucide-react';

const EmergencyModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const helplines = [
    { title: t('callPolice'), number: '112', icon: Shield, color: 'bg-blue-600' },
    { title: t('callAmbulance'), number: '108', icon: Ambulance, color: 'bg-red-600' },
    { title: t('callKumbhControl'), number: '0253-2575555', icon: ShieldAlert, color: 'bg-amber-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-red-500 text-center relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600 animate-bounce">
          <PhoneCall className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('emergencyHelpline')}</h2>
        <p className="text-xs text-gray-500 mb-5">Tap any helpline to call immediately</p>

        <div className="space-y-3">
          {helplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={`tel:${item.number}`}
                className={`flex items-center justify-between p-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-102 transition-transform ${item.color}`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{item.title}</span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-xl text-base">{item.number}</span>
              </a>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-5 leading-relaxed">
          Official Nashik Police & Medical Emergency Control Desk. Available 24 hours.
        </p>
      </div>
    </div>
  );
};

export default EmergencyModal;

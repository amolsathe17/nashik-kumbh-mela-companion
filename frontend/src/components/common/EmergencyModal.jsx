import React from 'react';
import { createPortal } from 'react-dom';
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold flex-shrink-0">
              <PhoneCall className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">{t('emergencyHelplines')}</h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">24/7 Official Kumbh Emergency Control</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-3">
          {helplines.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={`tel:${item.number}`}
                className={`flex items-center justify-between p-4 rounded-2xl text-white font-bold transition-all shadow-md hover:scale-102 ${item.color}`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-xl text-xs font-mono font-bold">{item.number}</span>
              </a>
            );
          })}

          {/* <p className="text-xs text-slate-500 text-center pt-2 leading-relaxed font-medium">
            {t('officialControlDeskDesc') || 'Official Nashik Police & Medical Emergency Control Desk. Available 24 hours.'}
          </p> */}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EmergencyModal;

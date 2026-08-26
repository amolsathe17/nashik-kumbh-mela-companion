import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PhoneCall, Phone } from 'lucide-react';
import EmergencyModal from '../common/EmergencyModal';

const Footer = () => {
  const { t } = useLanguage();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  return (
    <footer className="relative z-10 bg-slate-900 text-slate-300 mt-0 border-t-4 border-amber-500 text-center">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* App Title & Description Centered */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
            {/* <span className="text-2xl">🛕</span> */}
            <h3 className="text-xl font-bold text-white tracking-tight">{t('appName')}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-5xl mx-auto">
            {t('footerDesc')}
          </p>
        </div>

        {/* Official Helplines Button (Mobile Only - Hidden on Desktop/Laptop) */}
        <div className="pt-2 flex sm:hidden flex-col items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-all animate-pulse border border-red-400/50"
            title="Emergency Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Official Helplines</span>
          </button>
        </div>

        {/* Copyright Centered */}
        <div className="pt-2 text-sm text-slate-500 text-center">
          <p>{t('copyright')}</p>
        </div>
      </div>

      {/* Emergency Call Modal */}
      {isEmergencyOpen && (
        <EmergencyModal isOpen={true} onClose={() => setIsEmergencyOpen(false)} />
      )}
    </footer>
  );
};

export default Footer;

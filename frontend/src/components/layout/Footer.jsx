import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Phone, Heart, Globe } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-0 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
              <span className="text-2xl">🛕</span>
              <h3 className="text-lg font-bold text-white">{t('appName')}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerDesc')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> {t('officialHelplines')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span>{t('policeControlRoom')}</span>
                <a href="tel:112" className="text-amber-300 font-mono hover:underline">112</a>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span>{t('medicalAmbulance')}</span>
                <a href="tel:108" className="text-amber-300 font-mono hover:underline">108</a>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-1">
                <span>{t('pilgrimHelpCentre')}</span>
                <a href="tel:02532575555" className="text-amber-300 font-mono hover:underline">0253-2575555</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> {t('trustSecurity')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('trustDesc')}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

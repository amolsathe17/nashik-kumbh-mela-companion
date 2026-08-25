import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

const LanguageSelect = () => {
  const { supportedLanguages, langCode, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (code) => {
    changeLanguage(code);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-600 via-orange-600 to-amber-800 text-white flex flex-col items-center justify-between p-6">
      {/* Top Header */}
      <div className="text-center pt-8 max-w-md">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-xl border border-white/30 animate-bounce">
          🌐
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Choose Your Language</h1>
        <h2 className="text-xl font-semibold text-amber-100">अपनी भाषा का चयन करें</h2>
        <p className="text-xs text-amber-200 mt-2">
          Nashik Kumbh Mela Digital Companion • Nashik District Administration
        </p>
      </div>

      {/* Language Grid */}
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 my-6 shadow-2xl max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {supportedLanguages.map((lang) => {
            const isSelected = langCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? 'bg-white text-amber-900 font-bold shadow-lg ring-4 ring-amber-300 scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                }`}
              >
                <span className="text-lg font-bold">{lang.nativeName}</span>
                <span className="text-[11px] opacity-80">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-md pb-6 text-center">
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-transform hover:scale-102"
        >
          <span>{t('continueBtn')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LanguageSelect;

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, X, Check, Search } from 'lucide-react';

const LanguageModal = ({ isOpen, onClose }) => {
  const { supportedLanguages, langCode, changeLanguage, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  if (!isOpen) return null;

  const regions = ['All', 'Indian', 'European', 'Eastern European', 'Asia', 'Middle East'];

  const filteredLangs = supportedLanguages.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(search.toLowerCase()) || 
                          lang.nativeName.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || lang.region === selectedRegion || (selectedRegion === 'Indian' && lang.region.includes('Indian'));
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Globe className="w-8 h-8 text-amber-100 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold">{t('chooseLanguage')}</h2>
              <p className="text-xs text-amber-100">{t('selectLanguageSubtitle')}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language / भाषा खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm outline-none rtl:pr-10 rtl:pl-4"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === r 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-white text-gray-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Languages Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[50vh]">
          {filteredLangs.map((lang) => {
            const isSelected = langCode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 font-bold text-amber-900 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-amber-300 hover:bg-amber-50/40 text-gray-800'
                }`}
              >
                <div className="rtl:text-right">
                  <div className="text-base font-semibold">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500 font-normal">{lang.name}</div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 shadow-md transition-all text-sm"
          >
            {t('continueBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;

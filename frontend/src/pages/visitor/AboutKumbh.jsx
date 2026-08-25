import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LandPlot, Sparkles, Compass, ShieldCheck, MapPin, Calendar, Scroll, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutKumbh = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 bg-slate-950 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="/kumbh-bg.jpg" 
            alt="Nashik Kumbh Mela Culture and Heritage" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/80 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-amber-50 shadow border border-amber-300/40">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Official Government Tourism & Heritage Directory • nashik.gov.in</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-amber-100 drop-shadow">
            {t('aboutKumbhHeader')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {t('aboutKumbhSub') || 'History, Myths, Sacred Ghats & Trimbakeshwar Legacy'}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Mythological Roots & Samudra Manthan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-amber-900 border-b border-amber-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
                🏺
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Ancient Mythology</span>
                <h3 className="text-xl font-bold text-slate-950">
                  {t('samudraManthan')}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p>{t('samudraManthanP1')}</p>
              <p>{t('samudraManthanP2')}</p>
              <div className="p-4 bg-amber-50 rounded-2xl border-l-4 border-amber-500 text-amber-950 italic text-xs font-semibold">
                "{t('samudraManthanQuote')}"
              </div>
            </div>
          </div>

          {/* Section 2: Astrological Significance of Simhastha */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-md space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-rose-900 border-b border-rose-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-xl font-bold">
                ♌
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">Celestial Alignment</span>
                <h3 className="text-xl font-bold text-slate-950">
                  {t('simhasthaSignificance')}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p>{t('simhasthaP1')}</p>
              <p>{t('simhasthaP2')}</p>
            </div>
          </div>

          {/* Section 3: Akharas, Sadhus & Living Heritage */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-md space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-purple-900 border-b border-purple-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl font-bold">
                🚩
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider">Monastic Traditions</span>
                <h3 className="text-xl font-bold text-slate-950">
                  {t('akharasHeritage')}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p>{t('akharasP1')}</p>
              <p>{t('akharasP2')}</p>
            </div>
          </div>

          {/* Photographic Highlight Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-200 shadow-md space-y-4">
            <h4 className="font-bold text-base text-slate-950 flex items-center space-x-2">
              <Scroll className="w-5 h-5 text-amber-600" />
              <span>{t('historicHeritageTitle')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <img 
                  src="/goda-aarti-chatg.webp" 
                  alt="Godavari Aarti Ramkund" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 bg-slate-50 text-xs font-bold text-slate-800">
                  {t('ramkundAartiCap')}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <img 
                  src="/dhwajarohan.webp" 
                  alt="Trimbakeshwar Jyotirlinga Temple" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 bg-slate-50 text-xs font-bold text-slate-800">
                  {t('trimbakeshwarCap')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Action Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Facts Box */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-base text-amber-950 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <span>Simhastha At A Glance</span>
            </h3>

            <ul className="space-y-2.5 font-bold text-amber-900">
              <li className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-amber-700">Recurrence:</span>
                <span>Every 12 Years</span>
              </li>
              <li className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-amber-700">Primary River:</span>
                <span>Holy Godavari (Dakshin Ganga)</span>
              </li>
              <li className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-amber-700">Key Bathing Sites:</span>
                <span>Ramkund & Kushavarta Kund</span>
              </li>
              <li className="flex justify-between border-b border-amber-200/60 pb-1.5">
                <span className="text-amber-700">Astrological Sign:</span>
                <span>Jupiter in Leo (Simha Rashi)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-amber-700">Organized By:</span>
                <span>Government of Maharashtra</span>
              </li>
            </ul>
          </div>

          {/* Quick Service Links */}
          <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 space-y-4 shadow-md text-xs">
            <h3 className="font-bold text-base text-slate-950 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Explore Visitor Services</span>
            </h3>

            <div className="space-y-2">
              <Link 
                to="/pilgrim-guide" 
                className="p-3 bg-indigo-50 hover:bg-indigo-100 rounded-2xl border border-indigo-200 flex items-center justify-between font-bold text-indigo-900 transition-all"
              >
                <span>👑 Shahi Snan Dates & Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                to="/find-places" 
                className="p-3 bg-amber-50 hover:bg-amber-100 rounded-2xl border border-amber-200 flex items-center justify-between font-bold text-amber-900 transition-all"
              >
                <span>📍 Find Sacred Ghats & Temples</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                to="/travel-parking" 
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 flex items-center justify-between font-bold text-blue-900 transition-all"
              >
                <span>🚌 Shuttles & Parking Availability</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Official Source Banner */}
          <div className="p-4 bg-slate-900 text-white rounded-3xl text-center space-y-2 border border-slate-800 shadow">
            <div className="text-2xl">🏛️</div>
            <h4 className="font-bold text-xs">Official Heritage Source</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Reference: Nashik District Administration, Government of Maharashtra.
            </p>
            <a
              href="https://nashik.gov.in/en/tourism/culture-heritage/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] font-bold text-amber-300 hover:underline pt-1"
            >
              Visit Official Government Portal ↗
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutKumbh;

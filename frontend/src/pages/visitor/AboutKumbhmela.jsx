import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Sparkles, MapPin, Calendar, Award, Compass, Scroll, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutKumbhmela = () => {
  const { t } = useLanguage();

  const locationsTable = [
    { city: t('haridwar'), river: t('gangaRiver'), ghat: t('harKiPauri') },
    { city: t('prayagraj'), river: t('sangamRiver'), ghat: t('triveniSangam') },
    { city: t('nashikTrimbak'), river: t('godavariRiver'), ghat: t('ramkundKushavart') },
    { city: t('ujjain'), river: t('shipraRiver'), ghat: t('simhasthaGhat') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500 bg-slate-950 text-white p-6 sm:p-10">
        <div className="absolute inset-0 opacity-35">
          <img 
            src="/kumbh-bg.jpg" 
            alt="History of Kumbh Mela" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/80 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-amber-50 shadow border border-amber-300/40">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{t('unescoHeritageBadge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-amber-100 drop-shadow">
            {t('aboutKumbhmela')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {t('aboutKumbhmelaDesc')}
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Section 1: What is Kumbh Mela? */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md space-y-4">
            <div className="text-amber-900 border-b border-amber-100 pb-3">
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                {t('whatIsKumbhTitle')}
              </h3>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{t('whatIsKumbhBody1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{t('whatIsKumbhBody2')}</span>
              </li>
              <li className="p-3.5 bg-amber-50 rounded-2xl border-l-4 border-amber-500 text-amber-950 font-bold text-xs flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>{t('unescoDetail')}</span>
              </li>
            </ul>
          </div>

          {/* Section 2: Where is Kumbh Held? (Table) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md space-y-4">
            <div className="text-blue-900 border-b border-blue-100 pb-3">
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                {t('whereIsKumbhTitle')}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white font-bold">
                    <th className="p-3 rounded-tl-2xl">{t('kumbhRegion')}</th>
                    <th className="p-3">{t('holyRiver')}</th>
                    <th className="p-3 rounded-tr-2xl">{t('mainIdentity')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {locationsTable.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="p-3 font-bold text-blue-950">{row.city}</td>
                      <td className="p-3">{row.river}</td>
                      <td className="p-3 text-amber-700 font-bold">{row.ghat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: History & Speciality of Nashik-Trimbakeshwar Kumbh */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-md space-y-4">
            <div className="text-purple-900 border-b border-purple-100 pb-3">
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                {t('kumbhHistoryTitle')}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p>• {t('kumbhHistoryPoint1')}</p>
              <p>• {t('kumbhHistoryPoint2')}</p>
              <p>• {t('kumbhHistoryPoint3')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="font-bold text-amber-900 block text-xs">{t('vaishnavAkharas')}</span>
                  <span className="text-xs text-slate-700 font-semibold">{t('nashikRamkund')}</span>
                </div>
                <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200">
                  <span className="font-bold text-purple-900 block text-xs">{t('shaivaAkharas')}</span>
                  <span className="text-xs text-slate-700 font-semibold">{t('trimbakKushavart')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Shahi Snan / Amrit Snan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-md space-y-4">
            <div className="text-rose-900 border-b border-rose-100 pb-3">
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                {t('shahiSnanTitle')}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p>• {t('shahiSnanDetail1')}</p>
              <p>• {t('shahiSnanDetail2')}</p>
            </div>
          </div>

          {/* Section 5: Schedule & Simhastha Name */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-md space-y-4">
            <div className="text-emerald-900 border-b border-emerald-100 pb-3">
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                {t('astrologyTitle')}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p>• {t('astrologyDetail1')}</p>
              <p>• {t('astrologyDetail2')}</p>
              <p>• {t('astrologyDetail3')}</p>
            </div>
          </div>

        </div>

        {/* Sidebar Info & Navigation (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Pilgrim Benefits Summary Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg flex items-center space-x-2 border-b border-amber-300/40 pb-2 tracking-tight">
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>{t('pilgrimBenefitsTitle')}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                <strong className="block text-amber-100 text-sm font-semibold">{t('religious')}</strong>
                <span>{t('religiousBenefit')}</span>
              </div>

              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                <strong className="block text-amber-100 text-sm font-semibold">{t('personal')}</strong>
                <span>{t('personalBenefit')}</span>
              </div>

              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                <strong className="block text-amber-100 text-sm font-semibold">{t('socialCultural')}</strong>
                <span>{t('socialBenefit')}</span>
              </div>
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-md text-xs">
            <h3 className="font-bold text-base text-slate-950 flex items-center space-x-2 tracking-tight">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>{t('exploreRelatedPages') || 'Explore Related Pages'}</span>
            </h3>

            <div className="space-y-2">
              <Link 
                to="/about-kumbh" 
                className="p-3 bg-amber-50 hover:bg-amber-100 rounded-2xl border border-amber-200 flex items-center justify-between font-medium text-amber-900 transition-all"
              >
                <span>🏛️ {t('aboutKumbh')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                to="/pilgrim-guide" 
                className="p-3 bg-rose-50 hover:bg-rose-100 rounded-2xl border border-rose-200 flex items-center justify-between font-medium text-rose-900 transition-all"
              >
                <span>👑 {t('pilgrimGuide')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link 
                to="/find-places" 
                className="p-3 bg-indigo-50 hover:bg-indigo-100 rounded-2xl border border-indigo-200 flex items-center justify-between font-medium text-indigo-900 transition-all"
              >
                <span>📍 {t('findPlaces')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Verified Reference Footer */}
          <div className="p-4 bg-slate-900 text-white rounded-3xl text-center space-y-1.5 border border-slate-800 shadow text-xs">
            <div className="text-xl">📜</div>
            <h4 className="font-bold text-xs">{t('verifiedReferenceSource')}</h4>
            <p className="text-[11px] text-slate-400">
              {t('verifiedReferenceText')}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutKumbhmela;

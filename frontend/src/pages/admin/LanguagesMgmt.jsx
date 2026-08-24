import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../locales/languages';
import { Globe, CheckCircle, Clock } from 'lucide-react';

const LanguagesMgmt = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Languages & Translation Matrix</h2>
        <p className="text-xs text-slate-500">25+ Indian and International Languages Supported with Unicode & RTL</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-600" /> System Supported Languages (25 Active)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div key={lang.code} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">{lang.nativeName}</div>
                <div className="text-slate-500">{lang.name} ({lang.code})</div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                  {lang.dir.toUpperCase()}
                </span>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1">Ready</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagesMgmt;

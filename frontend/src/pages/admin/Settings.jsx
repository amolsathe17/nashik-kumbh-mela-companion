import React from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, Server } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">System Settings</h2>
        <p className="text-xs text-slate-500">API Gateway, Database Mode & Fallback Configurations</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-xl text-xs">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Server className="w-5 h-5 text-amber-600" /> Platform Infrastructure Configuration
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border space-y-1">
            <div className="font-bold text-slate-800">Backend API URL</div>
            <div className="font-mono text-slate-600">{import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border space-y-1">
            <div className="font-bold text-slate-800">Fallback Language Config</div>
            <div className="font-mono text-slate-600">English ('en')</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border space-y-1">
            <div className="font-bold text-slate-800">Push Notification Gateway</div>
            <div className="font-mono text-slate-600">WebPush / FCM Cloud Messaging Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

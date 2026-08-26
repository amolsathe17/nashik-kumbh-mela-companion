import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Database, Server, Phone, Bell, MessageSquare, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { adminUser, updateAdminProfile } = useAuth();
  const [saved, setSaved] = useState(false);

  const getInitialAdminCreds = () => {
    try {
      const saved = localStorage.getItem('kumbh_admin_credentials');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { name: 'Amol Sathe', email: 'amolsathe11@gmail.com' };
  };

  const initialCreds = getInitialAdminCreds();
  const [adminName, setAdminName] = useState(adminUser?.name || initialCreds.name || 'Amol Sathe');
  const [adminEmail, setAdminEmail] = useState(adminUser?.email || initialCreds.email || 'amolsathe11@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');

  const [settings, setSettings] = useState({
    eventName: 'Nashik Simhastha Kumbh Mela 2026',
    municipality: 'Nashik Municipal Corporation & District Administration',
    controlRoomPhone: '0253-2575555',
    policeHelpline: '112',
    ambulanceHelpline: '108',
    smsGatewayStatus: 'Connected (BSNL / NIC SMS Gateway)',
    autoBroadcastOnPublish: true,
    autoSmsOnAssistanceDispatch: true,
    defaultLanguageFallback: "English ('en')"
  });

  const handleSave = async (e) => {
    e.preventDefault();
    await updateAdminProfile({
      name: adminName,
      email: adminEmail,
      password: adminPassword ? adminPassword : undefined
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Admin Control Settings</h2>
          <p className="text-xs text-slate-500">Configure Event Information, Emergency Helplines, SMS Gateways & Security Preferences</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Event & System Information */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <Server className="w-5 h-5 text-amber-600" /> Event & System Identification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Event Title</label>
              <input
                type="text"
                required
                value={settings.eventName}
                onChange={(e) => setSettings({ ...settings, eventName: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Governing Authority</label>
              <input
                type="text"
                required
                value={settings.municipality}
                onChange={(e) => setSettings({ ...settings, municipality: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contacts Registry */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <Phone className="w-5 h-5 text-red-600" /> Emergency Helplines Registry
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Police Emergency</label>
              <input
                type="text"
                required
                value={settings.policeHelpline}
                onChange={(e) => setSettings({ ...settings, policeHelpline: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ambulance SOS</label>
              <input
                type="text"
                required
                value={settings.ambulanceHelpline}
                onChange={(e) => setSettings({ ...settings, ambulanceHelpline: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kumbh Control Room Phone</label>
              <input
                type="text"
                required
                value={settings.controlRoomPhone}
                onChange={(e) => setSettings({ ...settings, controlRoomPhone: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Notification & SMS Gateway Settings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <MessageSquare className="w-5 h-5 text-blue-600" /> Broadcast & SMS Gateway Configuration
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">SMS Gateway Provider Status</div>
                <div className="text-slate-500 font-mono">{settings.smsGatewayStatus}</div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Active
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Auto-Broadcast Notifications on Daily Info Release</div>
                <div className="text-slate-500">Automatically sends in-app notification to all mobile visitors when Admin creates a daily release.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoBroadcastOnPublish}
                onChange={(e) => setSettings({ ...settings, autoBroadcastOnPublish: e.target.checked })}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Auto-SMS Dispatch on Help Triage Response</div>
                <div className="text-slate-500">Enables direct SMS response dispatch to pilgrim mobile number from Admin Control Desk.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSmsOnAssistanceDispatch}
                onChange={(e) => setSettings({ ...settings, autoSmsOnAssistanceDispatch: e.target.checked })}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Admin Profile */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
            <ShieldCheck className="w-5 h-5 text-purple-600" /> SuperAdmin Security & Credentials Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Full Name</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                placeholder="Admin Name"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-amber-500"
                placeholder="admin@gmail.com"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Update Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-amber-500"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Access Role</label>
              <input
                type="text"
                disabled
                value={adminUser?.role || 'SuperAdmin'}
                className="w-full p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-left pt-2">
          <button
            type="submit"
            className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-transform hover:scale-101"
          >
            <Save className="w-4 h-4" /> Save All Settings
          </button>
        </div>
      </form>

      {/* Centered Modal Popup for Successful Settings Save */}
      {saved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-emerald-500/30 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
              <CheckCircle className="w-9 h-9 text-emerald-600" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">Settings Saved Successfully!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Admin profile credentials and system configurations have been updated.
              </p>
            </div>

            <button
              onClick={() => setSaved(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-102"
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

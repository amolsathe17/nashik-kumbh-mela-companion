import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HelpCircle, PhoneCall, ShieldAlert, CheckCircle2, Send, HeartPulse, User, MapPin } from 'lucide-react';
import api from '../../services/api';

const HelpSafety = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    requestType: 'General Assistance',
    requesterName: '',
    contactInfo: '',
    locationDescription: '',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/assistance', formData);
      if (res.data.success) {
        setSubmitted(true);
        setFormData({
          requestType: 'General Assistance',
          requesterName: '',
          contactInfo: '',
          locationDescription: '',
          description: ''
        });
      }
    } catch (err) {
      alert(t('submitError') || 'Error submitting request. Please try calling emergency numbers below if urgent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-700 text-white p-5 sm:p-6 rounded-[28px] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden min-h-[96px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse z-10 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md border border-white/20">
            🆘
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight truncate">{t('helpSafety')}</h2>
            <p className="text-xs sm:text-sm text-red-100 font-medium mt-0.5 truncate">
              {t('helpSafetyDesc') || 'Lost & Found, Pilgrim Support & Official Helplines'}
            </p>
          </div>
        </div>
      </div>

      {/* Non-Emergency Assistance Form Card */}
      <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-md space-y-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-red-900">
          <HelpCircle className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-lg">{t('nonEmergencyHelp')}</h3>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">{t('requestSuccess')}</h4>
            <p className="text-xs text-emerald-700 font-medium">
              {t('requestSuccessDesc') || 'Your request has been received with care. Our dedicated Kumbh volunteers and control room team are attending to your request immediately. Stay safe and blessed.'}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-bold text-emerald-800 underline"
            >
              {t('submitAnother') || 'Submit another request'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('requestType')}</label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="General Assistance">{t('General Assistance') || 'General Assistance'}</option>
                  <option value="Lost & Found">{t('Lost & Found') || 'Lost & Found'}</option>
                  <option value="Medical Support">{t('Medical Support') || 'Medical Support'}</option>
                  <option value="Senior Citizen Support">{t('Senior Citizen Support') || 'Senior Citizen Support'}</option>
                  <option value="Directions Help">{t('Directions Help') || 'Directions Help'}</option>
                  <option value="Other">{t('Other') || 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('requesterName')}</label>
                <input
                  type="text"
                  required
                  value={formData.requesterName}
                  onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('contactInfo')}</label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('locationDesc')}</label>
                <input
                  type="text"
                  required
                  value={formData.locationDescription}
                  onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                  placeholder="e.g. Near Gate 3, Ramkund"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('problemDesc')}</label>
              <textarea
                rows="3"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your situation in detail..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 font-medium"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md inline-flex items-center space-x-2 transition-transform hover:scale-101 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? (t('submitting') || 'Submitting...') : t('submitRequest')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Emergency Phone Helplines Section */}
      <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-lg text-red-950 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-600" />
          <span>{t('emergencyHelpline')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="tel:112"
            className="p-4 bg-white rounded-2xl border border-red-200 shadow-sm flex items-center justify-between hover:bg-red-100/50 transition-colors"
          >
            <div>
              <span className="text-xs text-slate-500 font-bold block">{t('policeControlRoom')}</span>
              <span className="text-base font-bold text-red-700">{t('callPolice')}</span>
            </div>
            <span className="text-xl">👮</span>
          </a>

          <a
            href="tel:108"
            className="p-4 bg-white rounded-2xl border border-red-200 shadow-sm flex items-center justify-between hover:bg-red-100/50 transition-colors"
          >
            <div>
              <span className="text-xs text-slate-500 font-bold block">{t('medicalAmbulance')}</span>
              <span className="text-base font-bold text-red-700">{t('callAmbulance')}</span>
            </div>
            <span className="text-xl">🚑</span>
          </a>

          <a
            href="tel:02532575555"
            className="p-4 bg-white rounded-2xl border border-red-200 shadow-sm flex items-center justify-between hover:bg-red-100/50 transition-colors"
          >
            <div>
              <span className="text-xs text-slate-500 font-bold block">{t('pilgrimHelpCentre')}</span>
              <span className="text-base font-bold text-red-700">0253-2575555</span>
            </div>
            <span className="text-xl">📞</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSafety;

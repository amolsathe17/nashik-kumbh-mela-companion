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
      alert('Error submitting request. Please try calling emergency numbers below if urgent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-amber-700 text-white p-6 rounded-3xl shadow-lg flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
          🆘
        </div>
        <div>
          <h2 className="text-2xl font-black">{t('helpSafety')}</h2>
          <p className="text-xs text-red-100 font-medium">Lost & Found, Pilgrim Support & Official Helplines</p>
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
            <p className="text-xs text-emerald-700">
              Our volunteer desk and police helpline officers at Panchavati HQ have received your inquiry.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-bold text-emerald-800 underline"
            >
              Submit another request
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
                  <option>General Assistance</option>
                  <option>Lost & Found</option>
                  <option>Medical Support</option>
                  <option>Senior Citizen Support</option>
                  <option>Directions Help</option>
                  <option>Other</option>
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
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('contactInfo')}</label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="Mobile number or WhatsApp"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('locationDesc')}</label>
                <input
                  type="text"
                  value={formData.locationDescription}
                  onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                  placeholder="e.g. Gate 3, Ramkund Ghat"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('problemDesc')}</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your question, lost item, or assistance needed..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center space-x-2 transition-transform hover:scale-101"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : t('submitRequest')}</span>
            </button>
          </form>
        )}
      </div>

      {/* Emergency Helplines Direct Dial Box */}
      <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-red-950 text-base flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-600" /> Immediate Emergency Direct Dial
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="tel:112"
            className="p-4 rounded-2xl bg-blue-600 text-white font-bold text-center shadow-md hover:bg-blue-700"
          >
            <div className="text-xs font-normal opacity-90">Police Control</div>
            <div className="text-xl font-mono">112</div>
          </a>
          <a
            href="tel:108"
            className="p-4 rounded-2xl bg-red-600 text-white font-bold text-center shadow-md hover:bg-red-700"
          >
            <div className="text-xs font-normal opacity-90">Medical Ambulance</div>
            <div className="text-xl font-mono">108</div>
          </a>
          <a
            href="tel:02532575555"
            className="p-4 rounded-2xl bg-amber-600 text-white font-bold text-center shadow-md hover:bg-amber-700"
          >
            <div className="text-xs font-normal opacity-90">Kumbh Help Desk</div>
            <div className="text-sm font-mono mt-1">0253-2575555</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSafety;

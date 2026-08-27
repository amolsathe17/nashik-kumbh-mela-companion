import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Send, AlertTriangle, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import api from '../../services/api';

const AnnouncementsMgmt = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    message: '',
    category: 'Official Announcements',
    targetLanguage: 'All',
    priority: 'Normal'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      if (res.data.success) setAnnouncements(res.data.data);
    } catch (err) {}
    finally { setLoading(false); }
  };

  const handleSend = async () => {
    try {
      const res = await api.post('/announcements', form);
      const notifRes = await api.post('/notifications/send', form);
      if (res.data.success) {
        setShowConfirm(false);
        setForm({ title: '', message: '', category: 'Official Announcements', targetLanguage: 'All', priority: 'Normal' });
        fetchAnnouncements();
        setShowSuccessModal(true);
      }
    } catch (err) {
      alert('Error broadcasting announcement');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Announcements & Push Notifications</h2>
        <p className="text-xs text-slate-500">Send Language-Aware Push Notifications to Mobile Devices</p>
      </div>

      {/* Broadcast Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 max-w-7xl">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-600" /> Create Broadcast Announcement
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Free Shuttle Buses Operating from Parking A"
              className="w-full p-3 bg-slate-50 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notification Message</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Enter short, clear message for pilgrims..."
              className="w-full p-3 bg-slate-50 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 bg-slate-50 border rounded-xl"
              >
                <option>Daily Kumbh Information</option>
                <option>Programme Information</option>
                <option>Official Announcements</option>
                <option>Travel Updates</option>
                <option>Safety Advisories</option>
                <option>Important Alerts</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Language</label>
              <select
                value={form.targetLanguage}
                onChange={(e) => setForm({ ...form, targetLanguage: e.target.value })}
                className="w-full p-3 bg-slate-50 border rounded-xl"
              >
                <option value="All">All Registered Languages</option>
                <option value="hi">Hindi Users Only</option>
                <option value="mr">Marathi Users Only</option>
                <option value="en">English Users Only</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              onClick={() => {
                if (!form.title || !form.message) return alert('Please enter title and message');
                setShowConfirm(true);
              }}
              className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md inline-flex items-center gap-2 transition-all hover:scale-101 border border-amber-500/30"
            >
              <Send className="w-4 h-4" /> Broadcast Push Notification
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 border border-slate-100 shadow-2xl animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">Confirm Push Broadcast</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              You are about to broadcast this notification to approximately 15,400 active pilgrim devices.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1">
              <div className="font-bold text-slate-900">{form.title}</div>
              <div className="text-slate-600">{form.message}</div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-all hover:scale-102"
              >
                Yes, Send Now
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Broadcast Success Modal Popup in Center of Page */}
      {showSuccessModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-emerald-500/30 space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">Broadcast Dispatched!</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Push notification broadcasted successfully to all eligible devices!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-102"
            >
              OK, Got it!
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AnnouncementsMgmt;

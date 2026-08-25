import React, { useState, useEffect } from 'react';
import { Bell, Send, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const AnnouncementsMgmt = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
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
        alert('Push notification broadcasted successfully to all eligible devices!');
      }
    } catch (err) {
      alert('Error broadcasting announcement');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Announcements & Push Notifications</h2>
        <p className="text-xs text-slate-500">Send Language-Aware Push Notifications to Mobile Devices</p>
      </div>

      {/* Broadcast Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-2xl">
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

          <div className="grid grid-cols-2 gap-3">
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

          <button
            onClick={() => {
              if (!form.title || !form.message) return alert('Please enter title and message');
              setShowConfirm(true);
            }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Broadcast Push Notification
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 border-2 border-amber-500">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Confirm Push Broadcast</h3>
            <p className="text-xs text-slate-600">
              You are about to send this notification to approximately 15,400 active pilgrim devices.
            </p>
            <div className="p-3 bg-slate-50 rounded-2xl text-left text-xs space-y-1">
              <div className="font-bold text-slate-800">{form.title}</div>
              <div className="text-slate-600">{form.message}</div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs shadow"
              >
                Yes, Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsMgmt;

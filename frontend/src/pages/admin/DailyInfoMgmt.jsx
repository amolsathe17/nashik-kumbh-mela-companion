import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle, Clock, Trash2, Send, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const DailyInfoMgmt = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    status: 'Published'
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDailyInfo();
  }, []);

  const fetchDailyInfo = async () => {
    try {
      const res = await api.get('/daily-information');
      if (res.data.success) setList(res.data.data);
    } catch (err) {
      console.error('Failed to fetch daily info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/daily-information', form);
      if (res.data.success) {
        setShowModal(false);
        setForm({
          date: new Date().toISOString().split('T')[0],
          title: '',
          description: '',
          status: 'Published'
        });
        fetchDailyInfo();
      }
    } catch (err) {
      alert('Failed to publish daily information');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this daily information item?')) return;
    try {
      const res = await api.delete(`/daily-information/${id}`);
      if (res.data.success) {
        fetchDailyInfo();
      }
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Information Management</h2>
          <p className="text-xs text-slate-500">Publish & Manage Daily Schedules, Rituals & Official Notes for Pilgrims</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" /> Send Daily Information
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading daily information releases...</div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-800">No Daily Releases Found</h3>
            <p className="text-xs text-slate-500">Click "Send Daily Information" to publish schedule updates.</p>
          </div>
        ) : (
          list.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Date: {item.date}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {item.status}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Publish Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-amber-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-600" /> Send Daily Information
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Today's Shahi Snan Schedule & Official Guidelines"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Official Instructions</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter detailed daily information, bathing ghat notes, or schedule details..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Send & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyInfoMgmt;

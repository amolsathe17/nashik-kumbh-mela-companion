import React, { useState, useEffect } from 'react';
import { Compass, Plus, Trash2, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const PilgrimGuideMgmt = () => {
  const [guideItems, setGuideItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    category: 'Shahi Snan',
    title: '',
    eventDate: '',
    location: '',
    description: '',
    highlightsText: ''
  });

  useEffect(() => {
    fetchGuideItems();
  }, []);

  const fetchGuideItems = async () => {
    try {
      const res = await api.get('/pilgrim-guide');
      if (res.data.success) setGuideItems(res.data.data);
    } catch (err) {
      console.error('Failed to fetch guide items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const highlights = form.highlightsText
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const payload = {
        category: form.category,
        title: form.title,
        eventDate: form.eventDate,
        location: form.location,
        description: form.description,
        highlights: highlights.length > 0 ? highlights : [form.description]
      };

      const res = await api.post('/pilgrim-guide', payload);
      if (res.data.success) {
        setShowModal(false);
        setForm({
          category: 'Shahi Snan',
          title: '',
          eventDate: '',
          location: '',
          description: '',
          highlightsText: ''
        });
        fetchGuideItems();
      }
    } catch (err) {
      alert('Error creating pilgrim guide card');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Pilgrim Guide card?')) return;
    try {
      const res = await api.delete(`/pilgrim-guide/${id}`);
      if (res.data.success) {
        fetchGuideItems();
      }
    } catch (err) {
      alert('Error deleting guide card');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pilgrim Guide Management</h2>
          <p className="text-xs text-slate-500">Create & Manage Cards for Shahi Snan Dates, Rituals, Akharas & Guidelines</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" /> Add Guide Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-500 font-medium">Loading pilgrim guide cards...</div>
        ) : guideItems.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="font-bold text-slate-800">No Custom Pilgrim Guide Cards Yet</h3>
            <p className="text-xs text-slate-500">Click "Add Guide Card" to create guide cards visible to all visitors.</p>
          </div>
        ) : (
          guideItems.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    {item.eventDate && (
                      <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        🗓️ {item.eventDate}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              {item.location && <p className="text-xs text-slate-500 font-medium">📍 Location: {item.location}</p>}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-rose-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-rose-600" /> Create Pilgrim Guide Card
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guide Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold"
                >
                  <option value="Shahi Snan">👑 Shahi Snan Dates</option>
                  <option value="Ritual Guide">🔱 Sacred Rituals</option>
                  <option value="Akharas">🛕 Akharas & Sadhus</option>
                  <option value="Temple Guide">🚩 Temple Guide</option>
                  <option value="Travel & Safety">🛡️ Travel & Safety Guidelines</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Royal Shahi Snan Bathing Instructions & Pass Rules"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event Date (Optional)</label>
                  <input
                    type="text"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    placeholder="e.g. 02 August 2027"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Ramkund Ghat & Trimbak"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide comprehensive details about this ritual, bathing date, or pilgrim guideline..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Highlights (1 per line)</label>
                <textarea
                  rows={2}
                  value={form.highlightsText}
                  onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
                  placeholder="Enter key highlight bullet points (one line per bullet)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
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
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow"
                >
                  Save & Publish Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PilgrimGuideMgmt;

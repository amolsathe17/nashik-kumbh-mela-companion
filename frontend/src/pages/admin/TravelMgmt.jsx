import React, { useState, useEffect } from 'react';
import { Bus, Car, Footprints, Plus } from 'lucide-react';
import api from '../../services/api';

const TravelMgmt = () => {
  const [updates, setUpdates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'Shuttle',
    description: '',
    occupancyPercentage: 50
  });

  useEffect(() => {
    fetchTravel();
  }, []);

  const fetchTravel = async () => {
    try {
      const res = await api.get('/travel');
      if (res.data.success) setUpdates(res.data.data);
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/travel', form);
      if (res.data.success) {
        setShowModal(false);
        fetchTravel();
      }
    } catch (err) { alert('Error updating travel info'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Travel & Parking Management</h2>
          <p className="text-xs text-slate-500">Update Shuttle Services, Parking Occupancy & Diversions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Travel Update
        </button>
      </div>

      <div className="space-y-3">
        {updates.map((item) => (
          <div key={item._id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600">{item.description}</p>
              <span className="inline-block mt-1 text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                {item.type}
              </span>
            </div>
            {item.occupancyPercentage !== undefined && (
              <span className="font-mono font-bold text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-xl">
                {item.occupancyPercentage}% Filled
              </span>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Travel Update</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option>Shuttle</option>
                  <option>Parking</option>
                  <option>Walking Route</option>
                  <option>Road Diversion</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Publish Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelMgmt;

import React, { useState, useEffect } from 'react';
import { Building2, Plus, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const FacilitiesMgmt = () => {
  const [facilities, setFacilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Food Area',
    location: '',
    capacityNotes: ''
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await api.get('/facilities');
      if (res.data.success) setFacilities(res.data.data);
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/facilities', form);
      if (res.data.success) {
        setShowModal(false);
        fetchFacilities();
      }
    } catch (err) { alert('Error adding facility'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Nearby Facilities Management</h2>
          <p className="text-xs text-slate-500">Manage Verified Camps, Food Arenas, Pharmacies & Rest Centers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((fac) => (
          <div key={fac._id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-slate-900">{fac.name}</h3>
                <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full">
                  {fac.category}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600">Verified</span>
            </div>
            <p className="text-xs text-slate-600">{fac.location}</p>
            {fac.capacityNotes && <p className="text-xs text-slate-500 italic">{fac.capacityNotes}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Facility</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option>Accommodation</option>
                  <option>Food Area</option>
                  <option>Drinking Water</option>
                  <option>Toilet</option>
                  <option>Medical</option>
                  <option>Pharmacy</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Capacity Notes</label>
                <textarea
                  rows={2}
                  value={form.capacityNotes}
                  onChange={(e) => setForm({ ...form, capacityNotes: e.target.value })}
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
                  className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesMgmt;

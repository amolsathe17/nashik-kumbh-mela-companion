import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const FacilitiesMgmt = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Food Area',
    location: '',
    capacityNotes: '',
    status: 'Verified'
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await api.get('/facilities');
      if (res.data.success) setFacilities(res.data.data);
    } catch (err) {
      console.error('Failed to fetch facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/facilities', form);
      if (res.data.success) {
        setShowModal(false);
        setForm({
          name: '',
          category: 'Food Area',
          location: '',
          capacityNotes: '',
          status: 'Verified'
        });
        fetchFacilities();
      }
    } catch (err) {
      alert('Error adding facility');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility entry?')) return;
    try {
      const res = await api.delete(`/facilities/${id}`);
      if (res.data.success) {
        fetchFacilities();
      }
    } catch (err) {
      alert('Error deleting facility');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Nearby Facilities Management</h2>
          <p className="text-xs text-slate-500">Create & Manage Verified Camps, Food Arenas, Pharmacies & Rest Centers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" /> Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-500 font-medium">Loading facilities...</div>
        ) : facilities.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <AlertCircle className="w-10 h-10 text-purple-500 mx-auto" />
            <h3 className="font-bold text-slate-800">No Facilities Created Yet</h3>
            <p className="text-xs text-slate-500">Click "Add Facility" to list camps, food arenas, and medical hubs for pilgrims.</p>
          </div>
        ) : (
          facilities.map((fac) => (
            <div key={fac._id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{fac.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full">
                      {fac.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {fac.status || 'Active'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(fac._id)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Delete Facility"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{fac.description || fac.location}</p>
              <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center justify-between gap-1 border-t pt-2 mt-2">
                <span>Notes: {fac.capacityNotes || 'N/A'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl border border-purple-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" /> Add Verified Facility
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
                <label className="block font-bold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tapovan Annadan & Free Meal Arena"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Accommodation">Camp / Accommodation</option>
                  <option value="Food Area">Food / Langar Area</option>
                  <option value="Drinking Water">Drinking Water Spot</option>
                  <option value="Toilet">Sanitary Toilet Block</option>
                  <option value="Medical">Medical Support Camp</option>
                  <option value="Pharmacy">Pharmacy / Dispensary</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Address</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Tapovan Sadhugram Sector 4"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Capacity & Operational Notes</label>
                <textarea
                  rows={2}
                  value={form.capacityNotes}
                  onChange={(e) => setForm({ ...form, capacityNotes: e.target.value })}
                  placeholder="e.g. Free 24/7 langar serving 10,000 pilgrims daily."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
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
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow"
                >
                  Save & Publish Facility
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

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, CheckCircle, Search } from 'lucide-react';
import api from '../../services/api';

const LocationsMgmt = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Ghat',
    address: '',
    description: '',
    lat: 20.0063,
    lng: 73.7915,
    status: 'Active'
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await api.get('/locations');
      if (res.data.success) setLocations(res.data.data);
    } catch (err) {}
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        coordinates: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) }
      };
      const res = await api.post('/locations', payload);
      if (res.data.success) {
        setShowModal(false);
        fetchLocations();
      }
    } catch (err) {
      alert('Error creating location');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Map & Location Management</h2>
          <p className="text-xs text-slate-500">Manage Ghats, Temples, Toilets, Water & Emergency Centers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add New Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <div key={loc._id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-slate-900">{loc.name}</h3>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  {loc.category}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600">{loc.status}</span>
            </div>
            <p className="text-xs text-slate-600">{loc.description}</p>
            <p className="text-xs text-slate-400 font-mono">Coords: {loc.coordinates?.lat}, {loc.coordinates?.lng}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Map Location</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option>Temple</option>
                    <option>Ghat</option>
                    <option>Toilet</option>
                    <option>Drinking Water</option>
                    <option>Medical Centre</option>
                    <option>Police/Help Centre</option>
                    <option>Parking</option>
                    <option>Food Area</option>
                    <option>Camp/Accommodation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                  />
                </div>
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
                  className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsMgmt;

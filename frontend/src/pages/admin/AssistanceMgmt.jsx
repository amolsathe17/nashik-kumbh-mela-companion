import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const AssistanceMgmt = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/assistance');
      if (res.data.success) setRequests(res.data.data);
    } catch (err) {}
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/assistance/${id}`, { status });
      if (res.data.success) fetchRequests();
    } catch (err) { alert('Error updating status'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Pilgrim Assistance & Help Requests</h2>
        <p className="text-xs text-slate-500">Triage Desk: New → In Progress → Resolved</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading requests...</div>
        ) : requests.length > 0 ? (
          requests.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-900">{item.requesterName}</span>
                  <span className="ml-2 text-xs text-slate-500 font-mono">({item.contactInfo})</span>
                </div>
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  className={`text-xs font-bold px-3 py-1 rounded-full border outline-none ${
                    item.status === 'New' 
                      ? 'bg-red-100 text-red-800 border-red-300' 
                      : item.status === 'In Progress'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-amber-800">Category: {item.requestType}</div>
                <p className="text-slate-700">{item.description}</p>
                {item.locationDescription && (
                  <p className="text-slate-500 font-medium">📍 Location: {item.locationDescription}</p>
                )}
              </div>

              {item.internalNotes && (
                <div className="p-3 bg-slate-50 rounded-2xl border text-xs text-slate-600 font-mono">
                  Internal Staff Note: {item.internalNotes}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed text-gray-500">
            No assistance requests logged yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistanceMgmt;

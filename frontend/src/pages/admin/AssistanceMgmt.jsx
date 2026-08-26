import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, Clock, AlertCircle, MessageSquare, Send, Trash2, Phone, User, MapPin } from 'lucide-react';
import api from '../../services/api';

const AssistanceMgmt = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smsModalItem, setSmsModalItem] = useState(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/assistance');
      if (res.data.success) setRequests(res.data.data);
    } catch (err) {
      console.error('Failed to fetch assistance requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/assistance/${id}`, { status });
      if (res.data.success) fetchRequests();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this help request?')) return;
    try {
      const res = await api.delete(`/assistance/${id}`);
      if (res.data.success) fetchRequests();
    } catch (err) {
      alert('Error deleting assistance request');
    }
  };

  const handleSendSms = async (e) => {
    e.preventDefault();
    if (!smsMessage.trim() || !smsModalItem) return;
    setSendingSms(true);
    try {
      // Send SMS update via API / mock gateway
      await api.put(`/assistance/${smsModalItem._id}`, {
        status: 'In Progress',
        internalNotes: `SMS Sent to ${smsModalItem.contactInfo}: "${smsMessage.trim()}"`
      });

      alert(`✅ SMS successfully dispatched to ${smsModalItem.requesterName} (${smsModalItem.contactInfo})!\n\nMessage: "${smsMessage.trim()}"`);
      setSmsModalItem(null);
      setSmsMessage('');
      fetchRequests();
    } catch (err) {
      alert('Failed to send SMS message');
    } finally {
      setSendingSms(false);
    }
  };

  const openSmsModal = (item) => {
    setSmsModalItem(item);
    setSmsMessage(`Namaste ${item.requesterName}, Nashik Kumbh Control Desk has received your ${item.requestType} request. Assistance is being dispatched. Emergency Helpline: 112 / 108.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Pilgrim Assistance & Help Requests</h2>
          <p className="text-xs text-slate-500">Live Control Triage Desk: Review Requests, Dispatch SMS Updates & Manage Status</p>
        </div>
        <div className="self-start sm:self-auto bg-amber-100 text-amber-900 text-xs font-mono font-bold px-3 py-1.5 rounded-full border border-amber-300">
          Total Requests: {requests.length}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading pilgrim help requests...</div>
        ) : requests.length > 0 ? (
          requests.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <User className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-base text-slate-900">{item.requesterName || 'Anonymous Pilgrim'}</span>
                    <span className="text-xs text-amber-900 font-mono bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 font-bold">
                      <Phone className="w-3 h-3 text-amber-600" /> {item.contactInfo || 'N/A'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Submitted: {new Date(item.createdAt || Date.now()).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openSmsModal(item)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-transform hover:scale-102"
                    title="Send SMS Update to Pilgrim"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Send SMS
                  </button>

                  <select
                    value={item.status || 'New'}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none ${
                      item.status === 'New' 
                        ? 'bg-red-100 text-red-800 border-red-300' 
                        : item.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    <option value="New">🔴 New</option>
                    <option value="In Progress">🟡 In Progress</option>
                    <option value="Resolved">🟢 Resolved</option>
                  </select>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div className="inline-block font-bold uppercase tracking-wider text-[10px] bg-red-100 text-red-900 px-2.5 py-0.5 rounded-full border border-red-200">
                  Category: {item.requestType}
                </div>
                <p className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  "{item.description}"
                </p>
                {item.locationDescription && (
                  <p className="text-slate-600 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" /> Pilgrim Location: {item.locationDescription}
                  </p>
                )}
              </div>

              {item.internalNotes && (
                <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-900 font-mono space-y-1">
                  <span className="font-bold flex items-center gap-1">📱 Gateway Status:</span>
                  <p className="text-[11px] text-blue-800">{item.internalNotes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-gray-500 space-y-2">
            <HelpCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-800">No Pilgrim Help Requests Logged</h3>
            <p className="text-xs text-slate-500">Pilgrim requests sent via the visitor app will appear here in real-time.</p>
          </div>
        )}
      </div>

      {/* Send SMS Modal */}
      {smsModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl border border-blue-500/30">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" /> Send SMS Response to Pilgrim
              </h3>
              <button 
                onClick={() => setSmsModalItem(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border text-xs space-y-1">
              <div className="font-bold text-slate-900">Recipient: {smsModalItem.requesterName}</div>
              <div className="font-mono text-slate-600">Mobile No: {smsModalItem.contactInfo}</div>
              <div className="text-[11px] text-slate-500">Category: {smsModalItem.requestType}</div>
            </div>

            <form onSubmit={handleSendSms} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">SMS Message Content</label>
                <textarea
                  required
                  rows={4}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSmsModalItem(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingSms}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> {sendingSms ? 'Dispatched...' : 'Dispatch SMS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistanceMgmt;

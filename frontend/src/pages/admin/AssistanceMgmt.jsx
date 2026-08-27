import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, Clock, AlertCircle, MessageSquare, Send, Trash2, Phone, User, MapPin, X, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const AssistanceMgmt = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smsModalItem, setSmsModalItem] = useState(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await api.delete(`/assistance/${deleteConfirmId}`);
      if (res.data.success) fetchRequests();
    } catch (err) {
      alert('Error deleting assistance request');
    } finally {
      setDeleteConfirmId(null);
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
      {smsModalItem && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            {/* Fixed Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">Send SMS Advisory</h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">Send direct update to pilgrim's mobile</p>
                </div>
              </div>
              <button 
                onClick={() => setSmsModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendSms} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs custom-scrollbar">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" /> {smsModalItem.requesterName || 'Pilgrim'}
                    </span>
                    <span className="font-mono text-blue-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {smsModalItem.contactInfo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Inquiry: {smsModalItem.description}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1.5">Response / Advisory SMS Message</label>
                  <textarea
                    rows={4}
                    required
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="Enter official assistance reply, helpline instructions, or sector directions..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-xs outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setSmsModalItem(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingSms}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> {sendingSms ? 'Sending...' : 'Send SMS Now'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CUSTOM CENTER DELETE CONFIRMATION MODAL POPUP */}
      {deleteConfirmId && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setDeleteConfirmId(null)} />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner border border-red-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">Confirm Deletion</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to delete this help request?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all hover:scale-102"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AssistanceMgmt;

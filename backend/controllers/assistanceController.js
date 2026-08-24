const AssistanceRequest = require('../models/AssistanceRequest');
const memoryStore = require('./dataStore');

const getAssistanceRequests = async (req, res) => {
  try {
    let data = [];
    try {
      data = await AssistanceRequest.find().sort({ createdAt: -1 });
    } catch (e) {
      data = memoryStore.assistanceRequests;
    }
    if (!data || data.length === 0) {
      data = memoryStore.assistanceRequests;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assistance requests' });
  }
};

const createAssistanceRequest = async (req, res) => {
  try {
    const newReq = {
      _id: 'req-' + Date.now(),
      ...req.body,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    try {
      const dbReq = new AssistanceRequest(req.body);
      await dbReq.save();
      return res.status(201).json({ success: true, data: dbReq, message: 'Assistance request submitted successfully' });
    } catch (e) {
      memoryStore.assistanceRequests.unshift(newReq);
      return res.status(201).json({ success: true, data: newReq, message: 'Assistance request submitted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit assistance request' });
  }
};

const updateAssistanceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await AssistanceRequest.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch (e) {}

    const index = memoryStore.assistanceRequests.findIndex(item => item._id === id);
    if (index !== -1) {
      memoryStore.assistanceRequests[index] = { ...memoryStore.assistanceRequests[index], ...req.body };
      return res.json({ success: true, data: memoryStore.assistanceRequests[index] });
    }

    res.status(404).json({ success: false, message: 'Assistance request record not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating assistance request' });
  }
};

module.exports = { getAssistanceRequests, createAssistanceRequest, updateAssistanceRequest };

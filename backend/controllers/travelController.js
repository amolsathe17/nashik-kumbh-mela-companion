const TravelUpdate = require('../models/TravelUpdate');
const memoryStore = require('./dataStore');

const getTravelUpdates = async (req, res) => {
  try {
    let data = [];
    try {
      data = await TravelUpdate.find().sort({ createdAt: -1 });
    } catch (e) {
      data = memoryStore.travelUpdates;
    }
    if (!data || data.length === 0) {
      data = memoryStore.travelUpdates;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch travel updates' });
  }
};

const createTravelUpdate = async (req, res) => {
  try {
    const newItem = {
      _id: 'travel-' + Date.now(),
      ...req.body
    };
    try {
      const dbItem = new TravelUpdate(req.body);
      await dbItem.save();
      return res.status(201).json({ success: true, data: dbItem });
    } catch (e) {
      memoryStore.travelUpdates.unshift(newItem);
      return res.status(201).json({ success: true, data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create travel update' });
  }
};

const updateTravelUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await TravelUpdate.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch (e) {}

    const index = memoryStore.travelUpdates.findIndex(item => item._id === id);
    if (index !== -1) {
      memoryStore.travelUpdates[index] = { ...memoryStore.travelUpdates[index], ...req.body };
      return res.json({ success: true, data: memoryStore.travelUpdates[index] });
    }

    res.status(404).json({ success: false, message: 'Travel update not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating travel information' });
  }
};

module.exports = { getTravelUpdates, createTravelUpdate, updateTravelUpdate };

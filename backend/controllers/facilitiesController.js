const Facility = require('../models/Facility');
const memoryStore = require('./dataStore');

const getFacilities = async (req, res) => {
  try {
    let data = [];
    try {
      data = await Facility.find().sort({ createdAt: -1 });
    } catch (e) {
      data = memoryStore.facilities;
    }
    if (!data || data.length === 0) {
      data = memoryStore.facilities;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch facilities' });
  }
};

const createFacility = async (req, res) => {
  try {
    const newItem = {
      _id: 'fac-' + Date.now(),
      ...req.body
    };
    try {
      const dbItem = new Facility(req.body);
      await dbItem.save();
      return res.status(201).json({ success: true, data: dbItem });
    } catch (e) {
      memoryStore.facilities.unshift(newItem);
      return res.status(201).json({ success: true, data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create facility' });
  }
};

const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Facility.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch (e) {}

    const index = memoryStore.facilities.findIndex(item => item._id === id);
    if (index !== -1) {
      memoryStore.facilities[index] = { ...memoryStore.facilities[index], ...req.body };
      return res.json({ success: true, data: memoryStore.facilities[index] });
    }

    res.status(404).json({ success: false, message: 'Facility record not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating facility' });
  }
};

module.exports = { getFacilities, createFacility, updateFacility };

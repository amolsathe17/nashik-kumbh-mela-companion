const Location = require('../models/Location');
const memoryStore = require('./dataStore');

const getLocations = async (req, res) => {
  try {
    const { category, search } = req.query;
    let data = [];
    try {
      const query = {};
      if (category && category !== 'All') query.category = category;
      if (search) query.name = { $regex: search, $options: 'i' };
      data = await Location.find(query);
    } catch (e) {
      data = memoryStore.locations;
    }
    if (!data || data.length === 0) {
      data = memoryStore.locations;
    }

    // Filter memory store if query provided
    if (category && category !== 'All') {
      data = data.filter(loc => loc.category === category);
    }
    if (search) {
      data = data.filter(loc => loc.name.toLowerCase().includes(search.toLowerCase()) || loc.address.toLowerCase().includes(search.toLowerCase()));
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch locations' });
  }
};

const createLocation = async (req, res) => {
  try {
    const newLoc = {
      _id: 'loc-' + Date.now(),
      ...req.body,
      verified: true
    };
    try {
      const dbLoc = new Location(req.body);
      await dbLoc.save();
      return res.status(201).json({ success: true, data: dbLoc });
    } catch (e) {
      memoryStore.locations.push(newLoc);
      return res.status(201).json({ success: true, data: newLoc });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create location' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Location.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch (e) {}

    const index = memoryStore.locations.findIndex(item => item._id === id);
    if (index !== -1) {
      memoryStore.locations[index] = { ...memoryStore.locations[index], ...req.body };
      return res.json({ success: true, data: memoryStore.locations[index] });
    }

    res.status(404).json({ success: false, message: 'Location not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating location' });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Location.findByIdAndDelete(id);
    } catch (e) {}

    memoryStore.locations = memoryStore.locations.filter(item => item._id !== id);
    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting location' });
  }
};

module.exports = { getLocations, createLocation, updateLocation, deleteLocation };

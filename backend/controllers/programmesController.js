const Program = require('../models/Program');
const memoryStore = require('./dataStore');

const getProgrammes = async (req, res) => {
  try {
    let data = [];
    try {
      data = await Program.find().sort({ createdAt: -1 });
    } catch (e) {
      data = memoryStore.programs;
    }
    if (!data || data.length === 0) {
      data = memoryStore.programs;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch programmes and guide' });
  }
};

const createProgram = async (req, res) => {
  try {
    const newItem = {
      _id: 'prog-' + Date.now(),
      ...req.body
    };
    try {
      const dbItem = new Program(req.body);
      await dbItem.save();
      return res.status(201).json({ success: true, data: dbItem });
    } catch (e) {
      memoryStore.programs.unshift(newItem);
      return res.status(201).json({ success: true, data: newItem });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create programme' });
  }
};

const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Program.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch (e) {}

    const index = memoryStore.programs.findIndex(item => item._id === id);
    if (index !== -1) {
      memoryStore.programs[index] = { ...memoryStore.programs[index], ...req.body };
      return res.json({ success: true, data: memoryStore.programs[index] });
    }

    res.status(404).json({ success: false, message: 'Programme record not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating programme' });
  }
};

module.exports = { getProgrammes, createProgram, updateProgram };

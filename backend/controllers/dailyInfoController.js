const DailyInfo = require('../models/DailyInfo');
const memoryStore = require('./dataStore');

const getDailyInfo = async (req, res) => {
  try {
    let data = [];
    try {
      data = await DailyInfo.find().sort({ createdAt: -1 });
    } catch (e) {
      data = memoryStore.dailyInfo;
    }
    if (!data || data.length === 0) {
      data = memoryStore.dailyInfo;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch daily information' });
  }
};

const getTodayInfo = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    let todayItem = null;
    try {
      todayItem = await DailyInfo.findOne({ status: 'Published' }).sort({ createdAt: -1 });
    } catch (e) {}

    if (!todayItem && memoryStore.dailyInfo.length > 0) {
      todayItem = memoryStore.dailyInfo[0];
    }

    res.json({ success: true, data: todayItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch today\'s Kumbh information' });
  }
};

const createDailyInfo = async (req, res) => {
  try {
    const newItemData = {
      _id: 'daily-' + Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    try {
      const dbItem = new DailyInfo(req.body);
      await dbItem.save();
      return res.status(201).json({ success: true, data: dbItem });
    } catch (e) {
      memoryStore.dailyInfo.unshift(newItemData);
      return res.status(201).json({ success: true, data: newItemData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save daily information' });
  }
};

const updateDailyInfo = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await DailyInfo.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch (e) {}

    const index = memoryStore.dailyInfo.findIndex(item => item._id === id);
    if (index !== -1) {
      memoryStore.dailyInfo[index] = { ...memoryStore.dailyInfo[index], ...req.body };
      return res.json({ success: true, data: memoryStore.dailyInfo[index] });
    }

    res.status(404).json({ success: false, message: 'Daily info record not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating daily info' });
  }
};

module.exports = { getDailyInfo, getTodayInfo, createDailyInfo, updateDailyInfo };

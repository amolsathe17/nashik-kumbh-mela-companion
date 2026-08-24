const Announcement = require('../models/Announcement');
const memoryStore = require('./dataStore');

const getAnnouncements = async (req, res) => {
  try {
    let data = [];
    try {
      data = await Announcement.find({ status: 'Published' }).sort({ publishedAt: -1 });
    } catch (e) {
      data = memoryStore.announcements;
    }
    if (!data || data.length === 0) {
      data = memoryStore.announcements;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const newAnn = {
      _id: 'ann-' + Date.now(),
      ...req.body,
      publishedAt: new Date().toISOString()
    };
    try {
      const dbAnn = new Announcement(req.body);
      await dbAnn.save();
      return res.status(201).json({ success: true, data: dbAnn });
    } catch (e) {
      memoryStore.announcements.unshift(newAnn);
      return res.status(201).json({ success: true, data: newAnn });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create announcement' });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Announcement.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    } catch (e) {}

    const index = memoryStore.announcements.findIndex(item => item._id === id);
    if (index !== -1) {
      memoryStore.announcements[index] = { ...memoryStore.announcements[index], ...req.body };
      return res.json({ success: true, data: memoryStore.announcements[index] });
    }

    res.status(404).json({ success: false, message: 'Announcement not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating announcement' });
  }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement };

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const AdminUser = require('./models/AdminUser');
const Location = require('./models/Location');
const DailyInfo = require('./models/DailyInfo');
const Announcement = require('./models/Announcement');
const Program = require('./models/Program');
const memoryStore = require('./controllers/dataStore');

const seedDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI found in .env. Skipping database seed script.');
    process.exit(0);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing
    await AdminUser.deleteMany({});
    await Location.deleteMany({});
    await DailyInfo.deleteMany({});
    await Announcement.deleteMany({});
    await Program.deleteMany({});

    // Seed Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123456', salt);
    await AdminUser.create({
      name: 'Super Admin',
      email: 'admin@kumbhmela.gov.in',
      passwordHash,
      role: 'SuperAdmin'
    });
    console.log('Admin user seeded (admin@kumbhmela.gov.in / Admin@123456)');

    // Seed Locations
    await Location.insertMany(memoryStore.locations.map(({ _id, ...rest }) => rest));
    console.log('Locations seeded');

    // Seed Daily Info
    await DailyInfo.insertMany(memoryStore.dailyInfo.map(({ _id, ...rest }) => rest));
    console.log('Daily Info seeded');

    // Seed Announcements
    await Announcement.insertMany(memoryStore.announcements.map(({ _id, ...rest }) => rest));
    console.log('Announcements seeded');

    // Seed Programs
    await Program.insertMany(memoryStore.programs.map(({ _id, ...rest }) => rest));
    console.log('Programs seeded');

    console.log('✅ Database seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();

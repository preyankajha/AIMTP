const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Zone = require('./models/Zone');
const Department = require('./models/Department');
const { regionData } = require('./zonesData');
const { departments } = require('./departments');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');

    await Zone.deleteMany({});
    await Department.deleteMany({});
    console.log('Cleared existing data');

    const zonesToInsert = [];
    for (const [zName, zObj] of Object.entries(regionData)) {
      const divisions = [];
      for (const [dName, dStations] of Object.entries(zObj.divisions)) {
        divisions.push({ name: dName, stations: dStations });
      }
      zonesToInsert.push({ name: zName, code: zObj.code, divisions });
    }
    await Zone.insertMany(zonesToInsert);

    const deptsToInsert = [];
    for (const [dName, dObj] of Object.entries(departments)) {
      const subDepartments = [];
      for (const [sdName, designations] of Object.entries(dObj.subDepartments)) {
        subDepartments.push({ name: sdName, designations });
      }
      deptsToInsert.push({ name: dName, subDepartments });
    }
    await Department.insertMany(deptsToInsert);

    console.log('Master data successfully seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();

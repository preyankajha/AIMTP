const Zone = require('../models/Zone');
const Department = require('../models/Department');

// ──────────────────────────────────────────
// PUBLIC ROUTES
// ──────────────────────────────────────────

// @desc   Get perfectly formatted data for frontend dropdowns
// @route  GET /api/master-data/public
// @access Public
const getPublicData = async (req, res, next) => {
  try {
    const zones = await Zone.find();
    const departments = await Department.find();

    // Map DB array into the frontend's legacy object map shape
    const regionData = {};
    zones.forEach(z => {
      const divMap = {};
      z.divisions.forEach(d => {
        divMap[d.name] = d.stations && d.stations.length ? d.stations : ['Other'];
      });
      regionData[z.name] = {
        code: z.code,
        divisions: divMap
      };
    });

    const departmentsData = {};
    departments.forEach(d => {
      const subMap = {};
      d.subDepartments.forEach(sd => {
        subMap[sd.name] = sd.designations && sd.designations.length ? sd.designations : [];
      });
      departmentsData[d.name] = {
        subDepartments: subMap
      };
    });

    res.json({ regionData, departments: departmentsData });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────
// ADMIN CRUD: ZONES
// ──────────────────────────────────────────

const getZones = async (req, res, next) => {
  try {
    const zones = await Zone.find().sort({ name: 1 });
    res.json(zones);
  } catch (error) { next(error); }
};

const addZone = async (req, res, next) => {
  try {
    const zone = new Zone(req.body);
    await zone.save();
    res.status(201).json(zone);
  } catch (error) { next(error); }
};

const updateZone = async (req, res, next) => {
  try {
    const zone = await Zone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!zone) return res.status(404).json({ message: 'Zone not found' });
    res.json(zone);
  } catch (error) { next(error); }
};

const removeZone = async (req, res, next) => {
  try {
    const zone = await Zone.findByIdAndDelete(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Zone not found' });
    res.json({ message: 'Zone removed' });
  } catch (error) { next(error); }
};

// ──────────────────────────────────────────
// ADMIN CRUD: DEPARTMENTS
// ──────────────────────────────────────────

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (error) { next(error); }
};

const addDepartment = async (req, res, next) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.status(201).json(dept);
  } catch (error) { next(error); }
};

const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json(dept);
  } catch (error) { next(error); }
};

const removeDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department removed' });
  } catch (error) { next(error); }
};

// ──────────────────────────────────────────
// SEEDER
// ──────────────────────────────────────────
const seedMasterData = async (req, res, next) => {
  try {
    const { regionData } = require('../zonesData.js');
    const { departments } = require('../departments.js');

    await Zone.deleteMany({});
    await Department.deleteMany({});

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

    res.json({ message: 'Master Data successfully seeded' });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getPublicData,
  getZones, addZone, updateZone, removeZone,
  getDepartments, addDepartment, updateDepartment, removeDepartment,
  seedMasterData
};

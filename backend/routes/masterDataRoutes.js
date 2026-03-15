const express = require('express');
const router = express.Router();
const {
  getPublicData,
  getZones, addZone, updateZone, removeZone,
  getDepartments, addDepartment, updateDepartment, removeDepartment,
  seedMasterData
} = require('../controllers/masterDataController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route for dropdowns
router.get('/public', getPublicData);

// Admin Action - run once to import legacy data
router.post('/seed', protect, adminOnly, seedMasterData);

// Protected Admin Routes
router.use(protect);
router.use(adminOnly);

router.get('/zones', getZones);
router.post('/zones', addZone);
router.put('/zones/:id', updateZone);
router.delete('/zones/:id', removeZone);

router.get('/departments', getDepartments);
router.post('/departments', addDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', removeDepartment);

module.exports = router;

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createTransfer,
  getMyTransfers,
  searchTransfers,
  deleteTransfer,
} = require('../controllers/transferController');
const { protect } = require('../middleware/authMiddleware');

const transferValidation = [
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('currentZone').trim().notEmpty().withMessage('Current Zone is required'),
  body('currentDivision').trim().notEmpty().withMessage('Current Division is required'),
  body('currentStation').trim().notEmpty().withMessage('Current Station is required'),
  body('desiredZone').trim().notEmpty().withMessage('Desired Zone is required'),
  body('desiredDivision').trim().notEmpty().withMessage('Desired Division is required'),
  body('desiredStation').trim().notEmpty().withMessage('Desired Station is required'),
  body('desiredStation').custom((value, { req }) => {
    if (value.toUpperCase() === req.body.currentStation?.toUpperCase()) {
      throw new Error('Desired station must be different from current station');
    }
    return true;
  }),
];

router.post('/', protect, transferValidation, createTransfer);
router.get('/my', protect, getMyTransfers);
router.get('/search', protect, searchTransfers);
router.delete('/:id', protect, deleteTransfer);

module.exports = router;

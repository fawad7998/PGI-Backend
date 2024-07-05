const express = require('express');
const {
  createShiftPattern,
  getAllShiftPatterns,
  getShiftPatternById,
  updateShiftPattern,
  deleteShiftPattern,
} = require('../controllers/patternController');
const {protectRoute} = require("../middlewares/authMiddlewares")


const router = express.Router();

router.post('/',protectRoute, createShiftPattern);
router.get('/',protectRoute, getAllShiftPatterns);
router.get('/:id',protectRoute, getShiftPatternById);
router.put('/:id',protectRoute, updateShiftPattern);

router.delete('/:id',protectRoute, deleteShiftPattern);
module.exports = router;
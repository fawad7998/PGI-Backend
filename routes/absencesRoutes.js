const express = require('express');
const router = express.Router();
const {createAbsence,getAllAbsences,getAbsenceById,updateAbsence,deleteAbsence} = require('../controllers/absencesController');
const {protectRoute} = require("../middlewares/authMiddlewares")

router.post('/',protectRoute, createAbsence);
router.get('/',protectRoute, getAllAbsences);
router.get('/:id',protectRoute, getAbsenceById);
router.put('/:id', protectRoute,updateAbsence);
router.delete('/:id', protectRoute,deleteAbsence);

module.exports = router;

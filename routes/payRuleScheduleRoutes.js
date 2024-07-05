const express = require('express');
const router = express.Router();
const {
    createPayRunSchedule,
    getAllPayRunSchedules,
    getPayRunScheduleById,
    updatePayRunSchedule,
    deletePayRunSchedule,
} = require('../controllers/payRuleScheduleController');
const { protectRoute } = require("../middlewares/authMiddlewares");
const asyncHandler = require("express-async-handler")
router.post('/',protectRoute,asyncHandler(createPayRunSchedule) );
router.get('/',protectRoute, asyncHandler(getAllPayRunSchedules));
router.get('/:id',protectRoute, asyncHandler(getPayRunScheduleById));
router.put('/:id',protectRoute, asyncHandler(updatePayRunSchedule));
router.delete('/:id',protectRoute, asyncHandler(deletePayRunSchedule));

module.exports = router;

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
    createPosition,
    getAllPositions,
    getPositionById,
    updatePosition,
    deletePosition,
    assignPositionToProfile
} = require('../controllers/positionController');
const { protectRoute } = require("../middlewares/authMiddlewares");

router.post('/', protectRoute, asyncHandler(createPosition));
router.get('/', protectRoute, asyncHandler(getAllPositions));
router.get('/:id', protectRoute, asyncHandler(getPositionById));
router.put('/:id', protectRoute, asyncHandler(updatePosition));
router.delete('/:id', protectRoute, asyncHandler(deletePosition));
router.put('/:id/assign/:profileId', protectRoute, asyncHandler(assignPositionToProfile));

module.exports = router;

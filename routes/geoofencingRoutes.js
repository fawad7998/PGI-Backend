const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protectRoute } = require("../middlewares/authMiddlewares");
const {
    createGeoOffence,
    getGeoOffences,
    getGeoOffenceById,
    updateGeoOffence,
    deleteGeoOffence
} = require("../controllers/geoofencingController");

// Define routes with appropriate middleware and async handlers
router.post('/', protectRoute, asyncHandler(createGeoOffence));
router.get('/', protectRoute, asyncHandler(getGeoOffences));
router.get('/:id', protectRoute, asyncHandler(getGeoOffenceById));
router.put('/:id', protectRoute, asyncHandler(updateGeoOffence));
router.delete('/:id', protectRoute, asyncHandler(deleteGeoOffence));

module.exports = router;

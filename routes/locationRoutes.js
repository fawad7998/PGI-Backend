const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {setupUploadImageMiddleware}= require('../utils/utilities/cloudinaryConfig');
const {
    createLocation,
    getLocations,
    getLocationById,
    updateLocation,
    deleteLocation
} = require("../controllers/locationController")
const {protectRoute} = require("../middlewares/authMiddlewares")
// Apply the upload middleware to the routes where image upload is required
router.post('/', protectRoute, asyncHandler(createLocation));
router.get('/', protectRoute,asyncHandler(getLocations));
router.get('/:id', protectRoute,asyncHandler(getLocationById));
router.put('/:id', protectRoute, asyncHandler(updateLocation));
router.delete('/:id',protectRoute, asyncHandler(deleteLocation));

module.exports = router;

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {setupUploadImageMiddleware}= require('../utils/utilities/cloudinaryConfig');
const {
    createProfile,
    getProfiles,
    getProfileById,
    updateProfile,
    deleteProfile,
} = require('../controllers/profileController');
const {protectRoute} = require("../middlewares/authMiddlewares")
// Apply the upload middleware to the routes where image upload is required
router.post('/', protectRoute,setupUploadImageMiddleware, asyncHandler(createProfile));
router.get('/', protectRoute,asyncHandler(getProfiles));
router.get('/:id', protectRoute,asyncHandler(getProfileById));
router.put('/:id', protectRoute,setupUploadImageMiddleware, asyncHandler(updateProfile));
router.delete('/:id', protectRoute,asyncHandler(deleteProfile));

module.exports = router;

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {setupUploadImageMiddleware}= require('../utils/utilities/cloudinaryConfig');
const {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
} = require("../controllers/clientController")
const {protectRoute} = require("../middlewares/authMiddlewares")
// Apply the upload middleware to the routes where image upload is required
router.post('/', protectRoute,setupUploadImageMiddleware, asyncHandler(createClient));
router.get('/', protectRoute,asyncHandler(getClients));
router.get('/:id', protectRoute,asyncHandler(getClientById));
router.put('/:id', protectRoute,setupUploadImageMiddleware, asyncHandler(updateClient));
router.delete('/:id',protectRoute, asyncHandler(deleteClient));

module.exports = router;

const express = require('express');
const router = express.Router();
const { setupUploadDocMiddleware } = require('../utils/utilities/cloudinaryConfig');
const {createDocument,getAllDocuments,getDocumentById,updateDocument,deleteDocument} = require('../controllers/documentsController');
const {protectRoute} = require("../middlewares/authMiddlewares")
router.post('/', protectRoute,setupUploadDocMiddleware, createDocument);
router.get('/', protectRoute,getAllDocuments);
router.get('/:id',protectRoute, getDocumentById);
router.put('/:id',protectRoute, setupUploadDocMiddleware, updateDocument);
router.delete('/:id',protectRoute,deleteDocument);

module.exports = router;

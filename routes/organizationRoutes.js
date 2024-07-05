const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
    createOrganization,
    login,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
} = require('../controllers/organizationControllers');

router.post('/', asyncHandler(createOrganization));
router.post('/login', asyncHandler(login));
router.get('/', asyncHandler(getOrganizations));
router.get('/:id', asyncHandler(getOrganizationById));
router.put('/:id', asyncHandler(updateOrganization));
router.delete('/:id', asyncHandler(deleteOrganization));

module.exports = router;

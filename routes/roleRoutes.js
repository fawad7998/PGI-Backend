const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    assignRoleToProfile,
} = require('../controllers/roleController');
const {protectRoute} = require("../middlewares/authMiddlewares")

router.post('/',protectRoute, asyncHandler(createRole));
router.get('/',protectRoute, asyncHandler(getRoles));
router.get('/:id', protectRoute,asyncHandler(getRoleById));
router.put('/:id', protectRoute,asyncHandler(updateRole));
router.delete('/:id', protectRoute,asyncHandler(deleteRole));
router.put("/:id/:profileId",protectRoute,asyncHandler(assignRoleToProfile))
module.exports = router;

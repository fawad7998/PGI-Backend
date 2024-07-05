const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
    registerProfile,
    loginProfile,
    getUserById,
    getAllUsers,
    deleteUserById,
    updateUser
} = require("../controllers/userController");

const { protectRoute } = require("../middlewares/authMiddlewares");

router.post('/register', protectRoute, asyncHandler(registerProfile));
router.post('/login', protectRoute, asyncHandler(loginProfile));
router.get('/:userId', protectRoute, asyncHandler(getUserById));
router.get('/', protectRoute, asyncHandler(getAllUsers));
router.delete('/:userId', protectRoute, asyncHandler(deleteUserById));
router.put('/:userId', protectRoute, asyncHandler(updateUser));

module.exports = router;

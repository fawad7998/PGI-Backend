const express = require('express');
const router = express.Router();
const {invitePerson, deleteInvitation, getAllInvitations, getInvitationById} = require('../controllers/invitationController');
const {protectRoute} = require("../middlewares/authMiddlewares")
const asyncHandler = require("express-async-handler")
router.post('/',protectRoute, asyncHandler(invitePerson));
router.get('/',protectRoute, asyncHandler(getAllInvitations));
router.get('/:invitationId',protectRoute, asyncHandler(getInvitationById));
router.delete('/:invitationId',protectRoute, asyncHandler(deleteInvitation));


module.exports = router;
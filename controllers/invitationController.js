const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");
const { setLog } = require("../utils/logger/logs");
const { sendEmail } = require("../utils/utilities/email");
const { invitationTemplate } = require("../utils/lib/templates/invitationTemplate");

/**
 * Invite a person by sending an email.
 * 
 * This function handles the process of inviting a person by email. It performs the following steps:
 * 1. Validates the request body.
 * 2. Checks if the email format is valid and if the emails are comma-separated.
 * 3. Sends the invitation email.
 * 4. Logs the operation.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const invitePerson = async (req, res) => {
    try {
        const { emails } = req.body;

        if (!emails) {
            return useErrorResponse(res, errorMessages.Invitation.InvalidEmails, statusCode.badRequest);
        }

        // Validate the email format and ensure they are comma-separated
        if (!/^([^\s@]+@[^\s@]+\.[^\s@]+)(,\s*[^\s@]+@[^\s@]+\.[^\s@]+)*$/.test(emails)) {
            return useErrorResponse(res, `Invalid email format. Use comma to separate email addresses.`, statusCode.apiStatusCodes.badRequest);
        }

        // Split the emails by comma
        const emailArray = emails.split(',').map(email => email.trim());

        // Validate each email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emailArray.filter(email => !emailPattern.test(email));
        if (invalidEmails.length > 0) {
            return useErrorResponse(res, `Invalid email addresses: ${invalidEmails.join(', ')}`, statusCode.apiStatusCodes.badRequest);
        }

        for (const email of emailArray) {
            const htmlMessage = invitationTemplate(process.env.INVITATION_TEMPLATE_URL);
            const result = await sendEmail(email, "", htmlMessage);
            console.log(result);

            if (result?.rejected?.length > 0) {
                return useErrorResponse(res, errorMessages.Invitation.SendFailure, statusCode.apiStatusCodes.badRequest);
            }

            await prisma.invitation.create({
                data: {
                    email,
                    isSent: true,
                    isAccepted: false,
                    isRejected: false
                }
            });
        }

        const logData = {
            level: "info",
            message: successMessages.Invitation.Send,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Invitation.Send, { sentEmails: emailArray }, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.error('Error inviting users:', error);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Get all invitations.
 * 
 * This function retrieves all invitations from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllInvitations = async (req, res) => {
    try {
        const invitations = await prisma.invitation.findMany();

        if (invitations.length === 0) {
            return useErrorResponse(res, errorMessages.Invitation.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const logData = {
            level: "info",
            message: successMessages.Invitation.AllFound,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Invitation.AllFound, invitations, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.error('Error retrieving invitations:', error);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Delete an invitation.
 * 
 * This function deletes an existing invitation from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;

        // Check if the invitation exists
        const invitation = await prisma.invitation.findUnique({
            where: { invitation_id: parseInt(invitationId) },
        });

        if (!invitation) {
            return useErrorResponse(res, errorMessages.Invitation.NotFound, statusCode.apiStatusCodes.notFound);
        }

        // Delete the invitation
        await prisma.invitation.delete({
            where: { invitation_id: parseInt(invitationId) },
        });

        const logData = {
            level: "info",
            message: successMessages.Invitation.Delete,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Invitation.Delete, { id: invitationId }, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.error('Error deleting invitation:', error);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Get an invitation by ID.
 * 
 * This function retrieves an invitation by its ID from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getInvitationById = async (req, res) => {
    try {
        const { invitationId } = req.params;

        const invitation = await prisma.invitation.findUnique({
            where: { invitation_id: parseInt(invitationId) },
        });

        if (!invitation) {
            return useErrorResponse(res, errorMessages.Invitation.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const logData = {
            level: "info",
            message: successMessages.Invitation.Found,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Invitation.Found, invitation, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.error('Error retrieving invitation:', error);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

module.exports = {
    invitePerson,
    deleteInvitation,
    getAllInvitations,
    getInvitationById
};

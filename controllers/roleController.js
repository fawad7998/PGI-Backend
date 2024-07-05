const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");

/**
 * Creates a new role in the database.
 * 
 * @param {Object} req - The request object containing the role data.
 * @param {Object} res - The response object.
 * @returns {Object} - The newly created role data or an error message.
 */
const createRole = async (req, res) => {
    try {
        const { role_type } = req.body;

        // Check if the role already exists
        const existRole = await prisma.role.findUnique({
            where: { role_type }
        });
        if (existRole) {
            return useErrorResponse(res, errorMessages.Role.RoleTypeExists, statusCode.apiStatusCodes.badRequest);
        }

        // Create a new role
        const role = await prisma.role.create({
            data: { role_type },
        });

        return useSuccessResponse(res, successMessages.Role.Create, role, statusCode.apiStatusCodes.created);
    } catch (e) {
        console.log(e.message);
        return useErrorResponse(res, errorMessages.Role.Create, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Retrieves all roles from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - A list of roles or an error message.
 */
const getRoles = async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        if (roles.length <= 0) {
            return useErrorResponse(res, errorMessages.Role.NotFound, statusCode.apiStatusCodes.badRequest);
        }
        return useSuccessResponse(res, successMessages.Role.AllFound, roles, statusCode.apiStatusCodes.found);
    } catch (e) {
        console.log(e.message);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.badRequest);
    }
};

/**
 * Retrieves a role by its ID.
 * 
 * @param {Object} req - The request object containing the role ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The role data or an error message.
 */
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await prisma.role.findUnique({
            where: { role_id: parseInt(id) },
        });
        if (!role) {
            return useErrorResponse(res, errorMessages.Role.NotFound, statusCode.apiStatusCodes.notFound);
        }
        return useSuccessResponse(res, successMessages.Role.Found, role, statusCode.apiStatusCodes.found);
    } catch (e) {
        console.log(e.message);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Updates an existing role in the database.
 * 
 * @param {Object} req - The request object containing the updated role data.
 * @param {Object} res - The response object.
 * @returns {Object} - The updated role data or an error message.
 */
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_type } = req.body;

        // Check if the role exists
        const existingRole = await prisma.role.findUnique({
            where: { role_id: parseInt(id) },
        });
        if (!existingRole) {
            return useErrorResponse(res, errorMessages.Role.NotFound, statusCode.apiStatusCodes.notFound);
        }

        // Update the role data
        const updatedRoleData = {
            role_type: role_type !== undefined ? role_type : existingRole.role_type,
        };

        const role = await prisma.role.update({
            where: { role_id: parseInt(id) },
            data: updatedRoleData,
        });

        return useSuccessResponse(res, successMessages.Role.Update, role, statusCode.apiStatusCodes.ok);
    } catch (e) {
        console.log(e.message);
        return useErrorResponse(res, errorMessages.Role.Update, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Deletes a role from the database.
 * 
 * @param {Object} req - The request object containing the role ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The deleted role data or an error message.
 */
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await prisma.role.delete({
            where: { role_id: parseInt(id) },
        });
        if (!role) {
            return useErrorResponse(res, errorMessages.Role.NotFound, statusCode.apiStatusCodes.notFound);
        }
        return useSuccessResponse(res, successMessages.Role.Delete, role, statusCode.apiStatusCodes.ok);
    } catch (e) {
        return useErrorResponse(res, errorMessages.Role.Delete, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Assigns a role to a profile in the database.
 * 
 * @param {Object} req - The request object containing the role ID and profile ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The updated profile data or an error message.
 */
const assignRoleToProfile = async (req, res) => {
    try {
        const { id, profileId } = req.params;

        // Check if the role is already assigned to the profile
        const role = await prisma.role.findMany({
            where: {
                AND: [
                    { role_id: parseInt(id) },
                    { profileId: parseInt(profileId) }
                ]
            }
        });
        if (role.length > 0) {
            return useErrorResponse(res, errorMessages.Role.AlreadyAssigned, statusCode.apiStatusCodes.badRequest);
        }

        // Check if the profile exists
        const roleAlreadyExist = await prisma.profile.findUnique({
            where: {
                profile_id: parseInt(profileId)
            },
        });

        // Assign the role to the profile
        const updatedRole = await prisma.role.update({
            where: {
                role_id: parseInt(id)
            },
            data: {
                profileId: parseInt(profileId)
            }
        });

        let profile;
        if (roleAlreadyExist) {
            profile = await prisma.profile.update({
                where: {
                    profile_id: parseInt(profileId)
                },
                data: {
                    role: {
                        connect: {
                            role_id: updatedRole.role_id
                        }
                    }
                }
            });

            profile = await prisma.profile.findUnique({
                where: {
                    profile_id: parseInt(profileId)
                },
                include: {
                    role: true
                }
            });
        }

        return useSuccessResponse(res, successMessages.Role.DetailsRetrieved, profile, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.log(error.message);
        return useErrorResponse(res, errorMessages.Role.NotFound, statusCode.apiStatusCodes.internalServerError);
    }
};

module.exports = {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    assignRoleToProfile
};

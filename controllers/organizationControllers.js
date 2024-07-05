const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const generateRandomPassword = require('../utils/utilities/generateRandomPassword');
const { sendEmail } = require('../utils/utilities/email');
const { setLog } = require("../utils/logger/logs");
const { accountRegisterTemplate } = require("../utils/lib/templates/accountRegister");

/**
 * Create a new organization.
 * 
 * This function handles the creation of a new organization. It performs the following steps:
 * 1. Extracts the required fields (name, businessEmail, companyName, phoneNumber) from the request body.
 * 2. Checks if an organization with the provided businessEmail already exists in the database.
 * 3. If the organization exists, returns an error response indicating that the organization already exists.
 * 4. Generates a random password and hashes it.
 * 5. Creates a new organization in the database with the provided details and hashed password.
 * 6. Sends an email to the provided businessEmail with the generated password.
 * 7. Returns a success response with the newly created organization data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createOrganization = async (req, res) => {
    try {
        const { name, businessEmail, companyName, phoneNumber } = req.body;

        // Check if the organization already exists
        const existingOrganization = await prisma.organization.findUnique({
            where: { businessEmail },
        });

        if (existingOrganization) {
            return useErrorResponse(res, errorMessages.Organization.AlreadyExists, 400);
        }

        // Generate a random password and hash it
        const { randomPassword, hashedPassword } = await generateRandomPassword();

        // Create a new organization
        const organization = await prisma.organization.create({
            data: {
                name,
                businessEmail,
                companyName,
                phoneNumber: phoneNumber,
                password: hashedPassword,
            },
        });

        const html = accountRegisterTemplate(businessEmail, randomPassword);

        // Send the generated password to the organization's email
        await sendEmail(businessEmail, 'Your Account Details', html);

        const logData = {
            level: "info",
            message: successMessages.Organization.Create,
            success: true,
            userType: `organization`,
            owner: organization.name,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Organization.Create, organization, 201);
    } catch (e) {
        // Handle specific Prisma errors
        if (e instanceof prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2002':
                    // Unique constraint failed
                    return useErrorResponse(res, errorMessages.Organization.UniqueConstraintFailed, 400);
                default:
                    return useErrorResponse(res, errorMessages.SomethingWrong, 500);
            }
        } else {
            console.log(e.message);
            return useErrorResponse(res, errorMessages.SomethingWrong, 500);
        }
    }
};

/**
 * Logs in an organization by validating the credentials and generating a JWT token.
 * 
 * @param {Object} req - The request object containing the login credentials.
 * @param {Object} res - The response object.
 * @returns {Object} - The JWT token or an error message.
 */
const login = async (req, res) => {
    try {
        const { businessEmail, password } = req.body;

        // Find the organization by businessEmail
        const organization = await prisma.organization.findUnique({
            where: { businessEmail },
        });

        // Check if the organization exists
        if (!organization) {
            return useErrorResponse(res, errorMessages.Organization.NotFound, 404);
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, organization.password);
        if (!isPasswordValid) {
            return useErrorResponse(res, errorMessages.Organization.InvalidCredentials, 400);
        }

        // Generate a JWT token with a 1-hour expiration time
        const token = jwt.sign({ organizationId: organization.organization_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Update the organization's token field with the generated token
        const Login = await prisma.organization.update({
            where: { organization_id: organization.organization_id },
            data: { token },
        });

        const logData = {
            level: "info",
            message: successMessages.Organization.DetailsRetrieved,
            success: true,
            userType: `organization`,
            owner: organization.name,
            status: 200
        };
        await setLog(logData);

        // Send success response with the token
        return useSuccessResponse(res, successMessages.Organization.Login, {
            businessEmail: Login.businessEmail,
            token,
            phoneNumber: Login.phoneNumber,
            companyName: Login.companyName
        }, 200);
    } catch (e) {
        console.error(e.message);
        return useErrorResponse(res, errorMessages.SomethingWrong, 500);
    }
};

/**
 * Get all organizations.
 * 
 * This function retrieves all organizations from the database. It performs the following steps:
 * 1. Queries the database to find all organizations.
 * 2. Returns a success response with the list of organizations.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getOrganizations = async (req, res) => {
    try {
        const organizations = await prisma.organization.findMany();
        
        const logData = {
            level: "info",
            message: successMessages.Organization.AllFound,
            success: true,
            userType: `organization`,
            owner: `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Organization.AllFound, organizations, 200);
    } catch (e) {
        return useErrorResponse(res, errorMessages.SomethingWrong, 500);
    }
};

/**
 * Get an organization by ID.
 * 
 * This function retrieves a specific organization by its ID from the database. It performs the following steps:
 * 1. Extracts the organization ID from the request parameters.
 * 2. Queries the database to find the organization with the provided ID.
 * 3. If the organization does not exist, returns an error response indicating that the organization was not found.
 * 4. Returns a success response with the organization data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await prisma.organization.findUnique({
            where: { organization_id: parseInt(id) },
        });

        if (!organization) return useErrorResponse(res, errorMessages.Organization.NotFound, 404);

        const logData = {
            level: "info",
            message: successMessages.Organization.Found,
            success: true,
            userType: `organization`,
            owner: organization.name,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Organization.Found, organization, 200);
    } catch (e) {
        return useErrorResponse(res, errorMessages.SomethingWrong, 500);
    }
};

/**
 * Update an organization.
 * 
 * This function updates the details of a specific organization by its ID. It performs the following steps:
 * 1. Extracts the organization ID from the request parameters and the updated data from the request body.
 * 2. Updates the organization in the database with the provided data.
 * 3. Returns a success response with the updated organization data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, businessEmail, companyName, phoneNumber } = req.body;

        const organization = await prisma.organization.update({
            where: { organization_id: parseInt(id) },
            data: { name, businessEmail, companyName, phoneNumber },
        });

        if (!organization) {
            return useErrorResponse(res, errorMessages.Organization.Update, 500);
        }

        const logData = {
            level: "info",
            message: successMessages.Organization.Update,
            success: true,
            userType: `organization`,
            owner: organization.name,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Organization.Update, organization, 200);
    } catch (e) {
        return useErrorResponse(res, e.message, 500);
    }
};

/**
 * Delete an organization.
 * 
 * This function deletes a specific organization by its ID from the database. It performs the following steps:
 * 1. Extracts the organization ID from the request parameters.
 * 2. Deletes the organization from the database with the provided ID.
 * 3. Returns a success response with the deleted organization data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;

        const organization = await prisma.organization.delete({
            where: { organization_id: parseInt(id) },
        });

        const logData = {
            level: "info",
            message: successMessages.Organization.Delete,
            success: true,
            userType: `organization`,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Organization.Delete, organization, 200);
    } catch (e) {
        return useErrorResponse(res, errorMessages.Organization.Delete, 500);
    }
};

module.exports = {
    createOrganization,
    login,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
};

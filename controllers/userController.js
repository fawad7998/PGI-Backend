const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const validateEmail = require("../utils/utilities/validEmail");
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");
const jwt = require("jsonwebtoken");
const generateRandomPassword = require("../utils/utilities/generateRandomPassword");
const { sendEmail } = require("../utils/utilities/email");
const bcrypt = require("bcryptjs");
const { setLog } = require("../utils/logger/logs");
const { accountRegisterTemplate } = require("../utils/lib/templates/accountRegister");

//^ Register a profile
/**
 * Registers a new profile and sends an email with login credentials.
 * @param {Object} req - The request object containing profileId and email.
 * @param {Object} res - The response object.
 * @returns {Object} - The newly created user credentials or an error message.
 */
const registerProfile = async (req, res) => {
    try {
        const { profileId, email } = req.body;

        // Validate the email format
        if (!validateEmail(email)) {
            return useErrorResponse(res, errorMessages.User.InvalidUserData, statusCode.apiStatusCodes.badRequest);
        }

        // Check if a user with the given profileId or email already exists
        const existingUser = await prisma.userCredientials.findMany({
            where: {
                OR: [
                    { profileId },
                    { email }
                ]
            }
        });

        if (existingUser.length > 0) {
            return useErrorResponse(res, errorMessages.User.EmailAlreadyExists, statusCode.apiStatusCodes.badRequest);
        }

        // Generate random password and hash it
        const { randomPassword, hashedPassword } = await generateRandomPassword();
        const html = accountRegisterTemplate(email, randomPassword);
        const mail = await sendEmail(email, randomPassword, html);

        if (mail?.rejected?.length == 0) {
            const user = await prisma.userCredientials.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    profile: {
                        connect: {
                            profile_id: parseInt(profileId)
                        }
                    }
                }
            });

            if (!user) {
                throw new Error("Failed to create user credentials");
            }

            const logData = {
                level: "info",
                message: successMessages.User.SignUp,
                success: true,
                userType: req.userType,
                owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
                status: 200
            };
            await setLog(logData);
            return useSuccessResponse(res, successMessages.User.SignUp, user, statusCode.apiStatusCodes.ok);
        }
    } catch (error) {
        console.log(error.message);
        return useErrorResponse(res, errorMessages.User.Register, statusCode.apiStatusCodes.badRequest);
    }
};

//^ Login a profile
/**
 * Logs in a profile by validating credentials and generating a JWT token.
 * @param {Object} req - The request object containing email and password.
 * @param {Object} res - The response object.
 * @returns {Object} - The JWT token or an error message.
 */
const loginProfile = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the input data
        if (!email || !password) {
            return useErrorResponse(res, errorMessages.User.InvalidUserData, statusCode.apiStatusCodes.badRequest);
        }

        // Find the user by email
        const user = await prisma.userCredientials.findMany({ where: { email } });

        if (user.length > 0) {
            // Compare the provided password with the stored hashed password
            const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
            if (!isPasswordCorrect) {
                return useErrorResponse(res, errorMessages.User.IncorrectPassword, statusCode.apiStatusCodes.badRequest);
            }

            // Generate a JWT token with a 1-hour expiration time
            const token = jwt.sign({ userId: user[0].user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

            // Update the user's token in the database
            const updateUser = await prisma.userCredientials.update({
                where: { user_id: parseInt(user[0].user_id) },
                data: { token }
            });

            if (!updateUser) {
                throw new Error("Failed to update user");
            }

            const logData = {
                level: "info",
                message: successMessages.User.Login,
                success: true,
                userType: req.userType,
                owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
                status: 200
            };
            await setLog(logData);
            return useSuccessResponse(res, successMessages.User.Login, { token }, statusCode.apiStatusCodes.ok);
        } else {
            return useErrorResponse(res, errorMessages.User.NotFound, statusCode.apiStatusCodes.badRequest);
        }
    } catch (error) {
        console.log(error.message);
        return useErrorResponse(res, errorMessages.User.Login, statusCode.apiStatusCodes.badRequest);
    }
};

//^ Get user by ID
/**
 * Retrieves a user by their ID.
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The user data or an error message.
 */
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await prisma.userCredientials.findUnique({
            where: { user_id: parseInt(userId) },
        });

        if (!user) {
            return useErrorResponse(res, errorMessages.User.NotFound, statusCode.apiStatusCodes.badRequest);
        }

        const logData = {
            level: "info",
            message: successMessages.User.Found,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);
        return useSuccessResponse(res, successMessages.User.Found, user, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.log(error.message);
        return useErrorResponse(res, errorMessages.User.SomethingWrong, statusCode.apiStatusCodes.badRequest);
    }
};

//^ Get all users
/**
 * Retrieves all users from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - A list of users or an error message.
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.userCredientials.findMany();
        
        if (users.length <= 0) {
            return useErrorResponse(res, errorMessages.User.NotFound, statusCode.apiStatusCodes.badRequest);
        }
        
        const logData = {
            level: "info",
            message: successMessages.User.FoundAll,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);
        return useSuccessResponse(res, successMessages.User.FoundAll, users, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.log(error.message);
        return useErrorResponse(res, errorMessages.User.SomethingWrong, statusCode.apiStatusCodes.badRequest);
    }
};

//^ Delete user by ID
/**
 * Deletes a user by their ID.
 * @param {Object} req - The request object containing the user ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The deleted user data or an error message.
 */
const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await prisma.userCredientials.findUnique({
            where: { user_id: parseInt(userId) },
        });

        if (!user) {
            return useErrorResponse(res, errorMessages.User.NotFound, statusCode.apiStatusCodes.badRequest);
        }

        // Delete the user
        await prisma.userCredientials.delete({
            where: { user_id: parseInt(userId) },
        });

        const logData = {
            level: "info",
            message: successMessages.User.Delete,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);
        return useSuccessResponse(res, successMessages.User.Delete, null, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.log(error.message);
        return useErrorResponse(res, errorMessages.User.SomethingWrong, statusCode.apiStatusCodes.badRequest);
    }
};

//^ Update User
/**
 * Updates a user's email and/or password.
 * @param {Object} req - The request object containing the updated user data.
 * @param {Object} res - The response object.
 * @returns {Object} - The updated user data or an error message.
 */
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email, password } = req.body;

        // Find the existing user
        const existingUser = await prisma.userCredientials.findUnique({
            where: { user_id: parseInt(userId) },
        });

        if (!existingUser) {
            return useErrorResponse(res, errorMessages.User.NotFound, statusCode.apiStatusCodes.badRequest);
        }

        // Prepare updated data
        let updatedData = { email };

        if (password) {
            const { randomPassword, hashedPassword } = await generateRandomPassword();
            updatedData.password = hashedPassword;
            await sendEmail(email, randomPassword);
        }

        // Update the user
        const user = await prisma.userCredientials.update({
            where: { user_id: parseInt(userId) },
            data: updatedData,
        });

        const logData = {
            level: "info",
            message: `Update user successfully`,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);
        return useSuccessResponse(res, `Update user successfully`, user, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.log(error.message);
        return useErrorResponse(res, errorMessages.User.SomethingWrong, statusCode.apiStatusCodes.badRequest);
    }
};

module.exports = {
    registerProfile,
    loginProfile,
    getUserById,
    getAllUsers,
    deleteUserById,
    updateUser
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");
const { setLog } = require("../utils/logger/logs");

/**
 * Create a new location.
 * 
 * This function handles the creation of a new location. It performs the following steps:
 * 1. Extracts the required fields from the request body.
 * 2. Checks if a location with the provided locationId already exists.
 * 3. If the location exists, returns an error response indicating that the location already exists.
 * 4. Creates a new location in the database with the provided details.
 * 5. Logs the operation.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createLocation = async (req, res) => {
    try {
        const { clientId, clientName, locationName, locationId, streetAddress, city, postCode, state, country, directions } = req.body;

        const existLocation = await prisma.location.findUnique({
            where: { locationId: parseInt(locationId) }
        });

        if (existLocation) {
            return useErrorResponse(res, errorMessages.Location.AlreadyExist, statusCode.apiStatusCodes.badRequest);
        }

        const location = await prisma.location.create({
            data: {
                clientName,
                locationName,
                locationId,
                streetAddress,
                city,
                postCode,
                state,
                country,
                directions,
                clients: clientId !== undefined ? { connect: { client_id: parseInt(clientId) } } : undefined
            }
        });

        const locationWithClient = await prisma.location.findUnique({
            where: { location_id: parseInt(location.location_id) },
            include: { clients: true }
        });

        const logData = {
            level: "info",
            message: successMessages.Location.Created,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Location.Created, locationWithClient, statusCode.apiStatusCodes.created);
    } catch (e) {
        console.log(e.message);
        return useErrorResponse(res, e.message, statusCode.apiStatusCodes.badRequest);
    }
};

/**
 * Get all locations.
 * 
 * This function retrieves all locations from the database. It includes related clients in the response.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getLocations = async (req, res) => {
    try {
        const locations = await prisma.location.findMany({ include: { clients: true } });

        if (locations.length === 0) {
            return useErrorResponse(res, errorMessages.Location.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const logData = {
            level: "info",
            message: successMessages.Location.Found,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Location.Found, locations, statusCode.apiStatusCodes.ok);
    } catch (error) {
        return useErrorResponse(res, error.message, statusCode.apiStatusCodes.notFound);
    }
};

/**
 * Get a location by ID.
 * 
 * This function retrieves a specific location by its ID from the database. It includes related clients in the response.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await prisma.location.findUnique({
            where: { location_id: Number(id) },
            include: { clients: true }
        });

        if (!location) {
            return useErrorResponse(res, errorMessages.Location.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const logData = {
            level: "info",
            message: successMessages.Location.Found,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Location.Found, location, statusCode.apiStatusCodes.ok);
    } catch (error) {
        return useErrorResponse(res, error.message, statusCode.apiStatusCodes.notFound);
    }
};

/**
 * Update an existing location.
 * 
 * This function updates the details of a specific location by its ID. It performs the following steps:
 * 1. Extracts the required fields from the request body.
 * 2. Finds the existing location by its ID.
 * 3. If the location does not exist, returns an error response indicating that the location was not found.
 * 4. Updates the location in the database with the provided details.
 * 5. Logs the operation.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateLocation = async (req, res) => {
    const { id } = req.params;
    const { clientId, clientName, locationName, locationId, streetAddress, city, postCode, state, country, directions } = req.body;

    try {
        const existingLocation = await prisma.location.findUnique({
            where: { location_id: parseInt(id) },
        });

        if (!existingLocation) {
            return useErrorResponse(res, errorMessages.Location.NotFound, 404);
        }

        const updatedLocationData = {
            clientName: clientName !== undefined ? clientName : existingLocation.clientName,
            locationName: locationName !== undefined ? locationName : existingLocation.locationName,
            locationId: locationId !== undefined ? locationId : existingLocation.locationId,
            streetAddress: streetAddress !== undefined ? streetAddress : existingLocation.streetAddress,
            city: city !== undefined ? city : existingLocation.city,
            postCode: postCode !== undefined ? postCode : existingLocation.postCode,
            state: state !== undefined ? state : existingLocation.state,
            country: country !== undefined ? country : existingLocation.country,
            directions: directions !== undefined ? directions : existingLocation.directions,
        };

        const location = await prisma.location.update({
            where: { location_id: parseInt(id) },
            data: {
                ...updatedLocationData,
                clients: clientId !== undefined ? { connect: { client_id: parseInt(clientId) } } : undefined
            }
        });

        const result = await prisma.location.findUnique({
            where: { location_id: parseInt(location.location_id) },
            include: { clients: true }
        });

        const logData = {
            level: "info",
            message: successMessages.Location.Update,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Location.Update, result, statusCode.apiStatusCodes.ok);
    } catch (error) {
        console.error(error.message);
        return useErrorResponse(res, error.message, 500);
    }
};

/**
 * Delete a location.
 * 
 * This function deletes a specific location by its ID from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await prisma.location.delete({
            where: { location_id: Number(id) }
        });

        if (!location) {
            return useErrorResponse(res, errorMessages.Location.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const logData = {
            level: "info",
            message: successMessages.Location.Delete,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Location.Delete, location, statusCode.apiStatusCodes.ok);
    } catch (error) {
        return useErrorResponse(res, error.message, statusCode.apiStatusCodes.notFound);
    }
};

module.exports = {
    createLocation,
    getLocations,
    getLocationById,
    updateLocation,
    deleteLocation
};

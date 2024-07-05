const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");
const { setLog } = require("../utils/logger/logs");

/**
 * Creates a new geofence entry in the database.
 */
const createGeoOffence = async (req, res) => {
    try {
        const { profileId, lattitude, longitude, radius, status } = req.body;

        // Check if the profile exists
        const profile = await prisma.profile.findUnique({
            where: { profile_id: parseInt(profileId) }
        });
        if(!profileId || !lattitude || !longitude || !radius || !status){
          return useErrorResponse(res,`Provide all the fields`,statusCode.apiStatusCodes.badRequest);
        }
        if (!profile) {
            return useErrorResponse(res, `Profile does not exist`, statusCode.apiStatusCodes.notFound);
        }

        const geoOffence = await prisma.geoOffencing.create({
            data: {
                profileId: parseInt(profileId),
                lattitude,
                longitude,
                radius,
                status
            }
        });

        const logData = {
            level: "info",
            message: `Geofence created successfully `,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, `Geofence created successfully`, geoOffence, statusCode.apiStatusCodes.created);
    } catch (e) {
        console.error(e.message);
        return useErrorResponse(res, `Internal Server Error: ${e.message}`, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Retrieves all geofence entries from the database.
 */
const getGeoOffences = async (req, res) => {
    try {
        const geoOffences = await prisma.geoOffencing.findMany({
            include: {
                profile: true
            }
        });
        if (geoOffences.length <= 0) {
            return useErrorResponse(res, errorMessages.GeoOffence.NotFound, 404);
        }

        const logData = {
            level: "info",
            message: successMessages.GeoOffence.AllFound,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.GeoOffence.AllFound, geoOffences, 200);
    } catch (e) {
        console.error(e.message);
        return useErrorResponse(res, errorMessages.SomethingWrong, 500);
    }
};

/**
 * Retrieves a geofence entry by its ID.
 */
const getGeoOffenceById = async (req, res) => {
    try {
        const { id } = req.params;
        const geoOffence = await prisma.geoOffencing.findUnique({
            where: { geoOffence_id: parseInt(id) },
            include: {
                profile: true
            }
        });
        if (!geoOffence) {
            return useErrorResponse(res, errorMessages.GeoOffence.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const logData = {
            level: "info",
            message: successMessages.GeoOffence.Found,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.GeoOffence.Found, geoOffence, 200);
    } catch (e) {
        console.error(e.message);
        return useErrorResponse(res, errorMessages.SomethingWrong, 500);
    }
};

/**
 * Updates an existing geofence entry in the database.
 */
const updateGeoOffence = async (req, res) => {
    try {
        const { id } = req.params;
        const { lattitude, longitude, radius, status } = req.body;

        const existingGeoOffence = await prisma.geoOffencing.findUnique({
            where: { geoOffence_id: parseInt(id) },
        });

        if (!existingGeoOffence) {
            return useErrorResponse(res, errorMessages.GeoOffence.NotFound, 404);
        }

        const updatedGeoOffenceData = {
            lattitude: lattitude !== undefined ? lattitude : existingGeoOffence.lattitude,
            longitude: longitude !== undefined ? longitude : existingGeoOffence.longitude,
            radius: radius !== undefined ? radius : existingGeoOffence.radius,
            status: status !== undefined ? status : existingGeoOffence.status,
        };

        const geoOffence = await prisma.geoOffencing.update({
            where: { geoOffence_id: parseInt(id) },
            data: updatedGeoOffenceData,
        });

        const logData = {
            level: "info",
            message: successMessages.GeoOffence.Update,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.GeoOffence.Update, geoOffence, 200);
    } catch (e) {
        console.error(e.message);
        if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2002':
                    return useErrorResponse(res, errorMessages.GeoOffence.UniqueConstraintFailed, 400);
                default:
                    return useErrorResponse(res, errorMessages.SomethingWrong, 500);
            }
        } else {
            return useErrorResponse(res, errorMessages.SomethingWrong, 500);
        }
    }
};

/**
 * Deletes a geofence entry from the database.
 */
const deleteGeoOffence = async (req, res) => {
    try {
        const { id } = req.params;

        const geoOffence = await prisma.geoOffencing.delete({
            where: { geoOffence_id: parseInt(id) },
        });

        const logData = {
            level: "info",
            message: successMessages.GeoOffence.Delete,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.GeoOffence.Delete, geoOffence, 200);
    } catch (e) {
        console.error(e.message);
        if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2025':
                    return useErrorResponse(res, errorMessages.GeoOffence.NotFound, 404);
                default:
                    return useErrorResponse(res, errorMessages.SomethingWrong, 500);
            }
        } else {
            return useErrorResponse(res, errorMessages.SomethingWrong, 500);
        }
    }
};

module.exports = {
    createGeoOffence,
    getGeoOffences,
    getGeoOffenceById,
    updateGeoOffence,
    deleteGeoOffence,
};

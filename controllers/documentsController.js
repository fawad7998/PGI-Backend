const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { cloudinary } = require('../utils/utilities/cloudinaryConfig');
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");
const { setLog } = require("../utils/logger/logs");

/**
 * Create a new document.
 * 
 * This function handles the creation of a new document. It performs the following steps:
 * 1. Validates the request body.
 * 2. Checks if a document with the same name already exists.
 * 3. Validates the presence of file URLs and Cloudinary IDs.
 * 4. Creates the document entries in the database.
 * 5. Logs the operation.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createDocument = async (req, res) => {
    try {
        const { name, description, clientId, locationId } = req.body;
        const fileUrls = req.fileUrls;
        const cloudinaryIds = req.cloudinaryIds;

        // Check if a document with the same name already exists
        const existingName = await prisma.documents.findMany({
            where: { fileName: name }
        });
        if (existingName.length > 0) {
            return useErrorResponse(res, errorMessages.Documents.Create, statusCode.apiStatusCodes.badRequest);
        }

        // Validate presence of file URLs and Cloudinary IDs
        if (!fileUrls || fileUrls.length === 0 || !cloudinaryIds || cloudinaryIds.length === 0) {
            return useErrorResponse(res, "Missing required parameter - file or Cloudinary ID", statusCode.apiStatusCodes.badRequest);
        }

        // Ensure fileUrls and cloudinaryIds arrays are of the same length
        if (fileUrls.length !== cloudinaryIds.length) {
            return useErrorResponse(res, "Mismatch in the number of file URLs and Cloudinary IDs", statusCode.apiStatusCodes.badRequest);
        }

        // Prepare document data for insertion
        const documents = fileUrls.map((url, index) => ({
            fileName: name,
            description,
            client: clientId !== undefined ? {
                connect: { client_id: parseInt(clientId) }
            } : undefined,
            location: locationId !== undefined ? {
                connect: { location_id: parseInt(locationId) }
            } : undefined,
            fileUrl: url,
            cloudinary_id: cloudinaryIds[index],
        }));

        // Insert documents into the database
        const createdDocuments = await prisma.documents.createMany({
            data: documents,
        });

        // Log the operation
        const logData = {
            level: "info",
            message: successMessages.Documents.Create,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Documents.Create, createdDocuments, statusCode.apiStatusCodes.created);
    } catch (err) {
        console.error(err);
        return useErrorResponse(res, `Internal Server Error: ${err.message}`, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Get all documents.
 * 
 * This function retrieves all documents from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllDocuments = async (req, res) => {
    try {
        const documents = await prisma.documents.findMany();
        if (documents.length === 0) {
            return useErrorResponse(res, errorMessages.Documents.NotFound, statusCode.apiStatusCodes.notFound);
        }

        // Log the operation
        const logData = {
            level: "info",
            message: successMessages.Documents.AllFound,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Documents.AllFound, documents, statusCode.apiStatusCodes.ok);
    } catch (err) {
        console.error(err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Get a document by ID.
 * 
 * This function retrieves a document by its ID from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await prisma.documents.findUnique({
            where: { document_id: parseInt(id) },
        });
        if (!document) {
            return useErrorResponse(res, errorMessages.Documents.NotFound, statusCode.apiStatusCodes.notFound);
        }

        // Log the operation
        const logData = {
            level: "info",
            message: successMessages.Documents.Found,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Documents.Found, document, statusCode.apiStatusCodes.ok);
    } catch (err) {
        console.error(err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Update a document.
 * 
 * This function updates an existing document in the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, clientId, locationId } = req.body;

        // Find the existing document
        const existingDocument = await prisma.documents.findUnique({
            where: { document_id: parseInt(id) },
        });

        if (!existingDocument) {
            return useErrorResponse(res, errorMessages.Documents.NotFound, statusCode.apiStatusCodes.notFound);
        }

        // Prepare updated data
        let updatedData = {
            fileName: name !== undefined ? name : existingDocument.name,
            description: description !== undefined ? description : existingDocument.description,
            client: clientId !== undefined ? { connect: { client_id: parseInt(clientId) } } : existingDocument.client,
            location: locationId !== undefined ? { connect: { location_id: parseInt(locationId) } } : existingDocument.location,
        };

        // If new file URLs and cloudinary IDs are provided
        if (req.fileUrls && req.fileUrls.length > 0 && req.cloudinaryIds && req.cloudinaryIds.length > 0) {
            console.log('File URLs:', req.fileUrls);
            console.log('Cloudinary IDs:', req.cloudinaryIds);

            // Ensure cloudinaryIds array is defined and has the same length as fileUrls
            if (req.cloudinaryIds.length === req.fileUrls.length) {
                // Assuming only one file is uploaded during an update
                const newFileUrl = req.fileUrls[0];
                const newCloudinaryId = req.cloudinaryIds[0];

                updatedData.fileUrl = newFileUrl;
                updatedData.cloudinary_id = newCloudinaryId;
            } else {
                console.error('Mismatch in file URLs and Cloudinary IDs length');
                return useErrorResponse(res, "File upload error", statusCode.apiStatusCodes.internalServerError);
            }
        }

        // Update the document in the database
        const updatedDocument = await prisma.documents.update({
            where: { document_id: parseInt(id) },
            data: updatedData,
        });

        // Log the operation
        const logData = {
            level: "info",
            message: successMessages.Documents.Update,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Documents.Update, updatedDocument, statusCode.apiStatusCodes.ok);
    } catch (err) {
        console.error(err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Delete a document.
 * 
 * This function deletes an existing document from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const existingDocument = await prisma.documents.findUnique({
            where: { document_id: parseInt(id) },
        });

        if (!existingDocument) {
            return useErrorResponse(res, errorMessages.Documents.NotFound, statusCode.apiStatusCodes.notFound);
        }

        // Delete the document from Cloudinary
        await cloudinary.uploader.destroy(existingDocument.cloudinary_id);

        // Delete the document from the database
        await prisma.documents.delete({
            where: { document_id: parseInt(id) },
        });

        // Log the operation
        const logData = {
            level: "info",
            message: successMessages.Documents.Delete,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Documents.Delete, existingDocument, statusCode.apiStatusCodes.ok);
    } catch (err) {
        console.error(err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

module.exports = {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
  useSuccessResponse,
  useErrorResponse,
} = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require('../utils/apiStatus');

/**
 * Create a new client
 *
 * This function handles the creation of a new client record. It performs the following steps:
 * 1. Extracts the required fields from the request body.
 * 2. Checks if a client with the given clientId already exists.
 * 3. If a client exists, returns an error response.
 * 4. Creates the new client in the database.
 * 5. Returns a success response with the created client or an error response in case of any issues.
 *
 * @param {Object} req - The request object containing the creation data.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the created client or an error message.
 */
const createClient = async (req, res) => {
  try {
    const {
      clientId,
      clientPersonName,
      title,
      contactPersonName,
      contactPersonEmail,
      phoneNumber,
      jobTitle,
      isClientPortalAccess,
      clientEmail,
      clientPhoneNumber,
      regNo,
      vatNo,
      website,
      sectors,
      addressLine,
      city,
      postCode,
      county,
      country,
    } = req.body;

    // Check if the client already exists
    const existClient = await prisma.client.findUnique({
      where: {
        clientId: parseInt(clientId),
      },
    });
    if (existClient) {
      return useErrorResponse(
        res,
        errorMessages.Client.AlreadyExist,
        statusCode.apiStatusCodes.badRequest
      );
    }

    // Handle file upload for client image
    let imageUrl = req.file ? req.file.path : '';

    // Create new client in the database
    const client = await prisma.client.create({
      data: {
        clientId,
        clientPersonName,
        title,
        contactPersonName,
        contactPersonEmail,
        phoneNumber,
        jobTitle,
        isClientPortalAccess,
        clientEmail,
        clientPhoneNumber,
        regNo,
        vatNo,
        website,
        sectors,
        addressLine,
        city,
        image: imageUrl,
        postCode,
        county,
        country,
      },
    });
    return useSuccessResponse(
      res,
      successMessages.Client.Created,
      client,
      statusCode.apiStatusCodes.created
    );
  } catch (e) {
    console.log(e.message);
    return useErrorResponse(
      res,
      e.message,
      statusCode.apiStatusCodes.badRequest
    );
  }
};

/**
 * Retrieve all clients
 *
 * This function retrieves all clients from the database. It performs the following steps:
 * 1. Fetches all clients from the database.
 * 2. Validates if any clients are found.
 * 3. Returns a success response with the retrieved clients or an error response in case of any issues.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the retrieved clients or an error message.
 */
const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    if (clients.length === 0) {
      return useErrorResponse(
        res,
        errorMessages.Client.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }
    return useSuccessResponse(
      res,
      successMessages.Client.AllFound,
      clients,
      statusCode.apiStatusCodes.ok
    );
  } catch (error) {
    return useErrorResponse(
      res,
      error.message,
      statusCode.apiStatusCodes.notFound
    );
  }
};

/**
 * Retrieve a client by ID
 *
 * This function retrieves a client by its ID from the database. It performs the following steps:
 * 1. Extracts the client ID from the request parameters.
 * 2. Fetches the client with the provided ID from the database, including related documents.
 * 3. Validates if the client is found.
 * 4. Returns a success response with the retrieved client or an error response in case of any issues.
 *
 * @param {Object} req - The request object containing the client ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the retrieved client or an error message.
 */
const getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { client_id: Number(id) },
      include: { documents: true },
    });
    if (!client) {
      return useErrorResponse(
        res,
        errorMessages.Client.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }
    return useSuccessResponse(
      res,
      successMessages.Client.Found,
      client,
      statusCode.apiStatusCodes.ok
    );
  } catch (error) {
    return useErrorResponse(
      res,
      error.message,
      statusCode.apiStatusCodes.notFound
    );
  }
};

/**
 * Update an existing client
 *
 * This function handles the updating of an existing client record. It performs the following steps:
 * 1. Extracts the client ID from the request parameters and the update data from the request body.
 * 2. Updates the client in the database with the provided data.
 * 3. Validates if the client is found.
 * 4. Returns a success response with the updated client or an error response in case of any issues.
 *
 * @param {Object} req - The request object containing the update data.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the updated client or an error message.
 */
const updateClient = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const client = await prisma.client.update({
      where: { client_id: Number(id) },
      data,
    });
    if (!client) {
      return useErrorResponse(
        res,
        errorMessages.Client.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }
    return useSuccessResponse(
      res,
      successMessages.Client.Updated,
      client,
      statusCode.apiStatusCodes.ok
    );
  } catch (error) {
    return useErrorResponse(
      res,
      error.message,
      statusCode.apiStatusCodes.notFound
    );
  }
};

/**
 * Delete an existing client
 *
 * This function handles the deletion of an existing client record. It performs the following steps:
 * 1. Extracts the client ID from the request parameters.
 * 2. Searches for the existing client by ID.
 * 3. Deletes the client from the database.
 * 4. Returns a success response with the deleted client or an error response in case of any issues.
 *
 * @param {Object} req - The request object containing the client ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the deleted client or an error message.
 */
const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.delete({
      where: { client_id: Number(id) },
    });
    if (!client) {
      return useErrorResponse(
        res,
        errorMessages.Client.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }
    return useSuccessResponse(
      res,
      successMessages.Client.Deleted,
      client,
      statusCode.apiStatusCodes.ok
    );
  } catch (error) {
    return useErrorResponse(
      res,
      error.message,
      statusCode.apiStatusCodes.notFound
    );
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
  useSuccessResponse,
  useErrorResponse,
} = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require('../utils/apiStatus');
const { setLog } = require('../utils/logger/logs');

/**
 * Create a new position.
 *
 * This function handles the creation of a new position. It performs the following steps:
 * 1. Extracts the required fields (positionName, profileId, shiftId) from the request body.
 * 2. Creates a new position in the database with the provided details.
 * 3. Returns a success response with the newly created position data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createPosition = async (req, res) => {
  try {
    const { positionName, profileId, shiftId } = req.body;

    const position = await prisma.position.create({
      data: {
        positionName,
        profile: profileId ? { connect: { profile_id: profileId } } : undefined,
        shift: shiftId ? { connect: { shift_id: shiftId } } : undefined,
      },
    });

    const logData = {
      level: 'info',
      message: successMessages.Position.Create,
      success: true,
      userType: req.userType,
      owner:
        req.userType === 'organization'
          ? req.organization.name
          : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200,
    };
    await setLog(logData);

    return useSuccessResponse(
      res,
      successMessages.Position.Create,
      position,
      statusCode.apiStatusCodes.created
    );
  } catch (error) {
    console.error('Error creating position:', error.message);
    return useErrorResponse(
      res,
      errorMessages.Position.Create,
      statusCode.apiStatusCodes.internalServerError
    );
  }
};

/**
 * Get all positions.
 *
 * This function retrieves all positions from the database. It performs the following steps:
 * 1. Queries the database to find all positions.
 * 2. Returns a success response with the list of positions.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllPositions = async (req, res) => {
  try {
    const positions = await prisma.position.findMany();
    if (positions.length <= 0) {
      return useErrorResponse(
        res,
        errorMessages.Position.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }

    const logData = {
      level: 'info',
      message: successMessages.Position.AllFound,
      success: true,
      userType: req.userType,
      owner:
        req.userType === 'organization'
          ? req.organization.name
          : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200,
    };
    await setLog(logData);

    return useSuccessResponse(
      res,
      successMessages.Position.AllFound,
      positions,
      statusCode.apiStatusCodes.found
    );
  } catch (error) {
    console.error('Error fetching positions:', error.message);
    return useErrorResponse(
      res,
      errorMessages.SomethingWrong,
      statusCode.apiStatusCodes.internalServerError
    );
  }
};

/**
 * Get a position by ID.
 *
 * This function retrieves a specific position by its ID from the database. It performs the following steps:
 * 1. Extracts the position ID from the request parameters.
 * 2. Queries the database to find the position with the provided ID.
 * 3. If the position does not exist, returns an error response indicating that the position was not found.
 * 4. Returns a success response with the position data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getPositionById = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await prisma.position.findUnique({
      where: { position_id: parseInt(id) },
    });
    if (!position) {
      return useErrorResponse(
        res,
        errorMessages.Position.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }

    const logData = {
      level: 'info',
      message: successMessages.Position.Found,
      success: true,
      userType: req.userType,
      owner:
        req.userType === 'organization'
          ? req.organization.name
          : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200,
    };
    await setLog(logData);

    return useSuccessResponse(
      res,
      successMessages.Position.Found,
      position,
      statusCode.apiStatusCodes.found
    );
  } catch (error) {
    console.error('Error fetching position:', error.message);
    return useErrorResponse(
      res,
      errorMessages.SomethingWrong,
      statusCode.apiStatusCodes.internalServerError
    );
  }
};

/**
 * Update a position.
 *
 * This function updates the details of a specific position by its ID. It performs the following steps:
 * 1. Extracts the position ID from the request parameters and the updated data from the request body.
 * 2. Finds the existing position in the database.
 * 3. Updates the position in the database with the provided data.
 * 4. Returns a success response with the updated position data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { positionName, profileId, shiftId } = req.body;

    const existingPosition = await prisma.position.findUnique({
      where: { position_id: parseInt(id) },
    });

    if (!existingPosition) {
      return useErrorResponse(
        res,
        errorMessages.Position.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }

    const updatedPositionData = {
      positionName:
        positionName !== undefined
          ? positionName
          : existingPosition.positionName,
      profile: profileId
        ? { connect: { profile_id: profileId } }
        : existingPosition.profile,
      shift: shiftId
        ? { connect: { shift_id: shiftId } }
        : existingPosition.shift,
    };

    const position = await prisma.position.update({
      where: { position_id: parseInt(id) },
      data: updatedPositionData,
    });

    const logData = {
      level: 'info',
      message: successMessages.Position.Update,
      success: true,
      userType: req.userType,
      owner:
        req.userType === 'organization'
          ? req.organization.name
          : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200,
    };
    await setLog(logData);

    return useSuccessResponse(
      res,
      successMessages.Position.Update,
      position,
      statusCode.apiStatusCodes.ok
    );
  } catch (error) {
    console.error('Error updating position:', error.message);
    return useErrorResponse(
      res,
      errorMessages.Position.Update,
      statusCode.apiStatusCodes.internalServerError
    );
  }
};

/**
 * Delete a position.
 *
 * This function deletes a specific position by its ID from the database. It performs the following steps:
 * 1. Extracts the position ID from the request parameters.
 * 2. Deletes the position from the database with the provided ID.
 * 3. Returns a success response with the deleted position data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await prisma.position.delete({
      where: { position_id: parseInt(id) },
    });
    if (!position) {
      return useErrorResponse(
        res,
        errorMessages.Position.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }

    const logData = {
      level: 'info',
      message: successMessages.Position.Delete,
      success: true,
      userType: req.userType,
      owner:
        req.userType === 'organization'
          ? req.organization.name
          : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200,
    };
    await setLog(logData);

    return useSuccessResponse(
      res,
      successMessages.Position.Delete,
      position,
      statusCode.apiStatusCodes.ok
    );
  } catch (error) {
    console.error('Error deleting position:', error.message);
    return useErrorResponse(
      res,
      errorMessages.Position.Delete,
      statusCode.apiStatusCodes.internalServerError
    );
  }
};

/**
 * Assign a position to a profile.
 *
 * This function assigns a specific position to a profile by their respective IDs. It performs the following steps:
 * 1. Extracts the position ID and profile ID from the request parameters.
 * 2. Checks if the position is already assigned to the profile.
 * 3. Finds the profile in the database.
 * 4. Updates the position and profile with the association.
 * 5. Returns a success response with the updated profile data.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const assignPositionToProfile = async (req, res) => {
  try {
    const { id, profileId } = req.params;

    const position = await prisma.position.findMany({
      where: {
        AND: [
          { position_id: parseInt(id) },
          { profileId: parseInt(profileId) },
        ],
      },
    });

    if (position.length > 0) {
      return useErrorResponse(
        res,
        errorMessages.Position.AlreadyAssigned,
        statusCode.apiStatusCodes.badRequest
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { profile_id: parseInt(profileId) },
    });

    if (!profile) {
      return useErrorResponse(
        res,
        errorMessages.Profile.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    }

    const updatedPosition = await prisma.position.update({
      where: { position_id: parseInt(id) },
      data: { profileId: parseInt(profileId) },
    });

    const updatedProfile = await prisma.profile.update({
      where: { profile_id: parseInt(profileId) },
      data: {
        Position: { connect: { position_id: updatedPosition.position_id } },
      },
    });

    const logData = {
      level: 'info',
      message: successMessages.Position.Assigned,
      success: true,
      userType: req.userType,
      owner:
        req.userType === 'organization'
          ? req.organization.name
          : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200,
    };
    await setLog(logData);

    return useSuccessResponse(
      res,
      successMessages.Position.Assigned,
      updatedProfile,
      statusCode.apiStatusCodes.ok
    );
  } catch (error) {
    console.error('Error assigning position to profile:', error.message);
    return useErrorResponse(
      res,
      errorMessages.Position.AssignmentFailed,
      statusCode.apiStatusCodes.internalServerError
    );
  }
};

module.exports = {
  createPosition,
  getAllPositions,
  getPositionById,
  updatePosition,
  deletePosition,
  assignPositionToProfile,
};

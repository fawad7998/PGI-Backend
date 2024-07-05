const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");
const { setLog } = require("../utils/logger/logs");

/**
 * Create a new absence
 * 
 * This function handles the creation of a new absence record. It performs the following steps:
 * 1. Extracts the required fields from the request body.
 * 2. Validates if the necessary fields are provided.
 * 3. Checks if an absence already exists for the given profile and dates.
 * 4. Creates the new absence in the database.
 * 5. Logs the operation for auditing purposes.
 * 6. Returns a success response with the created absence or an error response in case of any issues.
 * 
 * @param {Object} req - The request object containing the creation data.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the created absence or an error message.
 */
const createAbsence = async (req, res) => {
  const { absenceType, startingDate, endingDate, comment, daysOfHolidays, profileId, isPaid } = req.body;
  try {
    // Check if an absence already exists for the given profile and dates
    const existAbsence = await prisma.absences.findMany({
      where: {
        AND: [
          { profileId: parseInt(profileId) },
          { startingDate },
          { endingDate }
        ]
      }
    });
    
    if (existAbsence.length > 0) {
      return useErrorResponse(res, `Absence already exist`, statusCode.apiStatusCodes.badRequest);
    }

    // Validate required fields
    if (!startingDate || !endingDate || !isPaid || !absenceType || !daysOfHolidays) {
      return useErrorResponse(res, `Provide all the fields`, statusCode.apiStatusCodes.badRequest);
    }

    if (28 < daysOfHolidays) {
      return useErrorResponse(res, `Invalid days value`, statusCode.apiStatusCodes.badRequest);
    }

    // Create new absence in the database
    const absence = await prisma.absences.create({
      data: {
        absenceType,
        startingDate,
        comment,
        daysOfHolidays,
        allowedHolidays: 28,
        takenAbsences: 0,
        isPaid,
        remainingHolidays: 28 - daysOfHolidays,
        endingDate,
        profile: {
          connect: {
            profile_id: parseInt(profileId)
          }
        }
      }
    });

    const result = await prisma.absences.findUnique({
      where: {
        absences_id: parseInt(absence.absences_id)
      },
      include: {
        profile: true,
      }
    });

    // Log the operation for auditing purposes
    const logData = {
      level: "info",
      message: successMessages.Absences.Create,
      success: true,
      userType: req.userType,
      owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200
    };
    await setLog(logData);

    // Return success response with the created absence
    return useSuccessResponse(res, successMessages.Absences.Create, result, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.Absences.Create, statusCode.apiStatusCodes.badRequest);
  }
};

/**
 * Retrieve all absences
 * 
 * This function retrieves all absences from the database. It performs the following steps:
 * 1. Fetches all absences from the database.
 * 2. Validates if any absences are found.
 * 3. Logs the operation for auditing purposes.
 * 4. Returns a success response with the retrieved absences or an error response in case of any issues.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the retrieved absences or an error message.
 */
const getAllAbsences = async (req, res) => {
  try {
    const absences = await prisma.absences.findMany();
    if (absences.length === 0) {
      return useErrorResponse(res, errorMessages.Absences.NotFound, statusCode.apiStatusCodes.badRequest);
    }

    // Log the operation for auditing purposes
    const logData = {
      level: "info",
      message: successMessages.Absences.AllFound,
      success: true,
      userType: req.userType,
      owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200
    };
    await setLog(logData);

    // Return success response with the retrieved absences
    return useSuccessResponse(res, successMessages.Absences.AllFound, absences, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.Absences.NotFound, statusCode.apiStatusCodes.badRequest);
  }
};

/**
 * Retrieve an absence by ID
 * 
 * This function retrieves an absence by its ID from the database. It performs the following steps:
 * 1. Extracts the absence ID from the request parameters.
 * 2. Fetches the absence with the provided ID from the database.
 * 3. Validates if the absence is found.
 * 4. Logs the operation for auditing purposes.
 * 5. Returns a success response with the retrieved absence or an error response in case of any issues.
 * 
 * @param {Object} req - The request object containing the absence ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the retrieved absence or an error message.
 */
const getAbsenceById = async (req, res) => {
  const { id } = req.params;
  try {
    const absence = await prisma.absences.findUnique({
      where: { absences_id: parseInt(id) },
    });

    if (!absence) {
      return useErrorResponse(res, errorMessages.Absences.NotFound, statusCode.apiStatusCodes.badRequest);
    }

    // Log the operation for auditing purposes
    const logData = {
      level: "info",
      message: successMessages.Absences.Found,
      success: true,
      userType: req.userType,
      owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200
    };
    await setLog(logData);

    // Return success response with the retrieved absence
    return useSuccessResponse(res, successMessages.Absences.Found, absence, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.Absences.NotFound, statusCode.apiStatusCodes.badRequest);
  }
};

/**
 * Update an existing absence
 * 
 * This function handles the updating of an existing absence record. It performs the following steps:
 * 1. Extracts the required fields from the request body and parameters.
 * 2. Validates if the necessary fields are provided.
 * 3. Searches for the existing absence by ID.
 * 4. Checks if the remaining holidays are sufficient for the update.
 * 5. Prepares the data to update the absence.
 * 6. Updates the absence in the database.
 * 7. Logs the operation for auditing purposes.
 * 8. Returns a success response with the updated absence or an error response in case of any issues.
 * 
 * @param {Object} req - The request object containing the update data.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the updated absence or an error message.
 */
const updateAbsence = async (req, res) => {
  const { id } = req.params;
  const {
    absenceType, startingDate, endingDate, comment,
    daysOfHolidays, profileId, payrollId, takenAbsences, remainingHolidays
  } = req.body;
  try {
    const existingAbsence = await prisma.absences.findUnique({
      where: { absences_id: parseInt(id) },
    });

    if (!existingAbsence) {
      return useErrorResponse(res, errorMessages.Absences.NotFound, statusCode.apiStatusCodes.badRequest);
    }

    // Check if the remaining holidays are sufficient for the update
    if (existingAbsence.remainingHolidays - daysOfHolidays <= 0) {
      return useErrorResponse(res, `Don't have enough holidays`, statusCode.apiStatusCodes.badRequest);
    }

    if (existingAbsence.allowedHolidays < daysOfHolidays) {
      return useErrorResponse(res, `Invalid days value`, statusCode.apiStatusCodes.badRequest);
    }

    if (existingAbsence.remainingHolidays == 0) {
      return useErrorResponse(res, `No remaining holidays allowed`, statusCode.apiStatusCodes.badRequest);
    }

    if (!daysOfHolidays || !takenAbsences || !remainingHolidays) {
      return useErrorResponse(res, `Provide all fields`, statusCode.apiStatusCodes.badRequest);
    }

    if (existingAbsence.remainingHolidays < takenAbsences) {
      return useErrorResponse(res, `Don't have enough holidays`, statusCode.apiStatusCodes.badRequest);
    }

    const updatedAbsenceData = {
      absenceType: absenceType !== undefined ? absenceType : existingAbsence.absenceType,
      startingDate: startingDate !== undefined ? startingDate : existingAbsence.startingDate,
      endingDate: endingDate !== undefined ? endingDate : existingAbsence.endingDate,
      comment: comment !== undefined ? comment : existingAbsence.comment,
      daysOfHolidays: daysOfHolidays,
      allowedHolidays: existingAbsence.allowedHolidays,
      takenAbsences: takenAbsences,
      remainingHolidays: remainingHolidays - daysOfHolidays,
      profileId: profileId !== undefined ? profileId : existingAbsence.profileId,
      payrollId: payrollId !== undefined ? payrollId : existingAbsence.payrollId,
    };

    // Update the absence in the database
    const absence = await prisma.absences.update({
      where: { absences_id: parseInt(id) },
      data: updatedAbsenceData,
    });

    // Log the operation for auditing purposes
    const logData = {
      level: "info",
      message: successMessages.Absences.Update,
      success: true,
      userType: req.userType,
      owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200
    };
    await setLog(logData);

    // Return success response with the updated absence
    return useSuccessResponse(res, successMessages.Absences.Update, absence, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.Absences.Update, statusCode.apiStatusCodes.badRequest);
  }
};

/**
 * Delete an existing absence
 * 
 * This function handles the deletion of an existing absence record. It performs the following steps:
 * 1. Extracts the absence ID from the request parameters.
 * 2. Searches for the existing absence by ID.
 * 3. Deletes the absence from the database.
 * 4. Logs the operation for auditing purposes.
 * 5. Returns a success response with the deleted absence or an error response in case of any issues.
 * 
 * @param {Object} req - The request object containing the absence ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the deleted absence or an error message.
 */
const deleteAbsence = async (req, res) => {
  const { id } = req.params;
  try {
    const existingAbsence = await prisma.absences.findUnique({
      where: { absences_id: parseInt(id) },
    });

    if (!existingAbsence) {
      return useErrorResponse(res, errorMessages.Absences.NotFound, statusCode.apiStatusCodes.badRequest);
    }

    // Delete the absence from the database
    const absence = await prisma.absences.delete({
      where: { absences_id: parseInt(id) },
    });

    // Log the operation for auditing purposes
    const logData = {
      level: "info",
      message: successMessages.Absences.Delete,
      success: true,
      userType: req.userType,
      owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
      status: 200
    };
    await setLog(logData);

    // Return success response with the deleted absence
    return useSuccessResponse(res, successMessages.Absences.Delete, absence, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.Absences.Delete, statusCode.apiStatusCodes.badRequest);
  }
};

module.exports = {
  createAbsence,
  getAllAbsences,
  getAbsenceById,
  updateAbsence,
  deleteAbsence,
};

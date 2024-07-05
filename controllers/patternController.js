const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");

/**
 * Create a new shift pattern.
 * 
 * This function handles the creation of a new shift pattern. It performs the following steps:
 * 1. Extracts the required fields from the request body.
 * 2. Creates a new shift pattern in the database with the provided details.
 * 3. Returns a success response with the newly created shift pattern data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createShiftPattern = async (req, res) => {
  const {
    patternName, patternType, isWeekly, repeatWeekNum, isOnAndOff, lengthDays,
    isSpecificMonth, days, repeatMonth, isLastDayOfMonth, periodStartingDate,
    periodEndingDate, isAppliedOnBankHolidays, isAutoExtend, autoExtendMonth,
    autoExtendDaysBeforePeriod, periodStartingTime, periodEndingTime, shiftInstruction,
    locationId
  } = req.body;

  try {
    const shiftPattern = await prisma.shiftPattern.create({
      data: {
        patternName,
        patternType,
        isWeekly: isWeekly !== undefined ? isWeekly : false,
        repeatWeekNum: isWeekly === true ? repeatWeekNum : 0,
        isOnAndOff: isOnAndOff !== undefined ? isOnAndOff : false,
        lengthDays: isOnAndOff === true ? lengthDays : 0,
        isSpecificMonth: isSpecificMonth !== undefined ? isSpecificMonth : false,
        days: isSpecificMonth === true ? days : 0,
        repeatMonth: isSpecificMonth === true || isLastDayOfMonth !== true ? repeatMonth : 0,
        isLastDayOfMonth: isLastDayOfMonth !== undefined ? isLastDayOfMonth : false,
        periodStartingDate,
        periodEndingDate,
        isAppliedOnBankHolidays: isAppliedOnBankHolidays !== undefined ? isAppliedOnBankHolidays : false,
        isAutoExtend: isAutoExtend !== undefined ? isAutoExtend : false,
        autoExtendMonth: isAutoExtend === true ? autoExtendMonth : 0,
        autoExtendDaysBeforePeriod: isAutoExtend === true ? autoExtendDaysBeforePeriod : 0,
        periodStartingTime,
        periodEndingTime,
        shiftInstruction: shiftInstruction !== undefined ? shiftInstruction : "",
        Location: {
          connect: {
            location_id: parseInt(locationId)
          }
        }
      }
    });

    return useSuccessResponse(res, successMessages.ShiftPatterns.Create, shiftPattern, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.ShiftPatterns.Create, statusCode.apiStatusCodes.badRequest);
  }
};

/**
 * Get all shift patterns.
 * 
 * This function retrieves all shift patterns from the database. It performs the following steps:
 * 1. Queries the database to find all shift patterns.
 * 2. Returns a success response with the list of shift patterns.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllShiftPatterns = async (req, res) => {
  try {
    const shiftPatterns = await prisma.shiftPattern.findMany();
    if (shiftPatterns.length === 0) {
      return useErrorResponse(res, errorMessages.ShiftPatterns.NotFound, statusCode.apiStatusCodes.badRequest);
    }
    return useSuccessResponse(res, successMessages.ShiftPatterns.AllFound, shiftPatterns, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.ShiftPatterns.NotFound, statusCode.apiStatusCodes.badRequest);
  }
};

/**
 * Get a shift pattern by ID.
 * 
 * This function retrieves a specific shift pattern by its ID from the database. It performs the following steps:
 * 1. Extracts the shift pattern ID from the request parameters.
 * 2. Queries the database to find the shift pattern with the provided ID.
 * 3. If the shift pattern does not exist, returns an error response indicating that the shift pattern was not found.
 * 4. Returns a success response with the shift pattern data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getShiftPatternById = async (req, res) => {
  const { id } = req.params;
  try {
    const shiftPattern = await prisma.shiftPattern.findUnique({
      where: { pattern_id: parseInt(id) },
      include: { Location: true }
    });
    if (shiftPattern) {
      return useSuccessResponse(res, successMessages.ShiftPatterns.Found, shiftPattern, statusCode.apiStatusCodes.ok);
    } else {
      return useErrorResponse(res, errorMessages.ShiftPatterns.NotFound, statusCode.apiStatusCodes.badRequest);
    }
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.ShiftPatterns.NotFound, statusCode.apiStatusCodes.badRequest);
  }
};

/**
 * Update a shift pattern.
 * 
 * This function updates the details of a specific shift pattern by its ID. It performs the following steps:
 * 1. Extracts the shift pattern ID from the request parameters and the updated data from the request body.
 * 2. Updates the shift pattern in the database with the provided data.
 * 3. Returns a success response with the updated shift pattern data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateShiftPattern = async (req, res) => {
  const { id } = req.params;
  const {
    patternName, patternType, isWeekly, repeatWeekNum, isOnAndOff, lengthDays,
    isSpecificMonth, days, repeatMonth, isLastDayOfMonth, periodStartingDate,
    periodEndingDate, isAppliedOnBankHolidays, isAutoExtend, autoExtendMonth,
    autoExtendDaysBeforePeriod, periodStartingTime, periodEndingTime, shiftInstruction,
    locationId
  } = req.body;

  try {
    const existingShiftPattern = await prisma.shiftPattern.findUnique({
      where: { pattern_id: parseInt(id) },
    });

    if (!existingShiftPattern) {
      return useErrorResponse(res, errorMessages.ShiftPatterns.NotFound, statusCode.apiStatusCodes.badRequest);
    }

    const updatedShiftPatternData = {
      patternName: patternName !== undefined ? patternName : existingShiftPattern.patternName,
      patternType: patternType !== undefined ? patternType : existingShiftPattern.patternType,
      isWeekly: isWeekly !== undefined ? isWeekly : existingShiftPattern.isWeekly,
      repeatWeekNum: repeatWeekNum !== undefined ? repeatWeekNum : existingShiftPattern.repeatWeekNum,
      isOnAndOff: isOnAndOff !== undefined ? isOnAndOff : existingShiftPattern.isOnAndOff,
      lengthDays: lengthDays !== undefined ? lengthDays : existingShiftPattern.lengthDays,
      isSpecificMonth: isSpecificMonth !== undefined ? isSpecificMonth : existingShiftPattern.isSpecificMonth,
      days: days !== undefined ? days : existingShiftPattern.days,
      repeatMonth: repeatMonth !== undefined ? repeatMonth : existingShiftPattern.repeatMonth,
      isLastDayOfMonth: isLastDayOfMonth !== undefined ? isLastDayOfMonth : existingShiftPattern.isLastDayOfMonth,
      periodStartingDate: periodStartingDate !== undefined ? periodStartingDate : existingShiftPattern.periodStartingDate,
      periodEndingDate: periodEndingDate !== undefined ? periodEndingDate : existingShiftPattern.periodEndingDate,
      isAppliedOnBankHolidays: isAppliedOnBankHolidays !== undefined ? isAppliedOnBankHolidays : existingShiftPattern.isAppliedOnBankHolidays,
      isAutoExtend: isAutoExtend !== undefined ? isAutoExtend : existingShiftPattern.isAutoExtend,
      autoExtendMonth: autoExtendMonth !== undefined ? autoExtendMonth : existingShiftPattern.autoExtendMonth,
      autoExtendDaysBeforePeriod: autoExtendDaysBeforePeriod !== undefined ? autoExtendDaysBeforePeriod : existingShiftPattern.autoExtendDaysBeforePeriod,
      periodStartingTime: periodStartingTime !== undefined ? periodStartingTime : existingShiftPattern.periodStartingTime,
      periodEndingTime: periodEndingTime !== undefined ? periodEndingTime : existingShiftPattern.periodEndingTime,
      shiftInstruction: shiftInstruction !== undefined ? shiftInstruction : existingShiftPattern.shiftInstruction,
      Location: locationId !== undefined ? {
        connect: { location_id: parseInt(locationId) }
      } : undefined
    };

    const shiftPattern = await prisma.shiftPattern.update({
      where: { pattern_id: parseInt(id) },
      data: updatedShiftPatternData,
    });

    return useSuccessResponse(res, successMessages.ShiftPatterns.Update, shiftPattern, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.ShiftPatterns.Update, statusCode.apiStatusCodes.badRequest);
  }
};

/**
 * Delete a shift pattern.
 * 
 * This function deletes a specific shift pattern by its ID from the database. It performs the following steps:
 * 1. Extracts the shift pattern ID from the request parameters.
 * 2. Deletes the shift pattern from the database with the provided ID.
 * 3. Returns a success response with the deleted shift pattern data.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteShiftPattern = async (req, res) => {
  const { id } = req.params;
  try {
    const shiftPattern = await prisma.shiftPattern.delete({
      where: { pattern_id: parseInt(id) },
    });

    return useSuccessResponse(res, successMessages.ShiftPatterns.Delete, shiftPattern, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.ShiftPatterns.Delete, statusCode.apiStatusCodes.badRequest);
  }
};

module.exports = {
  createShiftPattern,
  getAllShiftPatterns,
  getShiftPatternById,
  updateShiftPattern,
  deleteShiftPattern,
};

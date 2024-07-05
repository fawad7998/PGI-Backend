const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");
const { setLog } = require("../utils/logger/logs");

const createPayRunSchedule = async (req, res) => {
    try {
        const {
            name, periodLength, isWeek, paySchedulestartDay, scheduleActiveDate, employmentType,
            isMonth, startDayOfMonth, islastDayOfMonth, isCustom, fromPeriodTime, toPeriodTime
        } = req.body;

        // Validate required fields
        if (!name || !employmentType) {
            return useErrorResponse(res, errorMessages.InvalidData, statusCode.apiStatusCodes.badRequest);
        }

        // Calculate the last day of the current month
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const lastDay = new Date(year, month, 0).getDate();

        // Convert JSON objects to Buffer (or retain them as they are if already objects)
        let fromPeriod = {};
        let toPeriod = {};

        if (isCustom) {
            try {
                fromPeriod = JSON.stringify(fromPeriodTime);
                toPeriod = JSON.stringify(toPeriodTime);
            } catch (err) {
                return useErrorResponse(res, "Invalid JSON format for fromPeriodTime or toPeriodTime", statusCode.apiStatusCodes.badRequest);
            }
        }

        // Create new PayRunSchedule in the database
        const newPayRunSchedule = await prisma.payRunSchedule.create({
            data: {
                name,
                periodLength: isCustom ? 0 : periodLength,
                isWeek: isWeek || false,
                paySchedulestartDay: isWeek ? paySchedulestartDay : "",
                scheduleActiveDate: !isCustom ? scheduleActiveDate : "",
                employmentType,
                isMonth: isMonth || false,
                startDayOfMonth: isMonth && !islastDayOfMonth ? startDayOfMonth : 0,
                islastDayOfMonth: islastDayOfMonth || false,
                lastDayofMonth: islastDayOfMonth ? lastDay : 0,
                isCustom: isCustom || false,
                fromPeriodTime: fromPeriod,
                toPeriodTime: toPeriod
            }
        });

        // Log the operation for auditing purposes
        const logData = {
            level: "info",
            message: successMessages.PayRunSchedule.Create,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        };
        await setLog(logData);

        // Return success response with the created PayRunSchedule
        return useSuccessResponse(res, successMessages.PayRunSchedule.Create, newPayRunSchedule, statusCode.apiStatusCodes.created);
    } catch (err) {
        console.error('Error creating PayRunSchedule:', err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};


const getAllPayRunSchedules = async (req, res) => {
    try {
        const payRunSchedules = await prisma.payRunSchedule.findMany();

        if (payRunSchedules.length === 0) {
            return useErrorResponse(res, errorMessages.PayRunSchedule.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const logData = {
            level: "info",
            message: successMessages.PayRunSchedule.AllFound,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        }
        await setLog(logData);

        return useSuccessResponse(res, successMessages.PayRunSchedule.AllFound, payRunSchedules, statusCode.apiStatusCodes.ok);
    } catch (err) {
        console.error('Error retrieving PayRunSchedules:', err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

const getPayRunScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const payRunSchedule = await prisma.payRunSchedule.findUnique({
            where: { payRunSchedule_id: parseInt(id) },
        });

        if (!payRunSchedule) {
            return useErrorResponse(res, errorMessages.PayRunSchedule.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const logData = {
            level: "info",
            message: successMessages.PayRunSchedule.Found,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        }
        await setLog(logData);

        return useSuccessResponse(res, successMessages.PayRunSchedule.Found, payRunSchedule, statusCode.apiStatusCodes.ok);
    } catch (err) {
        console.error('Error retrieving PayRunSchedule by ID:', err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

const updatePayRunSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, periodLength, isWeek, paySchedulestartDay, scheduleActiveDate, employmentType,
            isMonth, startDayOfMonth, islastDayOfMonth, isCustom, fromPeriodTime, toPeriodTime
        } = req.body;

        if (!name || !employmentType) {
            return useErrorResponse(res, errorMessages.InvalidData, statusCode.apiStatusCodes.badRequest);
        }

        // Find the existing payRunSchedule
        const existingPayRunSchedule = await prisma.payRunSchedule.findUnique({
            where: { payRunSchedule_id: parseInt(id) },
        });

        if (!existingPayRunSchedule) {
            return useErrorResponse(res, errorMessages.PayRunSchedule.NotFound, statusCode.apiStatusCodes.notFound);
        }
        let fromPeriod = {};
        let toPeriod = {};
        if (isCustom) {
            try {
                fromPeriod = JSON.stringify(fromPeriodTime);
                toPeriod = JSON.stringify(toPeriodTime);
            } catch (err) {
                return useErrorResponse(res, "Invalid JSON format for fromPeriodTime or toPeriodTime", statusCode.apiStatusCodes.badRequest);
            }
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const lastDay = new Date(year, month, 0).getDate();

        const updatedData = {
            name,
            periodLength: isCustom ? 0 : periodLength,
            isWeek: isWeek !== undefined ? isWeek : false,
            paySchedulestartDay: isWeek === true ? paySchedulestartDay : "",
            scheduleActiveDate: isCustom !== true ? scheduleActiveDate : "",
            employmentType,
            isMonth: isMonth ? isMonth : false,
            startDayOfMonth: isMonth === true && islastDayOfMonth === false ? startDayOfMonth : "",
            islastDayOfMonth: islastDayOfMonth ? islastDayOfMonth : false,
            lastDayofMonth: islastDayOfMonth ? lastDay : 0,
            isCustom: isCustom ? isCustom : false,
            fromPeriodTime: fromPeriod =={} ? existingPayRunSchedule.fromPeriodTime : fromPeriod,
            toPeriodTime: toPeriod=={}? existingPayRunSchedule.toPeriodTime : toPeriod,
        };

        const updatedPayRunSchedule = await prisma.payRunSchedule.update({
            where: { payRunSchedule_id: parseInt(id) },
            data: updatedData,
        });

        const logData = {
            level: "info",
            message: successMessages.PayRunSchedule.Update,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        }
        await setLog(logData);

        return useSuccessResponse(res, successMessages.PayRunSchedule.Update, updatedPayRunSchedule, statusCode.apiStatusCodes.ok);
    } catch (err) {
        console.error('Error updating PayRunSchedule:', err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

const deletePayRunSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        const existingPayRunSchedule = await prisma.payRunSchedule.findUnique({
            where: { payRunSchedule_id: parseInt(id) },
        });

        if (!existingPayRunSchedule) {
            return useErrorResponse(res, errorMessages.PayRunSchedule.NotFound, statusCode.apiStatusCodes.notFound);
        }

        await prisma.payRunSchedule.delete({
            where: { payRunSchedule_id: parseInt(id) },
        });

        const logData = {
            level: "info",
            message: successMessages.PayRunSchedule.Delete,
            success: true,
            userType: req.userType,
            owner: req.userType === 'organization' ? req.organization.name : `${req.profile.firstName} ${req.profile.lastName}`,
            status: 200
        }
        await setLog(logData);

        return useSuccessResponse(res, successMessages.PayRunSchedule.Delete, existingPayRunSchedule, statusCode.apiStatusCodes.ok);
    } catch (err) {
        console.error('Error deleting PayRunSchedule:', err);
        return useErrorResponse(res, errorMessages.SomethingWrong, statusCode.apiStatusCodes.internalServerError);
    }
};

module.exports = {
    createPayRunSchedule,
    getAllPayRunSchedules,
    getPayRunScheduleById,
    updatePayRunSchedule,
    deletePayRunSchedule,
};

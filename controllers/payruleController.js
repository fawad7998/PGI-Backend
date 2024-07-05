const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");

const createPayRule = async (req, res) => {
  const { payRate, payCode, conditions, appliesTo } = req.body;

  try {
    const existPayRule = await prisma.payRule.findMany({
        where:{
            
        }
    })
    const payRule = await prisma.payRule.create({
      data: {
        payRate,
        payCode,
        conditions,
        appliesTo: {
          create: appliesTo.map(item => ({
            positionId: item.positionId ? item.positionId : null,
            clientId: item.clientId ? item.clientId : null,
            locationId: item.locationId ? item.locationId : null,
            eventId: item.eventId ? item.eventId : null,
          })),
        },
      },
    });

    return useSuccessResponse(res, successMessages.PayRule.Create, payRule, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.PayRule.Create, statusCode.apiStatusCodes.badRequest);
  }
};

const getAllPayRules = async (req, res) => {
  try {
    const payRules = await prisma.payRule.findMany({
      include: {
        appliesTo: true,
      },
    });

    if (payRules.length === 0) {
      return useErrorResponse(res, errorMessages.PayRule.NotFound, statusCode.apiStatusCodes.badRequest);
    }
    return useSuccessResponse(res, successMessages.PayRule.AllFound, payRules, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.PayRule.NotFound, statusCode.apiStatusCodes.badRequest);
  }
};

const getPayRuleById = async (req, res) => {
  const { id } = req.params;
  try {
    const payRule = await prisma.payRule.findUnique({
      where: { id: parseInt(id) },
      include: {
        appliesTo: true,
      },
    });
    if (payRule) {
      return useSuccessResponse(res, successMessages.PayRule.Found, payRule, statusCode.apiStatusCodes.ok);
    } else {
      return useErrorResponse(res, errorMessages.PayRule.NotFound, statusCode.apiStatusCodes.badRequest);
    }
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.PayRule.NotFound, statusCode.apiStatusCodes.badRequest);
  }
};

const updatePayRule = async (req, res) => {
  const { id } = req.params;
  const { payRate, payCode, conditions, appliesTo } = req.body;

  try {
    const existingPayRule = await prisma.payRule.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPayRule) {
      return res.status(404).json({ error: 'Pay rule not found' });
    }

    const updatedPayRule = await prisma.payRule.update({
      where: { id: parseInt(id) },
      data: {
        payRate,
        payCode,
        conditions,
        appliesTo: {
          deleteMany: {}, // Clear existing appliesTo
          create: appliesTo.map(item => ({
            positionId: item.positionId ? item.positionId : null,
            clientId: item.clientId ? item.clientId : null,
            locationId: item.locationId ? item.locationId : null,
            eventId: item.eventId ? item.eventId : null,
          })),
        },
      },
    });

    return useSuccessResponse(res, successMessages.PayRule.Update, updatedPayRule, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.PayRule.Update, statusCode.apiStatusCodes.badRequest);
  }
};

const deletePayRule = async (req, res) => {
  const { id } = req.params;
  try {
    const payRule = await prisma.payRule.delete({
      where: { id: parseInt(id) },
    });

    return useSuccessResponse(res, successMessages.PayRule.Delete, payRule, statusCode.apiStatusCodes.ok);
  } catch (error) {
    console.log(error.message);
    return useErrorResponse(res, errorMessages.PayRule.Delete, statusCode.apiStatusCodes.badRequest);
  }
};

module.exports = {
  createPayRule,
  getAllPayRules,
  getPayRuleById,
  updatePayRule,
  deletePayRule,
};

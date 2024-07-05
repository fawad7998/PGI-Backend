const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const { useErrorResponse } = require('../utils/apiResponses/apiResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require('../utils/apiStatus');

const prisma = new PrismaClient();
require('dotenv').config();

/**
 * Middleware to protect routes by verifying JWT token.
 * Extracts the token from the Authorization header and verifies it.
 * Attaches the organization or user profile to the request object based on the decoded token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Calls the next middleware function if verification is successful, or returns an error response.
 */
const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the authorization header is present and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT secret key
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // If the token contains an organizationId, fetch the organization details
      if (decodedToken.organizationId) {
        const organization = await prisma.organization.findUnique({
          where: { organization_id: decodedToken.organizationId },
        });

        // If the organization is not found, return an error response
        if (!organization) {
          return useErrorResponse(
            res,
            errorMessages.Organization.NotFound,
            statusCode.apiStatusCodes.notFound
          );
        }

        // Attach the organization to the request object and set the user type to 'organization'
        req.organization = organization;
        req.userType = 'organization';
        return next();
      }

      // If the token contains a userId, fetch the user details
      if (decodedToken.userId) {
        const user = await prisma.userCredientials.findUnique({
          where: { user_id: decodedToken.userId },
          include: { profile: true },
        });

        // If the user is not found, return an error response
        if (!user) {
          return useErrorResponse(
            res,
            errorMessages.User.NotFound,
            statusCode.apiStatusCodes.notFound
          );
        }

        // Attach the user profile to the request object and set the user type to 'profile'
        req.profile = user.profile;
        req.userType = 'profile';
        return next();
      }

      // If the token does not contain a valid identifier, return an error response
      return useErrorResponse(
        res,
        errorMessages.User.NotFound,
        statusCode.apiStatusCodes.notFound
      );
    } catch (error) {
      // Handle token verification errors
      console.error(error);
      return useErrorResponse(
        res,
        errorMessages.authMiddleWareErrorMessages.InValidToken,
        498
      );
    }
  } else {
    // If the authorization header is not found or is not in the correct format, return an error response
    return useErrorResponse(
      res,
      errorMessages.authMiddleWareErrorMessages.TokenNotFound,
      401
    );
  }
});

module.exports = { protectRoute };

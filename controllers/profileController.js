const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { useSuccessResponse, useErrorResponse } = require('../utils/apiResponses/apiResponses');
const successMessages = require('../utils/responses/successResponses');
const errorMessages = require('../utils/responses/errorResponses');
const statusCode = require("../utils/apiStatus");
const { setLog } = require("../utils/logger/logs");

/**
 * Creates a new profile in the database.
 * 
 * @param {Object} req - The request object containing the profile data.
 * @param {Object} res - The response object.
 * @returns {Object} - The newly created profile data or an error message.
 */
const createProfile = async (req, res) => {
    try {
        const {
            id, firstName, lastName, employmentType, contractNo,
            contractStartTime, contractEndTime, positionId, isAccessToStaffPortal,
            mobileNo, streetName, apartmentNo, houseNo, postCode, city,
            country, gender, dob, nationality, cityOfBirth, countryOfBirth,
            nINo, isDrivingLicense, isVisaRequired, visaDescription, visaExpiryDate,
            isTwoStepFactorAuth, organizationId, isSecurityGuard, emergencyContact,
            qualification, certification, isActive, roleId
        } = req.body;

        const req_obj = {
            isSecurityGuard: Boolean(isSecurityGuard),
            isAccessToStaffPortal: Boolean(isAccessToStaffPortal),
            isDrivingLicense: Boolean(isDrivingLicense),
            isVisaRequired: Boolean(isVisaRequired)
        };

        // Check if the organization exists
        const organization = await prisma.organization.findUnique({
            where: { organization_id: parseInt(organizationId) }
        });
        if (!organization) {
            return useErrorResponse(res, `Organization does not exist`, statusCode.apiStatusCodes.notFound);
        }

        // Check if the position exists
        const existPosition = await prisma.position.findUnique({
            where: { position_id: parseInt(positionId) }
        });
        if (!existPosition) {
            return useErrorResponse(res, `Position does not exist`, statusCode.apiStatusCodes.notFound);
        }
        console.log(roleId)
        // Check if the role exists
        const existRole = await prisma.role.findUnique({
            where: { role_id: parseInt(roleId) }
        });
        if (!existRole) {
            return useErrorResponse(res, `Role does not exist`, 404);
        }

        // Check if the profile already exists
        const existProfile = await prisma.profile.findUnique({
            where: { id: parseInt(id) }
        });
        const existProfileByProfileId = await prisma.profile.findMany({
            where: { contractNo: parseInt(contractNo) }
        });

        if (existProfile || existProfileByProfileId.length > 0) {
            return useErrorResponse(res, `Profile already exists`, statusCode.apiStatusCodes.badRequest);
        }

        let imageUrl = req.file ? req.file.path : "";
        console.log(imageUrl);

        let securityGuardData = null;

        // Check if the security guard exists or needs to be created
        if (req_obj.isSecurityGuard) {
            const existSecurityGuard = await prisma.securityguard.findMany({
                where: { emergencyContact: emergencyContact }
            });

            if (existSecurityGuard.length === 0) {
                securityGuardData = await prisma.securityguard.create({
                    data: {
                        emergencyContact,
                        certification,
                        qualification,
                        isActive
                    }
                });
            } else {
                securityGuardData = existSecurityGuard[0];
            }
        }

        const profileData = {
            id: parseInt(id),
            firstName,
            lastName,
            employmentType,
            contractNo: parseInt(contractNo),
            contractStartTime,
            contractEndTime,
            isAccessToStaffPortal: req_obj.isAccessToStaffPortal,
            mobileNo,
            streetName,
            apartmentNo: parseInt(apartmentNo),
            houseNo: parseInt(houseNo),
            postCode: parseInt(postCode),
            city,
            country,
            gender,
            dob,
            nationality,
            cityOfBirth,
            countryOfBirth,
            nINo: parseInt(nINo),
            isDrivingLicense: req_obj.isDrivingLicense,
            isVisaRequired: req_obj.isVisaRequired,
            visaDescription,
            visaExpiryDate,
            isTwoStepFactorAuth: Boolean(isTwoStepFactorAuth),
            organization: { connect: { organization_id: parseInt(organizationId) } },
            role: { connect: { role_id: parseInt(existRole.role_id) } },
            image: imageUrl,
            isSecurityGuard: req_obj.isSecurityGuard,
            Position: { connect: { position_id: parseInt(positionId) } },
        };

        if (req_obj.isSecurityGuard && securityGuardData) {
            profileData.securityGuard = { connect: { s_id: securityGuardData.s_id } };
        }

        const profile = await prisma.profile.create({
            data: profileData
        });

        const logData = {
            level: "info",
            message: `Profile created successfully `,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, `Profile created successfully `, profile, statusCode.apiStatusCodes.created);
    } catch (e) {
        console.error(e.message);
        return useErrorResponse(res, `Internal Server Error: ${e.message}`, statusCode.apiStatusCodes.internalServerError);
    }
};

/**
 * Retrieves all profiles from the database.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - A list of profiles or an error message.
 */
const getProfiles = async (req, res) => {
    try {
        const profiles = await prisma.profile.findMany({
            include: {
                securityGuard: true,
                organization: true,
                Position: true
            }
        });
        if (profiles.length <= 0) {
            return useErrorResponse(res, errorMessages.Profile.NotFound, 404);
        }

        // Remove the password field from the organization object in each profile
        const sanitizedProfiles = profiles.map(profile => {
            const { organization, ...restProfile } = profile;
            if (organization) {
                const { password, ...restOrganization } = organization;
                return { ...restProfile, organization: restOrganization };
            }
            return profile;
        });

        const logData = {
            level: "info",
            message: successMessages.Profile.AllFound,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Profile.AllFound, sanitizedProfiles, 200);
    } catch (e) {
        console.error(e.message);
        return useErrorResponse(res, errorMessages.SomethingWrong, 500);
    }
};

/**
 * Retrieves a profile by its ID.
 * 
 * @param {Object} req - The request object containing the profile ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The profile data or an error message.
 */
const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await prisma.profile.findUnique({
            where: { profile_id: parseInt(id) },
        });
        if (!profile) {
            return useErrorResponse(res, errorMessages.Profile.NotFound, statusCode.apiStatusCodes.notFound);
        }

        const result = profile.isSecurityGuard == true ? await prisma.profile.findMany({
            where: {
                profile_id: parseInt(id)
            },
            include: {
                securityGuard: true,
                organization: true,
                Position: true
            }
        }) : await prisma.profile.findMany({
            where: {
                profile_id: parseInt(id)
            },
            include: {
                organization: true
            }
        });

        if (!profile) return useErrorResponse(res, errorMessages.Profile.NotFound, 404);

        const sanitizedProfiles = result.map(profile => {
            const { organization, ...restProfile } = profile;
            if (organization) {
                const { password, ...restOrganization } = organization;
                return { ...restProfile, organization: restOrganization };
            }
            return profile;
        });

        const logData = {
            level: "info",
            message: successMessages.Profile.Found,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Profile.Found, sanitizedProfiles, 200);
    } catch (e) {
        console.error(e.message);
        return useErrorResponse(res, errorMessages.SomethingWrong, 500);
    }
};

/**
 * Updates an existing profile in the database.
 * 
 * @param {Object} req - The request object containing the updated profile data.
 * @param {Object} res - The response object.
 * @returns {Object} - The updated profile data or an error message.
 */
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstName, lastName, employmentType, contractNo,
            contractStartTime, contractEndTime, PositionId, isAccessToStaffPortal,
            mobileNo, streetName, apartmentNo, houseNo, postCode, city,
            country, gender, dob, nationality, cityOfBirth, countryOfBirth,
            nINo, isDrivingLicense, isVisaRequired, visaDescription, visaExpiryDate,
            isTwoStepFactorAuth, isSecurityGuard, emergencyContact, qualification, certification
        } = req.body;

        const existingProfile = await prisma.profile.findUnique({
            where: { profile_id: parseInt(id) },
        });

        if (!existingProfile) {
            return useErrorResponse(res, errorMessages.Profile.NotFound, 404);
        }

        // Get the uploaded image URL from Cloudinary
        let imageUrl;
        if (req.file) {
            imageUrl = req.file.path;
            console.log('Image URL:', imageUrl); // Log the image URL
        }

        const updatedProfileData = {
            firstName: firstName !== undefined ? firstName : existingProfile.firstName,
            lastName: lastName !== undefined ? lastName : existingProfile.lastName,
            employmentType: employmentType !== undefined ? employmentType : existingProfile.employmentType,
            contractNo: contractNo !== undefined ? contractNo : existingProfile.contractNo,
            contractStartTime: contractStartTime !== undefined ? contractStartTime : existingProfile.contractStartTime,
            contractEndTime: contractEndTime !== undefined ? contractEndTime : existingProfile.contractEndTime,
            Position: PositionId !== undefined ? {
                connect: {
                    position_id: parseInt(PositionId)
                }
            } : existingProfile.Position,
            isAccessToStaffPortal: isAccessToStaffPortal !== undefined ? isAccessToStaffPortal : existingProfile.isAccessToStaffPortal,
            mobileNo: mobileNo !== undefined ? mobileNo : existingProfile.mobileNo,
            streetName: streetName !== undefined ? streetName : existingProfile.streetName,
            apartmentNo: apartmentNo !== undefined ? apartmentNo : existingProfile.apartmentNo,
            houseNo: houseNo !== undefined ? houseNo : existingProfile.houseNo,
            postCode: postCode !== undefined ? postCode : existingProfile.postCode,
            city: city !== undefined ? city : existingProfile.city,
            country: country !== undefined ? country : existingProfile.country,
            gender: gender !== undefined ? gender : existingProfile.gender,
            dob: dob !== undefined ? dob : existingProfile.dob,
            nationality: nationality !== undefined ? nationality : existingProfile.nationality,
            cityOfBirth: cityOfBirth !== undefined ? cityOfBirth : existingProfile.cityOfBirth,
            countryOfBirth: countryOfBirth !== undefined ? countryOfBirth : existingProfile.countryOfBirth,
            nINo: nINo !== undefined ? nINo : existingProfile.nINo,
            isDrivingLicense: isDrivingLicense !== undefined ? isDrivingLicense : existingProfile.isDrivingLicense,
            isVisaRequired: isVisaRequired !== undefined ? isVisaRequired : existingProfile.isVisaRequired,
            visaDescription: visaDescription !== undefined ? visaDescription : existingProfile.visaDescription,
            visaExpiryDate: visaExpiryDate !== undefined ? visaExpiryDate : existingProfile.visaExpiryDate,
            isTwoStepFactorAuth: isTwoStepFactorAuth !== undefined ? isTwoStepFactorAuth : existingProfile.isTwoStepFactorAuth,
            image: imageUrl !== undefined ? imageUrl : existingProfile.image,
        };

        const profile = await prisma.profile.update({
            where: { profile_id: parseInt(id) },
            data: updatedProfileData,
            include: {
                organization: true,
                securityGuard: true
            }
        });
        if (profile.isSecurityGuard == true) {
            const existSecurityGuard = await prisma.securityguard.findUnique({
                where: {
                    s_id: parseInt(profile.securityGuardId)
                }
            });

            if (!existSecurityGuard) { return useErrorResponse(res, errorMessages.Securityguard.NotFound, statusCode.apiStatusCodes.notFound); }
            await prisma.securityguard.update({
                where: {
                    s_id: parseInt(profile.securityGuardId)
                },
                data: {
                    emergencyContact: emergencyContact !== undefined ? emergencyContact : existSecurityGuard.emergencyContact,
                    qualification: qualification !== undefined ? qualification : existSecurityGuard.qualification,
                    certification: certification !== undefined ? certification : existSecurityGuard.certification
                }
            });
        }

        const logData = {
            level: "info",
            message: successMessages.Profile.Update,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Profile.Update, profile, 200);
    } catch (e) {
        console.error(e.message);
        if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2002':
                    return useErrorResponse(res, errorMessages.Profile.UniqueConstraintFailed, 400);
                default:
                    return useErrorResponse(res, errorMessages.SomethingWrong, 500);
            }
        } else {
            return useErrorResponse(res, errorMessages.SomethingWrong, 500);
        }
    }
};

/**
 * Deletes a profile from the database.
 * 
 * @param {Object} req - The request object containing the profile ID.
 * @param {Object} res - The response object.
 * @returns {Object} - The deleted profile data or an error message.
 */
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await prisma.profile.delete({
            where: { profile_id: parseInt(id) },
        });
        const logData = {
            level: "info",
            message: successMessages.Profile.Delete,
            success: true,
            userType: req.userType,
            owner: req.organization ? req.organization.name : `organization`,
            status: 200
        };
        await setLog(logData);

        return useSuccessResponse(res, successMessages.Profile.Delete, profile, 200);
    } catch (e) {
        console.error(e.message);
        if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2025':
                    return useErrorResponse(res, errorMessages.Profile.NotFound, 404);
                default:
                    return useErrorResponse(res, errorMessages.SomethingWrong, 500);
            }
        } else {
            return useErrorResponse(res, errorMessages.SomethingWrong, 500);
        }
    }
};

module.exports = {
    createProfile,
    getProfiles,
    getProfileById,
    updateProfile,
    deleteProfile,
};

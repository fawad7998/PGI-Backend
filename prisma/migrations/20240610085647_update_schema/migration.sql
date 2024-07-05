-- CreateTable
CREATE TABLE `Organization` (
    `organization_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `businessEmail` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `phoneNumber` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `token` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `Organization_businessEmail_key`(`businessEmail`),
    PRIMARY KEY (`organization_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `profile_id` INTEGER NOT NULL AUTO_INCREMENT,
    `id` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `employmentType` VARCHAR(191) NOT NULL DEFAULT 'Standard',
    `contractNo` INTEGER NOT NULL,
    `contractStartTime` VARCHAR(191) NOT NULL,
    `contractEndTime` VARCHAR(191) NOT NULL,
    `Position` ENUM('DoorSupervisor', 'DutyManager', 'EventSteward', 'OperationsManager', 'SecurityOfficer') NOT NULL DEFAULT 'DoorSupervisor',
    `isAccessToStaffPortal` BOOLEAN NOT NULL DEFAULT false,
    `mobileNo` VARCHAR(191) NOT NULL,
    `streetName` VARCHAR(191) NOT NULL,
    `apartmentNo` INTEGER NOT NULL,
    `houseNo` INTEGER NOT NULL,
    `postCode` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `gender` ENUM('Female', 'Male', 'NonBinary', 'Undisclosed') NOT NULL DEFAULT 'Male',
    `dob` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `cityOfBirth` VARCHAR(191) NOT NULL,
    `countryOfBirth` VARCHAR(191) NOT NULL,
    `nINo` INTEGER NOT NULL,
    `isSecurityGuard` BOOLEAN NOT NULL DEFAULT false,
    `isDrivingLicense` BOOLEAN NOT NULL DEFAULT false,
    `isVisaRequired` BOOLEAN NOT NULL DEFAULT false,
    `visaDescription` VARCHAR(191) NULL,
    `visaExpiryDate` VARCHAR(191) NULL,
    `organizationId` INTEGER NOT NULL,
    `isTwoStepFactorAuth` BOOLEAN NOT NULL DEFAULT false,
    `securityGuardId` INTEGER NOT NULL,

    UNIQUE INDEX `Profile_id_key`(`id`),
    UNIQUE INDEX `Profile_securityGuardId_key`(`securityGuardId`),
    PRIMARY KEY (`profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Securityguard` (
    `s_id` INTEGER NOT NULL AUTO_INCREMENT,
    `emergencyContact` VARCHAR(191) NOT NULL,
    `qualification` VARCHAR(191) NOT NULL,
    `certification` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`s_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_type` VARCHAR(191) NOT NULL,
    `profileId` INTEGER NOT NULL,

    UNIQUE INDEX `Role_profileId_key`(`profileId`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivePayRunSchedule` (
    `pay_run_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pay_type` ENUM('Biweekly', 'CustomPaySchedule', 'Monthly', 'Weekly') NOT NULL DEFAULT 'Biweekly',
    `periodLength` VARCHAR(191) NOT NULL,
    `activeFrom` VARCHAR(191) NOT NULL,
    `employmentId` INTEGER NOT NULL,

    UNIQUE INDEX `ActivePayRunSchedule_employmentId_key`(`employmentId`),
    PRIMARY KEY (`pay_run_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payroll` (
    `payroll_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pay_amount` INTEGER NOT NULL,
    `payment_month` VARCHAR(191) NOT NULL,
    `isRecieved` BOOLEAN NOT NULL DEFAULT false,
    `securityGuardId` INTEGER NOT NULL,

    PRIMARY KEY (`payroll_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Absences` (
    `absences_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `securityGuardId` INTEGER NOT NULL,
    `payrollId` INTEGER NOT NULL,

    PRIMARY KEY (`absences_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShiftTimeSheet` (
    `shiftTimesheet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shiftDay` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL DEFAULT 'SUNDAY',
    `shiftDate` VARCHAR(191) NOT NULL,
    `shiftStartTime` VARCHAR(191) NOT NULL,
    `shiftEndTime` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`shiftTimesheet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Forms` (
    `form_id` INTEGER NOT NULL AUTO_INCREMENT,
    `form_name` VARCHAR(191) NOT NULL,
    `form_extension` VARCHAR(191) NOT NULL,
    `form_template` JSON NOT NULL,
    `securityGuardId` INTEGER NOT NULL,

    PRIMARY KEY (`form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Availability` (
    `availability_id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `securityGuardId` INTEGER NOT NULL,

    PRIMARY KEY (`availability_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Calendar` (
    `calendar_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL DEFAULT 'SUNDAY',
    `availabilityId` INTEGER NOT NULL,

    PRIMARY KEY (`calendar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `schedule_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shiftType` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `securityGuardId` INTEGER NOT NULL,

    PRIMARY KEY (`schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Breakperiod` (
    `breakperiod_id` INTEGER NOT NULL AUTO_INCREMENT,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `scheduleId` INTEGER NOT NULL,
    `shiftId` INTEGER NOT NULL,

    PRIMARY KEY (`breakperiod_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveTracking` (
    `livetracking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `areaAddress` VARCHAR(191) NOT NULL,
    `timestramp` VARCHAR(191) NOT NULL,
    `securityGuardId` INTEGER NOT NULL,

    PRIMARY KEY (`livetracking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Latitude` (
    `latitude_id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `liveTrackingId` INTEGER NOT NULL,

    PRIMARY KEY (`latitude_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Longitude` (
    `longitude_id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `liveTrackingId` INTEGER NOT NULL,

    PRIMARY KEY (`longitude_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `generatedAt` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `securityGuardId` INTEGER NOT NULL,

    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documents` (
    `document_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `extension` VARCHAR(191) NOT NULL,
    `securityGuardId` INTEGER NOT NULL,

    PRIMARY KEY (`document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`organization_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Absences` ADD CONSTRAINT `Absences_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Absences` ADD CONSTRAINT `Absences_payrollId_fkey` FOREIGN KEY (`payrollId`) REFERENCES `Payroll`(`payroll_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forms` ADD CONSTRAINT `Forms_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Availability` ADD CONSTRAINT `Availability_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Calendar` ADD CONSTRAINT `Calendar_availabilityId_fkey` FOREIGN KEY (`availabilityId`) REFERENCES `Availability`(`availability_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Breakperiod` ADD CONSTRAINT `Breakperiod_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`schedule_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Breakperiod` ADD CONSTRAINT `Breakperiod_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `ShiftTimeSheet`(`shiftTimesheet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveTracking` ADD CONSTRAINT `LiveTracking_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Latitude` ADD CONSTRAINT `Latitude_liveTrackingId_fkey` FOREIGN KEY (`liveTrackingId`) REFERENCES `LiveTracking`(`livetracking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Longitude` ADD CONSTRAINT `Longitude_liveTrackingId_fkey` FOREIGN KEY (`liveTrackingId`) REFERENCES `LiveTracking`(`livetracking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documents` ADD CONSTRAINT `Documents_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

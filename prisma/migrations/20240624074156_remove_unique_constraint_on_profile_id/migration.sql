/*
  Warnings:

  - You are about to drop the column `date` on the `Absences` table. All the data in the column will be lost.
  - You are about to drop the column `securityGuardId` on the `Absences` table. All the data in the column will be lost.
  - You are about to drop the column `shiftId` on the `Breakperiod` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `Documents` table. All the data in the column will be lost.
  - You are about to drop the column `Position` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `ActivePayRunSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Calendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShiftTimeSheet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role_type]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `absenceType` to the `Absences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endingDate` to the `Absences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPaid` to the `Absences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingDate` to the `Absences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloudinary_id` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Absences` DROP FOREIGN KEY `Absences_payrollId_fkey`;

-- DropForeignKey
ALTER TABLE `Absences` DROP FOREIGN KEY `Absences_securityGuardId_fkey`;

-- DropForeignKey
ALTER TABLE `Breakperiod` DROP FOREIGN KEY `Breakperiod_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `Calendar` DROP FOREIGN KEY `Calendar_availabilityId_fkey`;

-- DropForeignKey
ALTER TABLE `Documents` DROP FOREIGN KEY `Documents_securityGuardId_fkey`;

-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_profileId_fkey`;

-- AlterTable
ALTER TABLE `Absences` DROP COLUMN `date`,
    DROP COLUMN `securityGuardId`,
    ADD COLUMN `absenceType` VARCHAR(191) NOT NULL,
    ADD COLUMN `allowedHolidays` INTEGER NOT NULL DEFAULT 28,
    ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `daysOfHolidays` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `endingDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `isPaid` BOOLEAN NOT NULL,
    ADD COLUMN `profileId` INTEGER NULL,
    ADD COLUMN `remainingHolidays` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `startingDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `takenAbsences` INTEGER NOT NULL DEFAULT 0,
    MODIFY `payrollId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Breakperiod` DROP COLUMN `shiftId`;

-- AlterTable
ALTER TABLE `Documents` DROP COLUMN `extension`,
    ADD COLUMN `clientId` INTEGER NULL,
    ADD COLUMN `cloudinary_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `locationId` INTEGER NULL,
    MODIFY `securityGuardId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `Position`,
    MODIFY `organizationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Role` MODIFY `profileId` INTEGER NULL;

-- DropTable
DROP TABLE `ActivePayRunSchedule`;

-- DropTable
DROP TABLE `Calendar`;

-- DropTable
DROP TABLE `ShiftTimeSheet`;

-- CreateTable
CREATE TABLE `UserCredientials` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER NOT NULL,
    `token` VARCHAR(191) NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserCredientials_profileId_key`(`profileId`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `location_id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientName` VARCHAR(191) NULL,
    `locationName` VARCHAR(191) NOT NULL,
    `locationId` INTEGER NOT NULL,
    `streetAddress` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postCode` INTEGER NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `directions` VARCHAR(191) NULL,

    UNIQUE INDEX `Location_locationId_key`(`locationId`),
    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `client_id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `image` VARCHAR(191) NULL DEFAULT '',
    `clientPersonName` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `contactPersonName` VARCHAR(191) NOT NULL,
    `contactPersonEmail` VARCHAR(191) NOT NULL,
    `phoneNumber` INTEGER NULL,
    `jobTitle` VARCHAR(191) NULL,
    `isClientPortalAccess` BOOLEAN NOT NULL DEFAULT false,
    `clientEmail` VARCHAR(191) NOT NULL,
    `clientPhoneNumber` INTEGER NOT NULL,
    `regNo` INTEGER NOT NULL,
    `vatNo` INTEGER NOT NULL,
    `website` VARCHAR(191) NOT NULL,
    `sectors` VARCHAR(191) NOT NULL,
    `addressLine` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postCode` INTEGER NOT NULL,
    `county` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `locationId` INTEGER NULL,

    UNIQUE INDEX `Client_clientId_key`(`clientId`),
    UNIQUE INDEX `Client_locationId_key`(`locationId`),
    PRIMARY KEY (`client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InternalNotes` (
    `note_id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `clientProfile_id` INTEGER NULL,

    PRIMARY KEY (`note_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PayRule` (
    `pay_rule_id` INTEGER NOT NULL AUTO_INCREMENT,
    `Isfixed` BOOLEAN NOT NULL DEFAULT false,
    `Ishourly` BOOLEAN NOT NULL DEFAULT true,
    `payRate` DOUBLE NOT NULL,
    `payCode` INTEGER NOT NULL,
    `conditions` JSON NOT NULL,

    PRIMARY KEY (`pay_rule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplyTo` (
    `applyTo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `payRuleId` INTEGER NOT NULL,
    `positionId` INTEGER NULL,
    `clientId` INTEGER NULL,
    `locationId` INTEGER NULL,
    `eventId` INTEGER NULL,
    `profileId` INTEGER NULL,
    `subConductorId` INTEGER NULL,
    `employmentTypeId` INTEGER NULL,

    PRIMARY KEY (`applyTo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Position` (
    `position_id` INTEGER NOT NULL AUTO_INCREMENT,
    `positionName` VARCHAR(191) NOT NULL,
    `profileId` INTEGER NULL,
    `shiftId` INTEGER NULL,

    PRIMARY KEY (`position_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubConductor` (
    `subConductor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subConductorName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`subConductor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shiftPattern` (
    `pattern_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patternName` VARCHAR(191) NOT NULL DEFAULT '',
    `patternType` VARCHAR(191) NOT NULL,
    `isWeekly` BOOLEAN NULL DEFAULT false,
    `repeatWeekNum` INTEGER NULL DEFAULT 0,
    `isOnAndOff` BOOLEAN NULL DEFAULT false,
    `lengthDays` INTEGER NULL DEFAULT 0,
    `isSpecificMonth` BOOLEAN NULL DEFAULT false,
    `days` INTEGER NULL DEFAULT 0,
    `repeatMonth` INTEGER NULL DEFAULT 0,
    `isLastDayOfMonth` BOOLEAN NULL DEFAULT false,
    `periodStartingDate` VARCHAR(191) NOT NULL,
    `periodEndingDate` VARCHAR(191) NOT NULL,
    `isAppliedOnBankHolidays` BOOLEAN NULL DEFAULT false,
    `isAutoExtend` BOOLEAN NULL DEFAULT false,
    `autoExtendMonth` INTEGER NULL,
    `autoExtendDaysBeforePeriod` INTEGER NULL DEFAULT 7,
    `periodStartingTime` VARCHAR(191) NOT NULL,
    `periodEndingTime` VARCHAR(191) NOT NULL,
    `isCancelled` BOOLEAN NULL DEFAULT false,
    `cancelledId` INTEGER NULL,
    `shiftInstruction` VARCHAR(191) NULL,
    `locationId` INTEGER NOT NULL,

    UNIQUE INDEX `shiftPattern_cancelledId_key`(`cancelledId`),
    UNIQUE INDEX `shiftPattern_locationId_key`(`locationId`),
    PRIMARY KEY (`pattern_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shifts` (
    `shift_id` INTEGER NOT NULL AUTO_INCREMENT,
    `startingTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `locationId` INTEGER NOT NULL,

    UNIQUE INDEX `Shifts_locationId_key`(`locationId`),
    PRIMARY KEY (`shift_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Role_role_type_key` ON `Role`(`role_type`);

-- AddForeignKey
ALTER TABLE `UserCredientials` ADD CONSTRAINT `UserCredientials_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`organization_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`location_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documents` ADD CONSTRAINT `Documents_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`location_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documents` ADD CONSTRAINT `Documents_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documents` ADD CONSTRAINT `Documents_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`client_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalNotes` ADD CONSTRAINT `InternalNotes_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Organization`(`organization_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalNotes` ADD CONSTRAINT `InternalNotes_clientProfile_id_fkey` FOREIGN KEY (`clientProfile_id`) REFERENCES `Profile`(`profile_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`profile_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplyTo` ADD CONSTRAINT `ApplyTo_payRuleId_fkey` FOREIGN KEY (`payRuleId`) REFERENCES `PayRule`(`pay_rule_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplyTo` ADD CONSTRAINT `ApplyTo_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`position_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplyTo` ADD CONSTRAINT `ApplyTo_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`event_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplyTo` ADD CONSTRAINT `ApplyTo_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`location_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplyTo` ADD CONSTRAINT `ApplyTo_subConductorId_fkey` FOREIGN KEY (`subConductorId`) REFERENCES `SubConductor`(`subConductor_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Position` ADD CONSTRAINT `Position_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`profile_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Position` ADD CONSTRAINT `Position_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shifts`(`shift_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Absences` ADD CONSTRAINT `Absences_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`profile_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Absences` ADD CONSTRAINT `Absences_payrollId_fkey` FOREIGN KEY (`payrollId`) REFERENCES `Payroll`(`payroll_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shiftPattern` ADD CONSTRAINT `shiftPattern_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`location_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shifts` ADD CONSTRAINT `Shifts_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`location_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_securityGuardId_fkey`;

-- AlterTable
ALTER TABLE `Profile` MODIFY `securityGuardId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_securityGuardId_fkey` FOREIGN KEY (`securityGuardId`) REFERENCES `Securityguard`(`s_id`) ON DELETE SET NULL ON UPDATE CASCADE;

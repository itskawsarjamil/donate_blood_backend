/*
  Warnings:

  - Changed the type of `dateOfDonation` on the `BloodRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BloodRequest" DROP COLUMN "dateOfDonation",
ADD COLUMN     "dateOfDonation" TIMESTAMP(3) NOT NULL;

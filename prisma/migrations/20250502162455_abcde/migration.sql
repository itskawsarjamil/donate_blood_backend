/*
  Warnings:

  - You are about to alter the column `transportFee` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "transportFee" SET DATA TYPE DECIMAL(65,30);

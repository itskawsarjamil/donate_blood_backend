/*
  Warnings:

  - You are about to alter the column `transportFee` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "transportFee" SET DEFAULT 0,
ALTER COLUMN "transportFee" SET DATA TYPE INTEGER;

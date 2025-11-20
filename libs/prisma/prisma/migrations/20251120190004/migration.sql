/*
  Warnings:

  - You are about to drop the column `scannedBy` on the `Planet` table. All the data in the column will be lost.
  - Added the required column `maxAmount` to the `MinigSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MinigSession" ADD COLUMN     "lastClaimAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maxAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mined" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Planet" DROP COLUMN "scannedBy",
ADD COLUMN     "ownerBy" TEXT;

-- AlterTable
ALTER TABLE "Ship" ADD COLUMN     "locator" DOUBLE PRECISION NOT NULL DEFAULT 3;

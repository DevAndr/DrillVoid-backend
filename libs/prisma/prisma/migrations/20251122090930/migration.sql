/*
  Warnings:

  - Added the required column `miningRate` to the `MinigSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MinigSession" ADD COLUMN     "miningRate" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Ship" ALTER COLUMN "miningPower" SET DEFAULT 100;

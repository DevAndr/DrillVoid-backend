/*
  Warnings:

  - Made the column `finishedAt` on table `MinigSession` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MinigSession" ALTER COLUMN "finishedAt" SET NOT NULL;

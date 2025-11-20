/*
  Warnings:

  - You are about to drop the column `currentStock` on the `Planet` table. All the data in the column will be lost.
  - You are about to drop the column `totalCapacity` on the `Planet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Planet" DROP COLUMN "currentStock",
DROP COLUMN "totalCapacity";

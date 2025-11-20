/*
  Warnings:

  - You are about to drop the column `typeResource` on the `PlanetResource` table. All the data in the column will be lost.
  - Added the required column `type` to the `PlanetResource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlanetResource" DROP COLUMN "typeResource",
ADD COLUMN     "type" "ResourceType" NOT NULL;

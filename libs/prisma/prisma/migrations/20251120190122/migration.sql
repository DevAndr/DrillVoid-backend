/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Planet` table. All the data in the column will be lost.
  - Added the required column `x` to the `Planet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Planet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `z` to the `Planet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planet" DROP COLUMN "coordinates",
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL,
ADD COLUMN     "z" INTEGER NOT NULL;

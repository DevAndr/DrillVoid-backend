/*
  Warnings:

  - You are about to drop the `MinigSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MinigSession";

-- CreateTable
CREATE TABLE "MiningSession" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,
    "planetSeed" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "status" "MiningStatus" NOT NULL DEFAULT 'PENDING',
    "lastClaimAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maxAmount" DOUBLE PRECISION NOT NULL,
    "mined" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedAmount" DOUBLE PRECISION NOT NULL,
    "miningRate" DOUBLE PRECISION NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiningSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MiningSession_uid_key" ON "MiningSession"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "MiningSession_resourceId_key" ON "MiningSession"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "MiningSession_planetId_key" ON "MiningSession"("planetId");

-- CreateIndex
CREATE UNIQUE INDEX "MiningSession_planetSeed_key" ON "MiningSession"("planetSeed");

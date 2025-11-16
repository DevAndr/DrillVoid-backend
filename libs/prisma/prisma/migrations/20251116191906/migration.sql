-- CreateEnum
CREATE TYPE "CurrencyAsset" AS ENUM ('ALFA', 'BETTA', 'OMEGA');

-- DropForeignKey
ALTER TABLE "Ship" DROP CONSTRAINT "Ship_gameDataShipId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gameDataShipId_fkey";

-- AlterTable
ALTER TABLE "GameData" ALTER COLUMN "uid" SET DATA TYPE TEXT,
ALTER COLUMN "shipId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Ship" ALTER COLUMN "gameDataShipId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "gameDataShipId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" "CurrencyAsset" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameDataShipId" TEXT,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_name_key" ON "Currency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_symbol_key" ON "Currency"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_currencyId_key" ON "Balance"("currencyId");

-- CreateIndex
CREATE INDEX "Balance_uid_idx" ON "Balance"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_uid_currencyId_key" ON "Balance"("uid", "currencyId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameDataShipId_fkey" FOREIGN KEY ("gameDataShipId") REFERENCES "GameData"("shipId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_gameDataShipId_fkey" FOREIGN KEY ("gameDataShipId") REFERENCES "GameData"("shipId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_gameDataShipId_fkey" FOREIGN KEY ("gameDataShipId") REFERENCES "GameData"("shipId") ON DELETE SET NULL ON UPDATE CASCADE;

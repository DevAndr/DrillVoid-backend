-- CreateEnum
CREATE TYPE "TypeShip" AS ENUM ('STARTER', 'CARGO', 'BIG_CARGO');

-- CreateEnum
CREATE TYPE "ShipComponentType" AS ENUM ('SCANER', 'DRILL', 'ENGINE', 'WAREHOUSE');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "PlanetType" AS ENUM ('ROCKY', 'LUSH', 'FROZEN', 'TOXIC', 'EXOTIC', 'BLACKHOLE');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('COPPER', 'CARBON', 'SILICON', 'ALUMINUM', 'TITANIUM', 'NICKEL', 'COBALT', 'URANIUM', 'ALPHACREDITS', 'GOLD', 'PLATINUM', 'IRIDIUM', 'EXOTICMATTER', 'GAMMARSHARDS', 'MAGNESIUM', 'CALCIUM', 'OBSIDIAN', 'COAL', 'MANGANESE', 'CHROMIUM', 'ZINC', 'TUNGSTEN', 'MOLYBDENUM', 'RHODIUM', 'PALLADIUM', 'OSMIUM', 'RUTHENIUM', 'HELIUM3', 'TRITIUM', 'DEUTERIUM', 'LITHIUM', 'BORON', 'PHOSPHORUS', 'SULFUR', 'WATERICE', 'AMMONIA', 'METHANE', 'BETATOKENS', 'NAQUADA', 'UNOBTANIUM', 'KYRIPTONITE', 'DILITHIUM', 'TRILLIUM', 'VERYNIUM', 'ADRA', 'STRYDIUM', 'NEUTRONIUM', 'QUANTUMORE');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('ALFA', 'BETTA', 'OMEGA');

-- CreateEnum
CREATE TYPE "CurrencyAsset" AS ENUM ('ALFA', 'BETTA', 'OMEGA');

-- CreateEnum
CREATE TYPE "MiningStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "telegramId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "urlPhoto" TEXT,
    "hashPassword" TEXT NOT NULL,
    "hashRefreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "type" "TypeShip" NOT NULL,
    "warpRange" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "warpSpeed" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "miningPower" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "cargoSize" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameDataShipId" TEXT,
    "warehouseId" TEXT,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id","uid")
);

-- CreateTable
CREATE TABLE "ShipComponent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ShipComponentType" NOT NULL,
    "description" TEXT NOT NULL,
    "upgradeCost" JSONB NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shipId" TEXT,
    "uid" TEXT,

    CONSTRAINT "ShipComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameData" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "z" DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "type" "ShipComponentType" NOT NULL DEFAULT 'WAREHOUSE',
    "shipId" TEXT NOT NULL,
    "foodQuantity" INTEGER NOT NULL DEFAULT 0,
    "coalQuantity" INTEGER NOT NULL DEFAULT 0,
    "waterQuantity" INTEGER NOT NULL DEFAULT 0,
    "herbsQuantity" INTEGER NOT NULL DEFAULT 0,
    "paperQuantity" INTEGER NOT NULL DEFAULT 0,
    "upgradeCost" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planet" (
    "id" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PlanetType" NOT NULL,
    "totalCapacity" JSONB NOT NULL,
    "currentStock" JSONB NOT NULL,
    "scannedBy" TEXT,
    "coordinates" JSONB NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "depleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "resource" "ResourceType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanetResource" (
    "id" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,
    "typeResource" "ResourceType" NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL,
    "drillPowerRequired" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanetResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanetVisit" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,
    "mined" JSONB NOT NULL,
    "exhausted" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameDataUid" TEXT,

    CONSTRAINT "PlanetVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cycle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "CurrencyType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cycle_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "MinigSession" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,
    "planetSeed" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "status" "MiningStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedAmount" DOUBLE PRECISION NOT NULL,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "MinigSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_uid_telegramId_idx" ON "User"("uid", "telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_uid_key" ON "User"("telegramId", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "Ship_id_uid_key" ON "Ship"("id", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "Ship_uid_key" ON "Ship"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "GameData_uid_key" ON "GameData"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "GameData_shipId_key" ON "GameData"("shipId");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_uid_key" ON "Warehouse"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_shipId_key" ON "Warehouse"("shipId");

-- CreateIndex
CREATE UNIQUE INDEX "Planet_seed_key" ON "Planet"("seed");

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

-- CreateIndex
CREATE UNIQUE INDEX "MinigSession_uid_key" ON "MinigSession"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "MinigSession_resourceId_key" ON "MinigSession"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "MinigSession_planetId_key" ON "MinigSession"("planetId");

-- CreateIndex
CREATE UNIQUE INDEX "MinigSession_planetSeed_key" ON "MinigSession"("planetSeed");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_uid_fkey" FOREIGN KEY ("uid") REFERENCES "GameData"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_gameDataShipId_fkey" FOREIGN KEY ("gameDataShipId") REFERENCES "GameData"("shipId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipComponent" ADD CONSTRAINT "ShipComponent_shipId_uid_fkey" FOREIGN KEY ("shipId", "uid") REFERENCES "Ship"("id", "uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_uid_fkey" FOREIGN KEY ("uid") REFERENCES "GameData"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanetResource" ADD CONSTRAINT "PlanetResource_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanetVisit" ADD CONSTRAINT "PlanetVisit_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanetVisit" ADD CONSTRAINT "PlanetVisit_gameDataUid_fkey" FOREIGN KEY ("gameDataUid") REFERENCES "GameData"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_gameDataShipId_fkey" FOREIGN KEY ("gameDataShipId") REFERENCES "GameData"("shipId") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "TypeShip" AS ENUM ('STARTER', 'CARGO', 'BIG_CARGO');

-- CreateEnum
CREATE TYPE "ShipComponentType" AS ENUM ('SCANER', 'DRILL', 'ENGINE', 'WAREHOUSE');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHICAL');

-- CreateEnum
CREATE TYPE "PlanetType" AS ENUM ('ROCKY', 'LUSH', 'FROZEN', 'TOXIC', 'EXOTIC', 'BLACKHOLE');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('COPPER', 'CARBON', 'SILICON', 'ALUMINUM', 'TITANIUM', 'NICKEL', 'COBALT', 'URANIUM', 'ALPHACREDITS', 'GOLD', 'PLATINUM', 'IRIDIUM', 'EXOTICMATTER', 'GAMMARSHARDS', 'MAGNESIUM', 'CALCIUM', 'OBSIDIAN', 'COAL', 'MANGANESE', 'CHROMIUM', 'ZINC', 'TUNGSTEN', 'MOLYBDENUM', 'RHODIUM', 'PALLADIUM', 'OSMIUM', 'RUTHENIUM', 'HELIUM3', 'TRITIUM', 'DEUTERIUM', 'LITHIUM', 'BORON', 'PHOSPHORUS', 'SULFUR', 'WATERICE', 'AMMONIA', 'METHANE', 'BETATOKENS', 'NAQUADA', 'UNOBTANIUM', 'KYRIPTONITE', 'DILITHIUM', 'TRILLIUM', 'VERYNIUM', 'ADRA', 'STRYDIUM', 'NEUTRONIUM', 'QUANTUMORE');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('ALFA', 'BETTA', 'OMEGA');

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
    "gameDataShipId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "type" "TypeShip" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameDataShipId" INTEGER,
    "warehouseId" TEXT,

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

    CONSTRAINT "ShipComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameData" (
    "id" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "shipId" INTEGER NOT NULL
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
    "sector" INTEGER NOT NULL DEFAULT 1,
    "totalCapacity" JSONB NOT NULL,
    "currentStock" JSONB NOT NULL,
    "scannedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanetResource" (
    "id" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,
    "typeResource" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Ship_id_uid_key" ON "Ship"("id", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "Ship_uid_key" ON "Ship"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "GameData_shipId_key" ON "GameData"("shipId");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_uid_key" ON "Warehouse"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_shipId_key" ON "Warehouse"("shipId");

-- CreateIndex
CREATE UNIQUE INDEX "Planet_seed_key" ON "Planet"("seed");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameDataShipId_fkey" FOREIGN KEY ("gameDataShipId") REFERENCES "GameData"("shipId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_gameDataShipId_fkey" FOREIGN KEY ("gameDataShipId") REFERENCES "GameData"("shipId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanetResource" ADD CONSTRAINT "PlanetResource_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanetVisit" ADD CONSTRAINT "PlanetVisit_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanetVisit" ADD CONSTRAINT "PlanetVisit_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

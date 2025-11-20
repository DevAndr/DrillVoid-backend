-- DropForeignKey
ALTER TABLE "Ship" DROP CONSTRAINT "Ship_uid_fkey";

-- AlterTable
ALTER TABLE "Ship" ADD COLUMN     "gameDataId" TEXT,
ALTER COLUMN "uid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_gameDataId_uid_fkey" FOREIGN KEY ("gameDataId", "uid") REFERENCES "GameData"("id", "uid") ON DELETE SET NULL ON UPDATE CASCADE;

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import {
  CurrencyAsset,
  TypeShip,
} from '../../../libs/prisma/generated/prisma/enums';

@Injectable()
export class MsGameDataService {
  private readonly logger = new Logger(MsGameDataService.name);

  constructor(private readonly prisma: PrismaService) {}

  initial(uid: string) {
    console.log({ uid });
    return this.prisma.$transaction(async (tx) => {
      const ship = await tx.ship.create({
        data: {
          uid,
          level: 1,
          type: TypeShip.STARTER,
          isSelected: true,
        },
      });

      const gameData = await tx.gameData.create({
        data: {
          x: 0,
          y: 0,
          z: 0,
          uid,
          shipId: ship.id,
        },
      });

      await tx.ship.update({
        data: { gameDataId: gameData.id },
        where: { id: ship.id },
      });

      // создание баланса валют
      const currencies = await tx.currency.findMany();

      for (const currency of currencies) {
        if (currency.symbol === CurrencyAsset.ALFA) {
          await tx.balance.create({
            data: {
              amount: 5000,
              currencyId: currency.id,
              uid,
              gameDataId: gameData.id,
            },
          });
        }

        if (currency.symbol === CurrencyAsset.BETTA) {
          await tx.balance.create({
            data: {
              amount: 3000,
              currencyId: currency.id,
              uid,
              gameDataId: gameData.id,
            },
          });
        }

        if (currency.symbol === CurrencyAsset.OMEGA) {
          await tx.balance.create({
            data: {
              amount: 1000,
              currencyId: currency.id,
              uid,
              gameDataId: gameData.id,
            },
          });
        }
      }
    });
  }

  getGameData(uid: string) {
    return this.prisma.gameData.findUnique({
      where: { uid },
      include: {
        planetVisits: true,
        balances: true,
        ships: true,
        inventoryItems: true,
      },
    });
  }
}

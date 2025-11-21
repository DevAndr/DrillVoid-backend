import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { StartMiningData } from '@app/contracts';
import { isDefined } from '@app/core/utils';
import { RpcException } from '@nestjs/microservices';
import { Rarity } from 'libs/prisma/generated/prisma/enums';
import moment from 'moment';

const rarityMultiplier: Record<Rarity, number> = {
  COMMON: 1,
  UNCOMMON: 1.5,
  RARE: 2.2,
  EPIC: 3.5,
  LEGENDARY: 5,
};

@Injectable()
export class MsShipService {
  constructor(private readonly prisma: PrismaService) {}

  async startMining(data: StartMiningData) {
    const planet = await this.prisma.planet.findUnique({
      where: { id: data.planetId },
      include: { planetResource: true },
    });

    if (!isDefined(planet)) {
      throw new RpcException(new NotFoundException('Planet not found'));
    }

    const resource = planet.planetResource.find(
      (res) => res.id === data.resourceId,
    );

    if (!isDefined(resource))
      throw new RpcException(
        new NotFoundException('Такого ресурса нет на планете'),
      );

    if (resource.current <= 0)
      throw new RpcException(new NotFoundException('Ресурс закончился'));

    const gameData = await this.prisma.gameData.findUnique({
      where: { uid: data.uid },
      include: { ship: true },
    });

    if (!isDefined(gameData))
      throw new RpcException(
        new NotFoundException('Не найдены игровые данные'),
      );

    const ship = gameData.ship.find((ship) => ship.id === gameData.shipId);

    if (!isDefined(ship))
      throw new RpcException(
        new NotFoundException('Не найден текущий корабль'),
      );

    // Рассчитываем добычу, но НЕ списываем ресурсы сейчас
    const miningSpeed = ship.miningPower;
    // const estimated = Math.min(resource.totalAmount, miningSpeed * 100);
    // const baseTime = estimated / miningSpeed;
    // const durationSeconds = baseTime * rarityMultiplier[resource.rarity];

    const miningRate = miningSpeed * rarityMultiplier[resource.rarity];
    const maxByRemaining = resource.current;
    const amountToMine = Math.min(maxByRemaining, maxByRemaining);
    const timeMinutes = amountToMine / miningRate;
    const timeMs = timeMinutes * 60 * 1000;

    // const session = this.prisma.minigSession.create({
    //   data: {
    //     uid: data.uid,
    //     resourceId: data.resourceId,
    //     planetId: data.planetId,
    //     planetSeed: planet.seed,
    //     startedAt: new Date(),
    //     status: 'IN_PROGRESS',
    //     maxAmount: resource.totalAmount,
    //     mined: 0,
    //     estimatedAmount: amountToMine,
    //     finishedAt: new Date(Date.now() + timeMs),
    //   },
    // });

    // return session;

    return {
      miningRate,
      amountToMine,
      timeMinutes,
      timeMs,
    };
  }

  claimMining() {}

  stopMining() {}
}

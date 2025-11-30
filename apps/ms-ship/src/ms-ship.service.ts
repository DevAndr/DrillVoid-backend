import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { RARITY_MINING_MULTIPLIER, StartMiningData } from '@app/contracts';
import { isDefined } from '@app/core/utils';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MsShipService {
  constructor(private readonly prisma: PrismaService) {}

  async startMining(data: StartMiningData) {
    const sessionFound = await this.prisma.miningSession.findUnique({
      where: { uid: data.uid },
    });

    if (isDefined(sessionFound)) {
      if (sessionFound.status === 'IN_PROGRESS')
        throw new RpcException(new BadRequestException('Майнинг уже запущен'));
    }

    const planet = await this.prisma.planet.findUnique({
      where: { id: data.planetId },
      include: { resources: true },
    });

    if (!isDefined(planet)) {
      throw new RpcException(new NotFoundException('Planet not found'));
    }

    const resource = planet.resources.find((res) => res.id === data.resourceId);

    if (!isDefined(resource))
      throw new RpcException(
        new NotFoundException('Такого ресурса нет на планете'),
      );

    if (resource.current <= 0)
      throw new RpcException(new NotFoundException('Ресурс закончился'));

    const gameData = await this.prisma.gameData.findUnique({
      where: { uid: data.uid },
      include: { ships: true },
    });

    if (!isDefined(gameData))
      throw new RpcException(
        new NotFoundException('Не найдены игровые данные'),
      );

    const ship = gameData.ships.find((ship) => ship.id === gameData.shipId);

    if (!isDefined(ship))
      throw new RpcException(
        new NotFoundException('Не найден текущий корабль'),
      );

    // Рассчитываем добычу, но НЕ списываем ресурсы сейчас
    const miningSpeed = ship.miningPower;
    const miningRate = miningSpeed * RARITY_MINING_MULTIPLIER[resource.rarity]; // единицы ресурса в мин
    const maxByRemaining = resource.current;
    const amountToMine = Math.min(maxByRemaining, maxByRemaining);
    const timeMinutes = Math.ceil(amountToMine / miningRate);
    const timeMs = timeMinutes * 60 * 1000;

    const session = await this.prisma.miningSession.upsert({
      where: { uid: data.uid },
      create: {
        uid: data.uid,
        resourceId: data.resourceId,
        planetId: data.planetId,
        planetSeed: planet.seed,
        startedAt: new Date(),
        status: 'IN_PROGRESS',
        maxAmount: resource.totalAmount,
        mined: 0,
        estimatedAmount: amountToMine,
        miningRate,
        finishedAt: new Date(Date.now() + timeMs),
      },
      update: {
        resourceId: data.resourceId,
        planetId: data.planetId,
        planetSeed: planet.seed,
        startedAt: new Date(),
        status: 'IN_PROGRESS',
        maxAmount: resource.totalAmount,
        mined: 0,
        estimatedAmount: amountToMine,
        miningRate,
        finishedAt: new Date(Date.now() + timeMs),
      },
    });

    return {
      miningRate,
      amountToMine,
      timeMinutes,
      timeMs,
      session,
    };
  }

  async claimMining(uid: string) {
    const session = await this.prisma.miningSession.findUnique({
      where: { uid },
    });

    if (!isDefined(session))
      throw new RpcException(new NotFoundException('Session not found'));

    if (session.status !== 'IN_PROGRESS' && session.status !== 'FINISHED')
      throw new BadRequestException('Cannot collect');

    const resource = await this.prisma.planetResource.findUnique({
      where: {
        id: session.resourceId,
      },
    });

    if (!isDefined(resource))
      throw new RpcException(
        new NotFoundException('Planet resource not found'),
      );

    const now = Date.now();
    const finishTime = session.finishedAt.getTime();

    const completedFraction = Math.min(
      1,
      (now - session.startedAt.getTime()) /
        (finishTime - session.startedAt.getTime()),
    );

    const mined = Math.floor(session.estimatedAmount * completedFraction);

    console.log({ mined, completedFraction });

    await this.prisma.$transaction(async (tx) => {
      await tx.miningSession.update({
        where: { id: session.id },
        data: {
          mined,
          status: 'FINISHED',
        },
      });

      await tx.inventoryItem.upsert({
        where: { uid, resource: resource.type },
        create: {
          uid,
          resource: resource.type,
          amount: mined,
        },
        update: {
          amount: { increment: mined },
        },
      });

      await tx.planetResource.update({
        where: {
          id: session.resourceId,
        },
        data: { current: { decrement: mined } },
      });
    });

    return { claim: mined };
  }

  async getCurrentProcessMining(uid: string) {
    const session = await this.prisma.miningSession.findFirst({
      where: {
        uid,
        status: 'IN_PROGRESS',
      },
    });

    if (!isDefined(session))
      throw new RpcException(new NotFoundException('Session not found'));

    const now = Date.now();
    const start = session.startedAt.getTime();
    const finish = session.finishedAt.getTime();

    const totalDuration = finish - start;
    const elapsed = now - start;
    const remaining = Math.max(0, finish - now);

    const progress = Math.min(1, elapsed / totalDuration);

    const mined = Math.floor(session.estimatedAmount * progress);

    return {
      ...session,
      mined,
      remainingToMine: session.estimatedAmount - mined,
      elapsedMs: elapsed,
      remainingMs: remaining,
      totalMs: totalDuration,
      progressPercent: +(progress * 100).toFixed(2),
      status: remaining === 0 ? 'FINISHED' : 'IN_PROGRESS',
    };
  }

  async stopMining(uid: string) {
    const session = await this.prisma.miningSession.findFirst({
      where: {
        uid,
        status: 'IN_PROGRESS',
      },
    });

    if (!isDefined(session))
      throw new RpcException(new NotFoundException('Session not found'));

    const resource = await this.prisma.planetResource.findUnique({
      where: {
        id: session.resourceId,
      },
    });

    if (!isDefined(resource))
      throw new RpcException(
        new NotFoundException('Planet resource not found'),
      );

    const now = Date.now();
    const start = session.startedAt.getTime();
    const finish = session.finishedAt.getTime();

    const totalDuration = finish - start;
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / totalDuration);
    const mined = Math.floor(session.estimatedAmount * progress);

    await this.prisma.$transaction(async (tx) => {
      await tx.miningSession.update({
        where: { id: session.id },
        data: {
          mined,
          status: 'FINISHED',
        },
      });

      await tx.inventoryItem.upsert({
        where: { uid, resource: resource.type },
        create: {
          uid,
          resource: resource.type,
          amount: mined,
        },
        update: {
          amount: { increment: mined },
        },
      });

      await tx.planetResource.update({
        where: {
          id: session.resourceId,
        },
        data: { current: { decrement: mined } },
      });
    });

    return { claim: mined };
  }

  async getCurrentShip(uid: string) {
    const gameData = await this.prisma.gameData.findUnique({ where: { uid } });

    if (!isDefined(gameData))
      throw new RpcException(new NotFoundException('Game data not found'));

    return this.prisma.ship.findUnique({
      where: {
        id: gameData.shipId,
      },
    });
  }
}

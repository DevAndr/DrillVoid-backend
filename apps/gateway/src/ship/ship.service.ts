import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MS_SHIP_NAME,
  MS_SHIP_PATTERNS,
  StartMiningData,
} from '@app/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShipService {
  constructor(@Inject(MS_SHIP_NAME) private readonly shipClient: ClientProxy) {}

  miningStart(data: StartMiningData) {
    return firstValueFrom(
      this.shipClient.send(MS_SHIP_PATTERNS.MINING_START, data),
    );
  }

  miningFinish(uid: string) {
    return firstValueFrom(
      this.shipClient.send(MS_SHIP_PATTERNS.MINING_FINISH, uid),
    );
  }

  miningClaim(uid: string) {
    return firstValueFrom(
      this.shipClient.send(MS_SHIP_PATTERNS.MINING_CLAIM, uid),
    );
  }

  miningProgress(uid: string) {
    return firstValueFrom(
      this.shipClient.send(MS_SHIP_PATTERNS.MINING_PROGRESS, uid),
    );
  }

  getCurrentShip(uid: string) {
    return firstValueFrom(
      this.shipClient.send(MS_SHIP_PATTERNS.CURRENT_SHIP, uid),
    );
  }
}

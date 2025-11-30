import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MS_GAME_DATA_NAME, MS_GAME_DATA_PATTERNS } from '@app/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GameDataService {
  constructor(
    @Inject(MS_GAME_DATA_NAME) private readonly gameDataClient: ClientProxy,
  ) {}

  getGameData(uid: string) {
    return firstValueFrom(
      this.gameDataClient.send(MS_GAME_DATA_PATTERNS.GET_GAME_DATA, uid),
    );
  }

  getResources(uid: string) {
    return firstValueFrom(
      this.gameDataClient.send(MS_GAME_DATA_PATTERNS.GET_RESOURCES, uid),
    );
  }
}

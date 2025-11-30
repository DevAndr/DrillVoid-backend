import { Controller } from '@nestjs/common';
import { MsShipService } from './ms-ship.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MS_SHIP_PATTERNS } from '@app/contracts/ship/constsnts';
import { StartMiningData } from '@app/contracts';

@Controller()
export class MsShipController {
  constructor(private readonly msShipService: MsShipService) {}

  @EventPattern(MS_SHIP_PATTERNS.MINING_START)
  handleStartMining(@Payload() data: StartMiningData) {
    return this.msShipService.startMining(data);
  }

  @EventPattern(MS_SHIP_PATTERNS.MINING_FINISH)
  handleEndMining(@Payload() uid: string) {
    return this.msShipService.stopMining(uid);
  }

  @EventPattern(MS_SHIP_PATTERNS.MINING_CLAIM)
  handleClaimMining(@Payload() uid: string) {
    return this.msShipService.claimMining(uid);
  }

  @EventPattern(MS_SHIP_PATTERNS.MINING_PROGRESS)
  handleProgressMining(@Payload() uid: string) {
    return this.msShipService.getCurrentProcessMining(uid);
  }

  @EventPattern(MS_SHIP_PATTERNS.CURRENT_SHIP)
  handleCurrentShip(@Payload() uid: string) {
    return this.msShipService.getCurrentShip(uid);
  }
}

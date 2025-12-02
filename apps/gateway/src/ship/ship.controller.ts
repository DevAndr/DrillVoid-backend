import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShipService } from './ship.service';
import { StartMiningData } from '@app/contracts';
import { GetCurrentUserId } from '../decorators';

@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post('start_mining')
  handleStartMining(
    @Body() data: StartMiningData,
    @GetCurrentUserId() uid: string,
  ) {
    return this.shipService.miningStart({ ...data, uid });
  }

  @Post('finish_mining')
  handleFinishMining(@Body() uid: string) {
    return this.shipService.miningFinish(uid);
  }

  @Post('claim_mining')
  handleClaimMining(@GetCurrentUserId() uid: string) {
    return this.shipService.miningClaim(uid);
  }

  @Get('progress')
  handleProgressMining(@GetCurrentUserId() uid: string) {
    return this.shipService.miningProgress(uid);
  }

  @Get('current_ship')
  handleCurrentShip(@GetCurrentUserId() uid: string) {
    return this.shipService.getCurrentShip(uid);
  }
}

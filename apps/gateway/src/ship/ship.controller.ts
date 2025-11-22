import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShipService } from './ship.service';
import { StartMiningData } from '@app/contracts';

@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post('start_mining')
  handleStartMining(@Body() data: StartMiningData) {
    return this.shipService.miningStart(data);
  }

  @Post('finish_mining')
  handleFinishMining(@Body() uid: string) {
    return this.shipService.miningFinish(uid);
  }

  @Post('claim_mining')
  handleClaimMining(@Body() uid: string) {
    return this.shipService.miningClaim(uid);
  }

  @Get('progress/:uid')
  handleProgressMining(@Param('uid') uid: string) {
    return this.shipService.miningProgress(uid);
  }
}

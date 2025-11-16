import { Test, TestingModule } from '@nestjs/testing';
import { MsShipController } from './ms-ship.controller';
import { MsShipService } from './ms-ship.service';

describe('MsShipController', () => {
  let msShipController: MsShipController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsShipController],
      providers: [MsShipService],
    }).compile();

    msShipController = app.get<MsShipController>(MsShipController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msShipController.getHello()).toBe('Hello World!');
    });
  });
});

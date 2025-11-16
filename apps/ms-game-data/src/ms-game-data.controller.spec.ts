import { Test, TestingModule } from '@nestjs/testing';
import { MsGameDataController } from './ms-game-data.controller';
import { MsGameDataService } from './ms-game-data.service';

describe('MsGameDataController', () => {
  let msGameDataController: MsGameDataController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsGameDataController],
      providers: [MsGameDataService],
    }).compile();

    msGameDataController = app.get<MsGameDataController>(MsGameDataController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msGameDataController.getHello()).toBe('Hello World!');
    });
  });
});

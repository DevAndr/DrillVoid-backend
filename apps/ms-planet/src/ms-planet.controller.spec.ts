import { Test, TestingModule } from '@nestjs/testing';
import { MsPlanetController } from './ms-planet.controller';
import { MsPlanetService } from './ms-planet.service';

describe('MsPlanetController', () => {
  let msPlanetController: MsPlanetController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsPlanetController],
      providers: [MsPlanetService],
    }).compile();

    msPlanetController = app.get<MsPlanetController>(MsPlanetController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msPlanetController.getHello()).toBe('Hello World!');
    });
  });
});

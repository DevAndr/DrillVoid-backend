import { Test, TestingModule } from '@nestjs/testing';
import { GameDataController } from './game-data.controller';

describe('GameDataController', () => {
  let controller: GameDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameDataController],
    }).compile();

    controller = module.get<GameDataController>(GameDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

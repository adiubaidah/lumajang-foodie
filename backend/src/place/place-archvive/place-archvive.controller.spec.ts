import { Test, TestingModule } from '@nestjs/testing';
import { PlaceArchviveController } from './place-archvive.controller';

describe('PlaceArchviveController', () => {
  let controller: PlaceArchviveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceArchviveController],
    }).compile();

    controller = module.get<PlaceArchviveController>(PlaceArchviveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

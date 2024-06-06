import { Test, TestingModule } from '@nestjs/testing';
import { PlaceArchiveController } from './place-archive.controller';

describe('PlaceArchviveController', () => {
  let controller: PlaceArchiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceArchiveController],
    }).compile();

    controller = module.get<PlaceArchiveController>(PlaceArchiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PlacePreferenceController } from './place-preference.controller';

describe('PlacePreferenceController', () => {
  let controller: PlacePreferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacePreferenceController],
    }).compile();

    controller = module.get<PlacePreferenceController>(PlacePreferenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

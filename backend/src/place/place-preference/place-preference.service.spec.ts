import { Test, TestingModule } from '@nestjs/testing';
import { PlacePreferenceService } from './place-preference.service';

describe('PlacePreferenceService', () => {
  let service: PlacePreferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacePreferenceService],
    }).compile();

    service = module.get<PlacePreferenceService>(PlacePreferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

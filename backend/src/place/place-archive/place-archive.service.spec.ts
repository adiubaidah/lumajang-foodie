import { Test, TestingModule } from '@nestjs/testing';
import { PlaceArchviveService } from './place-archive.service';

describe('PlaceArchviveService', () => {
  let service: PlaceArchviveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceArchviveService],
    }).compile();

    service = module.get<PlaceArchviveService>(PlaceArchviveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

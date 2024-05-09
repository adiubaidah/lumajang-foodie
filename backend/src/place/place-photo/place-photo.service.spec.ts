import { Test, TestingModule } from '@nestjs/testing';
import { PlacePhotoService } from './place-photo.service';

describe('PlacePhotoService', () => {
  let service: PlacePhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlacePhotoService],
    }).compile();

    service = module.get<PlacePhotoService>(PlacePhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

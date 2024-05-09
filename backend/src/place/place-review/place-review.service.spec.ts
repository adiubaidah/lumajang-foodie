import { Test, TestingModule } from '@nestjs/testing';
import { PlaceReviewService } from './place-review.service';

describe('PlaceReviewService', () => {
  let service: PlaceReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceReviewService],
    }).compile();

    service = module.get<PlaceReviewService>(PlaceReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

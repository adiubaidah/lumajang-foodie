import { Test, TestingModule } from '@nestjs/testing';
import { MenuReviewService } from './menu-review.service';

describe('MenuReviewService', () => {
  let service: MenuReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuReviewService],
    }).compile();

    service = module.get<MenuReviewService>(MenuReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

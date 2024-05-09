import { Test, TestingModule } from '@nestjs/testing';
import { PlaceReviewController } from './place-review.controller';

describe('PlaceReviewController', () => {
  let controller: PlaceReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceReviewController],
    }).compile();

    controller = module.get<PlaceReviewController>(PlaceReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

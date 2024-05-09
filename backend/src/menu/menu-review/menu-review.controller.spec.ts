import { Test, TestingModule } from '@nestjs/testing';
import { MenuReviewController } from './menu-review.controller';

describe('MenuReviewController', () => {
  let controller: MenuReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuReviewController],
    }).compile();

    controller = module.get<MenuReviewController>(MenuReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

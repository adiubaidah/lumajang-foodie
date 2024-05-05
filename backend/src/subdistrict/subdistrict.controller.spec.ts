import { Test, TestingModule } from '@nestjs/testing';
import { SubdistrictController } from './subdistrict.controller';

describe('SubdistrictController', () => {
  let controller: SubdistrictController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubdistrictController],
    }).compile();

    controller = module.get<SubdistrictController>(SubdistrictController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

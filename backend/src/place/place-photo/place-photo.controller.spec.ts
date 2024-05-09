import { Test, TestingModule } from '@nestjs/testing';
import { PlacePhotoController } from './place-photo.controller';

describe('PlacePhotoController', () => {
  let controller: PlacePhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacePhotoController],
    }).compile();

    controller = module.get<PlacePhotoController>(PlacePhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

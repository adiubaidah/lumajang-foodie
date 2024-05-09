import { Test, TestingModule } from '@nestjs/testing';
import { MenuPhotoController } from './menu-photo.controller';

describe('MenuPhotoController', () => {
  let controller: MenuPhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuPhotoController],
    }).compile();

    controller = module.get<MenuPhotoController>(MenuPhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

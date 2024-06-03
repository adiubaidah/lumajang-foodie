import { Test, TestingModule } from '@nestjs/testing';
import { MenuArchiveController } from './menu-archive.controller';

describe('MenuArchiveController', () => {
  let controller: MenuArchiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuArchiveController],
    }).compile();

    controller = module.get<MenuArchiveController>(MenuArchiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

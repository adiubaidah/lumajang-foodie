import { Test, TestingModule } from '@nestjs/testing';
import { MenuPhotoService } from './menu-photo.service';

describe('MenuPhotoService', () => {
  let service: MenuPhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuPhotoService],
    }).compile();

    service = module.get<MenuPhotoService>(MenuPhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

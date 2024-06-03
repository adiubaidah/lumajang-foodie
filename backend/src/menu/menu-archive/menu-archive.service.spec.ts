import { Test, TestingModule } from '@nestjs/testing';
import { MenuArchiveService } from './menu-archive.service';

describe('MenuArchiveService', () => {
  let service: MenuArchiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuArchiveService],
    }).compile();

    service = module.get<MenuArchiveService>(MenuArchiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

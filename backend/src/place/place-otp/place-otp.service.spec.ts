import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOtpService } from './place-otp.service';

describe('PlaceOtpService', () => {
  let service: PlaceOtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceOtpService],
    }).compile();

    service = module.get<PlaceOtpService>(PlaceOtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

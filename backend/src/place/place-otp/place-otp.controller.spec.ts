import { Test, TestingModule } from '@nestjs/testing';
import { PlaceOtpController } from './place-otp.controller';

describe('PlaceOtpController', () => {
  let controller: PlaceOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceOtpController],
    }).compile();

    controller = module.get<PlaceOtpController>(PlaceOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

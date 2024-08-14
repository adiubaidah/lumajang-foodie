import { Module } from '@nestjs/common';
import { PlaceOtpService } from './place-otp.service';
import { PlaceOtpController } from './place-otp.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PlaceOtpService, PrismaService, JwtService],
  controllers: [PlaceOtpController],
})
export class PlaceOtpModule {}

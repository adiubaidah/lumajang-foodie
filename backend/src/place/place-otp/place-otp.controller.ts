import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request as RequestExpress } from 'express';
import { Role as RoleEnum } from '@prisma/client';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';
import { PlaceOtpService } from './place-otp.service';

@Controller('place-otp')
export class PlaceOtpController {
  constructor(private placeOtpService: PlaceOtpService) {}

  @Role([RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async sendOtp(@Body('place') place: string, @Req() req: RequestExpress) {
    const userId = req['user'].id;
    const canRequestOtp = await this.placeOtpService.canRequestOtp({
      userId,
      placeId: place,
    });

    if (!canRequestOtp) {
      throw new HttpException(
        {
          status: HttpStatus.TOO_MANY_REQUESTS,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlaceOtpService {
  constructor(private prismaService: PrismaService) {}

  async createOtp({
    otp,
    userId,
    placeId,
  }: {
    otp: string;
    userId: string;
    placeId: string;
  }) {
    return this.prismaService.placeOtp.create({
      data: {
        otp,
        user: {
          connect: {
            id: userId,
          },
        },
        place: {
          connect: {
            id: placeId,
          },
        },
      },
    });
  }

  async canRequestOtp({
    userId,
    placeId,
  }: {
    userId: string;
    placeId: string;
  }) {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const otpCount = await this.prismaService.placeOtp.count({
      where: {
        user: {
          id: userId,
        },
        place: {
          id: placeId,
        },
        createdAt: {
          gte: fourHoursAgo,
        },
      },
    });

    return otpCount < 3;
  }
}

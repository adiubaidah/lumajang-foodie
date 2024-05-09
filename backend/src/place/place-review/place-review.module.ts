import { Module } from '@nestjs/common';
import { PlaceReviewService } from './place-review.service';
import { PlaceReviewController } from './place-review.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PlaceReviewService, PrismaService, JwtService],
  controllers: [PlaceReviewController],
})
export class PlaceReviewModule {}

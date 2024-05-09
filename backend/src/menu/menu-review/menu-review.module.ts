import { Module } from '@nestjs/common';
import { MenuReviewService } from './menu-review.service';
import { MenuReviewController } from './menu-review.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [MenuReviewService, PrismaService, JwtService],
  controllers: [MenuReviewController],
})
export class MenuReviewModule {}

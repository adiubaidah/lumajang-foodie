import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuPhotoModule } from './menu-photo/menu-photo.module';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MenuReviewModule } from './menu-review/menu-review.module';

@Module({
  controllers: [MenuController],
  providers: [MenuService, PrismaService, JwtService],
  imports: [MenuPhotoModule, MenuReviewModule],
})
export class MenuModule {}

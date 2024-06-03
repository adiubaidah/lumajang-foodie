import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MenuReviewModule } from './menu-review/menu-review.module';
import { MenuArchiveModule } from './menu-archive/menu-archive.module';

@Module({
  controllers: [MenuController],
  providers: [MenuService, PrismaService, JwtService],
  imports: [MenuReviewModule, MenuArchiveModule],
})
export class MenuModule {}

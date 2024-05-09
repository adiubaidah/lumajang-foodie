import { Module } from '@nestjs/common';
import { MenuPhotoService } from './menu-photo.service';
import { MenuPhotoController } from './menu-photo.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [MenuPhotoService, PrismaService, JwtService],
  controllers: [MenuPhotoController],
})
export class MenuPhotoModule {}

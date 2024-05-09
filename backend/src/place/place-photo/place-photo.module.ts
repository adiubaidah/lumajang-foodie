import { Module } from '@nestjs/common';
import { PlacePhotoService } from './place-photo.service';
import { PlacePhotoController } from './place-photo.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PlacePhotoService, PrismaService, JwtService],
  controllers: [PlacePhotoController],
})
export class PlacePhotoModule {}

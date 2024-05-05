import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PlaceService, PrismaService, JwtService],
  controllers: [PlaceController],
})
export class PlaceModule {}

import { Module } from '@nestjs/common';
import { PlaceArchviveController } from './place-archvive.controller';
import { PlaceArchviveService } from './place-archvive.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PlaceArchviveController],
  providers: [PlaceArchviveService, PrismaService, JwtService],
})
export class PlaceArchviveModule {}

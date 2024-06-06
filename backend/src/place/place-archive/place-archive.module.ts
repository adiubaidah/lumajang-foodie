import { Module } from '@nestjs/common';
import { PlaceArchiveController } from './place-archive.controller';
import { PlaceArchiveService } from './place-archive.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PlaceArchiveController],
  providers: [PlaceArchiveService, PrismaService, JwtService],
})
export class PlaceArchiveModule {}

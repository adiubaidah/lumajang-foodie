import { Module } from '@nestjs/common';
import { MenuArchiveController } from './menu-archive.controller';
import { MenuArchiveService } from './menu-archive.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MenuArchiveController],
  providers: [MenuArchiveService, PrismaService, JwtService],
})
export class MenuArchiveModule {}

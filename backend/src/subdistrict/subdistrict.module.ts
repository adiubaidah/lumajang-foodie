import { Module } from '@nestjs/common';
import { SubdistrictController } from './subdistrict.controller';
import { SubdistrictService } from './subdistrict.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SubdistrictController],
  providers: [SubdistrictService, PrismaService],
})
export class SubdistrictModule {}

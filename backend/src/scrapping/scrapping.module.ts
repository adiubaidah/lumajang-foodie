import { Module } from '@nestjs/common';
import { ScrappingService } from './scrapping.service';
import { ScrappingController } from './scrapping.controller';
import { PrismaService } from 'src/prisma.service';
import { SubdistrictService } from 'src/subdistrict/subdistrict.service';

@Module({
  providers: [ScrappingService, PrismaService, SubdistrictService],
  controllers: [ScrappingController],
})
export class ScrappingModule {}

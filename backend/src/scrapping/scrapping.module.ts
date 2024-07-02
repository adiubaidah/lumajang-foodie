import { Module } from '@nestjs/common';
import { ScrappingService } from './scrapping.service';
import { ScrappingController } from './scrapping.controller';
import { PrismaService } from 'src/prisma.service';
import { SubdistrictService } from 'src/subdistrict/subdistrict.service';
import { PlaceService } from 'src/place/place.service';

@Module({
  providers: [
    ScrappingService,
    PrismaService,
    SubdistrictService,
    PlaceService,
  ],
  controllers: [ScrappingController],
})
export class ScrappingModule {}

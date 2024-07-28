import { Module } from '@nestjs/common';
import { PlacePreferenceController } from './place-preference.controller';
import { PlacePreferenceService } from './place-preference.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PlacePreferenceController],
  providers: [PlacePreferenceService, PrismaService],
})
export class PlacePreferenceModule {}

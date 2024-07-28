import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PlaceReviewModule } from './place-review/place-review.module';
import { PlacePhotoModule } from './place-photo/place-photo.module';
import { PlaceArchiveModule } from './place-archive/place-archive.module';
import { PlacePreferenceModule } from './place-preference/place-preference.module';

@Module({
  providers: [PlaceService, PrismaService, JwtService],
  controllers: [PlaceController],
  imports: [
    PlaceReviewModule,
    PlacePhotoModule,
    PlaceArchiveModule,
    PlacePreferenceModule,
  ],
})
export class PlaceModule {}

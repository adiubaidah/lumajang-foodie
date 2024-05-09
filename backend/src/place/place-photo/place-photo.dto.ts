import { PlacePhotoType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
export class PlacePhotoDto {
  @IsEnum(PlacePhotoType)
  type: PlacePhotoType;

  @IsString({ message: 'Tempat makan diperlukan' })
  placeId: string;
}

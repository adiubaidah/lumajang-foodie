import { PlacePhotoType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
export class PlacePhotoDto {
  @IsEnum(PlacePhotoType)
  type: PlacePhotoType;

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'Posisi gambar thumbnail tidak valid' })
  thumbnailPosition: number;

  @IsString({ message: 'Tempat makan diperlukan' })
  placeId: string;
}

import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { MenuType } from '@prisma/client';
import { Transform } from 'class-transformer';
export class MenuDto {
  @IsString({ message: 'Nama menu diperlukan' })
  name: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'Harga menu diperlukan' })
  price: number;

  @IsEnum(MenuType)
  type: MenuType;

  @IsOptional()
  @IsString({ message: 'Promo tidak valid' })
  promo: string;

  @IsString({ message: 'Tempat makan diperlukan' })
  placeId: string;
}

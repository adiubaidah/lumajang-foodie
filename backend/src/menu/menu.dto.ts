import { IsString, IsNumber, IsEnum } from 'class-validator';
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

  @IsString({ message: 'Tempat makan diperlukan' })
  placeId: string;
}

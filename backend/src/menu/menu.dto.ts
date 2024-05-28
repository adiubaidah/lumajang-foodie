import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { JenisMenu } from '@prisma/client';
export class MenuDto {
  @IsString({ message: 'Nama menu diperlukan' })
  name: string;
  @IsNumber({}, { message: 'Harga menu diperlukan' })
  price: number;

  @IsEnum(JenisMenu)
  jenis: JenisMenu;

  @IsString({ message: 'Tempat makan diperlukan' })
  placeId: string;
}

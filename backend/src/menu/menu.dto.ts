import { IsString, IsNumber, IsOptional } from 'class-validator';
export class MenuDto {
  @IsString({ message: 'Nama menu diperlukan' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Deskripsi tidak valid' })
  description: string;

  @IsNumber({}, { message: 'Harga menu diperlukan' })
  price: number;

  @IsString({ message: 'Tempat makan diperlukan' })
  placeId: string;
}

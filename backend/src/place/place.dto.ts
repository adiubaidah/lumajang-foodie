import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OpeningHoursDto {
  @IsString()
  day: string;

  @IsString()
  openHours: string;

  @IsString()
  closeHours: string;
}

export class LocationDto {
  @IsNumber()
  @Min(-90.0)
  @Max(90.0)
  latitude: number;

  @IsNumber()
  @Min(-180.0)
  @Max(180.0)
  longitude: number;
}

export class PlaceDto {
  @IsString({ message: 'Nama tempat makan diperlukan' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Deskripsi tidak valid' })
  description: string;

  @IsString({ message: 'Alamat diperlukan' })
  address: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested({ each: true })
  @Type(() => OpeningHoursDto)
  openingHours: OpeningHoursDto[];

  @IsOptional()
  @IsString({ message: 'Website url tidak valid' })
  websiteUri: string;

  @IsBoolean()
  takeout: boolean;

  @IsBoolean()
  delivery: boolean;

  @IsBoolean()
  liveMusic: boolean;

  @IsBoolean()
  restRoom: boolean;

  @IsBoolean()
  cashOnly: boolean;

  @IsBoolean()
  servesCoffee: boolean;

  @IsString({ message: 'Nomor telepon tidak valid' })
  phoneNumber: string;

  @IsString({ message: 'Kecamatan diperlukan' })
  subdistrictId: string;

  @IsOptional()
  @IsString()
  ownerId: string;
}

import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBooleanString,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email diperlukan' })
  email: string;

  @IsString({ message: 'Nama lengkap diperlukan' })
  name: string;

  @IsString({ message: 'Password diperlukan' })
  password: string;
}

export class UserDto {
  @IsEmail({}, { message: 'Email diperlukan' })
  email: string;

  @IsString({ message: 'Nama lengkap diperlukan' })
  name: string;

  @Type(() => Boolean)
  @IsBoolean({ message: 'Privasi tidak valid' })
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  isPrivate: boolean;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender tidak valid' })
  gender: Gender;

  @IsOptional()
  @IsString({ message: 'Kecamatan tidak valid' })
  subdistrictId: string;

  @IsOptional()
  @IsString({ message: 'Deskripsi tidak valid' })
  description: string;
}

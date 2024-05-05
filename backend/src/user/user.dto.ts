import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

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

  @IsEnum(Gender, { message: 'Gender tidak valid' })
  gender: Gender;

  @IsOptional()
  @IsString({ message: 'Deskripsi tidak valid' })
  description: string;
}

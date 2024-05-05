import { IsEmail, IsString } from 'class-validator';
export class LoginDto {
  @IsEmail({}, { message: 'Email diperlukan' })
  email: string;

  @IsString({ message: 'Password harus ada' })
  password: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email diperlukan' })
  email: string;

  @IsString({ message: 'Nama lengkap diperlukan' })
  name: string;

  @IsString({ message: 'Password diperlukan' })
  password: string;

  @IsString({ message: 'Konfirmasi Password diperlukan' })
  confirm_password: string;
}

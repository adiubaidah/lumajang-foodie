import { IsOptional, IsString } from 'class-validator';

export class MessageDto {
  @IsOptional()
  @IsString({ message: 'Pesan tidak valid' })
  body: string;

  @IsString({ message: 'Konversasi harus ada' })
  conversationId: string;
}

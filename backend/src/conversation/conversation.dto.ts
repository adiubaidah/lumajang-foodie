import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class ConversationDto {
  @IsOptional()
  @IsBoolean({ message: 'Group tidak valid' })
  isGroup: boolean;

  @IsString({ message: 'Penerima tidak valid' })
  receiverId: string;
}

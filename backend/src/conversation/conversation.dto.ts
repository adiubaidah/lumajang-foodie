import { IsBoolean, IsString } from 'class-validator';
export class ConversationDto {
  @IsBoolean({ message: 'Group tidak valid' })
  isGroup: boolean;

  @IsString({ message: 'Penerima tidak valid' })
  receiverId: string;
}

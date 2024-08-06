import { IsOptional, IsString } from 'class-validator';

export class PublicConversationDto {
  @IsOptional()
  @IsString()
  readonly body: string;

  @IsOptional()
  @IsString()
  readonly placeId: string;
}

import { Module } from '@nestjs/common';
import { PublicConversationController } from './public-conversation.controller';
import { PublicConversationService } from './public-conversation.service';

@Module({
  controllers: [PublicConversationController],
  providers: [PublicConversationService]
})
export class PublicConversationModule {}

import { Module } from '@nestjs/common';
import { MessageEvent } from './message.event';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConversationService } from 'src/conversation/conversation.service';

@Module({
  providers: [
    MessageService,
    PrismaService,
    JwtService,
    MessageEvent,
    ConversationService,
  ],
  controllers: [MessageController],
})
export class MessageModule {}

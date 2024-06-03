import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MessageEvent } from 'src/message/message.event';

@Module({
  providers: [ConversationService, PrismaService, JwtService, MessageEvent],
  controllers: [ConversationController],
})
export class ConversationModule {}

import { Module } from '@nestjs/common';
import { PublicConversationController } from './public-conversation.controller';
import { PublicConversationService } from './public-conversation.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PublicConversationController],
  providers: [PublicConversationService, PrismaService, JwtService],
})
export class PublicConversationModule {}

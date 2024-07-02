import { Module } from '@nestjs/common';
import { MessageEvent } from 'src/message/message.event';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService, MessageEvent, PrismaService, JwtService],
  controllers: [UserController],
})
export class UserModule {}

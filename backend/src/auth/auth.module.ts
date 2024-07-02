import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MessageEvent } from 'src/message/message.event';

@Module({
  providers: [
    AuthService,
    MessageEvent,
    PrismaService,
    UserService,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

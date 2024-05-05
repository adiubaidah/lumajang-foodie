import { Module } from '@nestjs/common';
import { UserFollowController } from './user-follow.controller';
import { UserFollowService } from './user-follow.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserFollowController],
  providers: [UserFollowService, PrismaService, JwtService],
})
export class UserFollowModule {}

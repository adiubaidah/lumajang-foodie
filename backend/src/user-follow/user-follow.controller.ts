import {
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { Request as RequestExpress } from 'express';
import { Role as RoleEnum } from '@prisma/client';
import { UserFollowService } from './user-follow.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';

@Controller('user-follow')
export class UserFollowController {
  constructor(private userFollowService: UserFollowService) {}

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Get('follower/:userId')
  async follower(@Param('userId') userId: string) {
    return this.userFollowService.follower(userId);
  }
  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Get('following/:userId')
  async following(@Param('userId') userId: string) {
    return this.userFollowService.following(userId);
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post(':userId')
  async follow(@Param('userId') userId: string, @Req() req: RequestExpress) {
    return await this.userFollowService.create(userId, req['user'].id);
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Get('check-follow')
  async checkFollow(@Query('user') user: string, @Req() req: RequestExpress) {
    const currentUser = req['user'];
    return this.userFollowService.checkFollow({
      user: user,
      currentUser: currentUser.id,
    });
  }
}

import {
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  Get,
  Query,
  Delete,
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

  @Get('follower/:userId')
  async follower(@Param('userId') userId: string) {
    return this.userFollowService.follower(userId);
  }
  @Get('following/:userId')
  async following(@Param('userId') userId: string) {
    return this.userFollowService.following(userId);
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post(':userId')
  async follow(@Param('userId') userId: string, @Req() req: RequestExpress) {
    const result = await this.userFollowService.create(userId, req['user'].id);
    return { result, type: 'follow' };
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':userId')
  async unFollow(@Param('userId') userId: string, @Req() req: RequestExpress) {
    const result = await this.userFollowService.delete(userId, req['user'].id);
    return { result, type: 'unfollow' };
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

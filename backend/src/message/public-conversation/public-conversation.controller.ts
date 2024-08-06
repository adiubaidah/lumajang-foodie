import { Controller, Get, Post, UseGuards, Body, Req } from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';
import { Request as RequestExpress } from 'express';
import { Role } from 'src/role/role.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { PublicConversationService } from './public-conversation.service';
import { PublicConversationDto } from './public-conversation.dto';

@Controller('public-conversation')
export class PublicConversationController {
  constructor(private publicConversationService: PublicConversationService) {}

  @Get()
  async getPublicConversations() {
    return await this.publicConversationService.getPublicConversations();
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createPublicConversation(
    @Body() payload: PublicConversationDto,
    @Req() req: RequestExpress,
  ) {
    const user = req['user'];
    return await this.publicConversationService.createPublicConversation(
      payload,
      user.id,
    );
  }
}

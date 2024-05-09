import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request as RequestExpress } from 'express';
import { Role as RoleEnum } from '@prisma/client';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';

import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Role([RoleEnum.foodie, RoleEnum.owner, RoleEnum.admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async allByUser(@Req() req: RequestExpress) {
    return await this.conversationService.allByUser(req['user'].id);
  }
}

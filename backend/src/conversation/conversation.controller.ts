import {
  Controller,
  UseGuards,
  Get,
  Post,
  Req,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { Request as RequestExpress } from 'express';
import { Role as RoleEnum } from '@prisma/client';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';

import { ConversationService } from './conversation.service';
import { ConversationDto } from './conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Role([RoleEnum.foodie, RoleEnum.owner, RoleEnum.admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async allByUser(@Req() req: RequestExpress) {
    return await this.conversationService.allByUser(req['user'].id);
  }

  @Role([RoleEnum.foodie, RoleEnum.owner, RoleEnum.admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.conversationService.find(id);
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Body() body: ConversationDto, @Req() req: RequestExpress) {
    return await this.conversationService.create({
      receiverId: body.receiverId,
      senderId: req['user'].id,
    });
  }
  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post(':conversation/seen')
  async seen(
    @Param('conversation') conversationId: string,
    @Req() req: RequestExpress,
  ) {
    const user = req['user'];
    return await this.conversationService.seen({
      conversation: conversationId,
      currentUser: user.id,
    });
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':conversation')
  async delete(
    @Param('conversation') conversationId: string,
    @Req() req: RequestExpress,
  ) {
    return await this.conversationService.delete({
      conversationId,
      userId: req['user'].id,
    });
  }
}

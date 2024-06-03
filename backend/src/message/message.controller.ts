import {
  Controller,
  Query,
  Get,
  UseGuards,
  Delete,
  Param,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { Request as RequestExpress } from 'express';
import { Role as RoleEnum } from '@prisma/client';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';
import { MessageService } from './message.service';
import { MessageDto } from './message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async allByConversation(@Query('conversation') conversationId: string) {
    return await this.messageService.getByConversation(conversationId);
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Body() payload: MessageDto, @Req() req: RequestExpress) {
    const user = req['user'];
    return await this.messageService.create(
      {
        body: payload.body,
        conversationId: payload.conversationId,
      },
      user.id,
    );
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':messageId')
  async delete(@Param('messageId') messageId: string) {
    return await this.messageService.delete(messageId);
  }
}

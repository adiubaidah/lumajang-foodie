import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';
import { Role } from 'src/role/role.decorator';
import { Request as RequestExpress } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { MenuReviewService } from './menu-review.service';
import { MenuReviewDto } from './menu-review.dto';

@Controller('menu-review')
export class MenuReviewController {
  constructor(private menuReview: MenuReviewService) {}

  @Get()
  async all(
    @Query('menu') menuId: string,
    @Query('perPage') perPage: number,
    @Query('page') page: number,
  ) {
    return await this.menuReview.all(menuId, {
      page: page || 1,
      perPage: perPage || 4,
    });
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Body() payload: MenuReviewDto, @Req() req: RequestExpress) {
    return await this.menuReview.create(payload, req['user'].id);
  }
}

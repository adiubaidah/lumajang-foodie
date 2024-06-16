import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';
import { Role } from 'src/role/role.decorator';
import { Request as RequestExpress } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { MenuArchiveService } from './menu-archive.service';

@Controller('menu-archive')
export class MenuArchiveController {
  constructor(private menuService: MenuArchiveService) {}

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async all(
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Req() req: RequestExpress,
  ) {
    const user = req['user'].id;
    return await this.menuService.all({
      perPage: perPage || 6,
      page: page || 1,
      user,
    });
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Get('find')
  async find(@Query('menu') menu: string, @Req() req: RequestExpress) {
    const user = req['user'].id;
    return await this.menuService.find({ user, menu });
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post(':menu')
  async create(@Param('menu') menu: string, @Req() req: RequestExpress) {
    const user = req['user'].id;
    return await this.menuService.create({ menu, user });
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':menu')
  async delete(@Param('menu') menu: string, @Req() req: RequestExpress) {
    const user = req['user'].id;
    return await this.menuService.delete({ menu, user });
  }
}

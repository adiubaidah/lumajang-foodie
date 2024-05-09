import {
  Controller,
  Body,
  Post,
  Put,
  Delete,
  Get,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';
import { Role } from 'src/role/role.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { MenuService } from './menu.service';
import { MenuDto } from './menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Role([RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Body() payload: MenuDto) {
    return await this.menuService.create(payload);
  }

  @Get()
  async all(
    @Query('q') name: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('perPage') perPage: number,
    @Query('page') page: number,
  ) {
    return await this.menuService.all({
      maxPrice,
      minPrice,
      name,
      page,
      perPage,
    });
  }
  @Role([RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Put(':menuId')
  async update(@Body() payload: MenuDto, @Param('menudId') menuId: string) {
    return await this.menuService.update(payload, menuId);
  }
  @Role([RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':menuId')
  async delete(@Param('menuId') menuId: string) {
    return await this.menuService.delete(menuId);
  }
}

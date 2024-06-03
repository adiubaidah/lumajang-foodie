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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';
import { Role } from 'src/role/role.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { MenuService } from './menu.service';
import { MenuDto } from './menu.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Role([RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: 'public/img/menu',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname.replace(/\//g, '/'));
        },
      }),
    }),
  )
  @Post()
  async create(
    @Body() payload: MenuDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.menuService.create(payload, photo.path);
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

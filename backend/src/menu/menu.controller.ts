import { unlink } from 'node:fs/promises';
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
  BadRequestException,
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
    @Query('place') placeId: string,
    @Query('sort') sort,
  ) {
    return await this.menuService.all({
      maxPrice,
      minPrice,
      name,
      page: page || 1,
      perPage: perPage || 12,
      placeId,
      sort,
    });
  }

  @Get('find')
  async find(@Query('slug') slug: string, @Query('id') id: string) {
    if (!!slug && !!id) {
      throw new BadRequestException('Request tidak valid');
    }
    return await this.menuService.find({ slug, id });
  }

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
  @Put(':menuId')
  async update(
    @Body() payload: MenuDto,
    @Param('menuId') menuId: string,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const menu = await this.menuService.find({ id: menuId });

    if (menu && menu.photo && photo) {
      try {
        await unlink(`public/img/menu/${menu.photo}`);
      } catch (err) {
        console.error(`Failed to delete old photo: ${err}`);
      }
    }

    return await this.menuService.update({
      menuId,
      isNameChange: menu.name !== payload.name,
      payload,
      photo: photo ? photo.path : undefined,
    });
  }

  @Role([RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':menuId')
  async delete(@Param('menuId') menuId: string) {
    return await this.menuService.delete(menuId);
  }
}

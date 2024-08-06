import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Param,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { Role as RoleEnum } from '@prisma/client';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';
import { PlaceService } from './place.service';
import { PlaceDto } from './place.dto';
import { Request as RequestExpress } from 'express';
import { PrismaService } from 'src/prisma.service';

@Controller('place')
export class PlaceController {
  constructor(
    private placeService: PlaceService,
    private prismaService: PrismaService,
  ) {}

  @Get()
  async all(
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('q') q: string,
    @Query('sort') sort: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('subdistrict') subdistrict: string,
    @Query('open-now') openNow: number,
    @Query('promo') promo: number,
    @Query() preference: object,
  ) {
    const validPreference = [];
    //validate preference key by check in database
    const preferenceKey = Object.keys(preference);

    for (const key of preferenceKey) {
      if (preference[key] === '1') {
        const findPreference =
          await this.prismaService.placePreferences.findUnique({
            where: {
              value: key,
            },
          });

        if (!!findPreference) {
          validPreference.push(key);
        }
      }
    }
    // return validPreference;
    return await this.placeService.all({
      page: page || 1,
      perPage: perPage || 15,
      latitude,
      longitude,
      openNow,
      query: q,
      promo,
      sort,
      subdistrict,
      preferences: validPreference,
    });
  }

  @Get('find')
  async find(@Query('slug') slug: string, @Query('id') id: string) {
    if (!!slug && !!id) {
      throw new BadRequestException('Request tidak valid');
    }
    return await this.placeService.find({ slug, id });
  }

  @Get('by-owner/:ownerId')
  async placeByOwner(@Param('ownerId') ownerId: string) {
    return await this.placeService.placeByOwner(ownerId);
  }

  @Role([RoleEnum.owner, RoleEnum.admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Body() body: PlaceDto, @Req() req: RequestExpress) {
    const user = req['user'];

    // if(user.role ===)
    if (user.role === 'owner') {
      if (body.ownerId) {
        // if owner id is exist
        throw new ForbiddenException('Tindakan hanya untuk admin');
      }
      body.ownerId = user.id;
    }

    return await this.placeService.create(body);
  }

  @Role([RoleEnum.owner, RoleEnum.admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: PlaceDto,
    @Req() req: RequestExpress,
  ) {
    const user = req['user'];

    // if(user.role ===)
    if (user.role === 'owner') {
      if (body.ownerId) {
        throw new ForbiddenException('Tindakan hanya untuk admin');
      }
      body.ownerId = user.id;
    }
    return await this.placeService.put(id, body);
  }

  @Role([RoleEnum.owner, RoleEnum.admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: RequestExpress) {
    const user = req['user'];

    return await this.placeService.delete(id);
  }
}

import {
  Controller,
  Get,
  Query,
  Post,
  Put,
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

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get()
  async all(
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('q') q: string,
    @Query('takeout') takeout: number,
    @Query('delivery') delivery: number,
    @Query('liveMusic') liveMusic: number,
    @Query('restRoom') restRoom: number,
    @Query('cashOnly') cashOnly: number,
    @Query('servesCoffe') servesCoffe: number,
    @Query('openNow') openNow: number,
    @Query('sort') sort: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('subdistrict') subdistrict: string,
  ) {
    return await this.placeService.all({
      page: page || 1,
      perPage: perPage || 9,
      cashOnly,
      delivery,
      latitude,
      liveMusic,
      longitude,
      restRoom,
      openNow,
      takeout,
      query: q,
      sort,
      servesCoffe,
      subdistrict,
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
}

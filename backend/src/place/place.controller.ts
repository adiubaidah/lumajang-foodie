import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';

import { Role as RoleEnum } from '@prisma/client';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';
import { PlaceService } from './place.service';
import { PlaceDto } from './place.dto';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get()
  async all(
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('q') q: string,
    @Query('takeout') taketout: number,
    @Query('delivery') delivery: number,
    @Query('liveMusic') liveMusic: number,
    @Query('restRoom') restRoom: number,
    @Query('cashOnly') cashOnly: number,
    @Query('servesCoffe') servesCoffe: number,
    @Query('openNow') openNow: number,
  ) {
    return await this.placeService.all(
      perPage || 6,
      page || 1,
      q,
      taketout,
      delivery,
      liveMusic,
      restRoom,
      cashOnly,
      servesCoffe,
      openNow,
    );
  }
  @Role([RoleEnum.foodie])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Body() body: PlaceDto) {
    return await this.placeService.create(body);
  }

  @Get(':slug')
  async find(@Param('slug') slug: string) {
    return await this.placeService.find(slug);
  }

  @Get('by-owner/:ownerId')
  async placeByOwner(@Param('ownerId') ownerId: string) {
    return await this.placeService.placeByOwner(ownerId);
  }
}

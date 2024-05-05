import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';

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
  ) {
    return await this.placeService.all(
      perPage || 2,
      page || 1,
      q,
      taketout,
      delivery,
      liveMusic,
      restRoom,
      cashOnly,
      servesCoffe,
    );
  }
  @Role([RoleEnum.foodie])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Body() body: PlaceDto) {
    return await this.placeService.create(body);
  }
}

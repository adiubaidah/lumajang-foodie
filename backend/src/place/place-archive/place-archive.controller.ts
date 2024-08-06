import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';
import { Role } from 'src/role/role.decorator';
import { Request as RequestExpress } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { PlaceArchiveService } from './place-archive.service';
@Controller('place-archive')
export class PlaceArchiveController {
  constructor(private placeArchiveService: PlaceArchiveService) {}

  @Get()
  async all(
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('user') user: string,
  ) {
    return await this.placeArchiveService.all({
      perPage: perPage || 5,
      page: page || 1,
      user,
    });
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Get('find')
  async find(@Query('place') place: string, @Req() req: RequestExpress) {
    const user = req['user'].id;
    return await this.placeArchiveService.find({ user, place });
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async create(@Query('place') place: string, @Req() req: RequestExpress) {
    const user = req['user'].id;
    const result = await this.placeArchiveService.create({ place, user });
    return { result, type: 'archive' };
  }

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Delete()
  async delete(@Query('place') place: string, @Req() req: RequestExpress) {
    const user = req['user'].id;
    const result = await this.placeArchiveService.delete({ place, user });
    return { result, type: 'unarchive' };
  }
}

import {
  Controller,
  Body,
  Post,
  Put,
  Delete,
  Get,
  Req,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';
import { PlaceReviewService } from './place-review.service';
import { PlaceReviewDto } from './place-review.dto';
import { Role } from 'src/role/role.decorator';
import { Request as RequestExpress } from 'express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';

@Controller('place-review')
export class PlaceReviewController {
  constructor(private placeReviewService: PlaceReviewService) {}

  @Role([RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Put()
  async update(@Body() payload: PlaceReviewDto, @Req() req: RequestExpress) {
    return await this.placeReviewService.update(payload, req['user'].id);
  }

  @Get()
  async all(
    @Query('place') placeId: string,
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('user') userId: string,
    @Query('current-user') currentUser: string,
  ) {
    //cari keseluruhan
    return await this.placeReviewService.all({
      page: page || 1,
      perPage: perPage || 5,
      placeId,
      userId,
      currentUser,
    });
  }

  @Get('find')
  async findByPlace(
    @Query('place') placeId: string,
    @Query('current-user') currentUser: string,
  ) {
    return await this.placeReviewService.findByPlaceAndUser(
      placeId,
      currentUser,
    );
  }
}

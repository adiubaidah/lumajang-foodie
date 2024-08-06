import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import {
  Controller,
  BadRequestException,
  Post,
  Get,
  Delete,
  UseGuards,
  Body,
  UploadedFile,
  Query,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { PlacePhotoType, Role as RoleEnum } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlacePhotoService } from './place-photo.service';
import { Role } from 'src/role/role.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { PlacePhotoDto } from './place-photo.dto';
import { PrismaService } from 'src/prisma.service';

@Controller('place-photo')
export class PlacePhotoController {
  constructor(
    private placePhotoService: PlacePhotoService,
    private prismaService: PrismaService,
  ) {}

  @Role([RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: PlacePhotoDto,
  ) {
    //check is thumbnail or not, if thumnail, then must unique

    if (payload.type === PlacePhotoType.thumbnail) {
      const isThumbnailExist = await this.prismaService.placePhoto.findFirst({
        where: {
          placeId: payload.placeId,
          type: PlacePhotoType.thumbnail,
        },
      });

      if (isThumbnailExist) {
        throw new BadRequestException('Thumbnail sudah ada');
      }
    }

    if (payload.thumbnailPosition) {
      const isPhotoPositionExist =
        await this.prismaService.placePhoto.findFirst({
          where: {
            placeId: payload.placeId,
            thumbnailPosition: payload.thumbnailPosition,
          },
        });
      if (isPhotoPositionExist) {
        throw new BadRequestException('Posisi foto sudah ada');
      }
    }

    const filePath = await this.placePhotoService.uploadFile(file);
    return await this.placePhotoService.create(payload, filePath);
  }

  @Get()
  async all(
    @Query('place') placeId: string,
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('type') type: PlacePhotoType,
    @Query('preview') preview: number,
  ) {
    return await this.placePhotoService.all({
      perPage: perPage || 5,
      page: page || 1,
      preview,
      type,
      placeId,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.placePhotoService.delete(id);
    await unlink(join(process.cwd(), result.url));
    return true;
  }
}

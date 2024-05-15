import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  UseInterceptors,
  Body,
  UploadedFile,
  Query,
  Param,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { Role as RoleEnum } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlacePhotoService } from './place-photo.service';
import { Role } from 'src/role/role.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RoleGuard } from 'src/role/role.guard';
import { PlacePhotoDto } from './place-photo.dto';

@Controller('place-photo')
export class PlacePhotoController {
  constructor(private placePhotoService: PlacePhotoService) {}

  @Role([RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: 'public/img/place',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname.replace(/\//g, '/'));
        },
      }),
    }),
  )
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: PlacePhotoDto,
  ) {
    return await this.placePhotoService.create(payload, file.path);
  }

  @Get()
  async all(@Query('place') placeId: string) {
    return await this.placePhotoService.all(placeId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.placePhotoService.delete(id);
    await unlink(join(process.cwd(), result.url));
    return true;
  }
}

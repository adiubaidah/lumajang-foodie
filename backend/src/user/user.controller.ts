import {
  Controller,
  Get,
  UseGuards,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
  Body,
  Query,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { Role as RoleEnum } from '@prisma/client';
import { Request as RequestExpress } from 'express';
import { diskStorage } from 'multer';

import { fileFilter } from 'src/lib/file.validator';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/role/role.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { UserService } from './user.service';
import { RoleGuard } from 'src/role/role.guard';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Role([RoleEnum.admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async all(
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('q') query: string,
    @Query('isActive') isActive: number,
    @Query('role') role: RoleEnum,
  ) {
    return await this.userService.all({
      perPage: perPage || 10,
      page: page || 1,
      q: query,
      isActive,
      role,
    });
  }

  @Role([RoleEnum.admin, RoleEnum.foodie, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Get(':id')
  async find(@Param('id') id: string, @Req() req: RequestExpress) {
    const user = req['user'];
    if (user.id !== id && user.role !== RoleEnum.admin) {
      throw new ForbiddenException();
    }
    return await this.userService.find(id);
  }

  @Role([RoleEnum.foodie, RoleEnum.admin, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'backgroundImage', maxCount: 1 },
      ],
      {
        fileFilter: fileFilter,
        storage: diskStorage({
          destination: 'public/img/user',
          filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
          },
        }),
      },
    ),
  )
  @Put('update-profile')
  async update(
    @Req() req: RequestExpress,
    @Body() body: UserDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File;
      backgroundImage?: Express.Multer.File;
    },
  ) {
    let imageFile: Express.Multer.File;
    let backgroundImageFile: Express.Multer.File;

    if (!!files) {
      imageFile = files.image ? files.image[0] : null;
      backgroundImageFile = files.backgroundImage
        ? files.backgroundImage[0]
        : null;
    }

    return await this.userService.update(req['user'].id, body, {
      image: imageFile && imageFile.path,
      backgroundImage: backgroundImageFile && backgroundImageFile.path,
    });
  }
}

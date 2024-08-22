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
  Delete,
  ForbiddenException,
  UsePipes,
  ValidationPipe,
  Post,
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
import { UpdatePasswordDto, UserDto } from './user.dto';
import { makeid } from 'src/helper';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Role([RoleEnum.owner, RoleEnum.foodie, RoleEnum.admin])
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async all(
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('q') query: string,
    @Query('isActive') isActive: number,
    @Query('role') role: RoleEnum,
    @Req() req: RequestExpress,
  ) {
    return await this.userService.all({
      q: query,
      isActive,
      role,
      currentUser: req['user'],
    });
  }

  @Get('online')
  async checkOnline(@Query('id') id: string) {
    return await this.userService.checkOnline(id);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.userService.find(id);
  }

  @Role([RoleEnum.foodie, RoleEnum.admin, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  // @UsePipes(new ValidationPipe({ forbidNonWhitelisted: false }))
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'backgroundImage', maxCount: 1 },
      ],
      {
        fileFilter: fileFilter,
        storage: diskStorage({
          destination: (req, file, cb) => {
            // Determine the destination based on the file field name
            const destinationPath =
              file.fieldname === 'image'
                ? 'public/img/user/profile'
                : 'public/img/user/background';
            cb(null, destinationPath);
          },
          filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop();
            cb(null, `${Date.now()}-${makeid(6)}.${fileExtension}`);
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
  @Role([RoleEnum.foodie, RoleEnum.admin, RoleEnum.owner])
  @UseGuards(JwtGuard, RoleGuard)
  @Put('update-password')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @Req() req: RequestExpress,
  ) {
    if (body.confirmNewPassword !== body.newPassword) {
      throw new ForbiddenException(
        'Password baru dan konfirmasi password baru tidak sama',
      );
    }
    return await this.userService.changePassword({
      newPassword: body.newPassword,
      oldPassword: body.oldPassword,
      userId: req['user'].id,
    });
  }
}

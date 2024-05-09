import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlacePhotoDto } from './place-photo.dto';

@Injectable()
export class PlacePhotoService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: PlacePhotoDto, path: string) {
    return await this.prismaService.placePhoto.create({
      data: {
        type: payload.type,
        url: path,
        place: {
          connect: {
            id: payload.placeId,
          },
        },
      },
    });
  }

  async all(placeId: string) {
    return await this.prismaService.placePhoto.findMany({
      where: {
        placeId,
      },
    });
  }

  async delete(id: string) {
    return await this.prismaService.placePhoto.delete({
      where: {
        id,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlacePhotoDto } from './place-photo.dto';
import { PlacePhotoType } from '@prisma/client';

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

  async all({
    placeId,
    perPage,
    page,
    type,
  }: {
    placeId: string;
    perPage: number;
    page: number;
    type?: PlacePhotoType;
  }) {
    const skip = (page - 1) * perPage;
    const result = await this.prismaService.placePhoto.findMany({
      where: {
        placeId,
        ...(type && {
          type,
        }),
      },
      skip,
      take: perPage,
    });

    const total = await this.prismaService.placePhoto.count({
      where: {
        placeId,
      },
    });

    const pageCount = Math.ceil(total / perPage);
    const prev = page > 1 ? page - 1 : null;
    const next = page < pageCount ? page + 1 : null;

    return {
      result,
      pagination: {
        prev,
        page,
        total,
        pageCount,
        next,
      },
    };
  }

  async delete(id: string) {
    return await this.prismaService.placePhoto.delete({
      where: {
        id,
      },
    });
  }
}

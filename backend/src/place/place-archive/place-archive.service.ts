import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlaceArchiveService {
  constructor(private prismaService: PrismaService) {}

  async all({
    user,
    page,
    perPage,
  }: {
    user: string;
    page: number;
    perPage: number;
  }) {
    const skip = (page - 1) * perPage;
    const result = await this.prismaService.placeArchive.findMany({
      where: {
        userId: user,
      },
      include: {
        place: true,
      },
      skip,
      take: perPage,
    });

    const count = await this.prismaService.placeArchive.count({
      where: {
        userId: user,
      },
    });

    const pageCount = Math.ceil(count / perPage);
    const prev = page > 1 ? page - 1 : null;
    const next = page < pageCount ? page + 1 : null;

    return {
      result,
      pagination: {
        prev,
        page,
        total: count,
        pageCount,
        next,
      },
    };
  }

  async create({ place, user }: { place: string; user: string }) {
    return await this.prismaService.placeArchive.create({
      data: {
        place: {
          connect: {
            id: place,
          },
        },
        user: {
          connect: {
            id: user,
          },
        },
      },
    });
  }

  async find({ place, user }: { place: string; user: string }) {
    return await this.prismaService.placeArchive.findUnique({
      where: {
        placeId_userId: {
          placeId: place,
          userId: user,
        },
      },
    });
  }
  async delete({ place, user }: { place: string; user: string }) {
    return await this.prismaService.placeArchive.delete({
      where: {
        placeId_userId: {
          placeId: place,
          userId: user,
        },
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlaceReviewDto } from './place-review.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaceReviewService {
  constructor(private prismaService: PrismaService) {}

  async update(payload: PlaceReviewDto, userId: string) {
    const { placeId, ...rest } = payload;
    return await this.prismaService.placeReview.upsert({
      where: {
        userId_placeId: {
          userId,
          placeId,
        },
      },
      update: {
        ...rest,
      },
      create: {
        ...rest,
        place: {
          connect: {
            id: placeId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async all({
    perPage,
    page,
    placeId,
    userId,
    currentUser,
  }: {
    perPage: number;
    page: number;
    placeId?: string;
    userId?: string;
    currentUser?: string;
  }) {
    const skip = (page - 1) * perPage;
    const whereClause: Prisma.PlaceReviewWhereInput = {
      ...(placeId && {
        placeId,
      }),
      ...(userId && {
        //jika melihat profile user
        userId,
      }),
    };
    if (!!currentUser && !!placeId) {
      whereClause.NOT = [{ userId: currentUser }];
    }

    const result = await this.prismaService.placeReview.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
        place: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take: perPage,
    });
    const count = await this.prismaService.placeReview.count({
      where: {
        placeId,
      },
    });

    const pageCount = Math.ceil(count / perPage);

    return {
      result,
      pagination: {
        pageCount,
        total: count,
        prev: page > 1 ? page - 1 : null,
        next: page < pageCount ? page + 1 : null,
      },
    };
  }

  async findByPlaceAndUser(placeId: string, userId: string) {
    return await this.prismaService.placeReview.findUnique({
      where: {
        userId_placeId: {
          userId,
          placeId,
        },
      },
    });
  }
}

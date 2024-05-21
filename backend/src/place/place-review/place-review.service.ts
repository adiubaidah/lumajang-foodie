import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlaceReviewDto } from './place-review.dto';

@Injectable()
export class PlaceReviewService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: PlaceReviewDto, userId: string) {
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
  }: {
    perPage: number;
    page: number;
    placeId?: string;
    userId?: string;
  }) {
    const skip = (page - 1) * perPage;
    const result = await this.prismaService.placeReview.findMany({
      where: {
        ...(placeId && {
          placeId,
        }),
        ...(userId && {
          userId,
        }),
      },
      include: {
        user: {
          select: {
            image: true,
            name: true,
          },
        },
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

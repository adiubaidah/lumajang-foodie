import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MenuReviewDto } from './menu-review.dto';

@Injectable()
export class MenuReviewService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: MenuReviewDto, userId: string) {
    const { menuId, ...rest } = payload;
    return await this.prismaService.menuReview.create({
      data: {
        ...rest,
        menu: {
          connect: {
            id: menuId,
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

  async all(
    menuId: string,
    { perPage = 3, page = 1 }: { perPage: number; page: number },
  ) {
    const skip = (page - 1) * perPage;
    const result = await this.prismaService.menuReview.findMany({
      where: {
        menuId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      skip,
      take: perPage,
    });
    const count = await this.prismaService.menuReview.count({
      where: {
        menuId,
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
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MenuArchiveService {
  constructor(private prismaService: PrismaService) {}

  async all({
    perPage,
    page,
    user,
  }: {
    perPage: number;
    page: number;
    user: string;
  }) {
    const skip = (page - 1) * perPage;
    const result = await this.prismaService.menuArchive.findMany({
      where: {
        userId: user,
      },
      include: {
        menu: true,
      },
      skip,
      take: perPage,
    });
    const count = await this.prismaService.menuArchive.count({
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
  async create({ menu, user }: { menu: string; user: string }) {
    return await this.prismaService.menuArchive.create({
      data: {
        menu: {
          connect: {
            id: menu,
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

  async find({ menu, user }: { menu: string; user: string }) {
    return await this.prismaService.menuArchive.findUnique({
      where: {
        menuId_userId: {
          menuId: menu,
          userId: user,
        },
      },
    });
  }
  async delete({ menu, user }: { menu: string; user: string }) {
    return await this.prismaService.menuArchive.delete({
      where: {
        menuId_userId: {
          menuId: menu,
          userId: user,
        },
      },
    });
  }
}

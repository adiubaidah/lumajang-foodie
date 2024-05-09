import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MenuDto } from './menu.dto';
import { slugify } from 'src/helper';
import { Prisma } from '@prisma/client';
@Injectable()
export class MenuService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: MenuDto) {
    const { placeId, name, description, price } = payload;
    return await this.prismaService.menu.create({
      data: {
        name,
        description,
        price,
        slug: slugify(name),
        place: {
          connect: {
            id: placeId,
          },
        },
      },
    });
  }

  async all({
    name,
    minPrice,
    maxPrice,
    page,
    perPage,
  }: {
    name: string;
    minPrice: number;
    maxPrice: number;
    page: number;
    perPage: number;
  }) {
    const skip = (page - 1) * perPage;
    const whereClause: Prisma.MenuWhereInput = {
      name: {
        contains: name,
        mode: 'insensitive',
      },
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };
    const result = await this.prismaService.menu.findMany({
      where: whereClause,
      skip,
      take: perPage,
    });
    const total = await this.prismaService.menu.count({
      where: whereClause,
    });
    const pageCount = Math.ceil(total / perPage);

    return {
      result,
      pagination: {
        total,
        pageCount,
        prev: page > 1 ? page - 1 : null,
        next: page < pageCount ? page + 1 : null,
      },
    };
  }

  async update(payload: MenuDto, menuId: string) {
    const { placeId, name, description, price } = payload;
    return await this.prismaService.menu.update({
      where: {
        id: menuId,
      },
      data: {
        name,
        description,
        price,
        slug: slugify(name),
        place: {
          connect: {
            id: placeId,
          },
        },
      },
    });
  }

  async delete(menuId: string) {
    return await this.prismaService.menu.delete({
      where: {
        id: menuId,
      },
    });
  }
}

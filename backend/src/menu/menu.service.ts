import { Injectable } from '@nestjs/common';
// import ObjectId
import { PrismaService } from 'src/prisma.service';
import { MenuDto } from './menu.dto';
import { slugify } from 'src/helper';
import { Prisma } from '@prisma/client';
import { CountResult } from 'src/constant';
@Injectable()
export class MenuService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: MenuDto, photo: string) {
    const { placeId, name, type, price } = payload;
    return await this.prismaService.menu.create({
      data: {
        name,
        type,
        price,
        photo,
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
    placeId,
    minPrice,
    maxPrice,
    page,
    perPage,
    sort,
  }: {
    name: string;
    placeId: string;
    minPrice: number;
    maxPrice: number;
    page: number;
    perPage: number;
    sort: string;
  }) {
    const skip = (page - 1) * perPage;
    const pipeline: Prisma.JsonValue = [
      {
        $match: {
          ...(name && {
            name: {
              $regex: name,
              $options: 'i',
            },
          }),
          ...(placeId && {
            placeId: {
              $eq: { $oid: placeId },
            },
          }),
          ...(minPrice && {
            price: {
              $gte: minPrice,
            },
          }),
          ...(maxPrice && {
            price: {
              $lte: maxPrice,
            },
          }),
        },
      },
      {
        $lookup: {
          from: 'MenuReview',
          let: { menuId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$menuId', '$$menuId'],
                },
              },
            },
            {
              $group: {
                _id: null,
                averageStar: { $avg: '$star' },
              },
            },
          ],
          as: 'averageStar',
        },
      },
      {
        $addFields: {
          averageStar: { $arrayElemAt: ['$averageStar.averageStar', 0] },
        },
      },
    ];

    const sortOptions = {
      'name:asc': { name: 1 },
      'name:desc': { name: -1 },
      popular: { averageStar: -1 },
    };

    const sortBy = sortOptions[sort] || sortOptions['name:asc'];

    pipeline.push(
      ...[{ $sort: { ...sortBy } }, { $skip: skip }, { $limit: perPage }],
    );
    const result = await this.prismaService.menu.aggregateRaw({
      pipeline,
    });

    const count = (await this.prismaService.menu.aggregateRaw({
      pipeline: [
        ...pipeline,
        {
          $count: 'total',
        },
      ],
    })) as unknown as CountResult[];

    const total = !!count[0] ? count[0].total : 0;
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

  async find({ slug, id }: { slug?: string; id?: string }) {
    const result = await this.prismaService.menu.findUnique({
      where: {
        ...(slug && {
          slug,
        }),
        ...(id && {
          id,
        }),
      },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
    const rate = await this.prismaService.menuReview.aggregate({
      where: {
        menuId: result.id,
      },
      _count: {
        id: true,
      },
      _avg: {
        star: true,
      },
    });

    return { ...result, rate };
  }

  async update({
    menuId,
    payload,
    photo,
    isNameChange,
  }: {
    menuId: string;
    payload: MenuDto;
    photo?: string;
    isNameChange: boolean;
  }) {
    const { placeId, name, type, price } = payload;
    return await this.prismaService.menu.update({
      where: {
        id: menuId,
      },
      data: {
        name,
        type,
        price,
        ...(isNameChange && { slug: slugify(name) }),
        photo,
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

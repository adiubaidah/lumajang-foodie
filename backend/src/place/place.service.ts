import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma.service';
import { PlaceDto } from './place.dto';
import { CountResult } from 'src/constant';
import { slugify } from 'src/helper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlaceService {
  constructor(private prismaService: PrismaService) {}

  async all(
    {
      perPage,
      page,
      query,
      takeout,
      delivery,
      liveMusic,
      restRoom,
      cashOnly,
      servesCoffe,
      openNow,
      longitude,
      latitude,
      sort,
      subdistrict,
    }: {
      perPage: number;
      page: number;
      query: string;
      takeout: number;
      delivery: number;
      liveMusic: number;
      restRoom: number;
      cashOnly: number;
      servesCoffe: number;
      openNow: number;
      longitude: number;
      latitude: number;
      sort: string;
      subdistrict: string;
    },
    // popularSort: number,
  ) {
    const skip = (page - 1) * perPage;
    const filterOptions = {};

    if (takeout === 1) filterOptions['takeout'] = true;
    if (delivery === 1) filterOptions['delivery'] = true;
    if (liveMusic === 1) filterOptions['liveMusic'] = true;
    if (restRoom === 1) filterOptions['restRoom'] = true;
    if (cashOnly === 1) filterOptions['cashOnly'] = true;
    if (servesCoffe === 1) filterOptions['servesCoffe'] = true;

    const now = moment().locale('id');
    const dayName = now.format('dddd'); // Contoh output: "Senin"
    const currentTime = now.format('HH:mm');

    const pipeline: Prisma.JsonValue[] = [];

    if (longitude && latitude) {
      // console.log(longitude, latitude);
      pipeline.push({
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          spherical: true,
        },
      });
    }

    const match = {
      $match: {
        name: query ? { $regex: query, $options: 'i' } : undefined,
        ...filterOptions,
        ...(subdistrict && {
          subdistrictId: {
            $eq: {
              $oid: subdistrict,
            },
          },
        }),
        ...(openNow === 1 && {
          openingHours: {
            $elemMatch: {
              day: dayName,
              openHours: {
                $lte: currentTime,
              },
              closeHours: {
                $gte: currentTime,
              },
            },
          },
        }),
      },
    };

    pipeline.push(match);

    const lookupClause = [
      {
        $lookup: {
          from: 'Subdistrict',
          let: { subdistrictId: '$subdistrictId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$subdistrictId'],
                },
              },
            },
          ],
          as: 'subdistrict',
        },
      },
      {
        $lookup: {
          from: 'PlacePhoto',
          let: { placeId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$placeId', '$$placeId'] },
                    { $eq: ['$type', 'thumbnail'] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: 'photoForThumbnail',
        },
      },

      {
        $lookup: {
          from: 'PlaceReview',
          let: { placeId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$placeId', '$$placeId'],
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
          photoForThumbnail: { $arrayElemAt: ['$photoForThumbnail', 0] },
          // averageStar: '$reviews.averageStar'
          averageStar: { $arrayElemAt: ['$averageStar.averageStar', 0] },
          subdistrict: { $arrayElemAt: ['$subdistrict.name', 0] },
        },
      },
    ];

    pipeline.push(...lookupClause);

    const sortOptions = {
      'name:asc': { name: 1 },
      'name:desc': { name: -1 },
      popular: { averageStar: -1 },
      distance: { distance: 1 },
    };

    const sortBy = sortOptions[sort] || sortOptions['name:asc'];

    pipeline.push(
      ...[{ $sort: { ...sortBy } }, { $skip: skip }, { $limit: perPage }],
    );
    // return pipeline;

    const result = await this.prismaService.place.aggregateRaw({
      pipeline,
    });
    const count = (await this.prismaService.place.aggregateRaw({
      pipeline: [
        match,
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

  async placeByOwner(ownerId: string) {
    return await this.prismaService.place.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        photos: {
          where: {
            type: 'thumbnail',
          },
          take: 1,
        },
      },
    });
  }

  async find({ slug, id }: { slug?: string; id?: string }) {
    const result = await this.prismaService.place.findUnique({
      where: {
        ...(slug && {
          slug,
        }),
        ...(id && {
          id,
        }),
      },
      include: {
        menus: true,
        photos: true,
        subdistrict: true,
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            _count: {
              select: {
                placeReviews: true,
                menuReviews: true,
                followers: true,
              },
            },
          },
        },
      },
    });
    const rate = await this.prismaService.placeReview.aggregate({
      where: {
        placeId: result.id,
      },
      _count: {
        id: true,
      },
      _avg: {
        star: true,
      },
    });

    return {
      ...result,
      rate,
    };
  }

  async create(body: PlaceDto) {
    const { subdistrictId, location, ownerId, ...rest } = body;
    // console.log(slugify(body.name))
    // return slugify(body.name);
    return await this.prismaService.place.create({
      data: {
        ...rest,
        slug: slugify(body.name),
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        owner: {
          connect: {
            id: ownerId,
          },
        },
        subdistrict: {
          connect: {
            id: subdistrictId,
          },
        },
      },
    });
  }

  async put(id: string, body: PlaceDto) {
    const { subdistrictId, location, ownerId, ...rest } = body;
    const check = await this.find({ id });

    return await this.prismaService.place.update({
      where: {
        id,
      },
      data: {
        ...rest,
        ...(check.name !== body.name && {
          slug: slugify(body.name),
        }),
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        owner: {
          connect: {
            id: ownerId,
          },
        },
        subdistrict: {
          connect: {
            id: subdistrictId,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return await this.prismaService.place.delete({
      where: {
        id,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlaceDto } from './place.dto';
import { CountResult } from 'src/constant';

@Injectable()
export class PlaceService {
  constructor(private prismaService: PrismaService) {}

  async all(
    perPage: number,
    page: number,
    query: string,
    takeout: number,
    delivery: number,
    liveMusic: number,
    restRoom: number,
    cashOnly: number,
    servesCoffe: number,
  ) {
    const skip = (page - 1) * perPage;
    const filterOptions = {};

    // Menambahkan filter berdasarkan nama dengan regex untuk case-insensitive search
    // Menambahkan filter lain jika parameter yang relevan diberikan dan bukan 0
    if (takeout === 1) filterOptions['takeout'] = true;
    if (delivery === 1) filterOptions['delivery'] = true;
    if (liveMusic === 1) filterOptions['liveMusic'] = true;
    if (restRoom === 1) filterOptions['restRoom'] = true;
    if (cashOnly === 1) filterOptions['cashOnly'] = true;
    if (servesCoffe === 1) filterOptions['servesCoffe'] = true;
    const result = await this.prismaService.place.findRaw({
      filter: {
        name: query ? { $regex: query, $options: 'i' } : undefined,
        ...filterOptions,
      },
      options: {
        skip,
        limit: perPage,
      },
    });
    const count = (await this.prismaService.place.aggregateRaw({
      pipeline: [
        {
          $match: {
            name: query ? { $regex: query, $options: 'i' } : undefined,
            ...filterOptions,
          },
        },
        {
          $count: 'total',
        },
      ],
    })) as unknown as CountResult[];

    const total = count[0].total;
    const pageCount = Math.ceil(total / perPage);
    const prev = page > 1 ? page - 1 : null;
    const next = page < pageCount ? page + 1 : null;

    return {
      result,
      pagination: {
        prev,
        pageCount,
        next,
      },
    };
  }

  async create(body: PlaceDto) {
    const { subdistrictId, location, ownerId, ...rest } = body;
    return await this.prismaService.place.create({
      data: {
        ...rest,
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

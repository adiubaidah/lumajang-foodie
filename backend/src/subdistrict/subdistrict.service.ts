import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubdistrictService {
  constructor(private prismaService: PrismaService) {}

  async all(place: number) {
    return await this.prismaService.subdistrict.findMany({
      ...(place && {
        include: {
          _count: {
            select: {
              Place: true,
            },
          },
        },
      }),
    });
  }

  async findByName(subdistrictName: string) {
    return await this.prismaService.subdistrict.findFirst({
      where: {
        name: {
          contains: subdistrictName,
          mode: 'insensitive',
        },
      },
    });
  }
}

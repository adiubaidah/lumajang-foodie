import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlacePhotoDto } from './place-photo.dto';
import { PlacePhotoType } from '@prisma/client';

@Injectable()
export class PlacePhotoService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: PlacePhotoDto, path: string) {
    return await this.prismaService.placePhoto.create({
      data: {
        type: payload.type as PlacePhotoType,
        url: path,
        thumbnailPosition: payload.thumbnailPosition || null,
        place: {
          connect: {
            id: payload.placeId,
          },
        },
      },
    });
  }

  async all({
    placeId,
    perPage,
    page,
    preview,
    type,
  }: {
    placeId: string;
    perPage: number;
    page: number;
    preview;
    type?: PlacePhotoType;
  }) {
    const skip = (page - 1) * perPage;
    const result = await this.prismaService.placePhoto.findMany({
      where: {
        placeId,
        ...(type && {
          type,
        }),
        ...(preview === 1 && {
          thumbnailPosition: {
            not: null,
          },
        }),
      },
      skip,
      ...(preview === 1 && {
        orderBy: {
          thumbnailPosition: 'asc',
        },
      }),
      take: perPage,
    });

    const total = await this.prismaService.placePhoto.count({
      where: {
        placeId,
      },
    });

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

  async delete(id: string) {
    return await this.prismaService.placePhoto.delete({
      where: {
        id,
      },
    });
  }

  // Hypothetical file upload function
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Implement your file upload logic here, e.g., saving to a local directory or cloud storage
    // For simplicity, let's assume we're saving the file to a local directory

    const uploadDir = 'public/place';
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `${uploadDir}/${fileName}`;

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save the file
    await fs.promises.writeFile(filePath, file.buffer);

    return filePath;
  }
}

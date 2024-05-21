import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcrypt';
import { UserDto } from './user.dto';
import { Prisma, Role } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: RegisterDto) {
    const { email, name, password } = payload;
    return await this.prismaService.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 10),
      },
    });
  }

  async update(
    id: string,
    payload: UserDto,
    { image, backgroundImage }: { image?: string; backgroundImage?: string },
  ) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...payload,
        image: image || undefined,
        backgroundImage: backgroundImage || undefined,
      },
    });
  }

  async all({
    q,
    isActive,
    role,
    page,
    perPage,
  }: {
    q: string;
    isActive: number;
    role?: Role;
    page: number;
    perPage: number;
  }) {
    const skip = (page - 1) * perPage;
    const filterOptions = {};
    if (isActive) {
      filterOptions['isActive'] = isActive === 1;
    }

    if (!!role) {
      filterOptions['role'] = role;
    }
    const whereClause: Prisma.UserWhereInput = { ...filterOptions };
    if (!!q) {
      whereClause.OR = [
        {
          email: {
            startsWith: q,
          },
        },
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ];
    }

    return await this.prismaService.user.findMany({
      where: whereClause,
      take: perPage,
      skip,
    });
  }
  async find(userId: string) {
    const result = await this.prismaService.user.findUnique({
      where: {
        id: userId,
        NOT: {
          role: 'admin',
        },
      },
      select: {
        id: true,
        name: true,
        backgroundImage: true,
        email: true,
        gender: true,
        description: true,
        image: true,
        role: true,
        isPrivate: true,
        _count: {
          select: {
            placeReviews: true,
            ownerPlaces: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (result.isPrivate) {
      throw new ForbiddenException('Akun di privasi');
    }
    return result;
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}

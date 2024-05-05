import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserFollowService {
  constructor(private prismaService: PrismaService) {}

  async follower(userId: string) {
    console.log(userId);
    return await this.prismaService.userFollow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }
  async following(userId: string) {
    return await this.prismaService.userFollow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async create(userId: string, currentUserId: string) {
    return await this.prismaService.userFollow.create({
      data: {
        follower: {
          connect: {
            id: currentUserId,
          },
        },
        following: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}

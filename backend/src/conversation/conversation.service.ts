import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prismaService: PrismaService) {}

  async create({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    return await this.prismaService.conversation.create({
      data: {
        users: {
          connect: [senderId, receiverId].map((userId) => ({ id: userId })),
        },
      },
    });
  }

  async findByUser({ senderId, receiverId }) {
    return await this.prismaService.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { users: { some: { id: senderId } } },
          { users: { some: { id: receiverId } } },
        ],
      },
    });
  }

  async allByUser(userId: string) {
    return await this.prismaService.conversation.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }
}

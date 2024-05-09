import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MessageDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: MessageDto) {
    return await this.prismaService.message.create({
      data: {
        body: payload.body,
        conversation: {
          connect: {
            id: payload.conversationId,
          },
        },
        sender: {
          connect: {
            id: payload.senderId,
          },
        },
      },
    });
  }

  async getByConversation(conversationId: string) {
    return await this.prismaService.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async delete(messageId: string) {
    return await this.prismaService.message.delete({
      where: {
        id: messageId,
      },
    });
  }
}

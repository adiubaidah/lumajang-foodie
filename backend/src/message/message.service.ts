import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MessageEvent } from './message.event';
import { MessageDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    private prismaService: PrismaService,
    private messageEvent: MessageEvent,
  ) {}

  async create(payload: MessageDto, senderId: string) {
    const newMessage = await this.prismaService.message.create({
      data: {
        body: payload.body,
        ...(payload.placeId && {
          place: {
            connect: {
              id: payload.placeId,
            },
          },
        }),
        conversation: {
          connect: {
            id: payload.conversationId,
          },
        },
        sender: {
          connect: {
            id: senderId,
          },
        },
        seen: {
          connect: {
            id: senderId,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await this.prismaService.conversation.update({
      where: {
        id: payload.conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          include: {
            seen: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    this.messageEvent.server
      .to(payload.conversationId)
      .emit('message:new', newMessage);

    updatedConversation.users.forEach((user) => {
      this.messageEvent.server
        .to(this.messageEvent.users[user.id])
        .emit('conversation:update', {
          id: payload.conversationId,
          messages: [lastMessage],
        });
    });

    return updatedConversation;
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
        place: {
          select: {
            id: true,
            name: true,
            photos: {
              where: {
                thumbnailPosition: 1,
              },
            },
          },
        },
      },
    });
  }

  async getConversation({ currentUser }: { currentUser: string }) {
    return await this.prismaService.conversation.findMany({
      where: {
        users: {
          some: {
            id: currentUser,
          },
        },
      },
      select: {
        id: true,
        messages: {
          select: {
            id: true,
            body: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
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

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MessageEvent } from 'src/message/message.event';

@Injectable()
export class ConversationService {
  constructor(
    private prismaService: PrismaService,
    private messageEvent: MessageEvent,
  ) {}

  async create({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    const existingConversations =
      await this.prismaService.conversation.findFirst({
        where: {
          OR: [
            {
              userIds: {
                equals: [senderId, receiverId],
              },
            },
            {
              userIds: {
                equals: [receiverId, senderId],
              },
            },
          ],
        },
      });
    if (existingConversations) {
      return existingConversations;
    }

    const newConversation = await this.prismaService.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: senderId,
            },
            {
              id: receiverId,
            },
          ],
        },
      },
      include: {
        users: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
      },
    });

    newConversation.users.forEach((user) => {
      if (user.id) {
        this.messageEvent.server
          .to(this.messageEvent.users[user.id])
          .emit('conversation:new', newConversation);
      }
    });

    return newConversation;
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
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: userId,
        },
      },
      include: {
        users: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
        messages: {
          include: {
            sender: true,
            seen: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async find(conversationId: string) {
    return await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  //seen only last message
  async seen({
    currentUser,
    conversation,
  }: {
    currentUser: string;
    conversation: string;
  }) {
    const conversationData = await this.prismaService.conversation.findUnique({
      where: {
        id: conversation,
      },
      include: {
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
        users: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    const lastMessage =
      conversationData.messages[conversationData.messages.length - 1];
    if (!lastMessage) {
      // if no message
      return conversationData;
    }
    // update seen of last message
    const updatedMessage = await this.prismaService.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        seen: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      data: {
        seen: {
          connect: {
            id: currentUser,
          },
        },
      },
    });

    this.messageEvent.server
      .to(this.messageEvent.users[currentUser])
      .emit('conversation:update', {
        id: conversationData.id,
        messages: [updatedMessage],
      });

    if (lastMessage.seenIds.indexOf(currentUser) !== -1) {
      return conversationData;
    }

    this.messageEvent.server
      .to(conversation)
      .emit('message:update', updatedMessage);
    return 'Success';
  }

  async delete({
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  }) {
    const existingConversation =
      await this.prismaService.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: {
          users: true,
        },
      });

    if (!existingConversation) {
      throw new BadRequestException('Conversation not found');
    }

    const deletedConversation = await this.prismaService.conversation.delete({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [userId],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.id) {
        this.messageEvent.server
          .to(this.messageEvent.users[user.id])
          .emit('conversation:delete', deletedConversation);
      }
    });

    return deletedConversation;
  }
}

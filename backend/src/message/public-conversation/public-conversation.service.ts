import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PublicConversationDto } from './public-conversation.dto';
@Injectable()
export class PublicConversationService {
  constructor(private prismaService: PrismaService) {}

  async getPublicConversations() {
    return await this.prismaService.publicConversation.findMany({
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            backgroundImage: true,
          },
        },
      },
    });
  }

  async createPublicConversation(
    payload: PublicConversationDto,
    senderId: string,
  ) {
    return await this.prismaService.publicConversation.create({
      data: {
        body: payload.body,
        placeId: payload.placeId,
        senderId: senderId,
      },
    });
  }
}

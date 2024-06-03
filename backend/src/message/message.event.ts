import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from './message.service';

@Injectable()
@WebSocketGateway({
  namespace: 'message',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
  },
})
export class MessageEvent implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  users = {};
  conversation = new Map<string, string[]>();

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      // console.log('Connected');
    });
  }

  @SubscribeMessage('register')
  onRegister(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.users[userId] = client.id;
  }
  @SubscribeMessage('conversation:join')
  onJoinConversation(
    @MessageBody('userId') userId: string,
    @MessageBody('conversationId') conversationId: string,
  ) {
    this.conversation.set(conversationId, [
      ...(this.conversation.get(conversationId) || []),
      userId,
    ]);
    this.server.socketsJoin(conversationId);
  }

  // @SubscribeMessage('message:send')
  // async onSendMessage(
  //   @MessageBody()
  //   {
  //     senderId,
  //     receiverId,
  //     message,
  //     conversationId,
  //   }: {
  //     senderId: string;
  //     receiverId: string;
  //     conversationId: string;
  //     message: string;
  //   },
  // ) {
  //   if (this.users[receiverId]) {
  //     const { newMessage, lastMessage, users } =
  //       await this.messageService.create(
  //         { body: message, conversationId },
  //         senderId,
  //       );
  //     this.server.to(this.users[receiverId]).emit('message:new', newMessage);

  //     users.forEach((user) =>
  //       this.server.to(this.users[user.id]).emit('conversation:update', {
  //         conversationId,
  //         lastMessage,
  //       }),
  //     );
  //   }
  // }
}

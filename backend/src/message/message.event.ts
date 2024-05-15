import { OnModuleInit } from '@nestjs/common';
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
  constructor(
    private conversationService: ConversationService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  users = {};
  conversation = new Map<string, string[]>()

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
@SubscribeMessage('joinConversation')
  onJoinConversation(@MessageBody("userId") userId: string) {
    // this.conversation.
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(
    @MessageBody()
    {
      senderId,
      receiverId,
      message,
      conversationId,
    }: {
      senderId: string;
      receiverId: string;
      conversationId: string;
      message: string;
    },
  ) {
    if (this.users[receiverId]) {
      this.server.to(this.users[receiverId]).emit('newMessage', message);

      // jika belum ad
      if (conversationId) {
        const newMessage = await this.messageService.create({
          body: message,
          conversationId,
          senderId: senderId,
        });
        return newMessage;
      } else {
        const checkBySenderAndReceiver =
          await this.conversationService.findByUser({ receiverId, senderId });
        let conversationId: string;
        if (!!checkBySenderAndReceiver) {
          conversationId = checkBySenderAndReceiver.id;
        } else {
          const newConversation = await this.conversationService.create({
            receiverId,
            senderId,
          });
          conversationId = newConversation.id;
        }
        //jika belum ada conversation
        //buat pesan
        const newMessage = await this.messageService.create({
          body: message,
          conversationId,
          senderId: senderId,
        });
        return { conversationId: conversationId, message: newMessage.body };
      }
    }
  }
}

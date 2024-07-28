import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

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
export class PublicConversationEvent {
  @WebSocketServer()
  server: Server;

//   @SubscribeMessage('conversation:join')
//     onJoinConversation(
//         @ConnectedSocket() client: Socket,
//     ) {
//         this.server.socketsJoin();
//     }
}

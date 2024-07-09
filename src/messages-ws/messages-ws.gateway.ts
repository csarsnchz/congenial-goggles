import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtPayload } from 'src/auth/interfaces';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
   const token = client.handshake.headers.authorization as string;
   let payload: JwtPayload;
   try {
     payload = this.jwtService.verify(token);
     await this.messagesWsService.registerClient(client, payload.id);
     //client.join(payload.id);
   } catch (error) {
     client.disconnect();
     return;
   }
   //console.log({payload});
   
   this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id), 
      message: payload.message || 'no-message!'
  });
  }
}

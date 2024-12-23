import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  import { AuththenticationSoket } from '../user/guard/authSocket.guard'; 
  import { User } from '../user/schemas/user.schemas';
  import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
  import { Types } from 'mongoose';

  
  @WebSocketGateway({
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
    },
  })
  

  export class EventGeteWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    private activeUsers = new Map<string, string>(); // clientId -> userId
  
    constructor(
      private readonly authenticationSoket: AuththenticationSoket,

    ) {}
  
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
  
async handleConnection(client: Socket) {
  console.log('New connection: ', client.id);

  try {
    const user = await this.authenticationSoket.authenticate(client);
    if (!user) {
      throw new WsException('Unauthorized');
    }

    this.activeUsers.set(client.id, user._id.toString());
    client.join(`user:${user._id.toString()}`);
    console.log(`User ${user.firstName} ${user.lastName} connected with client ID ${client.id}`);
    console.log('Active users:', Array.from(this.activeUsers.entries()));
  } catch (error) {
    console.error('Error during connection:', error);
    client.disconnect();
  }
}

handleDisconnect(client: Socket) {
  console.log('Disconnected client:', client.id);
  this.activeUsers.delete(client.id);
  console.log('Remaining active users:', Array.from(this.activeUsers.entries())); // Log sau khi client ngắt kết nối
}

  
  
}
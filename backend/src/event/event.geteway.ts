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
    origin: ['http://localhost:3000', 'https://zafacook.netlify.app'],
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
  },
})
export class EventGeteWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private activeUsers = new Map<string, Set <string>>(); // clientId -> userId

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
  
      const userId = user._id.toString();
  
      // Nếu userId chưa tồn tại trong activeUsers, khởi tạo Set mới
      if (!this.activeUsers.has(userId)) {
        this.activeUsers.set(userId, new Set());
      }
  
      // Thêm clientId vào Set của userId
      this.activeUsers.get(userId).add(client.id);
  
      // Thêm client vào phòng dựa trên userId
      client.join(userId);
  
      console.log(`User ${user.firstName} ${user.lastName} connected with client ID ${client.id}`);
      console.log(
        'Active users:',
        Array.from(this.activeUsers.entries()).map(([uid, clients]) => [uid, Array.from(clients)]),
      );
    } catch (error) {
      console.error('Error during connection:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected client:', client.id);
  
    // Tìm userId mà client thuộc về
    const userId = Array.from(this.activeUsers.entries()).find(([_, clientIds]) =>
      clientIds.has(client.id)
    )?.[0];
  
    if (userId) {
      const userSockets = this.activeUsers.get(userId);
  
      if (userSockets) {
        // Xóa clientId khỏi Set
        userSockets.delete(client.id);
  
        // Nếu Set rỗng, xóa userId khỏi Map
        if (userSockets.size === 0) {
          this.activeUsers.delete(userId);
        }
      }
  
      console.log(`Client ${client.id} disconnected from user ${userId}`);
    }
  
    console.log(
      'Remaining active users:',
      Array.from(this.activeUsers.entries()).map(([uid, clients]) => [uid, Array.from(clients)]),
    );
  }
  
  
  
}
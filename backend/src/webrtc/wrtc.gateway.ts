import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
  } from '@nestjs/websockets';
  import { Socket, Server, Namespace } from 'socket.io';
  import { AuththenticationSoket } from '../user/guard/authSocket.guard';
  
  @WebSocketGateway({
    namespace: '/call',
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:3000",];
  
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
    },
    
  })
  
  export class CallGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private activeCalls = new Map<string, Set<string>>();
  
    constructor(private readonly authenticationSoket: AuththenticationSoket) {}
  
    afterInit(server: Server) {
      console.log('Call WebSocket server initialized');
    }
  
    async handleConnection(client: Socket) {
      try {
        const user = await this.authenticationSoket.authenticate(client);
        if (!user) {
          throw new WsException('Unauthorized');
        }
  
        const userId = user._id.toString();
    
  
        if (!this.activeCalls.has(userId)) {
          this.activeCalls.set(userId, new Set());
        }
    
        this.activeCalls.get(userId).add(client.id);
    
        client.join(`user:${userId}`);
    
      } catch (error) {
        console.error('Error during connection:', error);
        client.disconnect();
      }
    }

    handleDisconnect(client: Socket) {

      const userId = Array.from(this.activeCalls.entries()).find(([_, clientIds]) =>
          clientIds.has(client.id)
      )?.[0];
  
      if (userId) {
          const userSockets = this.activeCalls.get(userId);
  
          if (userSockets) {
  
              userSockets.delete(client.id);
  
              if (userSockets.size === 0) {
                  this.activeCalls.delete(userId);
              }
          }
  
          console.log(`❌ User ${userId} disconnected: ${client.id}`);
      }
  }
  
@SubscribeMessage('startCall')
async handleStartCall(client: Socket, data: { targetUserId: string }) {
  const user = await this.authenticationSoket.authenticate(client);

    if (!user) {
        throw new WsException('Unauthorized');
    }

    const callerId = user._id.toString();
    console.log(`📞 User ${callerId} đang gọi đến User ${data.targetUserId}`);

    // Gửi sự kiện cuộc gọi đến người nhận
    this.server.to(`user:${data.targetUserId}`).emit('incomingCall', { from: callerId });
}

@SubscribeMessage('rejectCall')
async handleRejectCall(client: Socket, data: { callerId: string }) {

    const user = await this.authenticationSoket.authenticate(client);
    if (!user) {
        throw new WsException('Unauthorized');
    }

    console.log(`❌ User ${user._id} từ chối cuộc gọi từ ${data.callerId}`);


    this.server.to(`user:${data.callerId}`).emit('callRejected', { from: user._id });
}

@SubscribeMessage('endCall')
async handleEndCall(client: Socket, data: { targetUserId: string }) {

    const user = await this.authenticationSoket.authenticate(client);
    if (!user) {
        throw new WsException('Unauthorized');
    }

    console.log(`🚫 User ${user._id} kết thúc cuộc gọi với ${data.targetUserId}`);


    this.server.to(`user:${data.targetUserId}`).emit('callEnded', { from: user._id });
    this.server.to(`user:${user._id}`).emit('callEnded', { from: data.targetUserId });
}

@SubscribeMessage('getUserId')
async handleGetUserId(client: Socket) {
  const user = await this.authenticationSoket.authenticate(client);
  if (!user) {
    throw new WsException("Unauthorized");
  }
  client.emit("userId", { userId: user._id.toString() });
}
  

    @SubscribeMessage('offer')
    async handleOffer(client: Socket, { targetUserId, sdp }) {
      const user = await this.authenticationSoket.authenticate(client);
      if (!user) {
        throw new WsException('Unauthorized');
      }
  
      console.log(`📡 User ${user._id} gửi OFFER đến ${targetUserId}`);
      this.server.to(`call:${targetUserId}`).emit('offer', { from: user._id, sdp });
    }
  
    @SubscribeMessage('answer')
    async handleAnswer(client: Socket, { targetUserId, sdp }) {
      const user = await this.authenticationSoket.authenticate(client);
      if (!user) {
        throw new WsException('Unauthorized');
      }
  
      console.log(`📡 User ${user._id} gửi ANSWER đến ${targetUserId}`);
      this.server.to(`call:${targetUserId}`).emit('answer', { from: user._id, sdp });
    }
  

    @SubscribeMessage('ice-candidate')
    async handleIceCandidate(client: Socket, { targetUserId, candidate }) {
      const user = await this.authenticationSoket.authenticate(client);
      if (!user) {
        throw new WsException('Unauthorized');
      }
  
      console.log(`❄️ ICE Candidate từ ${user._id} gửi đến ${targetUserId}`);
      this.server.to(`call:${targetUserId}`).emit('ice-candidate', { from: user._id, candidate });
    }
  }
  
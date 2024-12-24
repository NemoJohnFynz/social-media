import { Injectable } from '@nestjs/common';
import { EventGeteWay } from './event.geteway';


@Injectable()
    export class EventService {
        constructor(private readonly socket: EventGeteWay) { }

    notificationAllClients(data: any) {
        this.socket.server.emit('events', data);
    }

    disconnectClientId(clientId: string) {
        this.socket.server.sockets[clientId].disconnect(true);
    }

    disconnectUserId(userId: string) {
        this.socket.server.to(`user:${userId}`).disconnectSockets(true);
    }

    notificationToUser(userId: string, event: string, data: any) {
        console.log(`Notifying user ${userId} with event ${event} and data:`, data);
        this.socket.server.to(`user:${userId}`).emit(event, data,);
    }

    // notificationSenmessagetoGroup()

}
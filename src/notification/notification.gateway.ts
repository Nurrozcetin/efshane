import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*', 
    },
})
export class NotificationsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: any, payload: { userId: number }) {
        client.join(`user-room-${payload.userId}`);
    }

    sendNotificationToUser(userId: number, data: any) {
        this.server.to(`user-room-${userId}`).emit('notification', data);
    }
}
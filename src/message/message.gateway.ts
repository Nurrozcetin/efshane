import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
    import { Server, Socket } from 'socket.io';
    
    @WebSocketGateway({
        cors: {
        origin: '*',
        },
    })
    
    export class MessagesGateway
        implements OnGatewayConnection, OnGatewayDisconnect
    {
        @WebSocketServer()
        server: Server;
    
        handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
        }
    
        handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
        }
    
        @SubscribeMessage('sendMessage')
        handleMessage(client: Socket, payload: any): void {
        this.server.emit('receiveMessage', payload); 
        }
    }

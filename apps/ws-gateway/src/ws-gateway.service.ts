import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientRedis } from '@nestjs/microservices';
import { REDIS_SERVICE_NAME } from '@app/redis';

@WebSocketGateway({
  cors: { origin: '*' }, // Разрешаем доступ со всех источников (настроить в продакшене)
})
@Injectable()
export class WsGetawayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger = new Logger('WsGateway');

  constructor(
    @Inject(REDIS_SERVICE_NAME) private readonly redisClient: ClientRedis,
  ) {}

  handleConnection(client: Socket) {
    const uid = client.handshake.query.uid as string;

    if (uid) {
      client.join(uid); // пользователь слушает только свои события
      this.logger.log(`User ${uid} подключен к своей комнате`);
      this.logger.log(`Client connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Отправка события клиенту
  // sendMessageToClient<T>(
  //   uid: string,
  //   event: string,
  //   data: PayloadEventData<T>,
  // ) {
  //   console.log({ uid, event, data });
  //   this.server.to(uid).emit(event, data);
  // }

  @SubscribeMessage('my_event')
  handleMyEvent(
    @MessageBody() data: any, // Данные, которые прислал клиент
    @ConnectedSocket() client: Socket, // Сокет клиента
  ) {
    console.log('Received from client:', data);

    return { status: 'received' }; // Если клиент использует ack callback
  }
}

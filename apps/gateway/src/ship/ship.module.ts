import { Module } from '@nestjs/common';
import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ShipService',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'ship-queue',
          queueOptions: {
            durable: false,
          },
          noAck: true,
          persistent: true,
        },
      },
    ]),
  ],
  providers: [ShipService],
  controllers: [ShipController],
})
export class ShipModule {}

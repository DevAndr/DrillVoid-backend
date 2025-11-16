import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export function configRabbitMq(
  queueName: string,
  configService: ConfigService,
  durable?: boolean,
  noAck?: boolean,
): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>(
          'rabbitmq.url',
          'amqp://guest:guest@localhost:5672',
        ),
      ],
      queue: queueName,
      noAck,
      persistent: true,
      queueOptions: {
        durable,
      },
    },
  };
}

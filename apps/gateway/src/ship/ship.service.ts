import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ShipService {
  constructor(
    @Inject('ShipService') private readonly shipClient: ClientProxy,
  ) {}

  test() {
    this.shipClient.emit('test', {});
  }
}

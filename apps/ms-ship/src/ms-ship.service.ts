import { Injectable } from '@nestjs/common';

@Injectable()
export class MsShipService {
  getHello(): string {
    return 'Hello World!';
  }
}

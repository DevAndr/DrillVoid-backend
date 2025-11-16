import { Injectable } from '@nestjs/common';

@Injectable()
export class MsPlanetService {
  getHello(): string {
    return 'Hello World!';
  }
}

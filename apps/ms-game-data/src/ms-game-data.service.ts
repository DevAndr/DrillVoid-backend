import { Injectable } from '@nestjs/common';

@Injectable()
export class MsGameDataService {
  getHello(): string {
    return 'Hello World!';
  }
}

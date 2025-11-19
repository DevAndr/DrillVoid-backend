import { Injectable } from '@nestjs/common';

@Injectable()
export class MsGameDataService {
  initial(uid: string) {
    console.log({ uid });
    return 'ok';
  }
}

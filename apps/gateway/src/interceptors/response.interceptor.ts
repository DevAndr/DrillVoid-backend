import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseData {
  success?: boolean;
  [key: string]: unknown;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: ResponseData) => {
        const hasSuccess = 'success' in data || data.success !== undefined;

        if (hasSuccess) {
          return {
            ...data,
            meta: {
              timestamp: new Date().toISOString(),
              requestId: context.switchToHttp().getRequest()?.id,
            },
          };
        }

        return data;
      }),
    );
  }
}

import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BaseResponseService } from '@app/core';

@Injectable()
export class MsResponseInterceptor<T>
  implements NestInterceptor<T, BaseResponseService<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseResponseService<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        error: null,
        message: null,
        statusCode: HttpStatus.OK,
      })),
      catchError((error) => {
        const statusCode =
          (error.status as number) || HttpStatus.INTERNAL_SERVER_ERROR;

        // console.log('MsResponseInterceptor', { error });

        return throwError(() => ({
          success: false,
          data: null,
          error: error.message || 'Unknown error',
          message: error.message || 'Unknown error',
          statusCode,
        }));
      }),
    );
  }
}

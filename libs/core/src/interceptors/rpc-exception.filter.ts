// src/common/filters/rpc-exception.filter.ts
import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllRpcExceptionsFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(AllRpcExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): Observable<never> {
    // Логируем полную ошибку (очень полезно!)
    this.logger.error(
      `RPC Exception: ${(exception as any)?.message || 'Unknown error'}`,
      (exception as any)?.stack || '',
    );

    // ВНИМАНИЕ: вот в чём весь секрет!
    // Мы НЕ вызываем .getError() и НЕ передаём HttpException
    // Мы всегда создаём "чистый" объект или строку
    let errorPayload: any;

    if (exception instanceof RpcException) {
      // Уже правильная RPC-ошибка — просто прокидываем её payload
      errorPayload = exception.getError();
    } else if (exception instanceof Error) {
      // Любая обычная ошибка → превращаем в понятный объект
      errorPayload = {
        message: exception.message,
        statusCode: 500,
        error: exception.name,
      };
    } else {
      errorPayload = {
        message: 'Internal server error',
        statusCode: 500,
      };
    }

    // Самое важное — возвращаем именно throwError с ПЛОСКИМ объектом/строкой
    return throwError(() => errorPayload);
  }
}

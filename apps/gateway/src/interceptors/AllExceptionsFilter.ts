// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log({ exception });
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (exception?.response?.statusCode) {
      status = exception.response.statusCode;
      message = exception.response.message;
    }

    response.status(status).json({
      success: false,
      data: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: ctx.getRequest()?.id,
      },
      error: {
        statusCode: status,
        message,
        path: request.url,
      },
    });
  }
}

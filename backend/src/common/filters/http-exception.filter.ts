import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Log the full exception for debugging in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Exception caught:', exception);
      if (exception instanceof Error) {
        console.error('Stack trace:', exception.stack);
      }
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      success: false,
      error: {
        code: exception instanceof HttpException ? exception.name : 'INTERNAL_ERROR',
        message,
        details: exception instanceof HttpException ? exception.getResponse() : null,
      },
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}


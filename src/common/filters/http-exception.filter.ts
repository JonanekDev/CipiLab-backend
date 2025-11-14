import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseException } from '../exceptions/base.exception';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any;

    if (exception instanceof BaseException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse();

      if (status >= 500) {
        // Server errors - log as ERROR
        this.logger.error(
          `${request.method} ${request.url} - ${errorResponse.message}`,
          exception.stack,
        );
      } else if (status >= 400) {
        // Client errors - log as WARNING
        this.logger.warn(
          `${request.method} ${request.url} - ${errorResponse.errorCode}: ${errorResponse.message}`,
        );
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorResponse = exceptionResponse;

      this.logger.warn(
        `${request.method} ${request.url} - ${status}: ${typeof exceptionResponse === 'string' ? exceptionResponse : JSON.stringify(exceptionResponse)}`,
      );
    } else {
      // Unexpected errors
      const error = exception as Error;

      //TODO: Edit to ErrorResDto
      errorResponse = {
        statusCode: status,
        message: 'Internal server error',
        errorCode: 'INTERNAL_ERROR',
        details: null,
      };

      this.logger.error(
        `${request.method} ${request.url} - Unhandled exception: ${error.message}`,
        error.stack,
      );
    }

    response.status(status).send({
      ...errorResponse,
      timestamp: new Date().toISOString(),
    });
  }
}

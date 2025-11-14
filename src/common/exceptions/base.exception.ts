import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes';

export interface ErrorResponse {
  message: string;
  errorCode: ErrorCode;
  details?: any;
}

export class BaseException extends HttpException {
  constructor(response: ErrorResponse, status: HttpStatus) {
    super(
      {
        statusCode: status,
        errorCode: response.errorCode,
        message: response.message,
        details: response.details || null,
      },
      status,
    );
  }
}

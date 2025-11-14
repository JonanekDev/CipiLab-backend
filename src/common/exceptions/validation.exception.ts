import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';
import { ValidationError } from 'class-validator';

export class ValidationException extends BaseException {
  constructor(validationErrors: string[]) {
    super(
      {
        message: `Validation failed`,
        errorCode: ErrorCode.VALIDATION_ERROR,
        details: validationErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

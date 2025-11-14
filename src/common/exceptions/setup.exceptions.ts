import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes';
import { BaseException } from './base.exception';

export class SetupAlreadyCompletedException extends BaseException {
  constructor() {
    super(
      {
        message: 'Setup has already been completed',
        errorCode: ErrorCode.SETUP_ALREADY_COMPLETED,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

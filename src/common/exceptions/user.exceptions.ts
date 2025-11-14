import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from './error-codes';

export class UserNotFoundException extends BaseException {
  constructor(identifier: string | number) {
    super(
      {
        message: `User with identifier '${identifier}' not found`,
        errorCode: ErrorCode.USER_NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidPasswordException extends BaseException {
  constructor() {
    super(
      {
        message: 'Current password is incorrect',
        errorCode: ErrorCode.INVALID_PASSWORD,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PasswordCannotBeSameException extends BaseException {
  constructor() {
    super(
      {
        message: 'New password must be different from current password',
        errorCode: ErrorCode.SAME_PASSWORD,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

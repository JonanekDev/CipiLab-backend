// common/exceptions/auth.exceptions.ts
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ErrorCode } from './error-codes';
import { BaseException } from './base.exception';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(
      {
        message: 'Invalid email or password',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenExpiredException extends BaseException {
  constructor(tokenType: 'access' | 'refresh' = 'access') {
    super(
      {
        message: `${tokenType} token has expired`,
        errorCode: ErrorCode.EXPIRED_TOKEN,
        details: { tokenType },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidTokenException extends BaseException {
  constructor(tokenType: 'access' | 'refresh' = 'access') {
    super(
      {
        message: `Invalid ${tokenType} token`,
        errorCode: ErrorCode.INVALID_TOKEN,
        details: { tokenType },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class MissingTokenException extends BaseException {
  constructor(tokenType: 'access' | 'refresh' = 'access') {
    super(
      {
        message: `No ${tokenType} token provided`,
        errorCode: ErrorCode.MISSING_TOKEN,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

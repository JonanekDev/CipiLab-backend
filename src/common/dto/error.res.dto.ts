import { ErrorCode } from '../exceptions/error-codes';

export class ErrorResDto {
  statusCode: number;

  errorCode: ErrorCode;

  message: string;

  details?: any;

  timestamp: string;
}

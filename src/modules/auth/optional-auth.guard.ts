import { Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class OptionalAuthGuard extends AuthGuard {
  protected optional: boolean = true;
}

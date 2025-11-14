import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { ExecutionContext } from '@nestjs/common';
import {
  InvalidTokenException,
  MissingTokenException,
} from 'src/common/exceptions/auth.exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  protected optional: boolean = false;

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      if (this.optional) {
        request['userId'] = null;
        return true;
      }
      throw new MissingTokenException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['userId'] = payload.userId;
      return true;
    } catch {
      if (this.optional) {
        request['userId'] = null;
        return true;
      }
      throw new InvalidTokenException('access');
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

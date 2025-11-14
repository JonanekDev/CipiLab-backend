import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { UsersService } from '../users/users.service';
import { LoginReqDto } from './dto/login.req.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { PrismaService } from 'src/database/prisma.service';
import { TokensService } from './tokens.service';
import { LoginResDto } from './dto/login.res.dto';
import { UserEntity } from '../users/entities/user.entity';
import { FastifyReply } from 'fastify';
import { InvalidCredentialsException } from 'src/common/exceptions/auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly tokensService: TokensService,
  ) {}

  async login(
    dto: LoginReqDto,
    ipAddress: string,
    userAgent: string,
    res: FastifyReply,
  ): Promise<LoginResDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const passwordValid = await this.hashingService.compare(
      dto.password,
      user.password,
    );
    if (!passwordValid) {
      throw new InvalidCredentialsException();
    }

    // generate refresh and access tokens
    const tokens = await this.tokensService.generateTokens(
      user.id,
      ipAddress,
      userAgent,
      dto.rememberMe,
    );

    res.setCookie('refresh_token', tokens.refreshToken, {
      expires: tokens.refreshExpiresAt,
      httpOnly: true,
      sameSite: 'strict',
    });

    return {
      user: new UserEntity(user),
      session: {
        sessionId: tokens.sessionId,
        accessToken: tokens.accessToken,
      },
    };
  }
}

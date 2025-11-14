import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { TokenRefreshResDto } from './dto/token-refresh.res.dto';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import * as config from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { FastifyReply } from 'fastify/types/reply';
import { HashingService } from './hashing.service';
import {
  InvalidTokenException,
  TokenExpiredException,
} from 'src/common/exceptions/auth.exceptions';

@Injectable()
export class TokensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    @Inject(configuration.KEY)
    private readonly appConfig: config.ConfigType<typeof configuration>,
  ) {}

  async generateUniqueRefreshToken(): Promise<string> {
    const token = randomBytes(64).toString('hex');

    return token;
  }

  async generateTokens(
    userId: number,
    ipAddress: string,
    userAgent: string,
    rememberMe: boolean,
  ): Promise<{
    accessToken: string;
    sessionId: number;
    refreshToken: string;
    refreshExpiresAt: Date;
  }> {
    const newRefreshToken = await this.generateUniqueRefreshToken();
    const hashedRefreshToken = await this.hashingService.hash(newRefreshToken);
    const session = await this.prisma.userSession.create({
      data: {
        userId,
        refreshToken: hashedRefreshToken,
        expiresAt: new Date(
          Date.now() +
            this.appConfig.auth.refreshToken.expiresInDays *
              24 *
              60 *
              60 *
              1000,
        ),
        userAgent,
        rememberMe,
      },
    });

    await this.prisma.userSessionAudit.create({
      data: {
        sessionId: session.id,
        action: 'LOGIN',
        ipAddress,
      },
    });

    const accessToken = this.jwtService.sign({ userId: userId });
    return {
      accessToken,
      refreshToken: newRefreshToken,
      sessionId: session.id,
      refreshExpiresAt: session.expiresAt,
    };
  }

  async refreshTokens(
    refreshToken: string,
    sessionId: number,
    ipAddress: string,
    userAgent: string,
    res: FastifyReply,
  ): Promise<TokenRefreshResDto> {
    const userSession = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });
    if (!userSession) {
      throw new InvalidTokenException('refresh');
    }

    const lastActivity = Date.now() - userSession.updatedAt.getTime();
    const idleLimit =
      (userSession.rememberMe
        ? this.appConfig.auth.refreshToken.idleExpiresInDays * 24 * 60
        : this.appConfig.auth.refreshToken.tempIdleExpiresInMinutes) *
      60 *
      1000;

    if (
      lastActivity > idleLimit ||
      userSession.revoked ||
      userSession.expiresAt < new Date()
    ) {
      throw new TokenExpiredException('refresh');
    }
    if (
      !(await this.hashingService.compare(
        refreshToken,
        userSession.refreshToken,
      ))
    ) {
      throw new InvalidTokenException('refresh');
    }

    if (userSession.userAgent !== userAgent) {
      await this.prisma.userSession.update({
        where: { id: userSession.id },
        data: { revoked: true },
      });
      await this.prisma.userSessionAudit.create({
        data: {
          sessionId: userSession.id,
          action: 'REVOKE_SYSTEM',
          ipAddress,
        },
      });
      throw new TokenExpiredException('refresh');
    }

    const newRefreshToken = await this.generateUniqueRefreshToken();
    const hashedNewRefreshToken =
      await this.hashingService.hash(newRefreshToken);

    // Update existing session with new refresh token
    await this.prisma.userSession.update({
      where: { id: userSession.id },
      data: { refreshToken: hashedNewRefreshToken },
    });

    await this.prisma.userSessionAudit.create({
      data: {
        sessionId: userSession.id,
        action: 'REFRESH',
        ipAddress,
      },
    });

    const accessToken = this.jwtService.sign({ userId: userSession.userId });
    res.setCookie('refresh_token', newRefreshToken, {
      expires: userSession.expiresAt,
    });
    return {
      accessToken,
      sessionId: userSession.id,
    };
  }

  async logoutSession(
    refreshToken: string,
    sessionId: number,
    ipAddress: string,
    res: FastifyReply,
  ): Promise<void> {
    const userSession = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });
    if (
      !userSession ||
      !(await this.hashingService.compare(
        refreshToken,
        userSession.refreshToken,
      ))
    ) {
      throw new InvalidTokenException('refresh');
    }
    if (userSession.revoked || userSession.expiresAt < new Date()) {
      throw new TokenExpiredException('refresh');
    }

    await this.prisma.userSession.update({
      where: { id: userSession.id },
      data: { revoked: true },
    });

    await this.prisma.userSessionAudit.create({
      data: {
        sessionId: userSession.id,
        action: 'LOGOUT',
        ipAddress,
      },
    });
    res.clearCookie('refresh_token');
  }
}

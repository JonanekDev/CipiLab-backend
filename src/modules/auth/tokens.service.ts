import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { TokenRefreshResDto } from './dto/token-refresh.res.dto';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import * as config from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(configuration.KEY)
    private readonly appConfig: config.ConfigType<typeof configuration>,
  ) {}

  async generateUniqueRefreshToken(): Promise<string> {
    //TODO: hash refresh token
    while (true) {
      //TODO: Is it ok?
      const token = randomBytes(64).toString('hex');
      const exists = await this.prisma.userSession.findUnique({
        where: { refreshToken: token },
      });

      if (!exists) return token;
    }
  }

  async generateTokens(
    userId: number,
    ipAddress: string,
    userAgent: string,
  ): Promise<TokenRefreshResDto> {
    const newRefreshToken = await this.generateUniqueRefreshToken();
    await this.prisma.userSession.create({
      data: {
        userId,
        refreshToken: newRefreshToken,
        expiresAt: new Date(
          Date.now() +
            this.appConfig.auth.refreshToken_expiresIn_days *
              24 *
              60 *
              60 *
              1000,
        ),
        userAgent,
      },
    });

    await this.prisma.userSessionAudit.create({
      data: {
        sessionId: userId,
        action: 'LOGIN',
        ipAddress,
      },
    });

    const accessToken = this.jwtService.sign({ userId: userId });
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async refreshTokens(
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<TokenRefreshResDto> {
    const userSession = await this.prisma.userSession.findUnique({
      where: { refreshToken },
    });
    if (!userSession || userSession.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
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
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newRefreshToken = await this.generateUniqueRefreshToken();

    // Update existing session with new refresh token
    await this.prisma.userSession.update({
      where: { id: userSession.id },
      data: { refreshToken: newRefreshToken },
    });

    await this.prisma.userSessionAudit.create({
      data: {
        sessionId: userSession.id,
        action: 'REFRESH',
        ipAddress,
      },
    });

    const accessToken = this.jwtService.sign({ userId: userSession.userId });
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}

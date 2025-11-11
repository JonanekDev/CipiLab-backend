import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { LoginReqDto } from './dto/login.req.dto';
import { AuthService } from './auth.service';
import { LoginResDto } from './dto/login.res.dto';
import { TokensService } from './tokens.service';
import { Cookies } from 'src/derocators/cookieDecorator';
import type { FastifyReply } from 'fastify';
import { TokenRefreshReqDto } from './dto/token-refresh.req.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginReqDto, @Req() request, @Res({ passthrough: true }) res: FastifyReply): Promise<LoginResDto> {
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;
    return await this.authService.login(dto, ipAddress, userAgent, res);
  }

  @Post('refresh')
  async refresh(@Cookies('refresh_token') refreshToken: string, @Body() dto: TokenRefreshReqDto, @Req() req, @Res({ passthrough: true }) res: FastifyReply) {
    if (!refreshToken) throw new UnauthorizedException('No refresh token');
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    return await this.tokensService.refreshTokens(
      refreshToken,
      dto.sessionId,
      ipAddress,
      userAgent,
      res
    );
  }

  @Post('logout')
  async logout(@Cookies('refresh_token') refreshToken: string, @Body() dto: TokenRefreshReqDto, @Req() req, @Res({ passthrough: true }) res: FastifyReply) {
    if (!refreshToken) throw new UnauthorizedException('No refresh token');
    return await this.tokensService.logoutSession(refreshToken, dto.sessionId, req.ip, res);
  }
}

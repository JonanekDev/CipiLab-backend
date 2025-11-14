import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginReqDto } from './dto/login.req.dto';
import { AuthService } from './auth.service';
import { LoginResDto } from './dto/login.res.dto';
import { TokensService } from './tokens.service';
import { Cookies } from 'src/derocators/cookieDecorator';
import type { FastifyReply } from 'fastify';
import { TokenRefreshReqDto } from './dto/token-refresh.req.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MissingTokenException } from 'src/common/exceptions/auth.exceptions';
import { ErrorResDto } from 'src/common/dto/error.res.dto';
import { TokenRefreshResDto } from './dto/token-refresh.res.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
    type: ErrorResDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User logged in successfully',
    type: LoginResDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(
    @Body() dto: LoginReqDto,
    @Req() request,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<LoginResDto> {
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;
    return await this.authService.login(dto, ipAddress, userAgent, res);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing, invalid or expired refresh token',
    type: ErrorResDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed successfully',
    type: TokenRefreshResDto,
  })
  @Post('refresh')
  async refresh(
    @Cookies('refresh_token') refreshToken: string,
    @Body() dto: TokenRefreshReqDto,
    @Req() req,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<TokenRefreshResDto> {
    if (!refreshToken) throw new MissingTokenException('refresh');
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    return await this.tokensService.refreshTokens(
      refreshToken,
      dto.sessionId,
      ipAddress,
      userAgent,
      res,
    );
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing, invalid or expired refresh token',
    type: ErrorResDto,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Logged out successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @ApiBearerAuth()
  async logout(
    @Cookies('refresh_token') refreshToken: string,
    @Body() dto: TokenRefreshReqDto,
    @Req() req,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    if (!refreshToken) throw new MissingTokenException('refresh');
    await this.tokensService.logoutSession(
      refreshToken,
      dto.sessionId,
      req.ip,
      res,
    );
  }
}

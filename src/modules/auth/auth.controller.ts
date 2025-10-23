import { Body, Controller, Post, Req } from '@nestjs/common';
import { LoginReqDto } from './dto/login.request.dto';
import { RefreshTokenDto } from './dto/token-refresh.dto';
import { AuthService } from './auth.service';
import { LoginResDto } from './dto/login.res';
import { TokensService } from './tokens.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginReqDto, @Req() request): Promise<LoginResDto> {
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;
    return this.authService.login(dto, ipAddress, userAgent);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto, @Req() request) {
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip;
    return this.tokensService.refreshTokens(
      ipAddress,
      userAgent,
      dto.refreshToken,
    );
  }
}

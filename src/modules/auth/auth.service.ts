import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UsersService } from '../users/users.service';
import { LoginReqDto } from './dto/login.request.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { PrismaService } from 'src/database/prisma.service';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokensService: TokensService,
  ) {}

  async login(dto: LoginReqDto, ipAddress: string, userAgent: string) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials U');
    }
    const passwordValid = await this.passwordService.comparePasswords(
      dto.password,
      user.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials P');
    }

    // generate refresh and access tokens
    const tokens = await this.tokensService.generateTokens(
      user.id,
      ipAddress,
      userAgent,
    );
    return {
      user,
      tokens,
    };
  }
}

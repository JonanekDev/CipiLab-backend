import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { TokensService } from './tokens.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from 'src/database/prisma.module';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokensService, AuthGuard],
  exports: [PasswordService, AuthGuard, JwtModule],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get('app');
        return {
          global: true,
          secret: appConfig.auth.jwt.secret,
          signOptions: { expiresIn: appConfig.auth.jwt.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
    forwardRef(() => UsersModule),
    PrismaModule,
  ],
})
export class AuthModule {}

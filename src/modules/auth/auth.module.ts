import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import configuration from 'src/config/configuration';

@Module({
  controllers: [AuthController],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class AuthModule {}

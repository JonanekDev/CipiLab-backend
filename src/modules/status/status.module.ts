import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [UsersModule, AuthModule, SettingsModule],
  controllers: [StatusController],
})
export class StatusModule {}

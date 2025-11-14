import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { SettingsModule } from '../settings/settings.module';
import { StatusService } from './status.service';

@Module({
  imports: [UsersModule, AuthModule, SettingsModule],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}

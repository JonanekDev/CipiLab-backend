import { Module } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';
import { UsersModule } from '../users/users.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  controllers: [SetupController],
  providers: [SetupService],
  imports: [UsersModule, SettingsModule],
})
export class SetupModule {}

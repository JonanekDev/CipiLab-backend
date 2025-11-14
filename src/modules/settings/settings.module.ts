import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  exports: [SettingsService],
  providers: [SettingsService],
  imports: [PrismaModule],
})
export class SettingsModule {}

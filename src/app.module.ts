import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StatusModule } from './modules/status/status.module';
import { SetupModule } from './modules/setup/setup.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { SettingsModule } from './modules/settings/settings.module';
import { SettingsService } from './modules/settings/settings.service';
import { ServicesModule } from './modules/services/services.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    StatusModule,
    SetupModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    PrismaModule,
    SettingsModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SettingsService],
})
export class AppModule {}

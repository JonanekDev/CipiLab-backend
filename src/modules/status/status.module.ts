import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [StatusController],
})
export class StatusModule {}

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StatusResponseDto } from './dto/status.res.dto';
import type { FastifyRequest } from 'fastify';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { UserEntity } from '../users/user.entity';
import { SettingsService } from '../settings/settings.service';

@Controller('status')
export class StatusController {
  constructor(private usersService: UsersService, private settingsService: SettingsService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getStatus(@Req() req: FastifyRequest): Promise<StatusResponseDto> {
    if (!req['userId']) {
      return {
        setupCompleted: await this.usersService.existsAtLeastOne(),
        serverName: this.settingsService.get('serverName'),
      };
    }
    const user = await this.usersService.findById(req['userId']);
    return {
      setupCompleted: true,
      serverName: this.settingsService.get('serverName'),
      user: user ? new UserEntity(user) : undefined,
    };
  }
}

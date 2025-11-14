import { FastifyRequest } from 'fastify';
import { StatusResponseDto } from './dto/status.res.dto';
import { UserEntity } from '../users/entities/user.entity';
import { SettingsService } from '../settings/settings.service';
import { UsersService } from '../users/users.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  constructor(
    private usersService: UsersService,
    private settingsService: SettingsService,
  ) {}

  async status(req?: FastifyRequest): Promise<StatusResponseDto> {
    if (!req || !req['userId']) {
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

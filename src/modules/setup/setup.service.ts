import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InitDashboardReqDto } from './dto/init-dashboard.req.dto';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class SetupService {
  constructor(private readonly usersService: UsersService,
    private readonly settingsService: SettingsService
  ) {}

  async initializeSetup(dto: InitDashboardReqDto) {
    if (await this.usersService.existsAtLeastOne()) {
      throw new BadRequestException('Setup has already been completed.');
    }
    await this.usersService.createUser(dto.username, dto.email, dto.password, 'FULL_ADMIN');
    await this.settingsService.set('serverName', dto.serverName);
  }
}

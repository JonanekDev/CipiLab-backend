import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SetupService } from './setup.service';
import { InitDashboardDto } from './dto/init-dashboard.dto';

@Controller('setup')
export class SetupController {
  constructor(private setupService: SetupService) {}

  @Post('init')
  async initializeSetup(@Body() dto: InitDashboardDto) {
    await this.setupService.initializeSetup(dto);
  }
}

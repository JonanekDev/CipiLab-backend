import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SetupService } from './setup.service';
import { InitDashboardReqDto } from './dto/init-dashboard.req.dto';

@Controller('setup')
export class SetupController {
  constructor(private setupService: SetupService) {}

  @Post('init')
  async initializeSetup(@Body() dto: InitDashboardReqDto) {
    await this.setupService.initializeSetup(dto);
  }
}

import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('status')
export class StatusController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getStatus() {
    return {
      setupCompleted: await this.usersService.existsAtLeastOne(),
    };
  }
}

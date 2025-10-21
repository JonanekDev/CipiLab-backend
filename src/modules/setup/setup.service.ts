import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InitDashboardDto } from './dto/init-dashboard.dto';

@Injectable()
export class SetupService {
  constructor(private readonly usersService: UsersService) {}

  async initializeSetup(dto: InitDashboardDto) {
    if (await this.usersService.existsAtLeastOne()) {
      throw new BadRequestException('Setup has already been completed.');
    }
    await this.usersService.createUser(dto.username, dto.email, dto.password);
    //TODO: dashboard name
  }
}

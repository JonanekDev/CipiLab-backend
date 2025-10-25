import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StatusResponseDto } from './dto/status.res.dto';
import type { FastifyRequest } from 'fastify';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { UserEntity } from '../users/user.entity';

@Controller('status')
export class StatusController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async getStatus(@Req() req: FastifyRequest): Promise<StatusResponseDto> {
    if (!req['userId']) {
      return {
        setupCompleted: await this.usersService.existsAtLeastOne(),
      };
    }
    const user = await this.usersService.findById(req['userId']);
    return {
      setupCompleted: true,
      user: user ? new UserEntity(user) : undefined,
    };
  }
}

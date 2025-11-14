import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StatusResponseDto } from './dto/status.res.dto';
import type { FastifyRequest } from 'fastify';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { SettingsService } from '../settings/settings.service';
import { ApiResponse } from '@nestjs/swagger';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Server status retrieved successfully',
    type: StatusResponseDto,
  })
  @Get()
  @UseGuards(OptionalAuthGuard)
  async getStatus(@Req() req: FastifyRequest): Promise<StatusResponseDto> {
    return await this.statusService.status(req);
  }
}

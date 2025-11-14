import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SetupService } from './setup.service';
import { InitDashboardReqDto } from './dto/init-dashboard.req.dto';
import { ApiResponse } from '@nestjs/swagger';
import { StatusResponseDto } from '../status/dto/status.res.dto';
import { StatusService } from '../status/status.service';

@Controller('setup')
export class SetupController {
  constructor(
    private setupService: SetupService,
    private statusService: StatusService,
  ) {}

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Setup has already been completed',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Setup initialized successfully',
  })
  @Post('init')
  @HttpCode(HttpStatus.CREATED)
  async initializeSetup(
    @Body() dto: InitDashboardReqDto,
  ): Promise<StatusResponseDto> {
    await this.setupService.initializeSetup(dto);
    return await this.statusService.status();
  }
}

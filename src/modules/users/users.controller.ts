import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ChangePasswordReqDto } from './dto/changepassword.req.dto';
import type { FastifyRequest } from 'fastify';
import { UsersService } from './users.service';
import { UpdateProfileReqDto } from './dto/update-profile.req.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PasswordCannotBeSameException } from 'src/common/exceptions/user.exceptions';
import { ErrorResDto } from 'src/common/dto/error.res.dto';
import { UserSessionEntity } from './entities/user-session.entity';

@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'New password must be different from current password',
    type: ErrorResDto,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Password changed successfully',
  })
  @Post('changepassword')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Body() dto: ChangePasswordReqDto,
    @Req() req: FastifyRequest,
  ): Promise<void> {
    if (dto.password === dto.currentPassword) {
      throw new PasswordCannotBeSameException();
    }
    await this.usersService.changePassword(req['userId'], dto);
  }

  @Post('updateprofile')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Profile updated successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfile(
    @Body() dto: UpdateProfileReqDto,
    @Req() req: FastifyRequest,
  ): Promise<void> {
    await this.usersService.updateProfile(req['userId'], dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active user sessions',
    type: [UserSessionEntity],
  })
  @Get('sessions')
  async getActiveSessions(
    @Req() req: FastifyRequest,
  ): Promise<UserSessionEntity[]> {
    return (await this.usersService.getActiveSessions(req['userId'])).map(
      (session) => new UserSessionEntity(session),
    );
  }
}
